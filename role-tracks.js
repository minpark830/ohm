import {roleTracks, resolveRoleTrack} from './role-track-data.js?v=0f174c989631b5f2';

export function createRoleTracks({shell, esc, icon, getProblems, getProgress, openProblem, navigate, prepareInterview}) {
  let trackId = 'analog';
  const current = () => resolveRoleTrack(trackId, getProblems(), getProgress());
  function render() {
    const track = current(), solved = new Set(getProgress().solved || []);
    shell(`<div class="page role-tracks-page">
      <div class="page-heading"><div><span class="eyebrow muted">PRACTICE WITH A PURPOSE</span><h1>Find your engineering focus.</h1><p>Five guided paths through the library, with milestones you can explain out loud.</p></div></div>
      <nav class="role-track-picker" aria-label="Engineering role">${roleTracks.map(role => {
        const status = resolveRoleTrack(role.id, getProblems(), getProgress());
        return `<button data-role-track="${role.id}" aria-current="${trackId === role.id ? 'page' : 'false'}"><span class="role-track-icon" aria-hidden="true">${icon(role.icon, 19)}</span><strong>${esc(role.short)}</strong><span>${status.completed} / ${status.total} solved</span></button>`;
      }).join('')}</nav>
      <section class="role-track-hero" aria-labelledby="role-track-title"><div><span class="eyebrow">YOUR FOCUS</span><h2 id="role-track-title" tabindex="-1">${esc(track.title)}</h2><p>${esc(track.description)}</p><div class="role-track-coverage">${track.coverage.map(label => `<span>${esc(label)}</span>`).join('')}</div><p class="role-track-prerequisite"><strong>Before you start</strong> ${esc(track.prerequisite)}</p></div><div class="role-track-actions"><div class="role-track-count"><strong>${track.completed}<span> / ${track.total}</span></strong><span>available problems solved</span></div><div class="role-track-progress" role="meter" aria-label="${esc(track.title)} solved problems" aria-valuemin="0" aria-valuemax="${track.total || 1}" aria-valuenow="${track.completed}"><span style="width:${track.total ? track.completed / track.total * 100 : 0}%"></span></div>${track.next ? `<button class="button primary" data-role-next>Continue practice ${icon('chevron', 15)}</button>` : `<p class="role-track-done">${track.total ? 'You’ve solved the available set. Revisit a question or try a timed session.' : 'No questions in this track are currently published.'}</p>`}<button class="button" data-role-interview ${track.total ? '' : 'disabled'}>${icon('clock', 16)}Build a focused interview</button><small>You choose the time and question count before starting.</small></div></section>
      ${track.missing ? `<p class="role-track-availability" role="status">${track.missing} curated ${track.missing === 1 ? 'problem is' : 'problems are'} currently unavailable. Progress and interviews use the ${track.total} available ${track.total === 1 ? 'problem' : 'problems'}.</p>` : ''}
      <div class="role-track-stages">${track.stages.map((stage, index) => `<section class="role-stage"><div class="role-stage-heading"><span class="role-stage-number">${stage.total && stage.completed === stage.total ? icon('check', 16) : `0${index + 1}`}</span><div><span class="eyebrow muted">STAGE ${index + 1}</span><h3>${esc(stage.title)}</h3></div><span class="role-stage-count">${stage.completed} / ${stage.total}</span></div><p class="role-stage-milestone"><strong>Aim to explain</strong>${esc(stage.milestone)}</p><ol class="role-stage-problems">${stage.problems.map(problem => `<li><span class="role-problem-state ${solved.has(problem.id) ? 'is-solved' : ''}" aria-label="${solved.has(problem.id) ? 'Solved' : 'Unsolved'}">${solved.has(problem.id) ? icon('check', 12) : ''}</span><button data-role-problem="${problem.id}">${esc(problem.title)}</button><span class="role-problem-meta">${esc(problem.difficulty)} · ${esc(problem.minutes)} min</span></li>`).join('')}</ol>${stage.total ? '' : '<p class="muted small">These questions are currently unavailable.</p>'}</section>`).join('')}</div>
      <section class="role-track-resources"><div><h2>Make the connection.</h2><p>Review a concept, then put the reasoning into practice.</p></div><div><button class="button" data-lesson="${track.lesson}">${icon('book', 16)}${esc(track.lessonLabel)}</button><button class="button" data-view="${track.extraView}">${esc(track.extraLabel)}${icon('chevron', 15)}</button></div></section>
      <p class="role-track-note">These focused practice paths overlap where skills overlap. Solving a problem counts in every path that includes it. Milestones guide your reasoning; solve counts do not certify job readiness.${track.id === 'pcb' ? ' This path covers electrical bring-up, not PCB layout, fabrication, or safety certification.' : ''}</p>
    </div>`);
  }
  function onClick(event) {
    const button = event.target.closest('[data-role-track],[data-role-next],[data-role-problem],[data-role-interview]');
    if (!button) return false;
    if (button.disabled) return true;
    if (button.dataset.roleTrack !== undefined) {
      if (roleTracks.some(track => track.id === button.dataset.roleTrack)) {
        trackId = button.dataset.roleTrack;
        navigate('roles');
        document.querySelector('#role-track-title')?.focus({preventScroll: true});
      }
    } else if (button.hasAttribute('data-role-next')) {
      const next = current().next;
      if (next) openProblem(next.id);
    } else if (button.dataset.roleProblem !== undefined) {
      const problem = current().problems.find(p => p.id === Number(button.dataset.roleProblem));
      if (problem) openProblem(problem.id);
    } else if (button.hasAttribute('data-role-interview') && current().total) prepareInterview(trackId);
    return true;
  }
  return {render, onClick};
}
