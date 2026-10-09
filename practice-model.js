import {roadmapStages} from './roadmap-data.js?v=7673f412980e7053';

const dayMs = 86400000;
const intervals = [1, 3, 7, 14, 30];
const focusStages = {analog: ['circuits', 'rc', 'bjt', 'mosfet'], digital: ['circuits', 'digital', 'hdl']};
const published = problems => problems.filter(p => p.published !== false);
export const utcDate = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);

export function roadmap(problems, progress = {}, focus = 'all') {
  const bySlug = new Map(published(problems).map(p => [p.slug, p]));
  const solved = new Set(progress.solved || []);
  const stages = roadmapStages.filter(s => !focusStages[focus] || focusStages[focus].includes(s.id)).map(stage => {
    const list = stage.slugs.map(slug => bySlug.get(slug)).filter(Boolean);
    return {...stage, problems: list, missing: stage.slugs.length - list.length,
      completed: list.filter(p => solved.has(p.id)).length, next: list.find(p => !solved.has(p.id)) || null};
  });
  const list = stages.flatMap(stage => stage.problems);
  return {stages, problems: list, total: stages.reduce((sum, s) => sum + s.slugs.length, 0),
    completed: list.filter(p => solved.has(p.id)).length,
    next: list.find(p => !solved.has(p.id)) || null, missing: stages.reduce((sum, s) => sum + s.missing, 0)};
}

// Guest history is kept in the guest store. Account summaries come from all
// server-side attempts, including those beyond the recent-history display cap.
export function summarizeAttempts(attempts = []) {
  const groups = new Map();
  const ordered = attempts.filter(a => Number.isSafeInteger(a.id) && a.id > 0 && typeof a.pass === 'boolean' && Number.isFinite(Date.parse(a.at)))
    .map((a, index) => ({...a, index})).sort((a, b) => Date.parse(a.at) - Date.parse(b.at) || a.index - b.index);
  for (const attempt of ordered) {
    const state = groups.get(attempt.id) || {days: new Set()};
    if (!attempt.pass) state.days.clear();
    else state.days.add(utcDate(Date.parse(attempt.at)));
    state.last = attempt;
    groups.set(attempt.id, state);
  }
  return Object.fromEntries([...groups].map(([id, {days, last}]) => [id,
    {id, lastAt: new Date(last.at).toISOString(), lastPass: last.pass, successDays: days.size, revision: 0}]));
}

export function reviewQueue(problems, progress = {}, now = Date.now()) {
  const summaries = {...summarizeAttempts(progress.attempts), ...progress.reviews};
  const entries = published(problems).flatMap(problem => {
    const review = summaries[problem.id];
    if (!review || !Number.isFinite(Date.parse(review.lastAt)) || typeof review.lastPass !== 'boolean') return [];
    const successDays = Number.isSafeInteger(review.successDays) ? Math.max(0, review.successDays) : 0;
    const intervalDays = review.lastPass ? intervals[Math.min(intervals.length - 1, Math.max(0, successDays - 1))] : 0;
    const dueAt = Date.parse(review.lastAt) + intervalDays * dayMs;
    return [{problem, lastAt: review.lastAt, lastPass: review.lastPass, successDays, dueAt, intervalDays,
      reason: review.lastPass ? 'Time to revisit' : 'Try again'}];
  });
  const order = (a, b) => Number(a.lastPass) - Number(b.lastPass) || a.dueAt - b.dueAt || a.problem.id - b.problem.id;
  return {due: entries.filter(e => e.dueAt <= now).sort(order), upcoming: entries.filter(e => e.dueAt > now).sort((a,b) => a.dueAt - b.dueAt || a.problem.id - b.problem.id)};
}

// Interleave stages so adjacent days exercise different subjects. The fixed
// slug schedule is independent of database-assigned IDs and API ordering.
const dailySlugs = Array.from({length: Math.max(...roadmapStages.map(s => s.slugs.length))}, (_, i) => roadmapStages.map(s => s.slugs[i]).filter(Boolean)).flat();
export function dailyChallenge(problems, progress = {}, now = Date.now()) {
  const list = published(problems);
  if (!list.length) return null;
  const bySlug = new Map(list.map(p => [p.slug, p]));
  const index = ((Math.floor(now / dayMs) % dailySlugs.length) + dailySlugs.length) % dailySlugs.length;
  let problem;
  for (let offset = 0; offset < dailySlugs.length; offset++) {
    problem = bySlug.get(dailySlugs[(index + offset) % dailySlugs.length]);
    if (problem) break;
  }
  // Only needed if the owner unpublishes the entire curated collection.
  if (!problem) { const sorted = [...list].sort((a,b) => a.id-b.id); problem = sorted[Math.floor(now / dayMs) % sorted.length]; }
  const date = utcDate(now);
  const completed = (progress.attempts || []).some(a => a.id === problem.id && a.pass && Number.isFinite(Date.parse(a.at)) && utcDate(Date.parse(a.at)) === date)
    || !!(progress.reviews?.[problem.id]?.lastPass && utcDate(Date.parse(progress.reviews[problem.id].lastAt)) === date);
  return {problem, date, completed};
}

export function recommendProblems(list, allProblems, progress = {}, now = Date.now()) {
  const due = new Map(reviewQueue(allProblems, progress, now).due.map((entry, i) => [entry.problem.id, i]));
  const curriculum = new Map(roadmap(allProblems, progress).problems.map((p, i) => [p.id, i]));
  const solved = new Set(progress.solved || []);
  const rank = p => due.has(p.id) ? due.get(p.id) : !solved.has(p.id) ? 10000 + (curriculum.get(p.id) ?? 1000 + ['Easy','Medium','Hard'].indexOf(p.difficulty) * 100) : 100000;
  return [...list].sort((a, b) => rank(a) - rank(b) || a.id - b.id);
}
