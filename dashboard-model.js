import {emptyDebugState, normalizeDebugState} from './debugging-state.js?v=ceacf964d1420d5c';
import {debugScenario, diagnoseDebugCase, measureDebugCase} from './debugging-model.js?v=ceacf964d1420d5c';
import {designChallenges, defaultDesignValues, emptyDesignState, normalizeDesignState, designCompletions} from './design-model.js?v=ceacf964d1420d5c';

const object = value => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const text = value => typeof value === 'string' && value.trim().length > 0;
const id = value => Number.isSafeInteger(value) && value > 0;
const published = problem => problem && id(problem.id) && problem.published !== false && problem.published !== 0;
const own = (record, key) => object(record) && Object.hasOwn(record, key) ? record[key] : undefined;

// Only decide whether work exists. Answer text and notes never leave this model.
export function hasSavedAnswer(problem, draft) {
  if (!text(draft)) return false;
  if (problem?.type !== 'multipart') return true;
  let parts;
  try { parts = JSON.parse(draft); } catch { return false; }
  return object(parts) && Array.isArray(problem.parts) && problem.parts.some(part => text(own(parts, part.id)));
}

function anySavedAnswer(draft) {
  if (!text(draft)) return false;
  try {
    const value = JSON.parse(draft);
    if (object(value)) return Object.values(value).some(text);
    if (Array.isArray(value) || value === null) return false;
  } catch {}
  return true;
}

function interviewSummary(raw, catalog, now) {
  const current = raw?.current;
  const session = current?.session;
  if (!object(session) || !Array.isArray(session.problems) || !session.problems.length || !Number.isSafeInteger(session.deadline) || !Number.isSafeInteger(session.startedAt) || session.startedAt < 0 || session.deadline < session.startedAt) return null;
  const questions = session.problems.filter(problem => id(problem?.id));
  if (!questions.length) return null;
  const submitted = questions.filter(problem => typeof own(session.answers, problem.id)?.pass === 'boolean').length;
  const unavailable = questions.filter(problem => !catalog.has(problem.id)).length;
  const changed = questions.filter(problem => catalog.has(problem.id) && Number.isSafeInteger(problem.version) && Number.isSafeInteger(catalog.get(problem.id).version) && problem.version !== catalog.get(problem.id).version).length;
  const active = session.endedAt === null;
  const remaining = active ? Math.max(0, Math.min(session.deadline - session.startedAt, session.deadline - now)) : 0;
  return {active, expired: active && remaining === 0, minutesLeft: Math.ceil(remaining / 60000), total: questions.length, submitted, unavailable, changed};
}

export function dashboardSnapshot({problems = [], progress = {}, interviewState, debugState, designState, now = Date.now()} = {}) {
  const catalog = new Map();
  for (const problem of Array.isArray(problems) ? problems : []) if (published(problem) && !catalog.has(problem.id)) catalog.set(problem.id, problem);
  const solved = new Set((Array.isArray(progress?.solved) ? progress.solved : []).filter(id));
  const drafts = object(progress?.drafts) ? progress.drafts : {};
  const notes = object(progress?.notes) ? progress.notes : {};
  const resume = [];
  for (const problem of catalog.values()) {
    if (solved.has(problem.id)) continue;
    const answer = hasSavedAnswer(problem, own(drafts, problem.id));
    const note = text(own(notes, problem.id));
    if (answer || note) resume.push({id:problem.id, title:typeof problem.title === 'string' ? problem.title : 'Untitled problem', category:typeof problem.category === 'string' ? problem.category : 'Electrical engineering', difficulty:['Easy','Medium','Hard'].includes(problem.difficulty) ? problem.difficulty : '', answer, note});
  }
  const savedIds = new Set([...Object.keys(drafts), ...Object.keys(notes)].filter(key => /^\d+$/.test(key) && String(Number(key)) === key && id(Number(key))).map(Number));
  const unavailable = [...savedIds].filter(problemId => !catalog.has(problemId) && !solved.has(problemId) && (text(own(notes, problemId)) || anySavedAnswer(own(drafts, problemId)))).length;

  let debug = emptyDebugState();
  try { if (debugState !== undefined && debugState !== null) debug = normalizeDebugState(debugState); } catch {}
  const selectedCase = debug.cases.find(item => item.scenarioId === debug.scenarioId && item.probeIds.length > 0);
  let debugging = null;
  if (selectedCase) {
    const scenario = debugScenario(selectedCase.scenarioId);
    // Recompute readings and the last diagnosis; no stored success flag is used.
    selectedCase.probeIds.forEach(probe => measureDebugCase(selectedCase, probe));
    const diagnosis = selectedCase.lastDiagnosis ? diagnoseDebugCase(selectedCase, selectedCase.lastDiagnosis.choiceId, selectedCase.lastDiagnosis.probeIds) : null;
    debugging = {title:scenario.title, measurements:selectedCase.probeIds.length, supported:diagnosis?.pass === true, diagnosed:Boolean(diagnosis)};
  }
  const evidenceCount = debug.completed.filter(item => diagnoseDebugCase(item, item.faultId, item.probeIds).pass).length;

  let design = emptyDesignState();
  try { if (designState !== undefined && designState !== null) design = normalizeDesignState(designState); } catch {}
  const changedDesigns = designChallenges.filter(challenge => {
    const defaults = defaultDesignValues(challenge.id);
    return challenge.fields.some(field => design.drafts[challenge.id][field.id] !== defaults[field.id]);
  });
  const selectedDesign = designChallenges.find(challenge => challenge.id === design.selected);
  const selectedHasWork = changedDesigns.some(challenge => challenge.id === design.selected) || design.attempts.some(attempt => attempt.challengeId === design.selected);
  const designing = changedDesigns.length || design.attempts.length ? {title:selectedHasWork ? selectedDesign.title : 'Your design notebook', changed:changedDesigns.length, checked:design.attempts.length} : null;
  return {resume:resume.slice(0,4), draftCount:resume.length, unavailable, solvedCount:[...catalog.keys()].filter(problemId => solved.has(problemId)).length, total:catalog.size,
    interview:interviewSummary(interviewState, catalog, now), debugging, evidenceCount, designing, validatedDesigns:designCompletions(design).size, designTotal:designChallenges.length};
}
