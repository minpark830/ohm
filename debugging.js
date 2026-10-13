import {debuggingScenarios,debugScenario,createDebugCase,measureDebugCase,diagnoseDebugCase,debugFormat} from './debugging-model.js?v=5a6db230efbf0bf2';
import {emptyDebugState,normalizeDebugState} from './debugging-state.js?v=5a6db230efbf0bf2';

// Every value embedded in a drawing is authored here; report text and account data never enter this module.
const path=d=>`<path d="${d}"/>`;
const label=(x,y,value,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${value}</text>`;
const resistor=(x,y,vertical=false)=>`<g transform="translate(${x} ${y})${vertical?' rotate(90)':''}">${path('M0 0h10l5-8 10 16 10-16 10 16 10-16 10 16 5-8h10')}</g>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3" fill="currentColor" stroke="none"/>`;
const ground=(x,y)=>path(`M${x} ${y}v10m-12 0h24m-19 5h14m-10 5h6`);
const supply=(x,y,text)=>`<circle cx="${x}" cy="${y}" r="23"/>${path(`M${x-7} ${y-8}h14m-7-7v14m-7 15h14`)}${label(x-34,y+5,text,'end')}`;
const probeLocations={divider:{VS:[90,55],OUT:[330,55],R1:[215,55],R2:[330,140]},rc:{VS:[90,55],R:[215,55],VC:[370,55]},opamp:{'IN+':[205,115],'IN−':[220,185],OUT:[470,150],'V+':[330,45]},bjt:{DRIVE:[100,170],B:[340,170],C:[410,100],RC:[410,55]},adc:{SENSOR:[105,165],AIN:[320,165],REF:[435,70],CODE:[545,165]}};
function circuit(scenario,selected){let body='';
 if(scenario.id==='divider')body=path('M90 127V55h90M250 55h230v55M90 173v87h390v-80M330 55v55m0 70v80')+supply(90,150,'12 V')+resistor(180,55)+resistor(330,110,true)+resistor(480,110,true)+label(215,30,'R1 · 4 kΩ')+label(310,158,'R2 · 4 kΩ','end')+label(497,158,'RL · 8 kΩ','start')+label(375,82,'OUT')+dot(330,55)+dot(330,260)+ground(90,260);
 if(scenario.id==='rc')body=path('M90 127V55h90M250 55h120v72M90 173v87h280V147M346 127h48M346 147h48')+supply(90,150,'0 → 5 V')+resistor(180,55)+label(215,30,'R · 10 kΩ')+label(405,140,'C · 10 μF','start')+label(420,82,'VC')+label(190,224,'Step at t = 0')+dot(370,55)+ground(90,260);
 if(scenario.id==='opamp')body=path('M250 80v140l150-70ZM100 115h150M250 185h-30v85h80M370 270h100V150h-70M220 270h-30M120 270H80M330 117V45m0 138v40')+resistor(300,270)+resistor(120,270)+label(271,122,'+')+label(271,192,'−')+label(125,90,'VIN · 0.2 V')+label(335,306,'RF · 100 kΩ')+label(155,306,'RG · 10 kΩ')+label(372,48,'+5 V')+label(375,228,'−5 V')+label(500,143,'OUT','start')+label(172,181,'IN−')+dot(470,150)+dot(220,270)+ground(80,270);
 if(scenario.id==='bjt')body=path('M100 170h75M245 170h110M355 135v70m0-45 55-35V90m-55 95 55 35v40M410 20v0m0 70v0')+resistor(175,170)+resistor(410,20,true)+label(215,145,'RB · 10 kΩ')+label(470,60,'RC · 470 Ω')+label(405,12,'VCC · 5 V')+label(105,145,'3.3 V drive')+label(425,125,'C','start')+label(332,199,'B')+label(375,245,'E')+label(467,190,'Q1 · NPN')+path('M388 214l22 6-10-20')+ground(410,260)+dot(410,100);
 if(scenario.id==='adc')body=path('M75 165h90m105 0h95m140 0h70M435 70v45')+`<rect x="165" y="120" width="105" height="90" rx="8"/><rect x="365" y="115" width="140" height="105" rx="8"/>`+label(218,152,'GAIN')+label(218,180,'1 V/V')+label(435,158,'10-BIT ADC')+label(435,190,'0 … 1023')+label(435,53,'VREF · 3.3 V')+label(110,142,'1 V sensor')+label(318,142,'AIN')+label(550,194,'CODE')+path('M435 220v35')+ground(435,255);
 const [x,y]=probeLocations[scenario.id][selected.node];
 return `<svg class="debug-schematic" viewBox="0 0 640 335" role="img" aria-labelledby="debug-circuit-title debug-circuit-desc"><title id="debug-circuit-title">${scenario.title}: intended circuit</title><desc id="debug-circuit-desc">The labels show intended values. One fault changes the actual circuit. ${scenario.nominal} Selected probe: ${selected.label}, ${selected.node}.</desc><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g><circle cx="${x}" cy="${y}" r="15" class="debug-probe-ring"/><circle cx="${x}" cy="${y}" r="4" class="debug-probe-center"/></svg>`;
}
function waveform(reading,esc){const points=reading.samples.map(({timeMs,value},i)=>`${i?'L':'M'}${50+timeMs/600*500},${180-value/5*140}`).join(' ');return `<div class="debug-wave"><h3>Scope capture · VC</h3><svg viewBox="0 0 600 230" role="img" aria-label="Capacitor charging waveform, 0 to 600 milliseconds and 0 to 5 volts. Exact readings are available below."><path d="M50 40v140h500" fill="none" stroke="var(--line)"/><path d="M50 110h500M300 40v140M550 40v140" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/><path d="${points}" fill="none" stroke="var(--green)" stroke-width="3"/><g>${label(25,45,'5 V')}${label(25,115,'2.5 V')}${label(25,184,'0 V')}${label(50,202,'0')}${label(300,202,'300')}${label(550,202,'600')}${label(300,225,'Time (ms)')}</g></svg><details><summary>Exact waveform samples</summary><div class="debug-table-scroll"><table><caption>Repeated step from 0 V; samples at selected times</caption><thead><tr><th>Time</th><th>VC</th></tr></thead><tbody>${reading.samples.filter(p=>[0,50,100,200,400,600].includes(p.timeMs)).map(p=>`<tr><td>${p.timeMs} ms</td><td>${esc(debugFormat(p.value,'V'))}</td></tr>`).join('')}</tbody></table></div></details></div>`;}

export function createDebugging({shell,esc,icon,toast,isActive=()=>true,storage=null,now=()=>Date.now()}) {
 let saved=emptyDebugState(),hydrated=!storage,restoreError='',confirmLoad=false,confirmRevisit=null,lastLocked=null;
 const randomIndex=n=>globalThis.crypto?.getRandomValues?globalThis.crypto.getRandomValues(new Uint32Array(1))[0]%n:0;
 const editable=()=>hydrated&&!restoreError&&(!storage||storage.status.ready&&!storage.status.authLost&&!storage.status.conflict);
 function fresh(id,previous) {
  const scenario=debugScenario(id),previousIndex=previous?scenario.faults.findIndex(f=>f.id===previous.faultId):-1;
  const variant=previousIndex<0?randomIndex(scenario.faults.length):(previousIndex+1+randomIndex(scenario.faults.length-1))%scenario.faults.length;
  const c=createDebugCase(id,variant);
  return {scenarioId:id,faultId:c.faultId,probeId:scenario.probes[0].id,probeIds:[],choiceId:'',lastDiagnosis:null};
 }
 function current() {
  let item=saved.cases.find(c=>c.scenarioId===saved.scenarioId);
  if(!item){item=fresh(saved.scenarioId);saved.cases.push(item);if(editable()&&storage){try{storage.set(saved);}catch(error){toast(error.message);}}}
  return item;
 }
 const resultFor=item=>item.lastDiagnosis?diagnoseDebugCase(item,item.lastDiagnosis.choiceId,item.lastDiagnosis.probeIds):null;
 function restore() {
  if(!storage){hydrated=true;return true;}
  if(!storage.status.ready||storage.status.authLost){hydrated=false;return false;}
  try {saved=normalizeDebugState(storage.state);hydrated=true;restoreError='';confirmRevisit=null;confirmLoad=false;return true;}
  catch {hydrated=false;restoreError='Saved debugging practice could not be opened. Retry loading before making changes.';return false;}
 }
 function draw(focus) {if(!isActive())return;render();if(focus)document.querySelector(focus)?.focus({preventScroll:true});}
 function change(update,focus) {
  if(!editable())return;
  const previous=saved;
  try {
   const next=structuredClone(saved);update(next);saved=normalizeDebugState(next);storage?.set(saved);
  } catch(error) {saved=previous;toast(error.message||'Your debugging practice could not be saved.');}
  draw(focus);
 }
 function syncMarkup() {
  if(!storage)return '';
  const status=storage.status;
  const message=restoreError||(status.authLost?'Sign in again to resume saving your debugging practice.':status.error||(status.saving?'Saving your debugging practice…':status.pending?'Debugging changes waiting to save…':status.ready?status.signedIn?'Debugging practice saved to your account':'Debugging practice saved in this browser':'Loading saved debugging practice…'));
  return `<div class="debug-sync ${status.error||restoreError||status.authLost?'has-error':''}" data-debug-sync role="status"><span>${esc(message)}</span>${status.conflict?'<button class="button" data-debug-action="load-saved">Load saved version</button>':(status.error||restoreError)&&!status.authLost?'<button class="button" data-debug-action="retry-save">Retry</button>':''}${confirmLoad?'<div class="debug-replace-confirm"><p>Loading the saved version will replace your unsaved debugging changes on this device.</p><button class="button primary" data-debug-action="confirm-load">Replace local changes</button><button class="button" data-debug-action="cancel-load">Keep local changes</button></div>':''}</div>`;
 }
 function historyMarkup(locked) {
  if(!saved.history.length)return '';
  return `<section class="rail-card debug-history"><div class="debug-card-heading"><div><span class="eyebrow muted">LEARN FROM EACH ATTEMPT</span><h2>Recent diagnoses</h2></div><span class="muted">Latest ${saved.history.length} · up to 20 saved</span></div><p class="muted">Review your measurements and revisit a case to test a different explanation.</p><ol>${saved.history.map((item,index)=>{
   const scenario=debugScenario(item.scenarioId),result=diagnoseDebugCase(item,item.choiceId,item.probeIds),choice=scenario.faults.find(f=>f.id===item.choiceId);
   return `<li><div class="debug-history-heading"><div><strong>${esc(scenario.title)}</strong><span>${esc(new Date(item.at).toLocaleDateString(undefined,{month:'short',day:'numeric'}))} · ${esc(choice.label)}</span></div><span class="debug-history-outcome ${result.pass?'matched':'needs-review'}">${result.pass?'Evidence matched':'Revisit reasoning'}</span></div><details><summary>Review ${item.probeIds.length} readings & feedback</summary><ul>${item.probeIds.map(id=>{const reading=measureDebugCase(item,id);return `<li><span>${esc(reading.note)}</span><strong>${esc(reading.display)}</strong></li>`;}).join('')}</ul><p>${esc(result.explanation)}</p></details><button class="button" data-debug-revisit="${index}" ${locked?'disabled':''}>Revisit case ${icon('chevron',14)}</button>${confirmRevisit===index?`<div class="debug-replace-confirm" role="status"><p>This replaces the current ${esc(scenario.topic.toLowerCase())} case and its measurements with this earlier case. Saved diagnosis history stays available.</p><button class="button primary" data-debug-action="confirm-revisit" ${locked?'disabled':''}>Open earlier case</button><button class="button" data-debug-action="cancel-revisit">Keep current case</button></div>`:''}</li>`;
  }).join('')}</ol></section>`;
 }
 function render() {
  lastLocked=!editable();
  if(storage&&!hydrated&&storage.status.ready&&!storage.status.authLost&&!restoreError)restore();
  if(!hydrated||storage?.status.authLost){shell(`${syncMarkup()}<div class="page debug-page"><div class="page-heading"><div><span class="eyebrow muted">THE DEBUGGING BENCH</span><h1>Your bench will be ready shortly.</h1><p>${storage?.status.authLost?'Sign in again to continue your saved practice.':'Waiting for your saved practice before making changes.'}</p></div></div></div>`);return;}
  const scenario=debugScenario(saved.scenarioId),s=current(),probe=scenario.probes.find(p=>p.id===s.probeId),measurements=s.probeIds.map(id=>measureDebugCase(s,id)),reading=measurements.find(p=>p.id===s.probeId),scope=measurements.find(p=>p.id==='scope'),result=resultFor(s),locked=!editable(),disabled=locked?'disabled':'';
  const completed=new Set(saved.completed.map(item=>item.scenarioId));
  shell(`${syncMarkup()}<div class="page debug-page"><div class="page-heading"><div><span class="eyebrow muted">THE DEBUGGING BENCH</span><h1>Find the fault. Follow the evidence.</h1><p>Probe a circuit, compare its behavior, and explain what went wrong.</p></div><span class="debug-completion">${completed.size} / ${debuggingScenarios.length} scenarios explored</span></div><nav class="debug-tabs" aria-label="Debugging scenarios">${debuggingScenarios.map(c=>`<button class="button ${c.id===saved.scenarioId?'primary':''}" data-debug-scenario="${c.id}" aria-pressed="${c.id===saved.scenarioId}" ${disabled}>${icon(c.icon,17)}${esc(c.topic)}${completed.has(c.id)?icon('check',14):''}</button>`).join('')}</nav><div class="debug-layout"><section class="rail-card debug-circuit-card"><div class="debug-card-heading"><div><span class="eyebrow muted">ONE FAULT · FOUR POSSIBILITIES</span><h2>${esc(scenario.title)}</h2></div><button class="button" data-debug-action="new" ${disabled}>${icon('shuffle',15)}New case</button></div><p>${esc(scenario.brief)}</p><p class="debug-nominal"><strong>Intended circuit.</strong> ${esc(scenario.nominal)}</p><div class="debug-canvas">${circuit(scenario,probe)}</div><p class="debug-diagram-note">Labels show the intended design. The highlighted probe shows where your next measurement will be taken.</p><details class="debug-assumptions"><summary>Model assumptions & reference</summary><p>${esc(scenario.assumptions)}</p><a href="${esc(scenario.reference)}" target="_blank" rel="noopener noreferrer">Read the primary reference ↗</a></details>${scope?waveform(scope,esc):''}</section><section class="rail-card debug-meter"><span class="eyebrow muted">01 · GATHER EVIDENCE</span><h2>Choose your measurement.</h2><div class="debug-probes" role="group" aria-label="Available measurements">${scenario.probes.map(p=>`<button class="button ${s.probeId===p.id?'selected':''}" data-debug-probe="${p.id}" aria-pressed="${s.probeId===p.id}" ${disabled}>${esc(p.label)}${s.probeIds.includes(p.id)?icon('check',14):''}</button>`).join('')}</div><div class="debug-meter-display" aria-live="polite"><span>${esc(probe.label)}</span><strong>${reading?esc(reading.display):'—'}</strong><small>${reading?esc(reading.note):'Select a probe, then take a measurement.'}</small></div><button class="button primary debug-measure" data-debug-action="measure" ${disabled}>${icon('bolt',16)}Take measurement</button><div class="debug-log"><h3>Measurement notebook <span>${measurements.length} / ${scenario.probes.length}</span></h3>${measurements.length?`<ol>${measurements.map(m=>`<li><span>${esc(m.note)}</span><strong>${esc(m.display)}</strong></li>`).join('')}</ol>`:'<p class="muted">Your readings will appear here for comparison.</p>'}</div></section></div><section class="rail-card debug-diagnosis"><div><span class="eyebrow muted">02 · EXPLAIN THE EVIDENCE</span><h2>What is the single fault?</h2><p class="muted">Take at least two different measurements, then choose the explanation that fits. Every case has one of these faults.</p></div><fieldset ${locked||result?.pass?'disabled':''}><legend class="sr-only">Select a fault diagnosis</legend>${scenario.faults.map(f=>`<label class="debug-choice ${s.choiceId===f.id?'selected':''}"><input type="radio" name="debug-diagnosis" value="${f.id}" ${s.choiceId===f.id?'checked':''}><span>${esc(f.label)}</span></label>`).join('')}</fieldset><div class="debug-diagnose-actions"><button class="button primary" data-debug-action="diagnose" ${locked||measurements.length<2||!s.choiceId||result?.pass?'disabled':''}>Check diagnosis ${icon('chevron',15)}</button><button class="button" data-debug-action="reset" ${disabled}>${icon('reset',15)}Reset this case</button></div>${result?`<div class="debug-verdict ${result.pass?'correct':'retry'}" role="status" tabindex="-1"><strong>${esc(result.title)}</strong><p>${esc(result.explanation)}</p>${result.repair?`<p><strong>Repair:</strong> ${esc(result.repair)} After repair, the intended values above should be restored.</p><button class="button" data-debug-action="new" ${disabled}>Try a different fault</button>`:''}</div>`:''}</section>${historyMarkup(locked)}<p class="debug-local-note">These are self-guided educational models. ${storage?'Cases, readings, and your latest 20 diagnoses save '+(storage.status.signedIn?'to your account':'in this browser')+'.':'Progress lasts for this tab session.'} Debugging practice stays separate from your library solve count.</p></div>`);
 }
 function onClick(event) {
  const button=event.target.closest('[data-debug-scenario],[data-debug-probe],[data-debug-action],[data-debug-revisit]');
  if(!button)return false;if(button.disabled)return true;
  const action=button.dataset.debugAction;
  if(action==='retry-save') {void Promise.resolve(storage?.retry()).then(()=>{if(!hydrated||restoreError)restore();draw();}).catch(error=>toast(error.message));return true;}
  if(action==='load-saved') {if(storage?.status.conflict){confirmLoad=true;draw('[data-debug-action="confirm-load"]');}return true;}
  if(action==='cancel-load') {confirmLoad=false;draw('[data-debug-action="load-saved"]');return true;}
  if(action==='confirm-load') {if(confirmLoad&&storage?.status.conflict){void Promise.resolve(storage.useRemote()).then(()=>{restore();draw();}).catch(error=>toast(error.message));}return true;}
  if(action==='cancel-revisit') {confirmRevisit=null;draw();return true;}
  if(!editable())return true;
  if(button.dataset.debugScenario) {
   const id=button.dataset.debugScenario;if(debuggingScenarios.some(c=>c.id===id))change(next=>{next.scenarioId=id;if(!next.cases.some(c=>c.scenarioId===id))next.cases.push(fresh(id));confirmRevisit=null;},`[data-debug-scenario="${id}"]`);
   return true;
  }
  if(button.dataset.debugRevisit!==undefined) {
   const index=Number(button.dataset.debugRevisit);if(Number.isInteger(index)&&index>=0&&index<saved.history.length){confirmRevisit=index;draw('[data-debug-action="confirm-revisit"]');}return true;
  }
  const scenario=debugScenario(saved.scenarioId),s=current();
  if(button.dataset.debugProbe) {
   const id=button.dataset.debugProbe;if(scenario.probes.some(p=>p.id===id))change(next=>{next.cases.find(c=>c.scenarioId===next.scenarioId).probeId=id;},`[data-debug-probe="${id}"]`);return true;
  }
  switch(action) {
   case 'measure':change(next=>{const c=next.cases.find(c=>c.scenarioId===next.scenarioId);if(!c.probeIds.includes(c.probeId))c.probeIds.push(c.probeId);if(!resultFor(c)?.pass)c.lastDiagnosis=null;},'[data-debug-action="measure"]');break;
   case 'new':change(next=>{next.cases[next.cases.findIndex(c=>c.scenarioId===next.scenarioId)]=fresh(next.scenarioId,s);},'[data-debug-action="new"]');break;
   case 'reset':change(next=>{Object.assign(next.cases.find(c=>c.scenarioId===next.scenarioId),{probeId:scenario.probes[0].id,probeIds:[],choiceId:'',lastDiagnosis:null});},'[data-debug-action="measure"]');break;
   case 'diagnose':if(s.choiceId&&s.probeIds.length>=2&&!resultFor(s)?.pass)change(next=>{
    const c=next.cases.find(c=>c.scenarioId===next.scenarioId);c.lastDiagnosis={choiceId:c.choiceId,probeIds:[...c.probeIds]};
    next.history.unshift({scenarioId:c.scenarioId,faultId:c.faultId,choiceId:c.choiceId,probeIds:[...c.probeIds],at:now()});next.history=next.history.slice(0,20);
    if(resultFor(c).pass&&!next.completed.some(item=>item.scenarioId===c.scenarioId&&item.faultId===c.faultId))next.completed.push({scenarioId:c.scenarioId,faultId:c.faultId,probeIds:[...c.probeIds]});
   },'.debug-verdict');break;
   case 'confirm-revisit':if(confirmRevisit!==null&&saved.history[confirmRevisit])change(next=>{
    const item=next.history[confirmRevisit],c={scenarioId:item.scenarioId,faultId:item.faultId,probeId:item.probeIds.at(-1),probeIds:[...item.probeIds],choiceId:'',lastDiagnosis:null},index=next.cases.findIndex(c=>c.scenarioId===item.scenarioId);
    if(index<0)next.cases.push(c);else next.cases[index]=c;next.scenarioId=item.scenarioId;confirmRevisit=null;
   },'[data-debug-action="measure"]');break;
  }
  return true;
 }
 function onChange(event) {
  if(event.target.name!=='debug-diagnosis')return false;if(!editable()||event.target.checked===false)return true;
  const s=current(),choice=event.target.value;
  if(!resultFor(s)?.pass&&debugScenario(saved.scenarioId).faults.some(f=>f.id===choice))change(next=>{const c=next.cases.find(c=>c.scenarioId===next.scenarioId);c.choiceId=choice;c.lastDiagnosis=null;},`[name="debug-diagnosis"][value="${choice}"]`);
  return true;
 }
 restore();
 function updateSyncStatus(){if(!isActive())return;if(lastLocked!==!editable()){draw();return;}const region=document.querySelector('[data-debug-sync]');if(region)region.outerHTML=syncMarkup();}
 return {render,onClick,onChange,restore,updateSyncStatus};
}
