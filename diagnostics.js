import {diagnosticTopics,diagnosticGoals,diagnosticQuestions,emptyDiagnosticState,normalizeDiagnosticState,startDiagnostic,personalizedPlan} from './diagnostic-model.js?v=ce80af150dbbde12';

const assistanceText=value=>({independent:'No help recorded for this version',hint:'A hint was viewed for this version',solution:'A solution was viewed for this version',unknown:'Help history is unknown'}[value]||'Help history is unknown');
export function createDiagnostics({shell,esc,icon,getProblems,getProgress,storage,gradeAnswer,openProblem,navigate,isActive=()=>true,toast=()=>{},now=()=>Date.now()}) {
  let saved=emptyDiagnosticState(),hydrated=!storage,restoreError='',mode='diagnostic',busy=false,generation=0,message='',confirmRestart=false,confirmLoad=false,lastLocked=false;
  const clone=value=>structuredClone(value);
  const editable=()=>hydrated&&!busy&&!restoreError&&(!storage||(storage.status.ready&&!storage.status.authLost&&!storage.status.conflict));
  const active=()=>isActive(mode);
  const draw=focus=>{if(!active())return;render(mode);if(focus)globalThis.document?.querySelector(focus)?.focus({preventScroll:true});};
  function restore() {
    generation++;busy=false;message='';confirmRestart=false;confirmLoad=false;
    try{saved=normalizeDiagnosticState(storage?storage.state:saved);hydrated=!storage||storage.status.ready;restoreError='';}catch{hydrated=false;restoreError='Saved diagnostic practice could not be restored. Retry loading it.';}
    return clone(saved);
  }
  function save(next) {
    try{const value=normalizeDiagnosticState(next);storage?.set(value);saved=value;return true;}catch(error){message=error.message;toast(error.message);return false;}
  }
  const problemFor=q=>getProblems().find(p=>p.slug===q?.slug&&p.published!==false&&p.version===q.version);
  const plan=()=>personalizedPlan(getProblems(),getProgress(),saved,now());
  const complete=()=>saved.questions.length>0&&saved.index===saved.questions.length;
  function syncMarkup() {
    const status=storage?.status||{ready:true},problem=restoreError||status.error;
    const text=status.authLost?'Your sign-in changed. Reload before continuing.':problem||(!status.ready?'Loading your saved diagnostic…':status.saving||status.pending?'Saving your diagnostic…':status.signedIn?'Diagnostic saved privately to your account':'Diagnostic saved in this browser');
    return `<div class="diagnostic-sync ${problem||status.authLost?'has-error':''}" data-diagnostic-sync role="status"><span>${esc(text)}</span>${status.conflict?'<button class="button" data-diagnostic-action="load-saved">Load saved version</button>':problem&&!status.authLost?'<button class="button" data-diagnostic-action="retry-save">Retry saving</button>':''}${confirmLoad?'<div class="diagnostic-confirm"><p>Loading the saved version replaces this tab’s unsaved diagnostic changes.</p><button class="button primary" data-diagnostic-action="confirm-load">Load saved version</button><button class="button" data-diagnostic-action="cancel-load">Keep this tab’s work</button></div>':''}</div>`;
  }
  function goalsMarkup(locked=false) {
    return `<fieldset class="diagnostic-goals" ${locked?'disabled':''}><legend>Your preparation goal</legend>${diagnosticGoals.map(goal=>`<label class="diagnostic-goal ${saved.goal===goal.id?'selected':''}"><input type="radio" name="diagnostic-goal" data-diagnostic-goal value="${goal.id}" ${saved.goal===goal.id?'checked':''}><span><strong>${esc(goal.label)}</strong><small>${esc(goal.description)}</small></span></label>`).join('')}</fieldset>`;
  }
  function overview() {
    const questions=diagnosticQuestions(getProblems()),minutes=questions.reduce((sum,p)=>sum+(Number(p.minutes)||3),0),topicCount=new Set(questions.map(p=>p.category)).size;
    return `<section class="rail-card diagnostic-intro"><div><span class="eyebrow muted">FIND A USEFUL STARTING POINT</span><h2>A small sample. A clearer next step.</h2><p>Try one question from each available topic, then build a daily plan around the ideas that deserve another look. You can pause and return to your saved answers.</p></div><div class="diagnostic-intro-facts"><span><strong>${questions.length}</strong> questions</span><span><strong>~${minutes}</strong> minutes</span><span><strong>${topicCount}</strong> topics</span></div>${topicCount<6?'<p class="diagnostic-warning">Some diagnostic topics are currently unavailable. Your plan will identify the topics that were not sampled.</p>':''}${goalsMarkup(!editable())}<div class="button-row"><button class="button primary" data-diagnostic-action="start" ${!editable()||!questions.length?'disabled':''}>Start diagnostic ${icon('chevron',15)}</button><button class="button" data-diagnostic-view="plan">Build my daily plan</button></div><p class="diagnostic-data-note">This is an assistance-aware practice diagnostic. It recommends what to study; it does not certify mastery or predict an interview result. Previous hints and solutions remain part of your help history.</p></section>`;
  }
  function inputMarkup(problem,answer,locked) {
    const disabled=locked?'disabled':'';
    if(problem.type==='choice')return `<fieldset class="diagnostic-options" ${disabled}><legend>${esc(problem.task)}</legend>${(problem.options||[]).map((option,index)=>`<label><input type="radio" name="diagnostic-answer" data-diagnostic-answer value="${esc(option)}" ${answer===option?'checked':''}><span>${esc(option)}</span></label>`).join('')}</fieldset>`;
    if(problem.type==='hdl')return `<label class="diagnostic-answer-label" for="diagnostic-answer">Your HDL statement</label><textarea id="diagnostic-answer" class="diagnostic-code" data-diagnostic-answer maxlength="2500" spellcheck="false" ${disabled}>${esc(answer)}</textarea>`;
    if(problem.type==='multipart') {
      let values={};try{values=JSON.parse(answer||'{}');}catch{}
      return `<div class="diagnostic-parts">${(problem.parts||[]).map(part=>`<label>${esc(part.label)}${part.unit?` (${esc(part.unit)})`:''}<input data-diagnostic-answer data-diagnostic-part="${esc(part.id)}" value="${esc(values[part.id]||'')}" maxlength="160" inputmode="decimal" ${disabled}></label>`).join('')}</div>`;
    }
    return `<label class="diagnostic-answer-label" for="diagnostic-answer">Your answer${problem.unit?` (${esc(problem.unit)})`:''}</label><input id="diagnostic-answer" class="diagnostic-number" data-diagnostic-answer type="text" inputmode="decimal" maxlength="2500" autocomplete="off" value="${esc(answer)}" aria-describedby="diagnostic-task" ${disabled}>`;
  }
  function resultMarkup(answer) {
    return `<div class="diagnostic-result ${answer.pass?'accepted':'retry'}" role="status" tabindex="-1" data-diagnostic-feedback><strong>${answer.pass?'Answer accepted':'An idea to revisit'}</strong><p>${answer.pass?'The checker accepted this answer. A fresh question and a later revisit will give you more useful evidence.':'Use this question as a starting point for your practice plan. You can compare the worked reasoning after the diagnostic.'}</p><span>${esc(assistanceText(answer.assistance))}</span></div>`;
  }
  function questionMarkup() {
    const q=saved.questions[saved.index],problem=problemFor(q),answer=saved.answers.find(a=>a.slug===q.slug),locked=!editable(),disabled=locked?'disabled':'';
    if(!problem)return `<section class="rail-card diagnostic-unavailable"><h2>This diagnostic question changed.</h2><p>The saved version is no longer available. Start a new diagnostic to use the current published questions.</p><button class="button" data-diagnostic-action="restart" ${disabled}>Start a new diagnostic</button>${restartConfirmation()}</section>`;
    return `<div class="diagnostic-session"><ol class="diagnostic-steps" aria-label="Diagnostic topics">${saved.questions.map((item,index)=>{const p=problemFor(item),done=saved.answers.some(a=>a.slug===item.slug);return `<li ${index===saved.index?'aria-current="step"':''} class="${done?'done':''}"><span>${done?icon('check',12):index+1}</span>${esc(p?.category||diagnosticTopics.find(t=>t.slugs.includes(item.slug))?.name)}</li>`;}).join('')}</ol><section class="rail-card diagnostic-question"><div class="diagnostic-question-head"><span class="eyebrow muted">${esc(problem.category)}</span><span class="tiny muted">Question ${saved.index+1} / ${saved.questions.length}</span></div><h2 data-diagnostic-heading tabindex="-1">${esc(problem.title)}</h2><p>${esc(problem.prompt)}</p><div class="given-grid">${(problem.given||[]).map(g=>`<div class="given"><small>${esc(g.label)}</small><strong>${esc(g.value)}</strong></div>`).join('')}</div><p class="task-box" id="diagnostic-task">${esc(problem.task)}</p><form data-diagnostic-form>${inputMarkup(problem,saved.drafts[q.slug]||'',locked||Boolean(answer))}<div class="button-row">${answer?`<button class="button primary" type="button" data-diagnostic-action="next" ${disabled}>${saved.index===saved.questions.length-1?'See my practice plan':'Next topic'} ${icon('chevron',15)}</button>`:`<button class="button primary" type="submit" ${disabled}>${busy?'Checking…':'Check answer'} ${icon('check',15)}</button><button class="button" type="button" data-diagnostic-action="skip" ${disabled}>Skip this topic</button>`}</div>${answer?resultMarkup(answer):message?`<p class="diagnostic-error" role="alert">${esc(message)}</p>`:''}</form><p class="diagnostic-data-note">Try your first answer with the solution closed. The checker saves ordinary practice submissions; help already viewed for this question version stays recorded.</p><button class="button link" data-diagnostic-view="plan">Pause and open my plan</button></section></div>`;
  }
  function restartConfirmation() {
    return confirmRestart?'<div class="diagnostic-confirm" role="status"><p>A new diagnostic replaces these saved diagnostic answers. Your ordinary practice history remains available to your plan.</p><button class="button primary" data-diagnostic-action="confirm-restart">Start new diagnostic</button><button class="button" data-diagnostic-action="cancel-restart">Keep my diagnostic</button></div>':'';
  }
  function resultsMarkup() {
    return `<section class="rail-card diagnostic-results"><span class="eyebrow muted">YOUR STARTING POINT</span><h2>${saved.answers.length} topics sampled.</h2><p>Each answer gives one small practice observation. Skipped topics and help history guide what to try next.</p><ul>${diagnosticTopics.map(topic=>{const q=saved.questions.find(q=>topic.slugs.includes(q.slug)),a=saved.answers.find(a=>a.slug===q?.slug),current=q&&problemFor(q);return `<li><span class="diagnostic-topic-symbol">${icon(topic.icon,20)}</span><div><strong>${esc(topic.name)}</strong><p>${!q?'Not available in this diagnostic':!current?'Question version changed':!a?'Skipped — try a first question':a.pass?'Accepted on this question':'Revisit the method for this question'}</p>${a?`<small>${esc(assistanceText(a.assistance))}</small>`:''}</div></li>`;}).join('')}</ul><div class="button-row"><button class="button primary" data-diagnostic-view="plan">Open my daily plan ${icon('chevron',15)}</button><button class="button" data-diagnostic-action="restart" ${!editable()?'disabled':''}>Start another diagnostic</button></div>${restartConfirmation()}<p class="diagnostic-data-note">One question per topic is a starting sample, not a mastery rating. A later independent answer and a different question provide stronger practice evidence.</p></section>`;
  }
  function planMarkup() {
    const data=plan(),evidence=data.evidence,completed=data.items.filter(item=>item.completed).length;
    return `<div class="diagnostic-plan-overview"><section class="diagnostic-plan-focus"><span class="eyebrow muted">TODAY’S FOCUS</span><h2>${esc(data.focus?.name||'Find a starting point')}</h2><p>${esc(data.focus?.check||'Published questions will appear in your plan as they become available.')}</p><span>${completed} / ${data.items.length} accepted today · about ${data.minutes} min · UTC</span></section><section class="rail-card diagnostic-plan-goal">${goalsMarkup(!editable())}</section></div><ol class="diagnostic-plan-list">${data.items.map((item,index)=>`<li class="rail-card diagnostic-plan-item" data-diagnostic-plan-item="${item.kind}"><span class="diagnostic-plan-index">${String(index+1).padStart(2,'0')}</span><div><span class="eyebrow muted">${esc(item.title)}</span><h2>${esc(item.problem.title)}</h2><p>${esc(item.reason)}</p><div class="diagnostic-plan-meta"><span>${esc(item.problem.category)}</span><span>${esc(item.problem.difficulty)}</span><span>${esc(item.problem.minutes)} min</span>${item.completed?'<span class="diagnostic-today-done">Accepted today</span>':''}</div></div><button class="button ${index===0?'primary':''}" data-diagnostic-open="${item.problem.id}">${item.completed?'Revisit':'Practice'} ${icon('chevron',15)}</button></li>`).join('')}</ol>${!data.items.length?'<section class="rail-card diagnostic-unavailable"><h2>Your plan is waiting for published questions.</h2><button class="button" data-view="problems">Open the library</button></section>':''}<section class="rail-card diagnostic-evidence"><div class="diagnostic-evidence-heading"><div><h2>What this plan is using</h2><p>Recent checked practice, help history, and your preparation goal.</p></div><button class="button" data-diagnostic-view="diagnostic">${saved.questions.length&&!complete()?'Resume diagnostic':complete()?'View diagnostic':'Try the diagnostic'}</button></div><div class="diagnostic-evidence-topics">${evidence.topics.map(topic=>`<div><strong>${esc(topic.name)}</strong><p>${topic.attempts?`${topic.accepted} accepted / ${topic.attempts} checked submissions`:'No checked practice yet'}</p><small>${topic.retained?`${topic.retained} question${topic.retained===1?'':'s'} accepted again after ≥3 days with no help recorded`:'Delayed retention evidence not yet available'}</small>${topic.assisted?`<small>${topic.assisted} accepted submission${topic.assisted===1?'':'s'} after viewing help</small>`:''}${topic.unknown?`<small>${topic.unknown} submission${topic.unknown===1?'':'s'} with unknown help or version history</small>`:''}</div>`).join('')}</div><p class="diagnostic-data-note">Recommendations are practice guidance, not certified mastery. A missed answer identifies an idea to inspect; it does not prove a specific misconception. Only current question versions with known independent help history count toward delayed retention.${evidence.imported?` ${evidence.imported} imported submissions are excluded from checked evidence.`:''}${evidence.oldVersions?` ${evidence.oldVersions} older-version submissions are excluded.`:''} Today’s question choices stay stable as you practice; a goal change or new diagnostic updates them.</p></section>`;
  }
  function render(view='diagnostic') {
    mode=view==='plan'?'plan':'diagnostic';
    if(storage&&!hydrated&&storage.status.ready&&!storage.status.authLost&&!restoreError)restore();
    lastLocked=!editable();
    const title=mode==='plan'?'A little practice, chosen for you.':'Find your starting point.';
    const body=!hydrated||storage?.status.authLost?'<section class="rail-card diagnostic-unavailable"><h2>Your saved practice is taking a moment.</h2><p>Wait for your diagnostic to load before making changes.</p></section>':mode==='plan'?planMarkup():!saved.questions.length?overview():complete()?resultsMarkup():questionMarkup();
    shell(`<div class="page diagnostic-page" data-diagnostic-page="${mode}"><div class="page-heading"><div><span class="eyebrow">${mode==='plan'?'PERSONALIZED DAILY PRACTICE':'SIX-TOPIC PRACTICE DIAGNOSTIC'}</span><h1>${title}</h1><p>${mode==='plan'?'Reconnect an idea, apply it to a fresh question, and return after a gap.':'A short, resumable sample of your electrical engineering foundations.'}</p></div><button class="button" data-diagnostic-view="${mode==='plan'?'diagnostic':'plan'}">${mode==='plan'?'My diagnostic':'My daily plan'} ${icon('chevron',15)}</button></div>${syncMarkup()}${body}</div>`);
  }
  function onClick(event) {
    const button=event.target.closest('[data-diagnostic-action],[data-diagnostic-view],[data-diagnostic-open]');
    if(!button)return false;if(button.disabled)return true;
    if(button.dataset.diagnosticView){navigate(button.dataset.diagnosticView);return true;}
    if(button.dataset.diagnosticOpen){const id=Number(button.dataset.diagnosticOpen);if(getProblems().some(p=>p.id===id&&p.published!==false))openProblem(id);return true;}
    const action=button.dataset.diagnosticAction;
    if(action==='retry-save'){void Promise.resolve(storage?.retry()).then(()=>{if(!hydrated||restoreError)restore();draw();}).catch(error=>toast(error.message));return true;}
    if(action==='load-saved'){confirmLoad=true;draw('[data-diagnostic-action="confirm-load"]');return true;}
    if(action==='cancel-load'){confirmLoad=false;draw();return true;}
    if(action==='confirm-load'){if(confirmLoad&&storage?.status.conflict){try{storage.useRemote();restore();draw();}catch(error){toast(error.message);}}return true;}
    if(action==='cancel-restart'){confirmRestart=false;draw();return true;}
    if(!editable())return true;
    if(action==='restart'){confirmRestart=true;draw('[data-diagnostic-action="confirm-restart"]');return true;}
    if(action==='start'||action==='confirm-restart'&&confirmRestart){const next=startDiagnostic(getProblems(),saved.goal,now());if(save(next)){generation++;confirmRestart=false;message='';draw('[data-diagnostic-heading]');}return true;}
    if(['next','skip'].includes(action)&&saved.index<saved.questions.length){const q=saved.questions[saved.index];if(action==='next'&&!saved.answers.some(a=>a.slug===q.slug))return true;const next=clone(saved);next.index++;if(save(next)){generation++;message='';if(complete()&&action==='next')navigate('plan');else draw('[data-diagnostic-heading]');}return true;}
    return true;
  }
  function onInput(event) {
    const field=event.target.closest('[data-diagnostic-goal],[data-diagnostic-answer]');if(!field)return false;if(!editable())return true;
    if(field.type==='radio'&&!field.checked)return true;
    if(field.dataset.diagnosticGoal!==undefined){if(diagnosticGoals.some(g=>g.id===field.value)){const next=clone(saved);next.goal=field.value;if(save(next))draw(`[data-diagnostic-goal][value="${field.value}"]`);}return true;}
    const q=saved.questions[saved.index];if(!q||saved.answers.some(a=>a.slug===q.slug))return true;
    const next=clone(saved);
    if(field.dataset.diagnosticPart!==undefined){let parts={};try{parts=JSON.parse(next.drafts[q.slug]||'{}');}catch{}parts[field.dataset.diagnosticPart]=field.value;next.drafts[q.slug]=JSON.stringify(parts);}
    else next.drafts[q.slug]=field.value;
    message='';save(next);return true;
  }
  function onSubmit(event) {
    if(!event.target.matches('[data-diagnostic-form]'))return false;event.preventDefault();if(!editable())return true;
    const q=saved.questions[saved.index],problem=problemFor(q),answer=saved.drafts[q?.slug]||'';
    if(!problem||saved.answers.some(a=>a.slug===q.slug))return true;
    if(!answer.trim()){message='Enter an answer or skip this topic.';draw('[data-diagnostic-answer]');return true;}
    const ticket=++generation,wasSignedIn=storage?.status.signedIn===true;
    busy=true;message='';draw();
    void (async()=>{
      try{
        const checked=await gradeAnswer(problem,answer);
        if(ticket!==generation)return;
        if(storage?.status.authLost||wasSignedIn!==(storage?.status.signedIn===true))throw Error('Your sign-in changed. Reload before continuing.');
        if(typeof checked?.pass!=='boolean'||checked.problemVersion!==q.version)throw Error('This answer response did not match the diagnostic question. Reload before continuing.');
        const submissionId=checked.attempt?.submissionId||checked.submissionId||null;
        if(wasSignedIn&&!submissionId)throw Error('The answer needs a saved account receipt. Retry checking it before continuing.');
        const next=clone(saved);next.answers.push({slug:q.slug,version:q.version,answer,submittedAt:now(),submissionId,pass:checked.pass,assistance:checked.attempt?.assistance||checked.assistance||'unknown'});
        save(next);
      }catch(error){if(ticket===generation)message=error.message||'Your answer could not be checked. Try again.';}
      finally{if(ticket===generation){busy=false;draw('[data-diagnostic-feedback]');}}
    })();
    return true;
  }
  function updateSyncStatus() {
    const region=globalThis.document?.querySelector('[data-diagnostic-sync]');if(region)region.outerHTML=syncMarkup();
    if(active()&&storage?.status.authLost){generation++;busy=false;draw();}
    else if(active()&&lastLocked!==!editable())draw();
  }
  function summaryCard() {
    const data=plan();return `<section class="diagnostic-summary"><span class="diagnostic-topic-symbol">${icon('chart',22)}</span><div><h2>Your next three steps.</h2><p>${esc(data.focus?`Focus on ${data.focus.name.toLowerCase()} with a personalized daily practice plan.`:'Try a short diagnostic to find a useful place to begin.')}</p></div><button class="button" data-diagnostic-view="${saved.questions.length?'plan':'diagnostic'}">${saved.questions.length?'Open my plan':'Find my starting point'} ${icon('chevron',15)}</button></section>`;
  }
  return {restore,render,onClick,onInput,onSubmit,updateSyncStatus,summaryCard,get state(){return clone(saved);}};
}
