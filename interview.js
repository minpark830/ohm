import {
  interviewTopics, selectInterviewProblems, createInterviewSession,
  remainingMs, recordInterviewAnswer, finishInterview, sessionScore
} from './interview-model.js';

const presets = {
  mixed: {label: 'Mixed interview', note: 'A little of everything', topics: [...interviewTopics]},
  analog: {label: 'Analog & circuits', note: 'Foundations and devices', topics: interviewTopics.slice(0, 4)},
  digital: {label: 'Digital & HDL', note: 'Logic and implementation', topics: interviewTopics.slice(4)}
};
const timeLabel = milliseconds => {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

export function createInterview({
  shell, esc, icon, getProblems, getProgress, gradeAnswer, openProblem, navigate,
  diagramForProblem, isActive, toast, now = () => Date.now(),
  schedule = (callback, milliseconds) => setInterval(callback, milliseconds), cancel = id => clearInterval(id)
}) {
  let config = {topics: [...interviewTopics], difficulty: 'All levels', count: 5, minutes: 20, preferUnsolved: true};
  let session = null;
  let questionIndex = 0;
  let drafts = {};
  let notes = {};
  let errors = {};
  let pending = null;
  let interval = null;
  let confirmingFinish = false;
  let finishNotice = '';

  const hasActive = () => Boolean(session && session.endedAt === null);
  const hasPending = () => Boolean(pending);
  const currentProblem = () => session?.problems[questionIndex];
  const badge = problem => `<span class="difficulty ${['Easy', 'Medium', 'Hard'].includes(problem.difficulty) ? problem.difficulty : ''}"><i class="difficulty-dot"></i>${esc(problem.difficulty)}</span>`;
  const refresh = () => { if (isActive()) render(); };
  const matchingProblems = () => getProblems().filter(problem =>
    problem.published !== false && problem.published !== 0 && config.topics.includes(problem.category) &&
    (config.difficulty === 'All levels' || problem.difficulty === config.difficulty));

  function stopTimer() {
    if (interval !== null) cancel(interval);
    interval = null;
  }

  function discard() {
    stopTimer();
    session = null;
    pending = null;
    questionIndex = 0;
    drafts = {};
    notes = {};
    errors = {};
    confirmingFinish = false;
    finishNotice = '';
  }

  function finish(reason = 'finished') {
    if (!hasActive()) return;
    session = finishInterview(session, reason, now());
    confirmingFinish = false;
    stopTimer();
    if (isActive()) render();
    else toast(reason === 'timeout' ? 'Your interview time is up. Open Mock interview to see your results.' : 'Your interview is finished.');
  }

  function tick() {
    if (!hasActive()) { stopTimer(); return; }
    const remaining = remainingMs(session, now());
    if (remaining === 0) { finish('timeout'); return; }
    if (!isActive()) return;
    const clock = document.querySelector('[data-interview-clock]');
    if (clock) {
      clock.textContent = timeLabel(remaining);
      clock.closest('.interview-timer')?.classList.toggle('is-low', remaining <= 60000);
    }
  }

  function presetName() {
    return Object.keys(presets).find(key => presets[key].topics.length === config.topics.length &&
      presets[key].topics.every(topic => config.topics.includes(topic))) || null;
  }

  function setupPage() {
    const pool = matchingProblems();
    const solved = new Set(getProgress().solved || []);
    const fresh = pool.filter(problem => !solved.has(problem.id)).length;
    const count = Math.min(config.count, pool.length);
    const selectedPreset = presetName();
    shell(`<div class="page interview-page">
      <div class="page-heading interview-heading"><div><span class="eyebrow">PRACTICE UNDER PRESSURE</span><h1>Think clearly. Beat the clock.</h1><p>A focused mock interview, built around the topics you want to practice.</p></div><span class="interview-heading-mark" aria-hidden="true">${icon('clock', 26)}</span></div>
      <div class="interview-setup-layout"><section class="interview-card interview-setup" aria-labelledby="interview-setup-title">
        <div class="interview-section-heading"><span class="interview-step">01</span><div><h2 id="interview-setup-title">Build your interview</h2><p>Choose a focus, then make it yours.</p></div></div>
        <div class="interview-presets" role="group" aria-label="Interview focus">${Object.entries(presets).map(([key, preset]) => `<button type="button" data-interview-preset="${key}" aria-pressed="${selectedPreset === key}"><strong>${preset.label}</strong><span>${preset.note}</span></button>`).join('')}</div>
        <fieldset class="interview-fieldset"><legend>Topics to include</legend><div class="interview-topics">${interviewTopics.map((topic, index) => `<label><input type="checkbox" data-interview-topic="${index}" ${config.topics.includes(topic) ? 'checked' : ''}><span>${esc(topic)}</span></label>`).join('')}</div></fieldset>
        <div class="interview-config-grid"><label>Difficulty<select class="select" data-interview-config="difficulty">${['All levels', 'Easy', 'Medium', 'Hard'].map(level => `<option ${config.difficulty === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label><label>Questions<select class="select" data-interview-config="count">${[3, 5, 8].map(count => `<option value="${count}" ${config.count === count ? 'selected' : ''}>${count} questions</option>`).join('')}</select></label><label>Time limit<select class="select" data-interview-config="minutes">${[10, 20, 30].map(minutes => `<option value="${minutes}" ${config.minutes === minutes ? 'selected' : ''}>${minutes} minutes</option>`).join('')}</select></label></div>
        <label class="interview-prefer"><input type="checkbox" data-interview-config="preferUnsolved" ${config.preferUnsolved ? 'checked' : ''}><span><strong>Prioritize unsolved problems</strong><small>Use solved problems when more questions are needed.</small></span></label>
        <div class="interview-pool" role="status"><span>${icon('grid', 16)}<strong>${pool.length}</strong> matching ${pool.length === 1 ? 'problem' : 'problems'} <span class="muted">· ${fresh} unsolved</span></span>${!pool.length ? '<p>Choose a topic or a different difficulty to get started.</p>' : pool.length < config.count ? `<p>Your filters match ${pool.length} ${pool.length === 1 ? 'question' : 'questions'}. This interview will use all of them.</p>` : ''}</div>
        <button class="button primary interview-start" data-interview-action="start" ${count ? '' : 'disabled'}>${icon('play', 16)}Start ${count || config.count}-question interview<span>${config.minutes} min</span></button>
      </section><aside class="interview-setup-aside"><section class="interview-rules"><span class="eyebrow">YOUR INTERVIEW, AT A GLANCE</span><h2>Room to reason.<br>A little time pressure.</h2><ol><li><span>1</span><div><strong>One final answer per question</strong><p>Move between questions and keep drafts before you submit.</p></div></li><li><span>2</span><div><strong>Feedback at the finish</strong><p>No hints or solutions in the interview. Review your answers together at the end.</p></div></li><li><span>3</span><div><strong>Keep the practice that counts</strong><p>Submitted answers save through your usual progress settings.</p></div></li></ol><div class="interview-tab-note">${icon('bulb', 17)}<p>The timer keeps running if you browse elsewhere in Ohm. Refreshing or closing this tab ends the session; drafts and the scorecard stay only in this tab.</p></div></section><p class="interview-measure-note">A practice score is a snapshot of these questions, not a measure of job readiness.</p></aside></div>
    </div>`);
  }

  function answerFields(problem, locked) {
    const value = drafts[problem.id] || '';
    const disabled = locked ? 'disabled' : '';
    if (problem.type === 'choice') return `<fieldset class="interview-answer-options" ${disabled}><legend class="answer-label">Choose your answer</legend>${(problem.options || []).map((option, index) => `<label class="choice"><input type="radio" name="interview-answer" value="${index}" data-interview-answer="${problem.id}" ${value === String(index) ? 'checked' : ''}><span>${esc(option)}</span></label>`).join('')}</fieldset>`;
    if (problem.type === 'hdl') return `<label class="answer-label" for="interview-answer">Verilog · continuous assignment</label><textarea id="interview-answer" data-interview-answer="${problem.id}" class="code-editor" maxlength="2500" spellcheck="false" autocomplete="off" placeholder="assign y = …;" ${disabled}>${esc(value)}</textarea><p class="code-description">One-bit, 0/1 truth-table checker. Supports ~ ! &amp; ^ | &amp;&amp; || == != and ?: . No module declarations, timing, or X/Z simulation.</p>`;
    return `<label class="answer-label" for="interview-answer">Your answer</label><div class="answer-input"><input id="interview-answer" data-interview-answer="${problem.id}" type="text" inputmode="decimal" autocomplete="off" maxlength="2500" placeholder="Enter a value" value="${esc(value)}" ${disabled}><span>${esc(problem.unit || '')}</span></div><p class="hint-text">Use ${esc(problem.unit || 'the requested units')}.${Number.isFinite(problem.tolerance) ? ` Accepted tolerance: ±${esc(problem.tolerance)} ${esc(problem.unit || '')}.` : ''}</p>`;
  }

  function activePage() {
    const problem = currentProblem();
    const submitted = Object.hasOwn(session.answers, problem.id);
    const checking = pending?.problemId === problem.id;
    const submittedCount = Object.keys(session.answers).length;
    const diagram = diagramForProblem(problem);
    const next = (questionIndex + 1) % session.problems.length;
    shell(`<div class="page interview-page interview-active-page">
      <div class="interview-session-header"><div><span class="eyebrow">MOCK INTERVIEW</span><h1>Stay with the problem.</h1><p>${submittedCount} of ${session.problems.length} answers submitted · Results at the finish</p></div><div class="interview-timer ${remainingMs(session, now()) <= 60000 ? 'is-low' : ''}">${icon('clock', 18)}<div><span>TIME REMAINING</span><strong role="timer" aria-live="off" aria-label="Time remaining" data-interview-clock>${timeLabel(remainingMs(session, now()))}</strong></div></div></div>
      <div class="interview-question-toolbar"><nav class="interview-question-nav" aria-label="Interview questions">${session.problems.map((item, index) => `<button type="button" data-interview-question="${index}" class="${index === questionIndex ? 'is-current' : ''} ${Object.hasOwn(session.answers, item.id) ? 'is-submitted' : ''}" ${index === questionIndex ? 'aria-current="step"' : ''} aria-label="Question ${index + 1}${Object.hasOwn(session.answers, item.id) ? ', submitted' : pending?.problemId === item.id ? ', checking' : drafts[item.id] ? ', draft saved' : ', unanswered'}">${Object.hasOwn(session.answers, item.id) ? icon('check', 14) : index + 1}</button>`).join('')}</nav><button class="button" data-interview-action="finish">Finish interview</button></div>
      ${confirmingFinish ? `<section class="interview-finish-confirm" role="region" aria-label="Confirm finish"><div><strong>Finish and see your results?</strong><p>${session.problems.length - submittedCount} ${session.problems.length - submittedCount === 1 ? 'question has' : 'questions have'} no final answer yet.${pending ? ' Your current submission will still be counted when it finishes checking.' : ''} Drafts will not be submitted.</p></div><div><button class="button" data-interview-action="keep-going">Keep going</button><button class="button primary" data-interview-action="confirm-finish">Finish now</button></div></section>` : ''}
      <div class="interview-workspace"><section class="interview-card interview-question" aria-labelledby="interview-question-title"><span class="eyebrow">QUESTION ${questionIndex + 1} OF ${session.problems.length} · ${esc(problem.category)}</span><h2 id="interview-question-title" tabindex="-1">${esc(problem.title)}</h2><div class="problem-meta">${badge(problem)}${submitted ? '<span class="interview-submitted">Answer submitted</span>' : ''}</div><p class="interview-prompt">${esc(problem.prompt)}</p>${diagram ? `<figure class="problem-diagram">${diagram.svg}<figcaption>${esc(diagram.caption)}</figcaption><button class="diagram-expand" data-diagram-view>Enlarge diagram</button></figure>` : ''}${Array.isArray(problem.given) && problem.given.length ? `<div class="given-grid">${problem.given.map(given => `<div class="given"><small>${esc(given.label)}</small><strong>${esc(given.value)}</strong></div>`).join('')}</div>` : ''}<div class="task-box">${esc(problem.task)}</div></section>
      <section class="interview-work"><form id="interview-answer-form" class="interview-card interview-answer"><div class="interview-work-heading"><h2>Your final answer</h2><span>One submission</span></div>${answerFields(problem, submitted || Boolean(pending))}${submitted ? `<p class="interview-answer-state" role="status">${icon('check', 16)}Answer recorded. You’ll see the result when the interview ends.</p>` : `<button type="submit" class="button primary" ${pending ? 'disabled' : ''}>${checking ? 'Checking submission…' : pending ? 'Another answer is checking…' : 'Submit final answer'}${pending ? '' : icon('check', 15)}</button>`}${errors[problem.id] ? `<p class="interview-error" role="alert">${esc(errors[problem.id])}</p>` : ''}<p class="interview-private-note">${submitted ? 'This answer is locked for this interview.' : 'Submitting locks this answer. You can skip and return before time runs out.'}</p></form><section class="interview-card interview-notes"><label for="interview-notes">Scratchpad <span>Only in this tab</span></label><textarea id="interview-notes" data-interview-note="${problem.id}" maxlength="10000" placeholder="Start with what you know. Write equations and work through your reasoning…">${esc(notes[problem.id] || '')}</textarea></section><div class="interview-question-controls"><button class="button" data-interview-question="${questionIndex - 1}" ${questionIndex === 0 ? 'disabled' : ''}>${icon('left', 15)}Previous</button><button class="button" data-interview-question="${next}">${submitted ? 'Next question' : 'Skip for now'}${icon('chevron', 15)}</button></div></section></div>
      <p class="interview-active-note">Refreshing ends this session. Your submitted answers save normally; unsubmitted drafts stay in this tab.</p>
    </div>`);
  }

  function scorePage() {
    const score = sessionScore(session, now());
    shell(`<div class="page interview-page"><div class="page-heading interview-heading"><div><span class="eyebrow">INTERVIEW COMPLETE</span><h1>${session.reason === 'timeout' ? 'Time’s up. Let’s look back.' : 'A little pressure. A lot to learn.'}</h1><p>Review the reasoning, find a pattern, and carry it into your next session.</p></div>${!pending ? '<button class="button" data-interview-action="new">Set up another interview</button>' : ''}</div>
      ${pending ? `<p class="interview-pending-result" role="status">${icon('clock', 17)}Your last answer is still checking. This score will update when its result arrives.</p>` : ''}${finishNotice ? `<p class="interview-error" role="alert">${esc(finishNotice)}</p>` : ''}
      <section class="interview-score-hero" aria-label="Interview score"><div><span class="eyebrow">${pending ? 'RESULTS SO FAR' : 'YOUR RESULTS'}</span><h2>${score.accepted}<span> / ${score.total}</span></h2><p>answers accepted${pending ? ' · one submission pending' : ''}</p></div><div class="interview-score-stats"><div><strong>${score.submitted}</strong><span>submitted</span></div><div><strong>${score.unanswered}</strong><span>${pending ? 'without a result' : 'unanswered'}</span></div><div><strong>${timeLabel(score.elapsedMs)}</strong><span>time used</span></div></div></section>
      <div class="interview-results-layout"><section class="interview-card interview-results"><div class="interview-work-heading"><h2>Question by question</h2><span>First submitted answer</span></div><ol>${session.problems.map((problem, index) => {
        const answer = session.answers[problem.id];
        const checking = pending?.problemId === problem.id;
        const state = checking ? 'Checking' : answer ? (answer.pass ? 'Accepted' : 'Not accepted') : 'Unanswered';
        const color = checking ? 'pending' : answer ? (answer.pass ? 'accepted' : 'retry') : 'unanswered';
        return `<li><span class="interview-result-number">${String(index + 1).padStart(2, '0')}</span><div><strong>${esc(problem.title)}</strong><p><span class="interview-result-state is-${color}">${state}</span><span>·</span>${esc(problem.category)}</p></div><button class="button" data-interview-review="${problem.id}" ${checking ? 'disabled' : ''}>Review${icon('chevron', 14)}</button></li>`;
      }).join('')}</ol></section><aside class="interview-card interview-topic-results"><h2>By topic</h2>${Object.entries(score.byTopic).map(([topic, counts]) => `<div class="interview-topic-result"><div><span>${esc(topic)}</span><strong>${counts.accepted} / ${counts.total}</strong></div><div class="interview-topic-track" role="meter" aria-label="${esc(topic)} accepted answers" aria-valuemin="0" aria-valuemax="${counts.total}" aria-valuenow="${counts.accepted}"><span style="width:${counts.percent}%"></span></div></div>`).join('')}<p>Accepted answers show what checked out in this session. Open a question to compare the reasoning and practice again.</p><button class="button" data-view="review">Open review queue${icon('chevron', 14)}</button></aside></div><p class="interview-measure-note">This scorecard stays in this tab. Submitted answers contribute to your normal practice progress. Scores are practice feedback, not a measure of job readiness.</p></div>`);
  }

  function render() {
    if (hasActive() && remainingMs(session, now()) === 0) {
      session = finishInterview(session, 'timeout', now());
      stopTimer();
    }
    if (!session) setupPage();
    else if (hasActive()) activePage();
    else scorePage();
  }

  function start() {
    if (hasActive() || pending) return;
    const selected = selectInterviewProblems(getProblems(), getProgress(), config);
    if (!selected.length) { toast('Choose a topic and difficulty with available problems.'); return; }
    discard();
    session = createInterviewSession(selected, config, now());
    interval = schedule(tick, 1000);
    render();
    document.querySelector('#interview-question-title')?.focus({preventScroll: true});
  }

  async function submitAnswer() {
    if (!hasActive() || pending) return;
    if (remainingMs(session, now()) === 0) { finish('timeout'); return; }
    const problem = currentProblem();
    if (Object.hasOwn(session.answers, problem.id)) return;
    const draft = drafts[problem.id] || '';
    if (!draft.trim()) {
      errors[problem.id] = problem.type === 'choice' ? 'Choose an answer before submitting.' : 'Enter an answer before submitting.';
      refresh();
      document.querySelector('[data-interview-answer]')?.focus();
      return;
    }
    const answer = problem.type === 'choice' ? problem.options?.[Number(draft)] : draft;
    if (typeof answer !== 'string') { errors[problem.id] = 'Choose one of the available answers.'; refresh(); return; }
    const startedAt = now();
    if (startedAt >= session.deadline) { finish('timeout'); return; }
    const request = {sessionId: session.id, problemId: problem.id, startedAt};
    pending = request;
    delete errors[problem.id];
    refresh();
    try {
      const checked = await gradeAnswer(problem, answer);
      if (session?.id !== request.sessionId) return;
      if (!checked || typeof checked.pass !== 'boolean') throw new Error('The answer checker returned an incomplete result. Please try again.');
      const receivedAt = now();
      session = recordInterviewAnswer(session, {problemId: problem.id, pass: checked.pass, startedAt: request.startedAt, receivedAt}, receivedAt);
    } catch (error) {
      if (session?.id !== request.sessionId) return;
      const message = error instanceof Error ? error.message : 'The answer could not be checked. Please try again.';
      if (hasActive() && remainingMs(session, now()) > 0) errors[problem.id] = message;
      else finishNotice = `The last submission could not be confirmed for this scorecard. ${message} If an account save is pending, retry it on the Account page. A later sync may update your practice progress without changing this scorecard.`;
    } finally {
      if (pending === request) pending = null;
      if (session?.id === request.sessionId) {
        if (hasActive() && remainingMs(session, now()) === 0) finish('timeout');
        else refresh();
      }
    }
  }

  function onInput(event) {
    const field = event.target;
    if (field.matches('[data-interview-answer]')) {
      if (!hasActive() || pending || Number(field.dataset.interviewAnswer) !== currentProblem()?.id || Object.hasOwn(session.answers, currentProblem().id)) return true;
      if (field.type !== 'radio' || field.checked) drafts[currentProblem().id] = field.value.slice(0, 2500);
      delete errors[currentProblem().id];
      return true;
    }
    if (field.matches('[data-interview-note]')) {
      if (hasActive() && Number(field.dataset.interviewNote) === currentProblem()?.id) notes[currentProblem().id] = field.value.slice(0, 10000);
      return true;
    }
    return false;
  }

  function onChange(event) {
    if (onInput(event)) return true;
    const field = event.target;
    if (!field.matches('[data-interview-config],[data-interview-topic]')) return false;
    if (session) return true;
    const key = field.dataset.interviewConfig;
    if (field.dataset.interviewTopic !== undefined) {
      const topic = interviewTopics[Number(field.dataset.interviewTopic)];
      if (topic) config.topics = field.checked ? [...new Set([...config.topics, topic])] : config.topics.filter(item => item !== topic);
    } else if (key === 'preferUnsolved') config.preferUnsolved = field.checked;
    else if (key === 'difficulty' && ['All levels', 'Easy', 'Medium', 'Hard'].includes(field.value)) config.difficulty = field.value;
    else if (key === 'count' && [3, 5, 8].includes(Number(field.value))) config.count = Number(field.value);
    else if (key === 'minutes' && [10, 20, 30].includes(Number(field.value))) config.minutes = Number(field.value);
    const focusSelector = field.dataset.interviewTopic !== undefined ? `[data-interview-topic="${Number(field.dataset.interviewTopic)}"]` : `[data-interview-config="${key}"]`;
    render();
    document.querySelector(focusSelector)?.focus({preventScroll: true});
    return true;
  }

  function onClick(event) {
    const button = event.target.closest('[data-interview-action],[data-interview-preset],[data-interview-question],[data-interview-review]');
    if (!button) return false;
    if (button.disabled) return true;
    if (button.dataset.interviewPreset && !session) {
      const preset = presets[button.dataset.interviewPreset];
      if (preset) { config.topics = [...preset.topics]; render(); document.querySelector(`[data-interview-preset="${button.dataset.interviewPreset}"]`)?.focus({preventScroll: true}); }
    } else if (button.dataset.interviewQuestion !== undefined && hasActive()) {
      const index = Number(button.dataset.interviewQuestion);
      if (Number.isInteger(index) && index >= 0 && index < session.problems.length) { questionIndex = index; confirmingFinish = false; render(); document.querySelector('#interview-question-title')?.focus({preventScroll: true}); }
    } else if (button.dataset.interviewReview && session?.endedAt !== null) {
      const id = Number(button.dataset.interviewReview);
      if (session?.problems.some(problem => problem.id === id) && pending?.problemId !== id) openProblem(id);
    } else if (button.dataset.interviewAction === 'start') start();
    else if (button.dataset.interviewAction === 'finish' && hasActive()) { confirmingFinish = true; render(); document.querySelector('[data-interview-action="keep-going"]')?.focus({preventScroll: true}); }
    else if (button.dataset.interviewAction === 'keep-going') { confirmingFinish = false; render(); }
    else if (button.dataset.interviewAction === 'confirm-finish') finish();
    else if (button.dataset.interviewAction === 'new' && !hasActive() && !pending) { discard(); render(); }
    return true;
  }

  function onSubmit(event) {
    if (event.target.id !== 'interview-answer-form') return false;
    event.preventDefault();
    void submitAnswer();
    return true;
  }

  function startFocused(category) {
    if (hasActive() || pending) {
      toast('Your interview is still in progress. Finish it before starting another.');
      navigate('interview');
      return;
    }
    discard();
    config.topics = interviewTopics.includes(category) ? [category] : [...interviewTopics];
    navigate('interview');
  }

  function summaryCard() {
    return `<section class="interview-summary-card"><span class="interview-summary-icon" aria-hidden="true">${icon('clock', 22)}</span><div><span class="eyebrow">MOCK INTERVIEW</span><h2>${hasActive() ? 'Your timer is still running.' : session ? 'Make room for a little pressure.' : 'Ready to put it together?'}</h2><p>${hasActive() ? 'Return to your questions. Your drafts are right where you left them.' : 'Choose your topics, set a timer, and see where your reasoning takes you.'}</p></div><button class="button" data-view="interview">${hasActive() ? 'Resume interview' : session ? 'View your results' : 'Build an interview'}${icon('chevron', 15)}</button></section>`;
  }

  return {render, onClick, onInput, onChange, onSubmit, startFocused, hasActive, hasPending, discard, summaryCard};
}
