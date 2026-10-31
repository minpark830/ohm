import {companies,companyFor,companyEvidence,companySelection} from './company-data.js?v=22c97c590ebdf290';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeLink=value=>{try{const url=new URL(value);return url.protocol==='https:'?escape(url.href):'';}catch{return '';}};

export function companyPrepMarkup({problems=[],progress={},selected=''}={}){
 const company=companyFor(selected)||companies[0],evidence=companyEvidence[company.kind];
 const rows=companySelection(problems,company.id),solved=new Set(Array.isArray(progress?.solved)?progress.solved:[]),completed=rows.filter(({problem})=>solved.has(problem.id)).length;
 const next=rows.find(({problem})=>!solved.has(problem.id))||rows[0];
 return `<div class="page company-page">
  <div class="page-heading"><div><span class="eyebrow muted">COMPANY PREP</span><h1>Prepare with a direction.</h1><p>Focused engineering practice, with the evidence behind every set.</p></div><button class="button" data-company-all>Browse the full library</button></div>
  <div class="company-intro"><span class="company-intro-mark" aria-hidden="true">↗</span><p><strong>Original problems. Clear sources.</strong> These sets connect Ohm exercises to official preparation topics or published role requirements. They do not claim that a company asked these exact questions or predict how often a topic appears.</p></div>
  <nav class="company-picker" aria-label="Choose a company">${companies.map(item=>`<button type="button" data-company-select="${item.id}" aria-pressed="${item.id===company.id}"><span class="company-mark" aria-hidden="true">${escape(item.mark)}</span><span>${escape(item.name)}</span></button>`).join('')}</nav>
  <section class="company-hero" aria-labelledby="company-title"><div><span class="company-evidence">${escape(evidence.label)}</span><h2 id="company-title" tabindex="-1">${escape(company.name)}</h2><h3>${escape(company.role)}</h3><div class="company-topics">${company.topics.map(topic=>`<span>${escape(topic)}</span>`).join('')}</div><p>${escape(company.scope)}</p></div><div class="company-progress"><span class="eyebrow muted">YOUR PRACTICE</span><strong>${completed}<span> / ${rows.length}</span></strong><p>available problems solved</p><div class="company-progress-track" role="img" aria-label="${completed} of ${rows.length} available problems solved"><span style="width:${rows.length?completed/rows.length*100:0}%"></span></div>${next?`<button class="button primary" data-company-problem="${next.problem.id}">${completed===rows.length?'Revisit the set':completed?'Continue practice':'Start this set'} <span aria-hidden="true">→</span></button>`:''}<button class="button" data-company-browse="${company.id}" ${rows.length?'':'disabled'}>Open filtered library</button></div></section>
  <div class="company-content"><section class="company-problems rail-card" aria-labelledby="company-problems-title"><div class="company-section-heading"><div><span class="eyebrow muted">CURATED PRACTICE</span><h2 id="company-problems-title">Build the foundations.</h2></div><span>${rows.length} problems</span></div>${rows.length?`<ol>${rows.map(({problem,focus},index)=>`<li><span class="company-problem-state ${solved.has(problem.id)?'is-solved':''}" aria-label="${solved.has(problem.id)?'Solved':'To do'}">${solved.has(problem.id)?'✓':String(index+1).padStart(2,'0')}</span><div><button data-company-problem="${problem.id}">${escape(problem.title)}</button><p>${escape(focus)}</p><span class="company-problem-topic">${escape(problem.category)} · ${Number.isFinite(problem.minutes)?escape(problem.minutes)+' min':'Practice'}</span></div><span class="difficulty ${['Easy','Medium','Hard'].includes(problem.difficulty)?problem.difficulty:''}">${escape(problem.difficulty)}</span></li>`).join('')}</ol>`:'<p class="company-note">The matching questions are currently unavailable. The full library still has other topics to explore.</p>'}${rows.length<company.problems.length?'<p class="company-note">This set shows published questions whose title and version still match the curation. Revised or unpublished questions are omitted.</p>':''}</section>
  <aside class="company-source rail-card" aria-labelledby="company-source-title"><span class="eyebrow muted">WHY THIS SET</span><h2 id="company-source-title">Follow the evidence.</h2><span class="company-evidence">${escape(evidence.label)}</span><p>${escape(evidence.detail)}</p><p>${escape(company.source.summary)}</p><a class="company-source-link" href="${safeLink(company.source.url)}" target="_blank" rel="noopener noreferrer">${escape(company.source.title)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><span class="company-checked">Source checked <time datetime="${escape(company.source.checkedOn)}">${escape(company.source.checkedOn)}</time></span><div class="company-source-rule"></div><h3>Make it interview practice.</h3><p>State your assumptions, work through the model, and explain a limiting case before checking your answer.</p><button class="button" data-view="interview">Rehearse a timed interview</button><button class="button link" data-view="roles">Explore role-based tracks →</button></aside></div>
  <p class="company-note">Company names identify preparation context. Ohm is independent and is not endorsed by these employers. Set completion records practice; it does not certify job readiness. Sources and role requirements can change.</p>
 </div>`;
}

export function createCompanyPrep({shell,getProblems,getProgress,getSelected,selectCompany,browseCompany,browseLibrary,openCompanyProblem,isActive}){
 return {
  render(){shell(companyPrepMarkup({problems:getProblems(),progress:getProgress(),selected:getSelected()}));},
  onClick(event){
   const button=event.target.closest('[data-company-select],[data-company-browse],[data-company-problem],[data-company-all]');
   if(!button||!isActive())return false;if(button.disabled)return true;
   if(button.dataset.companyAll!==undefined)browseLibrary();
   else if(button.dataset.companySelect!==undefined){if(companyFor(button.dataset.companySelect))selectCompany(button.dataset.companySelect);}
   else if(button.dataset.companyBrowse!==undefined){if(companyFor(button.dataset.companyBrowse))browseCompany(button.dataset.companyBrowse);}
   else {const id=Number(button.dataset.companyProblem),company=companyFor(getSelected())||companies[0];if(companySelection(getProblems(),company.id).some(({problem})=>problem.id===id))openCompanyProblem(id,company.id);}
   return true;
  }
 };
}
