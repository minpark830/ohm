import {activityDays,guestActivity,normalizeAccountActivity,calendarWeeks,activityLevel} from './activity-model.js?v=ceacf964d1420d5c';

const fallbackEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fullDate=value=>new Date(value+'T12:00:00.000Z').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
const shortDate=value=>new Date(value+'T12:00:00.000Z').toLocaleDateString(undefined,{month:'short',day:'numeric',timeZone:'UTC'});
const plural=(count,singular,plural=singular+'s')=>`${count} ${count===1?singular:plural}`;

/** Account activity is memory-only and purged on route or identity changes. */
export function createActivity({shell,esc=fallbackEscape,icon=()=>'',api,getSession=()=>({signedIn:false}),getProgress=()=>({}),getProblems=()=>[],isActive=()=>true,navigate=()=>{},now=()=>Date.now(),requestTimeoutMs=20000}){
  let days=182,data=null,error='',loading=false,selected=null,generation=0,controller=null,requestTimer=null,context=null,disposed=false,authBlocked=false;
  let calendarContext=null,calendarOffset=0,revealSelection=false;
  const identity=()=>{const session=getSession();return session.signedIn&&session.user?.id?String(session.user.id):null;};
  const key=()=>`${identity()||'guest'}:${days}`;
  function reset(){generation++;controller?.abort();controller=null;clearTimeout(requestTimer);requestTimer=null;loading=false;data=null;error='';selected=null;context=null;authBlocked=false;calendarContext=null;calendarOffset=0;revealSelection=false;}
  function draw(focus){if(disposed||!isActive())return;render();if(focus)globalThis.document?.querySelector?.(focus)?.focus?.({preventScroll:true});}
  function rememberCalendar(){
    if(!data||error||calendarContext!==context)return;
    const scroller=globalThis.document?.querySelector?.('.activity-calendar-scroll');
    if(scroller&&Number.isFinite(scroller.scrollLeft))calendarOffset=Math.max(0,scroller.scrollLeft);
  }
  function restoreCalendar(){
    if(!data||error)return;
    const scroller=globalThis.document?.querySelector?.('.activity-calendar-scroll');if(!scroller)return;
    const maximum=Math.max(0,(Number(scroller.scrollWidth)||0)-(Number(scroller.clientWidth)||0)),first=calendarContext!==context;
    scroller.scrollLeft=first?maximum:Math.min(maximum,calendarOffset);
    if(revealSelection){
      const target=globalThis.document?.querySelector?.('#activity-day-'+selected),viewport=scroller.getBoundingClientRect?.(),cell=target?.getBoundingClientRect?.();
      if(viewport&&cell&&Number.isFinite(viewport.left)&&Number.isFinite(cell.left)&&Number.isFinite(cell.right)&&scroller.clientWidth>0){
        const left=viewport.left+(Number(scroller.clientLeft)||0),right=left+scroller.clientWidth;
        if(cell.left<left)scroller.scrollLeft=Math.max(0,scroller.scrollLeft+cell.left-left-3);
        else if(cell.right>right)scroller.scrollLeft=Math.min(maximum,scroller.scrollLeft+cell.right-right+3);
      }
    }
    calendarOffset=Math.max(0,Number(scroller.scrollLeft)||0);calendarContext=context;revealSelection=false;
  }
  async function load(){
    const accountId=identity(),requestKey=key();if(!accountId||loading||disposed||authBlocked)return;
    const serial=++generation;controller?.abort();const currentController=new AbortController();controller=currentController;const signal=currentController.signal;let timedOut=false,timeout;
    context=requestKey;loading=true;error='';draw();
    try{
      const response=await Promise.race([api(`/api/account/activity?days=${days}`,{headers:{'X-Ohm-Account-ID':accountId},signal}),new Promise((resolve,reject)=>{timeout=setTimeout(()=>{timedOut=true;currentController.abort();reject(Error('The activity connection is taking longer than expected. Please retry.'));},Math.max(1,Math.min(30000,Number(requestTimeoutMs)||20000)));requestTimer=timeout;})]);
      if(disposed||serial!==generation||signal.aborted)return;
      if(identity()!==accountId||key()!==requestKey||response?.accountId!==accountId)throw Object.assign(Error('Your sign-in changed. Open Account to sign in again.'),{accountChanged:true});
      data=normalizeAccountActivity(response,accountId,days);selected=data.today;
    }catch(cause){
      if(disposed||serial!==generation||signal.aborted&&!timedOut)return;
      data=null;authBlocked=cause?.status===401||Boolean(cause?.data?.accountChanged)||Boolean(cause?.accountChanged)||identity()!==accountId;error=timedOut?'The activity connection is taking longer than expected. Please retry.':authBlocked?'Your sign-in changed. Open Account to sign in again.':cause?.message||'Your activity could not load. Please retry.';
    }finally{clearTimeout(timeout);if(requestTimer===timeout)requestTimer=null;if(serial===generation&&!disposed){loading=false;controller=null;draw();}}
  }
  function calendarMarkup(){
    const weeks=calendarWeeks(data.activity),selectedDay=data.activity.find(day=>day.date===selected)||data.activity.at(-1);
    selected=selectedDay.date;
    const dayLabel=day=>`${fullDate(day.date)}: ${plural(day.submissions,'checked submission')}, ${day.accepted} accepted, ${plural(day.practicedProblems,'problem')} practiced.`;
    return `<section class="activity-card activity-calendar-card" aria-labelledby="activity-calendar-title"><div class="activity-section-heading"><div><h2 id="activity-calendar-title">A little practice, over time.</h2><p>${esc(shortDate(data.start))}–${esc(shortDate(data.today))} · ${days} days · UTC</p></div><span class="activity-total">${plural(data.metrics.activeDays,'active day')}</span></div>
      <p class="activity-key-help" id="activity-key-help">Choose a day to inspect it. Use arrow keys to move by day or week; Home and End move within a week.</p>
      <div class="activity-calendar-scroll"><div class="activity-calendar-wrap"><div class="activity-weekdays" aria-hidden="true"><span></span>${['M','T','W','T','F','S','S'].map(label=>`<span>${label}</span>`).join('')}</div><div class="activity-calendar" role="group" aria-label="Daily practice calendar" aria-describedby="activity-key-help">${weeks.map((week,index)=>{const first=week.find(Boolean),previous=weeks[index-1]?.find(Boolean),month=new Date(first.date+'T12:00:00Z').toLocaleDateString(undefined,{month:'short',timeZone:'UTC'});return `<div class="activity-week"><span class="activity-month" aria-hidden="true">${index===0||first.date.slice(0,7)!==previous?.date.slice(0,7)?esc(month):''}</span>${week.map(day=>day?`<button id="activity-day-${day.date}" class="activity-cell activity-level-${activityLevel(day.submissions)}" data-activity-day="${day.date}" tabindex="${day.date===selected?0:-1}" aria-label="${esc(dayLabel(day))}" aria-pressed="${day.date===selected}"><span class="sr-only">${esc(day.date)}</span></button>`:'<span class="activity-cell activity-cell-empty" aria-hidden="true"></span>').join('')}</div>`;}).join('')}</div></div></div>
      <div class="activity-legend" aria-label="Calendar legend"><span>Checked submissions</span>${[['0',0],['1',1],['2–4',2],['5–9',3],['10+',4]].map(([label,level])=>`<span><i class="activity-cell activity-level-${level}" aria-hidden="true"></i>${label}</span>`).join('')}</div>
      <div class="activity-selected" aria-live="polite" aria-atomic="true"><div><h3>${esc(fullDate(selected))}</h3><p>${selectedDay.submissions?'Each checked answer is practice, including retries.':'No checked library submissions recorded for this day.'}</p></div><dl><div><dt>Checked</dt><dd>${selectedDay.submissions}</dd></div><div><dt>Accepted</dt><dd>${selectedDay.accepted}</dd></div><div><dt>Problems practiced</dt><dd>${selectedDay.practicedProblems}</dd></div></dl></div>
      <details class="activity-table-alternative"><summary>Read the calendar as a table</summary><div class="activity-table-scroll"><table><caption>${days} days of recorded practice · UTC</caption><thead><tr><th scope="col">Date</th><th scope="col">Checked</th><th scope="col">Accepted</th><th scope="col">Problems practiced</th></tr></thead><tbody>${[...data.activity].reverse().map(day=>`<tr><th scope="row">${esc(day.date)}</th><td>${day.submissions}</td><td>${day.accepted}</td><td>${day.practicedProblems}</td></tr>`).join('')}</tbody></table></div></details>
    </section>`;
  }
  function contentMarkup(){
    const {metrics,summary}=data;
    return `<div class="activity-stats"><article class="activity-stat"><span>Checked submissions</span><strong>${summary.submissions}</strong><p>${summary.accepted} accepted · retries count separately</p></article><article class="activity-stat"><span>Problems practiced</span><strong>${summary.practicedProblems}</strong><p>Distinct, currently published questions</p></article><article class="activity-stat"><span>Current streak · UTC</span><strong>${metrics.currentStreak}<small> ${metrics.currentStreak===1?'day':'days'}</small></strong><p>Consecutive active days through today or yesterday</p></article><article class="activity-stat"><span>Longest streak in this window</span><strong>${metrics.longestStreak}<small> ${metrics.longestStreak===1?'day':'days'}</small></strong><p>Streak lengths are limited to the selected window</p></article></div>
      ${calendarMarkup()}
      <section class="activity-card activity-topics" aria-labelledby="activity-topics-title"><div class="activity-section-heading"><div><h2 id="activity-topics-title">Where you put the work.</h2><p>Current published topic labels · this window</p></div><button class="button" data-activity-view="insights">Topic insights ${icon('chevron',14)}</button></div>${data.topics.length?`<div class="activity-topic-grid">${data.topics.map(topic=>`<article><h3>${esc(topic.category)}</h3><strong>${topic.submissions}<small> checked</small></strong><p>${topic.accepted} accepted · ${plural(topic.practicedProblems,'problem')} practiced</p></article>`).join('')}</div>`:'<p class="activity-empty">Your first checked answer will start the picture. Browse a problem when you are ready.</p>'}</section>
      <section class="activity-scope" aria-label="What these numbers include">${icon('help',17)}<div><h2>Practice evidence, with its limits.</h2><p>${data.source==='account'?`These counts use all server-checked library submissions in the ${days}-day window, including records beyond the recent 1,000-submission feed. They are private to this account.`:`This view uses up to the latest 1,000 available submissions saved in this browser (${data.availableAttempts} available). It may not cover the full window and does not sync unless you explicitly import supported guest progress.`} Imported browser history is excluded. Unpublished or removed problems are excluded; topic labels follow the current library. Day boundaries and streaks use UTC.</p><p>${summary.olderVersionSubmissions?`${plural(summary.olderVersionSubmissions,'submission')} used an older problem version. `:''}${summary.unknownVersionSubmissions?`${plural(summary.unknownVersionSubmissions,'submission')} has unknown version history. `:''}Older versions count as practice, and accepted retries count again. These numbers do not certify mastery, independent work, study time or interview readiness. Streaks can extend beyond the visible window.</p></div></section>`;
  }
  function render(){
    if(disposed||!isActive())return;
    const session=getSession(),accountId=identity(),current=key();
    if(context&&context!==current){reset();context=current;authBlocked=true;error='Your sign-in changed. Open Account to sign in again.';}
    if(session.signedIn&&!accountId){data=null;authBlocked=true;error='Your sign-in could not be checked. Open Account to continue.';}
    else if(!session.signedIn&&!error){data=guestActivity(getProblems(),getProgress(),days,now());context=current;selected=data.activity.some(day=>day.date===selected)?selected:data.today;}
    const shouldLoad=accountId&&!data&&!loading&&!error&&!authBlocked;
    rememberCalendar();
    shell(`<div class="page activity-page"><div class="page-heading activity-heading"><div><span class="eyebrow muted">YOUR PRIVATE PRACTICE HISTORY</span><h1>Show up. Make a connection.</h1><p>See the work you have put in, one checked answer at a time.</p></div><button class="button" data-activity-action="refresh" ${loading||authBlocked?'disabled':''}>${icon('reset',15)}Refresh</button></div>
      <div class="activity-toolbar"><label for="activity-range">Show activity<select id="activity-range" class="select" ${loading||authBlocked?'disabled':''}><option value="182" ${days===182?'selected':''}>26 weeks · 182 days</option><option value="364" ${days===364?'selected':''}>52 weeks · 364 days</option></select></label><p>${accountId?'Private account activity':'Browser-only guest activity'} · UTC${data?` · updated ${esc(new Date(data.asOf).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit',timeZone:'UTC'}))}`:''}</p></div>
      ${error?`<section class="activity-card activity-error" role="alert"><h2>Your activity is taking a moment.</h2><p>${esc(error)}</p><div class="button-row">${authBlocked?'':'<button class="button primary" data-activity-action="refresh">Try again</button>'}<button class="button" data-activity-view="account">Open Account</button></div></section>`:data?contentMarkup():`<section class="activity-card activity-loading" role="status">Loading your private activity…</section>`}
      <div class="activity-footer"><button class="button primary" data-activity-view="problems">${icon('grid',15)}Explore the library</button><button class="button" data-activity-view="plan">Open your daily plan</button></div></div>`);
    restoreCalendar();if(shouldLoad)void load();
  }
  function onClick(event){
    if(!isActive())return false;
    const button=event.target.closest?.('[data-activity-day],[data-activity-action],[data-activity-view]');if(!button)return false;
    if(button.dataset.activityDay){if(data?.activity.some(day=>day.date===button.dataset.activityDay)){selected=button.dataset.activityDay;draw('#activity-day-'+selected);}return true;}
    if(button.dataset.activityAction==='refresh'){if(authBlocked){navigate('account');return true;}reset();draw();return true;}
    if(['insights','account','problems','plan'].includes(button.dataset.activityView)){navigate(button.dataset.activityView);return true;}
    return true;
  }
  function onChange(event){if(event.target.id!=='activity-range'||!isActive())return false;if(authBlocked||loading)return true;days=activityDays(Number(event.target.value));reset();draw('#activity-range');return true;}
  function onKeydown(event){
    const button=event.target.closest?.('[data-activity-day]');if(!button||!data||!isActive())return false;
    const index=data.activity.findIndex(day=>day.date===button.dataset.activityDay);if(index<0)return false;
    const weekday=(new Date(button.dataset.activityDay+'T00:00:00Z').getUTCDay()+6)%7;
    const delta={ArrowUp:-1,ArrowDown:1,ArrowLeft:-7,ArrowRight:7,Home:-weekday,End:6-weekday}[event.key];if(delta===undefined)return false;
    event.preventDefault();const next=Math.max(0,Math.min(data.activity.length-1,index+delta));selected=data.activity[next].date;revealSelection=true;draw('#activity-day-'+selected);return true;
  }
  return {render,onClick,onChange,onKeydown,clear:reset,invalidate(){reset();authBlocked=true;error='Your sign-in changed. Open Account to sign in again.';},dispose(){reset();disposed=true;},get state(){return {days,loading,error,selected,authBlocked,accountId:identity(),data:data?structuredClone(data):null};}};
}
