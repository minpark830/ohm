// Solution data is loaded only after the user opens the Solution tab.
export function walkthroughSteps(problem){
 const curated=problem.walkthrough;
 if(curated?.steps?.length)return curated.steps;
 return (problem.explanation||[]).map((text,i)=>({title:`Reasoning step ${i+1}`,text,focus:[]}));
}
export function walkthroughMarkup(problem,esc,index=0){
 const steps=walkthroughSteps(problem);
 if(!steps.length)return '<p class="muted">A worked explanation is not available for this question yet.</p>';
 const current=Math.min(steps.length-1,Math.max(0,Number.isInteger(index)?index:0)),step=steps[current],focus=new Set(step.focus||[]);
 const diagram=problem.walkthrough?.svg?.replace(/data-walk-focus="([^"]+)"/g,(match,key)=>`${match} data-walk-active="${focus.has(key)}"`);
 return `<section class="walkthrough" data-walkthrough aria-label="Guided solution"><div class="walk-heading"><span class="eyebrow muted">FOLLOW THE REASONING</span><span class="tiny muted">${current+1} / ${steps.length}</span></div>${diagram?`<figure class="walk-diagram">${diagram}<figcaption>${esc(problem.walkthrough.caption)}</figcaption></figure>`:''}<div class="walk-step" aria-live="polite" aria-atomic="true"><span class="walk-count">STEP ${current+1}</span><h2 tabindex="-1" data-walk-heading>${esc(step.title)}</h2><p>${esc(step.text)}</p>${step.equation?`<div class="formula">${esc(step.equation)}</div>`:''}</div><nav class="walk-controls" aria-label="Solution steps"><button class="button" data-walk-step="${current-1}" ${current===0?'disabled':''}>Previous</button><div class="walk-dots" aria-label="Steps">${steps.map((s,i)=>`<button aria-label="Go to solution step ${i+1}" aria-current="${i===current?'step':'false'}" data-walk-step="${i}" ${i>current+1?'disabled':''}>${i+1}</button>`).join('')}</div><button class="button primary" data-walk-step="${current+1}" ${current===steps.length-1?'disabled':''}>Next step</button></nav>${current===steps.length-1?`<div class="walk-takeaway"><strong>You’ve reached the result.</strong><p>Close the solution and try explaining the method in your own words.</p>${problem.formula?`<div class="formula">${esc(problem.formula)}</div>`:''}${problem.type==='hdl'?`<pre class="formula">${esc(problem.referenceCode||'')}</pre>`:''}</div>`:''}<p class="tiny muted">Viewing this walkthrough records solution help. It does not mark the problem solved.</p></section>`;
}
export function createWalkthrough({esc,getProblem}){
 const positions=new Map();
 const key=p=>`${p.id}:${p.version}`;
 function markup(p){return walkthroughMarkup(p,esc,positions.get(key(p))||0);}
 function onClick(event){
  const button=event.target.closest('[data-walk-step]');if(!button)return false;
  const p=getProblem();if(!p||button.disabled)return true;
  const next=Number(button.dataset.walkStep),current=positions.get(key(p))||0;
  if(!Number.isInteger(next)||next<0||next>=walkthroughSteps(p).length||next>current+1)return true;
  positions.set(key(p),next);if(positions.size>150)positions.delete(positions.keys().next().value);
  const region=document.querySelector('[data-walkthrough]');if(region){region.outerHTML=markup(p);document.querySelector('[data-walk-heading]')?.focus({preventScroll:true});document.querySelector('[data-walkthrough]')?.scrollIntoView({block:'start'});}
  return true;
 }
 return {markup,onClick};
}
