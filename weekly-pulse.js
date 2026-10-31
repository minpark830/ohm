import {guestActivity,normalizeAccountActivity} from './activity-model.js?v=22c97c590ebdf290';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
const shortDate=value=>new Date(value+'T12:00:00.000Z').toLocaleDateString(undefined,{month:'short',day:'numeric',timeZone:'UTC'});
const weekday=value=>new Date(value+'T12:00:00.000Z').toLocaleDateString(undefined,{weekday:'short',timeZone:'UTC'});
const snapshotTime=value=>new Date(value).toLocaleString(undefined,{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'});
const utcDate=value=>{try{return new Date(value).toISOString().slice(0,10);}catch{return '';}};

// Only sum counts which are additive. Repeated questions and accepted retries
// are submissions, not distinct weekly solves or evidence of mastery.
export function weeklyPulseSummary(data){
 if(!data||!['account','guest'].includes(data.source)||!Array.isArray(data.activity)||data.activity.length<7)throw Error('Your practice pulse could not be read. Refresh to try again.');
 const days=data.activity.slice(-7).map(day=>({date:day.date,submissions:count(day.submissions),accepted:Math.min(count(day.submissions),count(day.accepted))}));
 return {source:data.source,asOf:data.asOf,today:data.today,start:days[0].date,days,submissions:days.reduce((sum,day)=>sum+day.submissions,0),accepted:days.reduce((sum,day)=>sum+day.accepted,0),activeDays:days.filter(day=>day.submissions>0).length};
}

/** A small, account-bound read-only view. It updates only its mounted region. */
export function createWeeklyPulse({api,getSession=()=>({signedIn:false}),getAuthLost=()=>false,getProgress=()=>({}),getProblems=()=>[],isActive=()=>true,navigate=()=>{},now=()=>Date.now(),timeoutMs=20000}={}){
 let host=null,data=null,error='',loading=false,blocked=false,context=null,generation=0,controller=null,timer=null;
 const timeout=Number.isFinite(timeoutMs)?Math.max(1,Math.min(30000,timeoutMs)):20000;
 const sessionContext=()=>{const session=getSession();return session?.signedIn===false?{key:'guest',accountId:null}:session?.signedIn===true&&typeof session.user?.id==='string'&&session.user.id?{key:'account:'+session.user.id,accountId:session.user.id}:{key:'unknown',accountId:null};};
 function cancel(){generation++;controller?.abort();controller=null;clearTimeout(timer);timer=null;loading=false;}
 function block(message='Your sign-in changed. Open Account before loading activity.'){
  cancel();data=null;error=message;blocked=true;context=sessionContext().key;
 }
 function reconcile(){
  const current=sessionContext();
  if(getAuthLost()||current.key==='unknown'||context!==null&&context!==current.key){block();return false;}
  context=current.key;return !blocked;
 }
 function stale(){return data&&data.today!==utcDate(now());}
 function content(){
  if(error)return `<p class="weekly-pulse-message weekly-pulse-error" role="status">${esc(error)}</p>`;
  if(!data)return `<p class="weekly-pulse-message" role="status">${loading?'Loading your private practice pulse…':'Your practice pulse is ready to load.'}</p>`;
  const maximum=Math.max(1,...data.days.map(day=>day.submissions));
  return `<div class="weekly-pulse-body"><div><p class="weekly-pulse-range"><time datetime="${esc(data.start)}">${esc(shortDate(data.start))}</time>–<time datetime="${esc(data.today)}">${esc(shortDate(data.today))}</time> · 7 UTC days</p><dl class="weekly-pulse-metrics"><div><dt>Checked submissions</dt><dd>${data.submissions}</dd></div><div><dt>Accepted submissions</dt><dd>${data.accepted}</dd></div><div><dt>Active days</dt><dd>${data.activeDays}<span> / 7</span></dd></div></dl></div><ol class="weekly-pulse-days" aria-label="Daily checked submissions and accepted submissions">${data.days.map(day=>`<li aria-label="${esc(day.date)}: ${day.submissions} checked ${day.submissions===1?'submission':'submissions'}, ${day.accepted} accepted."><span class="weekly-pulse-day-name">${esc(weekday(day.date))}</span><span class="weekly-pulse-track" aria-hidden="true"><i style="height:${day.submissions?Math.max(8,Math.round(day.submissions/maximum*100)):0}%"></i></span><strong aria-hidden="true">${day.submissions}</strong><span class="weekly-pulse-day-date">${esc(shortDate(day.date))}</span><span class="sr-only">${day.accepted} accepted submissions</span></li>`).join('')}</ol></div><p class="weekly-pulse-scope">${data.source==='account'?'Full account activity in this window.':'Available browser history only, limited to the latest 1,000 saved submissions.'} Imported history and unpublished problems are excluded. Older problem versions count as practice; accepted retries count again.</p><p class="weekly-pulse-snapshot">Snapshot ${esc(snapshotTime(data.asOf))} UTC.${stale()?' A new UTC day has started. Refresh to update this window.':''}</p>`;
 }
 function refreshLabel(){return blocked?'Open Account':loading?'Refreshing…':error?'Try again':'Refresh';}
 function draw(){
  if(!host||!isActive()||host.isConnected===false)return;
  const region=host.querySelector('[data-weekly-pulse-content]');if(region)region.innerHTML=content();
  // Native disabled controls blur in some browsers. Keep this stable control
  // focusable while exposing its busy state and guarding activation below.
  const button=host.querySelector('[data-weekly-action="refresh"]');if(button){button.setAttribute('aria-disabled',String(loading));button.textContent=refreshLabel();}
 }
 function guest(){
  try{data=weeklyPulseSummary(guestActivity(getProblems(),getProgress(),182,now()));error='';}
  catch{data=null;error='Your browser practice could not be read. Refresh to try again.';}
 }
 async function refresh(){
  if(!isActive()){clear();return;}
  if(!reconcile()){draw();return;}
  const {key,accountId}=sessionContext();
  if(!accountId){cancel();guest();draw();return;}
  if(typeof api!=='function'){data=null;error='Your practice connection is unavailable. Refresh to try again.';draw();return;}
  cancel();const token=generation,currentController=new AbortController();controller=currentController;loading=true;data=null;error='';context=key;draw();
  let timedOut=false,requestTimer;
  try{
   const response=await Promise.race([api('/api/account/activity?days=182',{method:'GET',headers:{'X-Ohm-Account-ID':accountId},signal:currentController.signal}),new Promise((resolve,reject)=>{requestTimer=setTimeout(()=>{timedOut=true;currentController.abort();reject(Error('Your practice pulse is taking longer than expected. Please try again.'));},timeout);timer=requestTimer;})]);
   if(token!==generation)return;
   if(!isActive()){clear();return;}
   if(!reconcile()||sessionContext().key!==key||response?.accountId!==accountId){block();draw();return;}
   data=weeklyPulseSummary(normalizeAccountActivity(response,accountId,182));
  }catch(cause){
   if(token!==generation)return;
   data=null;
   if(!isActive()){clear();return;}
   if(!reconcile())return;
   if(cause?.status===401||cause?.data?.accountChanged||cause?.accountChanged){block();}
   else error=timedOut?'Your practice pulse is taking longer than expected. Please try again.':cause?.message||'Your practice pulse could not load. Please try again.';
  }finally{
   clearTimeout(requestTimer);if(timer===requestTimer)timer=null;
   if(token===generation){controller=null;loading=false;}draw();
  }
 }
 function markup(){
  if(!isActive())clear();else{reconcile();if(!blocked&&sessionContext().key==='guest')guest();}
  return `<section class="weekly-pulse" data-weekly-pulse aria-labelledby="weekly-pulse-title"><header class="weekly-pulse-heading"><div><span class="eyebrow muted">YOUR PRACTICE RHYTHM</span><h2 id="weekly-pulse-title">Your 7-day practice pulse.</h2></div><div class="weekly-pulse-actions"><button class="button" type="button" data-weekly-action="refresh" aria-disabled="${loading}">${refreshLabel()}</button><button class="button" type="button" data-weekly-view="activity">View activity</button></div></header><div data-weekly-pulse-content aria-live="polite">${content()}</div></section>`;
 }
 function mount(element){
  if(!isActive()){clear();return;}host=element||null;if(!host)return;
  if(!reconcile()){draw();return;}
  if(sessionContext().key==='guest'){guest();draw();}
  else if(!loading&&!error&&(!data||stale()))void refresh();else draw();
 }
 function clear(){cancel();data=null;error='';blocked=false;context=null;host?.querySelector('[data-weekly-pulse-content]')?.replaceChildren();host=null;}
 function invalidate(){block();draw();}
 function onClick(event){
  if(!isActive())return false;
  const button=event.target.closest?.('[data-weekly-action],[data-weekly-view]');if(!button||host?.contains&&!host.contains(button))return false;
  if(button.dataset.weeklyView==='activity'){navigate('activity');return true;}
  if(button.dataset.weeklyAction==='refresh'){if(loading)return true;if(!reconcile()||blocked)navigate('account');else void refresh();return true;}
  return false;
 }
 return {markup,mount,refresh,invalidate,clear,onClick,get state(){if(!isActive())clear();else reconcile();return {loading,error,blocked,accountId:sessionContext().accountId,data:data?structuredClone(data):null};}};
}
