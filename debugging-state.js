import {debuggingScenarios,debugScenario,diagnoseDebugCase,measureDebugCase} from './debugging-model.js?v=f7435ebd4a867484';

// Store model identifiers and evidence only. Displayed readings and verdicts are
// always recalculated; saved practice is not an assessment credential.
const fail = () => { throw new TypeError('Saved debugging practice is malformed.'); };
function record(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) fail();
  const own=Reflect.ownKeys(value);
  if (own.length!==keys.length || own.some(key=>typeof key!=='string'||!keys.includes(key)) || keys.some(key=>!Object.hasOwn(value,key))) fail();
}
function items(value, maximum) { if (!Array.isArray(value)||value.length>maximum||Object.keys(value).length!==value.length) fail(); return value; }
function scenarioFor(id) { if (typeof id!=='string'||!debuggingScenarios.some(s=>s.id===id)) fail(); return debugScenario(id); }
function faultFor(scenario,id,allowEmpty=false) { if (allowEmpty&&id==='') return id; if (typeof id!=='string'||!scenario.faults.some(f=>f.id===id)) fail(); return id; }
function probesFor(scenario,ids) {
  items(ids,scenario.probes.length);
  if (ids.some(id=>typeof id!=='string'||!scenario.probes.some(p=>p.id===id))||new Set(ids).size!==ids.length) fail();
  return [...ids];
}
function evidence(raw, timed=false) {
  record(raw,timed?['scenarioId','faultId','choiceId','probeIds','at']:['scenarioId','faultId','probeIds']);
  const scenario=scenarioFor(raw.scenarioId),faultId=faultFor(scenario,raw.faultId),probeIds=probesFor(scenario,raw.probeIds);
  if (probeIds.length<2) fail();
  // Validate the model path, never accept cached numbers or success flags.
  for (const id of probeIds) measureDebugCase({scenarioId:scenario.id,faultId},id);
  if (timed) {
    const choiceId=faultFor(scenario,raw.choiceId);
    if (!Number.isSafeInteger(raw.at)||raw.at<0||raw.at>9999999999999) fail();
    diagnoseDebugCase({scenarioId:scenario.id,faultId},choiceId,probeIds);
    return {scenarioId:scenario.id,faultId,choiceId,probeIds,at:raw.at};
  }
  if (!diagnoseDebugCase({scenarioId:scenario.id,faultId},faultId,probeIds).pass) fail();
  return {scenarioId:scenario.id,faultId,probeIds};
}

export function emptyDebugState() { return {schemaVersion:1,scenarioId:'divider',cases:[],history:[],completed:[]}; }

export function normalizeDebugState(raw) {
  record(raw,['schemaVersion','scenarioId','cases','history','completed']);
  if (raw.schemaVersion!==1) fail();
  const selected=scenarioFor(raw.scenarioId),cases=items(raw.cases,debuggingScenarios.length).map(item=>{
    record(item,['scenarioId','faultId','probeId','probeIds','choiceId','lastDiagnosis']);
    const scenario=scenarioFor(item.scenarioId),faultId=faultFor(scenario,item.faultId),probeIds=probesFor(scenario,item.probeIds),choiceId=faultFor(scenario,item.choiceId,true);
    if (!scenario.probes.some(p=>p.id===item.probeId)) fail();
    for (const id of probeIds) measureDebugCase({scenarioId:scenario.id,faultId},id);
    let lastDiagnosis=null;
    if (item.lastDiagnosis!==null) {
      record(item.lastDiagnosis,['choiceId','probeIds']);
      const attemptedChoice=faultFor(scenario,item.lastDiagnosis.choiceId),attemptedProbes=probesFor(scenario,item.lastDiagnosis.probeIds);
      if (attemptedChoice!==choiceId||attemptedProbes.length<2||attemptedProbes.some(id=>!probeIds.includes(id))) fail();
      diagnoseDebugCase({scenarioId:scenario.id,faultId},attemptedChoice,attemptedProbes);
      lastDiagnosis={choiceId:attemptedChoice,probeIds:attemptedProbes};
    }
    return {scenarioId:scenario.id,faultId,probeId:item.probeId,probeIds,choiceId,lastDiagnosis};
  });
  if (new Set(cases.map(c=>c.scenarioId)).size!==cases.length) fail();
  const history=items(raw.history,20).map(item=>evidence(item,true));
  const completed=items(raw.completed,20).map(item=>evidence(item));
  if (new Set(completed.map(c=>`${c.scenarioId}:${c.faultId}`)).size!==completed.length) fail();
  return {schemaVersion:1,scenarioId:selected.id,cases,history,completed};
}
