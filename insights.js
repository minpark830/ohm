import {recommendProblems, reviewQueue, utcDate} from './practice-model.js?v=50be9e1e989012d0';

const dayMs = 86400000;
const validId = id => Number.isSafeInteger(id) && id > 0;

/** Recent rates are descriptive practice feedback, never a mastery estimate. */
export function topicInsights(problems = [], progress = {}, categories = [], now = Date.now()) {
  const catalog = problems.filter(p => p && validId(p.id) && p.published !== false);
  const byId = new Map(catalog.map(p => [p.id, p]));
  const solved = new Set((progress.solved || []).filter(id => byId.has(id)));
  const seen = new Set();
  const attempts = (progress.attempts || []).filter(a => {
    if (!a || !byId.has(a.id) || typeof a.pass !== 'boolean' || !Number.isFinite(Date.parse(a.at)) || Date.parse(a.at) > now) return false;
    if (a.source !== undefined && !['graded', 'imported'].includes(a.source)) return false;
    if (typeof a.submissionId === 'string' && a.submissionId) {
      if (seen.has(a.submissionId)) return false;
      seen.add(a.submissionId);
    }
    return true;
  }).map((a, order) => ({...a, order})).sort((a, b) => Date.parse(a.at) - Date.parse(b.at) || a.order - b.order).slice(-1000);
  const checked = attempts.filter(a => a.source !== 'imported');
  const retries = reviewQueue(catalog, progress, now).due.filter(entry => !entry.lastPass);
  const retryIds = new Set(retries.map(entry => entry.problem.id));
  const ranked = recommendProblems(catalog, catalog, progress, now);
  const topics = categories.map(category => {
    const list = catalog.filter(p => p.category === category.name);
    const ids = new Set(list.map(p => p.id));
    const recent = checked.filter(a => ids.has(a.id));
    const completed = list.filter(p => solved.has(p.id)).length;
    const retryCount = list.filter(p => retryIds.has(p.id)).length;
    const importedCount = attempts.filter(a => a.source === 'imported' && ids.has(a.id)).length;
    const accepted = recent.filter(a => a.pass).length;
    const next = ranked.find(p => ids.has(p.id)) || null;
    return {...category, total: list.length, solved: completed, coverage: list.length ? Math.round(completed / list.length * 100) : 0,
      attempts: recent.length, accepted, acceptance: recent.length ? Math.round(accepted / recent.length * 100) : null,
      attemptedProblems: new Set(recent.map(a => a.id)).size, importedCount, retryCount, next};
  });
  const today = Date.parse(utcDate(now) + 'T00:00:00.000Z');
  const activity = Array.from({length: 7}, (_, index) => {
    const date = utcDate(today - (6 - index) * dayMs);
    const daily = checked.filter(a => utcDate(Date.parse(a.at)) === date);
    return {date, attempts: daily.length, accepted: daily.filter(a => a.pass).length};
  });
  const suggestedProblem = retries[0]?.problem || ranked.find(p => !solved.has(p.id)) || ranked[0] || null;
  const suggested = topics.find(topic => topic.name === suggestedProblem?.category) || null;
  const accepted = checked.filter(a => a.pass).length;
  return {topics, activity, suggested, suggestedProblem, asOf: utcDate(now), summary: {
    total: catalog.length, solved: solved.size, attempts: checked.length, accepted,
    acceptance: checked.length ? Math.round(accepted / checked.length * 100) : null,
    importedCount: attempts.length - checked.length, retryCount: retries.length,
    activeDays: activity.filter(day => day.attempts > 0).length,
    weeklyAttempts: activity.reduce((sum, day) => sum + day.attempts, 0)
  }};
}

export function createInsights({shell, esc, icon, getProblems, getProgress, categories, openProblem, navigate, startInterview}) {
  const data = () => topicInsights(getProblems(), getProgress(), categories);
  const dateLabel = date => new Date(date + 'T12:00:00Z').toLocaleDateString(undefined, {weekday: 'short', timeZone: 'UTC'});
  const fullDate = date => new Date(date + 'T12:00:00Z').toLocaleDateString(undefined, {month: 'short', day: 'numeric', timeZone: 'UTC'});
  const color = value => /^#[a-f0-9]{3,8}$/i.test(value || '') ? value : '#3d8a69';
  const openButton = (problem, label, primary = false) => problem ? `<button class="button ${primary ? 'primary' : ''}" data-insight-open="${problem.id}">${esc(label)}${icon('chevron', 15)}</button>` : '';
  const interviewButton = (topic, label = 'Timed practice') => `<button class="button" data-insight-interview="${esc(topic.name)}">${icon('clock', 15)}${esc(label)}</button>`;

  function topicCard(topic) {
    const status = topic.retryCount ? `${topic.retryCount} to retry` : !topic.total ? 'No available problems' : topic.solved === topic.total ? 'Keep it fresh' : topic.attempts ? 'Keep exploring' : topic.solved || topic.importedCount ? 'Build on your history' : 'Ready to explore';
    return `<article class="insight-topic" style="--insight-topic:${color(topic.color)};--insight-tint:${color(topic.tint)}">
      <div class="insight-topic-heading"><span class="insight-topic-icon" aria-hidden="true">${icon(topic.icon, 22)}</span><div><h2>${esc(topic.name)}</h2><p>${esc(status)}</p></div>${topic.retryCount ? `<span class="insight-retry-chip">${icon('reset', 12)}${topic.retryCount}</span>` : ''}</div>
      <div class="insight-coverage"><span>Library coverage</span><strong>${topic.solved}<small> / ${topic.total} solved</small></strong></div>
      <div class="insight-coverage-track" role="progressbar" aria-label="${esc(topic.name)} library coverage" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${topic.coverage}"><span style="width:${topic.coverage}%"></span></div>
      <div class="insight-topic-metrics"><div><span>Recent acceptance</span><strong>${topic.acceptance === null ? '—' : topic.acceptance + '%'}</strong><p>${topic.accepted} accepted / ${topic.attempts} submissions</p></div><div><span>Problems practiced</span><strong>${topic.attemptedProblems}</strong><p>In recent checked history</p></div></div>
      ${topic.importedCount ? `<p class="insight-import-note">${topic.importedCount} imported ${topic.importedCount === 1 ? 'submission' : 'submissions'} excluded from the rate.</p>` : ''}
      ${topic.next ? `<div class="insight-next-problem"><span>NEXT TO EXPLORE</span><button data-insight-open="${topic.next.id}">${esc(topic.next.title)}${icon('chevron', 16)}</button></div><div class="insight-topic-actions">${openButton(topic.next, topic.retryCount ? 'Retry a problem' : topic.solved === topic.total ? 'Revisit a problem' : 'Practice')}${interviewButton(topic)}</div>` : '<p class="insight-topic-empty">Published problems will appear here.</p>'}
    </article>`;
  }

  function render() {
    const {topics, activity, summary, suggested, suggestedProblem} = data();
    const maxActivity = Math.max(1, ...activity.map(day => day.attempts));
    const focusNote = suggested?.retryCount ? 'A recent attempt is ready for another look.' : suggested && !suggested.attempts ? 'Explore this topic and start building a practice history.' : 'A useful next problem, picked from your review queue and study path.';
    shell(`<div class="page insights-page">
      <div class="page-heading insights-heading"><div><span class="eyebrow">YOUR PRACTICE PATTERNS</span><h1>See where to go next.</h1><p>A closer look at your topics, recent attempts, and next steps.</p></div><button class="button" data-insight-view="interview">${icon('clock', 16)}Try timed practice</button></div>
      <div class="insight-overview"><section class="insight-stat"><span>Library coverage</span><strong>${summary.solved}<small> / ${summary.total}</small></strong><p>Available problems solved</p></section><section class="insight-stat"><span>Recent acceptance</span><strong>${summary.acceptance === null ? '—' : summary.acceptance + '%'}</strong><p>${summary.accepted} accepted / ${summary.attempts} checked submissions</p></section><section class="insight-stat"><span>Ready for another try</span><strong>${summary.retryCount}</strong><p>Problems with a latest unaccepted attempt</p></section></div>
      <div class="insight-middle"><section class="insight-activity" aria-labelledby="insight-activity-title"><div class="insight-section-heading"><div><h2 id="insight-activity-title">A little practice adds up.</h2><p>Last 7 days · UTC</p></div><span>${summary.activeDays}<small> / 7 days active</small></span></div><div class="insight-week">${activity.map(day => `<div class="insight-day"><span class="insight-day-count">${day.attempts}</span><div class="insight-day-column" role="img" aria-label="${esc(fullDate(day.date))}: ${day.attempts} checked submissions, ${day.accepted} accepted"><span style="height:${day.attempts ? Math.max(8, day.attempts / maxActivity * 100) : 0}%"></span></div><span class="insight-day-label">${esc(dateLabel(day.date))}</span></div>`).join('')}</div><p class="insight-activity-foot">${summary.weeklyAttempts ? `${summary.weeklyAttempts} checked ${summary.weeklyAttempts === 1 ? 'submission' : 'submissions'} this week. Every attempt is useful practice.` : 'Your next checked answer starts the story.'}</p></section>
      <section class="insight-focus"><span class="eyebrow">A PLACE TO FOCUS</span><h2>${esc(suggested?.name || 'Start with a problem.')}</h2><p>${esc(suggested ? focusNote : 'Explore the library as new problems become available.')}</p>${suggestedProblem ? `<button class="insight-focus-problem" data-insight-open="${suggestedProblem.id}">${esc(suggestedProblem.title)}${icon('chevron', 17)}</button>` : ''}<div class="insight-focus-actions">${suggested ? interviewButton(suggested, 'Practice this topic') : '<button class="button" data-insight-view="problems">Open library</button>'}<button class="button link" data-insight-view="review">Open review queue${icon('chevron', 14)}</button></div></section></div>
      <div class="insight-section-heading insight-topics-heading"><div><h2>Your topics</h2><p>Coverage shows solved problems. Recent rates show accepted submissions.</p></div></div>
      <div class="insight-topics">${topics.map(topicCard).join('')}</div>
      <div class="insight-data-note">${icon('help', 17)}<p>Recent metrics use up to the latest 1,000 saved submissions for available problems. Imported browser submissions are excluded from acceptance rates and activity; imported solves still count toward coverage.${summary.importedCount ? ` This history includes ${summary.importedCount} imported ${summary.importedCount === 1 ? 'submission' : 'submissions'}.` : ''} Repeated attempts count separately. These are practice patterns, not a measure of mastery.</p></div>
    </div>`);
  }

  function summaryCard() {
    const {summary, suggested} = data();
    return `<section class="insight-summary"><span class="insight-summary-icon" aria-hidden="true">${icon('chart', 22)}</span><div><h2>Find your next focus.</h2><p>${summary.retryCount ? `${summary.retryCount} ${summary.retryCount === 1 ? 'problem is' : 'problems are'} ready for another try.` : suggested ? `Explore ${esc(suggested.name)} and build on your practice.` : 'Turn your practice history into a useful next step.'} See your topics and recent activity.</p></div><button class="button" data-insight-view="insights">View insights${icon('chevron', 15)}</button></section>`;
  }

  function onClick(event) {
    const button = event.target.closest('[data-insight-open],[data-insight-interview],[data-insight-view]');
    if (!button) return false;
    if (button.dataset.insightOpen) {
      const id = Number(button.dataset.insightOpen);
      if (getProblems().some(p => p.id === id && p.published !== false)) openProblem(id);
    } else if (button.dataset.insightInterview) {
      const topic = categories.find(c => c.name === button.dataset.insightInterview);
      if (topic && getProblems().some(p => p.category === topic.name && p.published !== false)) startInterview(topic.name);
    } else if (['insights', 'interview', 'review', 'problems'].includes(button.dataset.insightView)) navigate(button.dataset.insightView);
    return true;
  }

  return {render, onClick, summaryCard};
}
