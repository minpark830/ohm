import {reviewQueue, utcDate} from './practice-model.js?v=50be9e1e989012d0';

export const diagnosticTopics = [
  {name:'Circuit analysis',icon:'circuit',slugs:['one-loop-two-resistors','balance-the-node'],check:'Choose a current direction before applying KCL or KVL.'},
  {name:'RC circuits',icon:'capacitor',slugs:['rc-time-constant','charging-after-one-tau'],check:'Convert units and separate the initial voltage, final voltage, and time constant.'},
  {name:'BJT',icon:'transistor',slugs:['bjt-current-gain','bjt-switch-current-limit'],check:'Check the assumed operating region against the collector load.'},
  {name:'MOSFET',icon:'mosfet',slugs:['identify-nmos-region','nmos-saturation-current'],check:'Use gate-to-source voltage and compare drain voltage with overdrive.'},
  {name:'Digital logic',icon:'logic',slugs:['boolean-absorption','full-adder-output'],check:'Check every input combination rather than one convenient example.'},
  {name:'HDL',icon:'code',slugs:['nonblocking-pipeline-step','repair-combinational-sensitivity'],check:'Separate event scheduling from the intended combinational or sequential hardware.'}
];
export const diagnosticGoals = [{id:'foundation',label:'Broad foundations',description:'A balanced path across all six topics.'},{id:'analog',label:'Analog interviews',description:'Circuit analysis, transients, and transistor models.'},{id:'digital',label:'Digital / HDL interviews',description:'Circuit foundations, logic, and HDL reasoning.'}];
const goals = new Set(diagnosticGoals.map(goal=>goal.id));
const allowedSlugs = new Set(diagnosticTopics.flatMap(topic=>topic.slugs));
const help = new Set(['independent','hint','solution','unknown']);
const dayMs = 86400000;
const fail = () => {throw new TypeError('Saved diagnostic practice is malformed.');};
const integer = (value,min=0,max=9999999999999) => Number.isSafeInteger(value)&&value>=min&&value<=max;
function record(value,keys) {
  if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))fail();
  const own=Reflect.ownKeys(value);
  if(own.length!==keys.length||own.some(key=>typeof key!=='string'||!keys.includes(key))||keys.some(key=>!Object.hasOwn(value,key)))fail();
}
function array(value,max) {if(!Array.isArray(value)||value.length>max||Object.keys(value).length!==value.length)fail();return value;}
const validQuestion = question => {
  record(question,['slug','version']);
  if(!allowedSlugs.has(question.slug)||!integer(question.version,1,2147483647))fail();
  return {slug:question.slug,version:question.version};
};
export function emptyDiagnosticState() {return {schemaVersion:1,goal:'foundation',startedAt:null,questions:[],index:0,drafts:{},answers:[]};}

// Feedback is practice evidence, not a score credential. Signed-in saves must
// canonicalize every answer against the same account's server submission receipt.
export function normalizeDiagnosticState(raw) {
  record(raw,['schemaVersion','goal','startedAt','questions','index','drafts','answers']);
  if(raw.schemaVersion!==1||!goals.has(raw.goal)||raw.startedAt!==null&&!integer(raw.startedAt))fail();
  const questions=array(raw.questions,6).map(validQuestion),slugs=new Set(questions.map(q=>q.slug));
  if(slugs.size!==questions.length||new Set(questions.map(q=>diagnosticTopics.find(t=>t.slugs.includes(q.slug)).name)).size!==questions.length||!integer(raw.index,0,questions.length)||questions.length>0&&raw.startedAt===null||!questions.length&&raw.startedAt!==null)fail();
  if(!raw.drafts||typeof raw.drafts!=='object'||Array.isArray(raw.drafts)||![Object.prototype,null].includes(Object.getPrototypeOf(raw.drafts)))fail();
  const drafts={};
  for(const slug of Reflect.ownKeys(raw.drafts)) {
    if(typeof slug!=='string'||!slugs.has(slug)||typeof raw.drafts[slug]!=='string'||raw.drafts[slug].length>2500)fail();
    drafts[slug]=raw.drafts[slug];
  }
  const answers=array(raw.answers,6).map(item=>{
    record(item,['slug','version','answer','submittedAt','submissionId','pass','assistance']);
    if(!questions.some(q=>q.slug===item.slug&&q.version===item.version)||typeof item.answer!=='string'||!item.answer.trim()||item.answer.length>2500||!integer(item.submittedAt)||item.submittedAt<raw.startedAt||typeof item.pass!=='boolean'||!help.has(item.assistance)||item.submissionId!==null&&(typeof item.submissionId!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(item.submissionId)))fail();
    return {slug:item.slug,version:item.version,answer:item.answer,submittedAt:item.submittedAt,submissionId:item.submissionId,pass:item.pass,assistance:item.assistance};
  });
  if(new Set(answers.map(a=>a.slug)).size!==answers.length)fail();
  return {schemaVersion:1,goal:raw.goal,startedAt:raw.startedAt,questions,index:raw.index,drafts,answers};
}

export function diagnosticQuestions(problems=[]) {
  const bySlug=new Map(problems.filter(p=>p.published!==false&&integer(p.id,1)&&integer(p.version,1)).map(p=>[p.slug,p]));
  return diagnosticTopics.map(topic=>topic.slugs.map(slug=>bySlug.get(slug)).find(Boolean)).filter(Boolean);
}
export function startDiagnostic(problems,goal='foundation',now=Date.now()) {
  if(!goals.has(goal)||!integer(now))throw new TypeError('Choose a diagnostic goal and valid start time.');
  const questions=diagnosticQuestions(problems).map(p=>({slug:p.slug,version:p.version}));
  return {...emptyDiagnosticState(),goal,startedAt:questions.length?now:null,questions};
}
const attemptVersion = a => a.problemVersion??a.version??null;

export function practiceEvidence(problems=[],progress={},now=Date.now()) {
  const catalog=problems.filter(p=>p.published!==false&&integer(p.id,1)),byId=new Map(catalog.map(p=>[p.id,p])),seen=new Set();
  let imported=0,oldVersions=0,unknownVersions=0;
  const attempts=(Array.isArray(progress.attempts)?progress.attempts:[]).filter(a=>{
    if(!a||!byId.has(a.id)||typeof a.pass!=='boolean'||typeof a.at!=='string'||!Number.isFinite(Date.parse(a.at))||Date.parse(a.at)>now)return false;
    if(a.source==='imported'){imported++;return false;}
    if(a.source!==undefined&&a.source!=='graded')return false;
    if(a.submissionId){if(seen.has(a.submissionId))return false;seen.add(a.submissionId);}
    const version=attemptVersion(a);
    if(version!==null&&version!==byId.get(a.id).version){oldVersions++;return false;}
    if(version===null)unknownVersions++;
    return true;
  }).map((a,index)=>({...a,index,version:attemptVersion(a),assistance:help.has(a.assistance)?a.assistance:'unknown'})).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)||a.index-b.index).slice(-1000);
  const topics=diagnosticTopics.map(topic=>{
    const recent=attempts.filter(a=>byId.get(a.id).category===topic.name);
    const accepted=recent.filter(a=>a.pass),independent=accepted.filter(a=>a.assistance==='independent'&&a.version!==null);
    const delayed=new Set();
    for(const a of independent){const prior=independent.find(b=>b.id===a.id&&b.version===a.version&&Date.parse(a.at)-Date.parse(b.at)>=3*dayMs);if(prior)delayed.add(a.id);}
    const lastById=new Map(recent.map(a=>[a.id,a])),failures=[...lastById.values()].filter(a=>!a.pass);
    return {...topic,attempts:recent.length,accepted:accepted.length,independent:independent.length,assisted:accepted.filter(a=>['hint','solution'].includes(a.assistance)).length,unknown:recent.filter(a=>a.assistance==='unknown'||a.version===null).length,retained:delayed.size,failures,latest:recent.at(-1)||null};
  });
  return {catalog,attempts,topics,imported,oldVersions,unknownVersions};
}

function goalTopics(goal) {return goal==='analog'?['Circuit analysis','RC circuits','BJT','MOSFET']:goal==='digital'?['Circuit analysis','Digital logic','HDL']:diagnosticTopics.map(t=>t.name);}

export function personalizedPlan(problems=[],progress={},diagnostic=emptyDiagnosticState(),now=Date.now()) {
  const evidence=practiceEvidence(problems,progress,now),date=utcDate(now),dayStart=Date.parse(date+'T00:00:00.000Z');
  // Keep today's three selections stable as answers arrive. A new diagnostic or
  // an explicit goal change can still improve the plan during the day.
  const planningProgress={...progress,attempts:(progress.attempts||[]).filter(a=>Date.parse(a.at)<dayStart),reviews:{}};
  const planning=practiceEvidence(problems,planningProgress,now),goal=goals.has(diagnostic.goal)?diagnostic.goal:'foundation',wanted=goalTopics(goal),catalog=evidence.catalog.filter(p=>wanted.includes(p.category));
  const bySlug=new Map(catalog.map(p=>[p.slug,p])),recent=new Map(planning.attempts.map(a=>[a.id,a]));
  const answers=(diagnostic.answers||[]).filter(a=>bySlug.get(a.slug)?.version===a.version);
  const topicRank=topic=>{
    const diagnosticAnswer=answers.find(a=>bySlug.get(a.slug)?.category===topic.name);
    return topic.failures.length?0:diagnosticAnswer&&!diagnosticAnswer.pass?1:topic.assisted?2:!topic.attempts?3:topic.unknown?4:5;
  };
  const topics=planning.topics.filter(t=>wanted.includes(t.name)).sort((a,b)=>topicRank(a)-topicRank(b)||wanted.indexOf(a.name)-wanted.indexOf(b.name));
  const focus=topics[0]||null,used=new Set(),items=[];
  const add=(problem,kind,title,reason)=>{if(problem&&!used.has(problem.id)){used.add(problem.id);items.push({problem,kind,title,reason});}};
  const ordered=list=>[...list].sort((a,b)=>['Easy','Medium','Hard'].indexOf(a.difficulty)-['Easy','Medium','Hard'].indexOf(b.difficulty)||a.slug.localeCompare(b.slug));
  const failure=focus?.failures.sort((a,b)=>Date.parse(b.at)-Date.parse(a.at))[0];
  const diagnosticFailure=answers.find(a=>!a.pass&&bySlug.get(a.slug)?.category===focus?.name);
  const repair= failure?catalog.find(p=>p.id===failure.id):diagnosticFailure?bySlug.get(diagnosticFailure.slug):ordered(catalog.filter(p=>p.category===focus?.name&&(!recent.has(p.id)||recent.get(p.id).assistance!=='independent')))[0];
  add(repair,'focus','Reconnect the idea',failure?'Your latest answer on this question was not accepted. Revisit the assumptions and try again.':diagnosticFailure?'This diagnostic answer suggests a useful idea to revisit.':focus?.assisted?'Try this topic with the solution closed, then explain the method in your own words.':'Start with a manageable question in your current focus.');
  const fresh=ordered(catalog.filter(p=>p.category===focus?.name&&!used.has(p.id)&&!recent.has(p.id)&&(p.tags||[]).some(tag=>(repair?.tags||[]).includes(tag))))[0]||ordered(catalog.filter(p=>p.category===focus?.name&&!used.has(p.id)&&!recent.has(p.id)))[0];
  add(fresh,'transfer','Try a fresh transfer',`A different ${focus?.name.toLowerCase()||'topic'} question checks whether you can choose a method without remembering the earlier answer.`);
  const retention=reviewQueue(catalog,{attempts:planning.attempts},now).due.find(entry=>{
    const a=recent.get(entry.problem.id);return !used.has(entry.problem.id)&&a?.pass&&a.assistance==='independent'&&a.version===entry.problem.version&&now-Date.parse(a.at)>=3*dayMs;
  });
  if(retention)add(retention.problem,'retention','Return after a gap','At least three days have passed since an accepted answer with no help recorded for this version. Try it again before reopening the solution.');
  else {
    const nextTopic=topics.find(t=>t.name!==focus?.name);
    const mixed=ordered(catalog.filter(p=>p.category===nextTopic?.name&&!used.has(p.id)&&!recent.has(p.id)))[0];
    add(mixed,'interleave','Switch the context','A second topic gives you practice deciding which model or law applies.');
  }
  const completed=new Set(evidence.attempts.filter(a=>a.pass&&utcDate(Date.parse(a.at))===date).map(a=>a.id));
  return {goal,date,focus,items:items.map(item=>({...item,completed:completed.has(item.problem.id)})),minutes:items.reduce((sum,item)=>sum+(Number(item.problem.minutes)||5),0),evidence,diagnosticComplete:diagnostic.questions?.length>0&&diagnostic.index===diagnostic.questions.length,diagnosticAnswered:answers.length};
}
