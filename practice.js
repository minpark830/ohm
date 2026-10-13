import {roadmap, reviewQueue, dailyChallenge, recommendProblems} from './practice-model.js?v=5a6db230efbf0bf2';

const stageIcons = {circuits: 'circuit', rc: 'capacitor', bjt: 'transistor', mosfet: 'mosfet', digital: 'logic', hdl: 'code'};
const focuses = [['all', 'Complete path'], ['analog', 'Analog focus'], ['digital', 'Digital / HDL focus']];
const dateLabel = value => new Date(value).toLocaleDateString(undefined, {month: 'short', day: 'numeric', timeZone: 'UTC'});

export function createPractice({shell, esc, icon, getProblems, getProgress, openProblem, navigate}) {
  let focus = 'all';
  let context = null;
  const data = () => roadmap(getProblems(), getProgress(), focus);
  const queue = () => reviewQueue(getProblems(), getProgress());
  const isSolved = problem => (getProgress().solved || []).includes(problem.id);
  const dueCount = () => queue().due.length;
  const number = value => Math.max(0, Number(value) || 0);
  const badge = problem => `<span class="difficulty ${['Easy', 'Medium', 'Hard'].includes(problem.difficulty) ? problem.difficulty : ''}"><i class="difficulty-dot"></i>${esc(problem.difficulty)}</span>`;
  const openButton = (problem, label, from, primary = false) => `<button class="button ${primary ? 'primary' : ''}" data-practice-open="${esc(problem.id)}" data-practice-from="${from}">${label}${icon('chevron', 15)}</button>`;
  const progressBar = (completed, total) => `<div class="practice-progress-track" role="progressbar" aria-label="Problems solved" aria-valuemin="0" aria-valuemax="${number(total)}" aria-valuenow="${number(completed)}"><span style="width:${total ? Math.min(100, number(completed) / total * 100) : 0}%"></span></div>`;

  function dailyCard() {
    const daily = dailyChallenge(getProblems(), getProgress());
    if (!daily) return '';
    const {problem, date, completed} = daily;
    return `<section class="daily-card practice-daily" aria-labelledby="practice-daily-title">
      <div class="daily-eyebrow"><div>${icon('bolt', 15)} DAILY CHALLENGE</div><span><time datetime="${esc(date)}">${esc(dateLabel(date + 'T00:00:00Z'))}</time> UTC</span></div>
      <p class="practice-topic">${esc(problem.category)}</p>
      <h2 id="practice-daily-title">${esc(problem.title)}</h2>
      <div class="practice-problem-meta">${badge(problem)}<span>${esc(problem.minutes)} min</span></div>
      ${completed ? `<p class="practice-daily-complete">${icon('check', 15)} Completed today</p>` : '<p>A fresh problem each day. Make a little room for practice.</p>'}
      ${openButton(problem, completed ? 'Revisit problem' : 'Take the challenge', 'daily', true)}
      <p class="practice-daily-note">Refreshes at 00:00 UTC</p>
    </section>`;
  }

  function libraryCard() {
    const plan = roadmap(getProblems(), getProgress());
    const due = dueCount();
    return `<section class="practice-library-card" aria-label="Your practice plan">
      <div class="practice-plan-mark" aria-hidden="true">75</div>
      <div class="practice-library-copy"><h2>Build your foundation with Ohm 75.</h2><p>A guided path through circuits, transistors, digital logic, and HDL. <span>${plan.completed} / ${plan.total} solved</span></p></div>
      <div class="practice-library-actions"><button class="button" data-view="review">${icon('reset', 15)}Review${due ? ` <span class="practice-count">${due}</span>` : ''}</button><button class="button primary" data-view="roadmap">Explore the path${icon('chevron', 15)}</button></div>
    </section>`;
  }

  function problemRow(problem, index, from, current = false) {
    const solved = isSolved(problem);
    return `<li class="practice-problem-row ${current ? 'practice-current' : ''}">
      <span class="practice-row-status ${solved ? 'is-solved' : ''}" aria-label="${solved ? 'Solved' : 'Not yet solved'}">${solved ? icon('check', 13) : `<span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>`}</span>
      <button class="practice-problem-title" data-practice-open="${esc(problem.id)}" data-practice-from="${from}">${esc(problem.title)}${current ? '<span class="practice-next-tag">UP NEXT</span>' : ''}</button>
      <div class="practice-row-meta">${badge(problem)}<span>${esc(problem.minutes)} min</span></div>
      <button class="practice-row-open" data-practice-open="${esc(problem.id)}" data-practice-from="${from}" aria-label="Open ${esc(problem.title)}">${icon('chevron', 17)}</button>
    </li>`;
  }

  function stageCard(stage, index, plan) {
    const complete = stage.completed === stage.slugs.length;
    const active = stage.problems.some(problem => problem.id === plan.next?.id);
    return `<details class="practice-stage ${active ? 'is-current-stage' : ''}" ${active ? 'open' : ''}>
      <summary><span class="practice-stage-symbol" aria-hidden="true">${icon(stageIcons[stage.id] || 'circuit', 22)}</span><span class="practice-stage-label"><span class="practice-step-label">STEP ${String(index + 1).padStart(2, '0')}</span><span class="practice-stage-title">${esc(stage.title)}</span></span><span class="practice-stage-count ${complete ? 'is-complete' : ''}">${complete ? icon('check', 14) : ''}${stage.completed} / ${stage.slugs.length}<span class="practice-stage-count-label"> solved</span></span><span class="practice-stage-chevron" aria-hidden="true">${icon('chevron', 17)}</span></summary>
      <div class="practice-stage-body"><p>${esc(stage.description)}</p><p class="practice-prerequisite"><strong>Before you start</strong> ${esc(stage.prerequisite)}</p>${progressBar(stage.completed, stage.slugs.length)}
      <ol class="practice-problem-list">${stage.problems.map((problem, i) => problemRow(problem, i, 'roadmap', problem.id === plan.next?.id)).join('')}</ol>
      ${stage.missing ? `<p class="practice-unavailable">${stage.missing} ${stage.missing === 1 ? 'problem is' : 'problems are'} currently unavailable. The path keeps your place until ${stage.missing === 1 ? 'it returns' : 'they return'}.</p>` : ''}</div>
    </details>`;
  }

  function roadmapPage() {
    const plan = data();
    const complete = plan.completed === plan.total;
    const nextStage = plan.stages.find(stage => stage.problems.some(problem => problem.id === plan.next?.id));
    const due = dueCount();
    shell(`<div class="page practice-page">
      <div class="page-heading practice-page-heading"><div><span class="eyebrow">GUIDED INTERVIEW PREP</span><h1>One path. Stronger foundations.</h1><p>Ohm 75 brings the essentials into focus, one well-chosen problem at a time.</p></div><button class="button" data-view="problems">${icon('grid', 15)}Problem library</button></div>
      <section class="practice-plan-overview" aria-label="Ohm 75 progress"><div class="practice-plan-title"><span class="practice-plan-mark" aria-hidden="true">75</span><div><h2>Ohm 75</h2><p>${focus === 'all' ? 'The complete electrical engineering path' : focus === 'analog' ? 'Circuit foundations and analog devices' : 'Circuit foundations, digital logic, and HDL'}</p></div></div><div class="practice-overview-progress"><div><strong>${plan.completed}<span> / ${plan.total}</span></strong><span>problems solved</span></div>${progressBar(plan.completed, plan.total)}</div></section>
      <div class="practice-path-toolbar"><div class="practice-focus" role="group" aria-label="Choose a study focus">${focuses.map(([value, label]) => `<button data-practice-focus="${value}" aria-pressed="${focus === value}">${label}</button>`).join('')}</div><p>${plan.stages.length} stages · Move at your own pace</p></div>
      ${plan.missing ? `<p class="practice-notice">${plan.missing} of the ${plan.total} planned problems ${plan.missing === 1 ? 'is' : 'are'} currently unpublished. Your completion count includes available problems only.</p>` : ''}
      <div class="practice-path-layout"><section class="practice-stages" aria-label="Study path stages">${plan.stages.map((stage, i) => stageCard(stage, i, plan)).join('')}</section>
      <aside class="practice-path-aside"><section class="practice-continue-card"><span class="eyebrow">${complete ? 'PATH COMPLETE' : plan.next ? 'YOUR NEXT STEP' : 'YOU’RE UP TO DATE'}</span>${plan.next ? `<p class="practice-topic">${esc(nextStage?.title)}</p><h2>${esc(plan.next.title)}</h2><div class="practice-problem-meta">${badge(plan.next)}<span>${esc(plan.next.minutes)} min</span></div>${openButton(plan.next, plan.completed ? 'Continue the path' : 'Start the path', 'roadmap', true)}` : `<h2>${complete ? 'You made it through.' : 'All available problems solved.'}</h2><p>${complete ? 'Keep your reasoning fresh by returning to problems in your review queue.' : 'Come back when the remaining problems are available, or revisit a previous solve.'}</p><button class="button primary" data-view="review">Open review queue${icon('chevron', 15)}</button>`}<div class="practice-card-foot">${icon('check', 14)}Your existing solves count toward the path.</div></section>
      <button class="practice-review-shortcut" data-view="review"><span class="practice-shortcut-icon">${icon('reset', 20)}</span><span><strong>${due ? `${due} ${due === 1 ? 'problem' : 'problems'} to revisit` : 'Keep what you learn'}</strong><small>${due ? 'Your review queue is ready' : 'Review grows with your practice'}</small></span>${icon('chevron', 17)}</button>
      ${dailyCard()}<p class="practice-aside-note">Start with the foundations, or choose a focus for the role you want. Every stage stays open to explore.</p></aside></div>
    </div>`);
  }

  function reviewRow(entry, upcoming = false) {
    const {problem, lastPass, dueAt, intervalDays} = entry;
    const dueLabel = upcoming ? `Due ${dateLabel(dueAt)}` : lastPass ? 'Time to revisit' : 'Try again';
    return `<li class="practice-review-row"><span class="practice-review-symbol ${lastPass ? '' : 'needs-retry'}" aria-hidden="true">${icon(lastPass ? 'clock' : 'reset', 19)}</span><div class="practice-review-problem"><button class="practice-problem-title" data-practice-open="${esc(problem.id)}" data-practice-from="review">${esc(problem.title)}</button><div class="practice-review-reason"><span class="${lastPass ? '' : 'practice-retry-label'}">${esc(dueLabel)}</span><span>·</span><span>${esc(problem.category)}</span></div></div><div class="practice-review-interval">${badge(problem)}<span>${lastPass ? `${intervalDays}-day interval` : 'Last attempt not accepted'}</span></div><button class="button practice-review-open" data-practice-open="${esc(problem.id)}" data-practice-from="review">${upcoming ? 'Practice early' : 'Review'}${icon('chevron', 14)}</button></li>`;
  }

  function reviewPage() {
    const {due, upcoming} = queue();
    const retry = due.filter(entry => !entry.lastPass).length;
    shell(`<div class="page practice-page">
      <div class="page-heading practice-page-heading"><div><span class="eyebrow">SPACED PRACTICE</span><h1>Make it stick.</h1><p>Return to the problems that need another look. Keep your reasoning fresh.</p></div><button class="button" data-view="roadmap">${icon('book', 15)}Ohm 75 path</button></div>
      <div class="practice-review-layout"><section class="practice-review-main"><section class="practice-review-hero"><div><span class="eyebrow">READY TO REVIEW</span><h2>${due.length}<span> ${due.length === 1 ? 'problem' : 'problems'}</span></h2><p>${due.length ? `${retry ? `${retry} to retry` : 'Your previous solves are ready for another pass'}${retry && due.length > retry ? ` · ${due.length - retry} scheduled revisits` : ''}` : upcoming.length ? 'You’re caught up. Your next review is on its way.' : 'Your next submission starts your review queue.'}</p></div>${due.length ? openButton(due[0].problem, 'Start reviewing', 'review', true) : `<span class="practice-review-hero-icon" aria-hidden="true">${icon(upcoming.length ? 'check' : 'reset', 30)}</span>`}</section>
      ${due.length ? `<div class="practice-review-section-heading"><h2>Ready now</h2><span>Retries first, then scheduled reviews</span></div><ul class="practice-review-list" aria-label="Problems due for review">${due.map(entry => reviewRow(entry)).join('')}</ul>` : `<section class="practice-queue-empty"><span aria-hidden="true">${icon(upcoming.length ? 'check' : 'bulb', 24)}</span><h2>${upcoming.length ? 'A little space helps.' : 'Practice once. Come back stronger.'}</h2><p>${upcoming.length ? 'Your accepted submissions are scheduled below. Continue your study path while they settle in.' : 'Submit an answer to any problem. Unaccepted attempts return here right away; accepted submissions come back after a little time.'}</p><button class="button" data-view="roadmap">Continue with Ohm 75${icon('chevron', 15)}</button></section>`}
      ${upcoming.length ? `<section class="practice-upcoming"><div class="practice-review-section-heading"><h2>Coming up <span>${upcoming.length}</span></h2><span>Dates shown in UTC</span></div><ul class="practice-review-list" aria-label="Upcoming reviews">${upcoming.slice(0, 5).map(entry => reviewRow(entry, true)).join('')}</ul>${upcoming.length > 5 ? `<details class="practice-more-reviews"><summary>Show ${upcoming.length - 5} more scheduled ${upcoming.length - 5 === 1 ? 'review' : 'reviews'}</summary><ul class="practice-review-list">${upcoming.slice(5).map(entry => reviewRow(entry, true)).join('')}</ul></details>` : ''}</section>` : ''}</section>
      <aside class="practice-path-aside"><section class="practice-review-guide"><span class="practice-guide-icon" aria-hidden="true">${icon('reset', 21)}</span><h2>A rhythm for remembering.</h2><p>Get it right on separate days to stretch the time between reviews.</p><ol class="practice-spacing" aria-label="Review intervals">${[1, 3, 7, 14, 30].map(days => `<li><strong>${days}</strong><span>${days === 1 ? 'day' : 'days'}</span></li>`).join('')}</ol><p>An unaccepted attempt resets the interval and makes the problem ready to retry.</p><div class="practice-guide-note">${icon('bulb', 16)}<p>Explain the reasoning before you submit. A correct answer is a useful signal, not a measure of mastery.</p></div></section>${dailyCard()}</aside></div>
    </div>`);
  }

  function nextInContext(problem) {
    if (context?.from === 'review') return queue().due.find(entry => entry.problem.id !== problem.id)?.problem || null;
    if (context?.from !== 'roadmap') return null;
    const plan = roadmap(getProblems(), getProgress(), context.focus);
    const index = plan.problems.findIndex(item => item.id === problem.id);
    const remaining = [...plan.problems.slice(index + 1), ...plan.problems.slice(0, Math.max(0, index))];
    return remaining.find(item => !isSolved(item)) || null;
  }

  function contextBanner(problem) {
    if (!context || context.id !== problem.id) return '';
    const from = context.from;
    const next = nextInContext(problem);
    const label = from === 'roadmap' ? 'Ohm 75' : from === 'review' ? 'Review queue' : 'Daily challenge';
    const backView = from === 'daily' ? 'problems' : from;
    const currentDaily = from === 'daily' ? dailyChallenge(getProblems(), getProgress()) : null;
    const note = from === 'roadmap' ? `${focuses.find(([value]) => value === context.focus)?.[1] || 'Complete path'}` : from === 'review' ? `${dueCount()} ready to review` : currentDaily?.problem.id === problem.id ? `${currentDaily.completed ? 'Completed today · ' : ''}${dateLabel(currentDaily.date + 'T00:00:00Z')} UTC` : 'Keep the daily practice going';
    return `<nav class="practice-context" aria-label="Practice navigation"><div><button data-view="${backView}">${icon('left', 15)}${label}</button><span>${esc(note)}</span></div>${next ? `<button class="button" data-practice-action="next">${from === 'review' ? 'Next review' : 'Next in path'}${icon('chevron', 14)}</button>` : from !== 'daily' ? `<button class="button" data-view="${backView}">${from === 'review' ? 'Back to reviews' : 'View path'}${icon('chevron', 14)}</button>` : `<button class="button" data-view="review">Open reviews${icon('chevron', 14)}</button>`}</nav>`;
  }

  function render(view) {
    context = null;
    if (view === 'review') reviewPage();
    else roadmapPage();
  }

  function open(id, from) {
    const problem = getProblems().find(item => item.id === Number(id));
    if (!problem) return;
    const previous = context;
    context = {id: problem.id, from: ['roadmap', 'review', 'daily'].includes(from) ? from : 'roadmap', focus};
    if (openProblem(problem.id) === false) context = previous;
  }

  function onClick(event) {
    const button = event.target.closest('[data-practice-open],[data-practice-focus],[data-practice-action]');
    if (!button) return false;
    if (button.dataset.practiceOpen) open(button.dataset.practiceOpen, button.dataset.practiceFrom);
    else if (button.dataset.practiceFocus && focuses.some(([value]) => value === button.dataset.practiceFocus)) {
      focus = button.dataset.practiceFocus;
      render('roadmap');
      document.querySelector(`[data-practice-focus="${focus}"]`)?.focus({preventScroll: true});
    } else if (button.dataset.practiceAction === 'next' && context) {
      const current = getProblems().find(problem => problem.id === context.id);
      const next = current && nextInContext(current);
      if (next) open(next.id, context.from);
      else navigate(context.from === 'review' ? 'review' : 'roadmap');
    }
    return true;
  }

  return {render, onClick, dailyCard, libraryCard, contextBanner, dueCount, recommended: list => recommendProblems(list, getProblems(), getProgress())};
}
