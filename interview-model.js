// Interview state is temporary practice state, never an authentication or
// grading authority. Only pass/fail receipts from the existing judge belong here.
export const interviewTopics = Object.freeze(['Circuit analysis', 'RC circuits', 'BJT', 'MOSFET', 'Digital logic', 'HDL']);
const levels = ['Easy', 'Medium', 'Hard'];
const minuteMs = 60000;
const validId = value => Number.isSafeInteger(value) && value > 0;
const timestamp = value => Number.isSafeInteger(value) && value >= 0;
const boundedInteger = (value, fallback, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, Math.trunc(value))) : fallback;

function available(problems) {
  const seen = new Set();
  return (Array.isArray(problems) ? problems : []).filter(problem => {
    if (!problem || !validId(problem.id) || problem.published === false || problem.published === 0 || seen.has(problem.id)) return false;
    seen.add(problem.id);
    return true;
  });
}

function shuffled(list, random) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const sample = random();
    const j = Math.floor((Number.isFinite(sample) ? Math.max(0, Math.min(1 - Number.EPSILON, sample)) : 0) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Unique, published questions only. Missing topics means all six; [] means none.
 * Unsolved questions are exhausted before solved ones when preferUnsolved is on.
 * Within each tier, shuffled topic buckets are visited round-robin. A short
 * result means the chosen filters have fewer available questions than requested.
 * Input arrays and problem objects are never changed.
 */
export function selectInterviewProblems(problems, progress = {}, config = {}, random = Math.random) {
  const topics = Array.isArray(config.topics) ? [...new Set(config.topics)].filter(topic => interviewTopics.includes(topic)) : [...interviewTopics];
  const difficulty = levels.includes(config.difficulty) ? config.difficulty : 'All levels';
  const count = boundedInteger(config.count, 5, 1, 10);
  const solved = new Set(Array.isArray(progress.solved) ? progress.solved : []);
  const candidates = available(problems).filter(problem => topics.includes(problem.category) && (difficulty === 'All levels' || difficulty === problem.difficulty));
  const tiers = config.preferUnsolved === false ? [candidates] : [candidates.filter(problem => !solved.has(problem.id)), candidates.filter(problem => solved.has(problem.id))];
  const order = shuffled(topics, random);
  const chosen = [];
  for (const tier of tiers) {
    const buckets = order.map(topic => shuffled(tier.filter(problem => problem.category === topic), random));
    let remaining = true;
    while (remaining && chosen.length < count) {
      remaining = false;
      for (const bucket of buckets) {
        if (bucket.length && chosen.length < count) { chosen.push(bucket.pop()); remaining = true; }
      }
    }
    if (chosen.length === count) break;
  }
  return chosen;
}

/** Takes already-selected questions. Copies contain no cached answer/solution. */
export function createInterviewSession(problems, config = {}, now = Date.now()) {
  if (!timestamp(now)) throw new RangeError('Use a valid interview start time.');
  const questions = available(problems).map(problem => {
    const {answer, hints, explanation, formula, hdlOutputs, referenceCode, walkthrough, ...visible} = problem;
    const copy=structuredClone(visible);
    if(Array.isArray(copy.parts))copy.parts=copy.parts.map(({id,label,unit})=>({id,label,unit}));
    return copy;
  });
  if (!questions.length) throw new RangeError('Choose at least one available problem.');
  const minutes = boundedInteger(config.minutes, 30, 1, 180);
  const deadline = now + minutes * minuteMs;
  if (!timestamp(deadline)) throw new RangeError('Use a valid interview deadline.');
  return {id: globalThis.crypto.randomUUID(), problems: questions, startedAt: now, deadline,
    endedAt: null, reason: null, minutes, answers: {}};
}

export function remainingMs(session, now = Date.now()) {
  if (!timestamp(now)) throw new RangeError('Use a valid current time.');
  return session.endedAt !== null ? 0 : Math.max(0, Math.min(session.deadline - session.startedAt, session.deadline - now));
}

/**
 * The first graded receipt, passing or failing, is the final answer per question.
 * Duplicate receipts are harmless no-ops. Invalid receipts throw RangeError.
 * A request must start before the deadline AND any manual finish. Its response
 * may arrive after either: network latency must not discard submitted work.
 */
export function recordInterviewAnswer(session, receipt, now = Date.now()) {
  if (!receipt || !validId(receipt.problemId) || !session.problems.some(problem => problem.id === receipt.problemId)) throw new RangeError('This problem is not in the interview.');
  if (Object.hasOwn(session.answers, receipt.problemId)) return session;
  const {problemId, pass, startedAt, receivedAt} = receipt;
  if (typeof pass !== 'boolean' || !timestamp(startedAt) || !timestamp(receivedAt) || !timestamp(now) || receivedAt < startedAt || receivedAt > now) throw new RangeError('Use a valid graded answer receipt.');
  const lastStart = session.endedAt === null ? session.deadline : Math.min(session.deadline, session.endedAt);
  if (startedAt < session.startedAt || startedAt >= lastStart) throw new RangeError('The answer was submitted outside the interview time.');
  return {...session, answers: {...session.answers, [problemId]: {problemId, pass, startedAt, receivedAt,...(typeof receipt.submissionId === 'string' ? {submissionId:receipt.submissionId} : {}),...(typeof receipt.assistance === 'string' ? {assistance:receipt.assistance} : {}),...(Number.isFinite(receipt.score)&&receipt.score>=0&&receipt.score<=1?{score:receipt.score}:{})}}};
}

/** Completion is fixed on the first call. Timeout always ends at the deadline. */
export function finishInterview(session, reason = 'finished', now = Date.now()) {
  if (session.endedAt !== null) return session;
  if (!['finished', 'timeout'].includes(reason)) throw new RangeError('Use a valid interview finish reason.');
  if (!timestamp(now) || now < session.startedAt) throw new RangeError('Use a valid interview finish time.');
  if (reason === 'timeout' && now < session.deadline) throw new RangeError('The interview still has time remaining.');
  const endedAt = Math.min(now, session.deadline);
  return {...session, endedAt, reason: endedAt === session.deadline ? 'timeout' : reason};
}

/** Scores represent this session's first answers, not a certification of mastery. */
export function sessionScore(session, now = Date.now()) {
  if (!timestamp(now)) throw new RangeError('Use a valid current time.');
  const counts = () => ({accepted: 0, submitted: 0, unanswered: 0, total: 0, percent: 0});
  const result = {...counts(), elapsedMs: Math.max(0, Math.min(session.endedAt ?? now, session.deadline) - session.startedAt), byTopic: {}};
  for (const problem of session.problems) {
    const answer = session.answers[problem.id];
    const topic = problem.category;
    if (!Object.hasOwn(result.byTopic, topic)) Object.defineProperty(result.byTopic, topic, {value: counts(), enumerable: true, writable: true, configurable: true});
    for (const counter of [result, result.byTopic[topic]]) {
      counter.total++;
      if (answer) { counter.submitted++; if (answer.pass) counter.accepted++; }
      else counter.unanswered++;
    }
  }
  for (const counter of [result, ...Object.values(result.byTopic)]) counter.percent = counter.total ? Math.round(counter.accepted / counter.total * 100) : 0;
  return result;
}
