import {skillPickerMarkup} from './skill-picker.js?v=a8dd77a14a7d6aad';
import {libraryTopics,defaultLibraryFilters,normalizeLibraryFilters,filterProblems,canonicalProblemTags,problemFormat,attemptedProblemIds} from './library-context.js?v=a8dd77a14a7d6aad';

import {companies,companyFor,companyEvidence} from './company-data.js?v=a8dd77a14a7d6aad';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compareText=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
const formats=[['all','All formats'],['numeric','Numeric'],['parts','Multiple parts'],['choice','Multiple choice'],['hdl','HDL expression']];
const statuses=[['all','All problems'],['unsolved','To do'],['attempted','Attempted'],['solved','Solved']];
const sorts=[['recommended','Recommended'],['difficulty','Difficulty'],['quick','Quickest first'],['newest','Newest IDs first'],['title','Title A–Z']];
const option=(value,label,selected)=>`<option value="${esc(value)}"${value===selected?' selected':''}>${esc(label)}</option>`;
const catalog=problems=>filterProblems({problems,filters:defaultLibraryFilters()});

// Counts are derived from the same published selection as the problem rows.
// Exclude the facet itself so learners can see another useful choice.
export function librarySkillFacets({problems=[],progress={},filters,view='problems'}={}){
  const f=normalizeLibraryFilters(filters),counts=new Map();
  for(const p of filterProblems({problems,progress,filters:{...f,skill:''},view})){
    for(const tag of canonicalProblemTags(p))counts.set(tag,(counts.get(tag)||0)+1);
  }
  if(f.skill&&!counts.has(f.skill))counts.set(f.skill,0);
  return [...counts].sort(([a],[b])=>compareText.compare(a,b)).map(([tag,count])=>({tag,count}));
}

export function libraryActiveFilters(filters){
  const f=normalizeLibraryFilters(filters),chips=[];
  if(f.topic!=='All')chips.push({key:'topic',label:f.topic});
  if(f.level!=='All levels')chips.push({key:'level',label:f.level});
  if(f.company)chips.push({key:'company',label:companyFor(f.company).name+' prep'});
  if(f.skill)chips.push({key:'skill',label:f.skill});
  if(f.format!=='all')chips.push({key:'format',label:formats.find(([id])=>id===f.format)[1]});
  if(f.q)chips.push({key:'q',label:`Search: ${f.q}`});
  if(f.status!=='all')chips.push({key:'status',label:statuses.find(([id])=>id===f.status)[1]});
  if(f.sort!=='recommended')chips.push({key:'sort',label:sorts.find(([id])=>id===f.sort)[1]});
  return chips;
}

export function clearedLibraryFilter(filters,key){
  const f=normalizeLibraryFilters(filters),defaults=defaultLibraryFilters();
  if(Object.hasOwn(defaults,key)&&key!=='scroll')f[key]=defaults[key];
  return {...f,page:1,scroll:0};
}

export function libraryDiscoveryMarkup({problems=[],progress={},filters,view='problems',resultCount,advancedOpen=false}={}){
 const f=normalizeLibraryFilters(filters),skills=librarySkillFacets({problems,progress,filters:f,view});
 const count=filterProblems({problems,progress,filters:f,view}).length,company=companyFor(f.company),chips=libraryActiveFilters(f);
 const advancedCount=Number(Boolean(f.skill))+Number(Boolean(f.company))+Number(f.format!=='all');
 const companyCounts=new Map(companies.map(item=>[item.id,filterProblems({problems,progress,filters:{...f,company:item.id},view}).length]));
 return `<div class="library-discovery"><div class="ld-topics" role="group" aria-label="Engineering topic">${libraryTopics.map(topic=>{
  const n=filterProblems({problems,progress,filters:{...f,topic},view}).length;
  return `<button type="button" class="ld-topic${f.topic===topic?' selected':''}" data-category="${esc(topic)}" aria-pressed="${f.topic===topic}"><span>${esc(topic==='All'?'All topics':topic)}</span><span class="ld-count">${n}</span></button>`;
 }).join('')}</div><div class="ld-primary"><label class="ld-search" for="search"><span class="sr-only">Search problems</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="search" type="search" maxlength="160" placeholder="Search problems or concepts" aria-label="Search problems" value="${esc(f.q)}"><kbd aria-hidden="true">/</kbd></label><label class="ld-level" for="difficulty"><span class="sr-only">Difficulty</span><select class="select" id="difficulty" aria-label="Filter by difficulty">${['All levels','Easy','Medium','Hard'].map(level=>option(level,level==='All levels'?'All difficulties':level,f.level)).join('')}</select></label><details class="ld-more" data-library-more ${advancedOpen?'open':''}><summary id="library-more-toggle"><span aria-hidden="true">☷</span>More filters${advancedCount?`<span class="ld-filter-count">${advancedCount}<span class="sr-only"> active advanced filters</span></span>`:''}</summary><div class="ld-advanced" role="group" aria-label="Additional library filters"><div class="ld-advanced-heading"><strong>Refine your practice</strong><button class="button link" data-action="close-library-filters" type="button">Done</button></div>${skillPickerMarkup({facets:skills,selected:f.skill,problems})}<label class="ld-filter" for="company-filter"><span>Company prep</span><select class="select" id="company-filter" aria-label="Filter by company prep">${option('','All companies',f.company)}${companies.map(item=>option(item.id,`${item.name} (${companyCounts.get(item.id)})`,f.company)).join('')}</select></label><label class="ld-filter" for="answer-format"><span>Answer format</span><select class="select" id="answer-format" aria-label="Filter by answer format">${formats.map(([value,label])=>option(value,label,f.format)).join('')}</select></label></div></details></div>${company?`<div class="ld-company-note"><p><strong>${esc(company.name)} · ${esc(companyEvidence[company.kind].label)}</strong><br>Original practice matched to public topics; exact questions and interview frequency are not claimed.</p><button class="button link" data-company-profile="${company.id}">Sources & scope ↗</button></div>`:''}<div class="ld-selection"><div class="filter-tabs" role="tablist" aria-label="Problem status">${statuses.map(([id,label])=>`<button id="status-${id}" class="filter-tab ${f.status===id?'active':''}" data-status="${id}" role="tab" tabindex="${f.status===id?0:-1}" aria-controls="table-content" aria-selected="${f.status===id}">${label}</button>`).join('')}</div><label class="ld-sort" for="sort"><span class="sr-only">Sort problems</span><select class="select" id="sort" aria-label="Sort problems">${sorts.map(([value,label])=>option(value,label,f.sort)).join('')}</select></label><span class="ld-result-count" id="result-count" role="status" aria-live="polite">${Number.isSafeInteger(resultCount)&&resultCount>=0?resultCount:count} ${count===1?'problem':'problems'}</span></div>${chips.length?`<div class="ld-active" aria-label="Active library filters">${chips.map(chip=>`<button class="ld-chip" type="button" data-library-clear="${chip.key}" aria-label="Remove ${esc(chip.label)} filter">${esc(chip.label)}<span aria-hidden="true">×</span></button>`).join('')}<button class="button link tiny" type="button" data-action="clear">Clear all</button></div>`:''}<p class="ld-status-note"${f.status==='attempted'?'':' hidden'}>Attempted means a saved checked submission or imported attempt. Drafting alone does not count.</p></div>`;
}

function safeSummary(problem){
  return {id:problem.id,title:String(problem.title||''),category:String(problem.category||''),difficulty:String(problem.difficulty||''),minutes:Number.isFinite(problem.minutes)?problem.minutes:null,format:problemFormat(problem)};
}

export function relatedPractice({problems=[],current,progress={},limit=3}={}){
  const all=catalog(problems),source=all.find(p=>p.id===(typeof current==='object'?current?.id:current));
  if(!source)return [];
  const tags=new Set(canonicalProblemTags(source)),solved=new Set(Array.isArray(progress?.solved)?progress.solved:[]);
  const levels=['Easy','Medium','Hard'],rank=levels.indexOf(source.difficulty);
  const candidates=all.filter(p=>p.id!==source.id).map(problem=>({problem,shared:canonicalProblemTags(problem).filter(tag=>tags.has(tag))})).filter(({problem,shared})=>shared.length||problem.category===source.category);
  candidates.sort((a,b)=>Number(solved.has(a.problem.id))-Number(solved.has(b.problem.id))||b.shared.length-a.shared.length||Math.abs(levels.indexOf(a.problem.difficulty)-rank)-Math.abs(levels.indexOf(b.problem.difficulty)-rank)||a.problem.id-b.problem.id);
  const bounded=Number.isInteger(limit)?Math.max(0,Math.min(6,limit)):3;
  return candidates.slice(0,bounded).map(({problem,shared})=>({...safeSummary(problem),sharedTags:shared,reason:shared.length?`Practice ${shared.slice(0,2).join(' and ')} in another setting.`:`Build on ${source.category} with a different problem.`,solved:solved.has(problem.id)}));
}

// A transparent next action inside the current public filters. It uses real
// saved checks and avoids claims about mastery, acceptance rates or employers.
export function nextPracticeRecommendation({problems=[],progress={},filters,view='problems'}={}){
  const list=filterProblems({problems,progress,filters,view});if(!list.length)return null;
  const solved=new Set(Array.isArray(progress?.solved)?progress.solved:[]),attempted=attemptedProblemIds(progress);
  const latest=new Map();
  for(const attempt of Array.isArray(progress?.attempts)?progress.attempts:[]){
    if(!Number.isSafeInteger(attempt?.id)||typeof attempt.pass!=='boolean'||!Number.isFinite(Date.parse(attempt.at)))continue;
    const prior=latest.get(attempt.id);if(!prior||Date.parse(attempt.at)>=Date.parse(prior.at))latest.set(attempt.id,{pass:attempt.pass,at:attempt.at});
  }
  for(const [id,review] of Object.entries(progress?.reviews&&typeof progress.reviews==='object'?progress.reviews:{})){
    if(!/^[1-9]\d*$/.test(id)||typeof review?.lastPass!=='boolean'||!Number.isFinite(Date.parse(review.lastAt)))continue;
    const prior=latest.get(Number(id));if(!prior||Date.parse(review.lastAt)>=Date.parse(prior.at))latest.set(Number(id),{pass:review.lastPass,at:review.lastAt});
  }
  const retry=list.find(p=>latest.get(p.id)?.pass===false),fresh=list.find(p=>!solved.has(p.id)&&!attempted.has(p.id)),unsolved=list.find(p=>!solved.has(p.id));
  const problem=retry||fresh||unsolved||list[0],kind=retry?'retry':fresh?'new':unsolved?'continue':'revisit';
  const reason=kind==='retry'?'Your latest saved check needs another try.':kind==='new'?`A new ${problem.category} problem within these filters.`:kind==='continue'?'Continue a problem you have already checked.':'Revisit a solved problem within these filters.';
  return {...safeSummary(problem),kind,reason};
}
