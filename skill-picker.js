import {canonicalSkill,cleanSkillLabel,skillConceptFor,skillSearchTerms,skillSearchText,skillGroups} from './skill-taxonomy.js?v=22c97c590ebdf290';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compare=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
const batchSize=18;

export function skillOptions({facets=[],selected='',problems=[]}={}){
 const options=new Map(),topics=new Map();
 for(const p of Array.isArray(problems)?problems:[]){
  if(!p||p.published===false||p.published===0||!skillGroups.includes(p.category)||p.category==='All topics')continue;
  for(const tag of new Set((Array.isArray(p.tags)?p.tags:[]).map(canonicalSkill).filter(Boolean))){const counts=topics.get(tag)||new Map();counts.set(p.category,(counts.get(p.category)||0)+1);topics.set(tag,counts);}
 }
 for(const facet of Array.isArray(facets)?facets:[]){
  const tag=canonicalSkill(facet?.tag);if(!tag||!Number.isSafeInteger(facet?.count)||facet.count<0)continue;
  // Upstream facets already count canonical tags per problem. A duplicated
  // defensive input must not inflate those counts.
  options.set(tag,{tag,count:Math.max(options.get(tag)?.count||0,facet.count)});
 }
 const current=canonicalSkill(selected);if(current&&!options.has(current))options.set(current,{tag:current,count:0});
 return [...options.values()].map(option=>{
  const concept=skillConceptFor(option.tag),members=[...(topics.get(option.tag)||[])].sort((a,b)=>b[1]-a[1]||skillGroups.indexOf(a[0])-skillGroups.indexOf(b[0])).map(([topic])=>topic);
  if(!members.length&&concept)members.push(concept.topic);
  if(!members.length)members.push('Other skills');
  return {...option,topics:members,group:concept&&members.includes(concept.topic)?concept.topic:members[0],conceptId:concept?.id||null};
 });
}

export function skillResults({facets=[],selected='',problems=[],query='',group='All topics',limit=batchSize}={}){
 const current=canonicalSkill(selected),text=skillSearchText(query),tokens=text.split(/\s+/).filter(Boolean),topic=skillGroups.includes(group)?group:'All topics';
 const options=skillOptions({facets,selected:current,problems}).filter(option=>(topic==='All topics'||option.topics.includes(topic))&&tokens.every(token=>skillSearchTerms(option.tag).includes(token)));
 const rank=option=>{const label=skillSearchText(option.tag);return text?(label===text?0:label.startsWith(text)?1:2):option.tag===current?0:option.conceptId?1:2;};
 options.sort((a,b)=>rank(a)-rank(b)||(text?0: b.count-a.count)||compare.compare(a.tag,b.tag));
 const size=Number.isSafeInteger(limit)?Math.max(1,Math.min(options.length||1,limit)):batchSize;
 return {items:options.slice(0,size),total:options.length,hasMore:options.length>size,query:cleanSkillLabel(query),group:topic};
}

function resultMarkup(options){
 const result=skillResults(options),current=canonicalSkill(options.selected),groups=skillGroups.slice(1).filter(group=>result.items.some(option=>option.group===group));
 return `<p class="skill-result-status" role="status" aria-live="polite">${result.total?`Showing ${result.items.length} of ${result.total} skills`:'No matching skills. Try another term or topic.'}</p>${groups.map(group=>`<section class="skill-result-group" aria-label="${esc(group)}"><h3>${esc(group)}</h3><ul>${result.items.filter(option=>option.group===group).map(option=>`<li><button type="button" data-skill-value="${esc(option.tag)}" data-skill-result-index="${result.items.indexOf(option)}" aria-pressed="${option.tag===current}"><span>${esc(option.tag)}</span><small>${option.count} ${option.count===1?'problem':'problems'}</small>${option.tag===current?'<span class="skill-check" aria-hidden="true">✓</span>':''}</button></li>`).join('')}</ul></section>`).join('')}${result.hasMore?'<button class="skill-show-more" type="button" data-skill-more>Show more skills</button>':''}`;
}

export function skillPickerMarkup({facets=[],selected='',problems=[]}={}){
 const current=canonicalSkill(selected);
 return `<div class="skill-picker-field"><span class="skill-picker-caption">Skill</span><details class="skill-picker" data-skill-picker><summary id="skill" data-skill-toggle aria-label="Filter by skill" aria-controls="skill-picker-panel"><span>${esc(current||'All skills')}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="skill-picker-panel" id="skill-picker-panel"><div class="skill-picker-heading"><strong>Choose a skill</strong><button type="button" class="skill-picker-close" data-skill-close aria-label="Close skill picker">×</button></div><label class="skill-search-label" for="skill-query">Find a skill</label><input id="skill-query" data-skill-search type="search" maxlength="80" autocomplete="off" spellcheck="false" placeholder="Search concepts, e.g. KCL or clock crossing"><div class="skill-picker-groups" role="group" aria-label="Skill topic">${skillGroups.map(group=>`<button type="button" data-skill-group="${esc(group)}" aria-pressed="${group==='All topics'}">${esc(group)}</button>`).join('')}</div><button type="button" class="skill-all" data-skill-value="" aria-pressed="${!current}">All skills${!current?'<span aria-hidden="true">✓</span>':''}</button><div class="skill-picker-results" data-skill-results>${resultMarkup({facets,selected:current,problems})}</div></div></details></div>`;
}

export function createSkillPicker({document,getFacets=()=>[],getProblems=()=>[],getSelected=()=>'',onSelect=()=>{}}={}){
 let root=null,query='',group='All topics',limit=batchSize;
 function currentRoot(){const next=document?.querySelector('[data-skill-picker]')||null;if(next!==root){root=next;query='';group='All topics';limit=batchSize;}return root;}
 const options=()=>({facets:getFacets(),selected:getSelected(),problems:getProblems(),query,group,limit});
 function positionPanel(current){
  const panel=current.querySelector('.skill-picker-panel'),trigger=current.querySelector('[data-skill-toggle]'),view=document.defaultView;
  if(!panel?.style||typeof trigger?.getBoundingClientRect!=='function'||!view)return;
  // Embedded disclosures can let their containing filter panel own scrolling.
  if(view.getComputedStyle?.(panel).position==='static'){for(const key of ['width','left','top','bottom','max-height'])panel.style.removeProperty(key);return;}
  const rect=trigger.getBoundingClientRect(),width=Math.min(420,Math.max(200,view.innerWidth-32)),left=Math.max(16,Math.min(rect.left,view.innerWidth-width-16));
  const below=view.innerHeight-rect.bottom-20,above=rect.top-20,up=below<240&&above>below;
  panel.style.width=`${width}px`;panel.style.left=`${left-rect.left}px`;panel.style.top=up?'auto':'calc(100% + 8px)';panel.style.bottom=up?'calc(100% + 8px)':'auto';
  panel.style.maxHeight=`min(${Math.max(160,Math.min(560,up?above:below))}px, 72dvh)`;
 }
 function refresh(){const current=currentRoot();if(!current)return;const results=current.querySelector('[data-skill-results]');if(results)results.innerHTML=resultMarkup(options());for(const button of current.querySelectorAll('[data-skill-group]'))button.setAttribute('aria-pressed',String(button.dataset.skillGroup===group));positionPanel(current);}
 function close({restoreFocus=false}={}){const current=currentRoot(),wasOpen=Boolean(current?.open);if(current)current.open=false;query='';group='All topics';limit=batchSize;if(current){const search=current.querySelector('[data-skill-search]');if(search)search.value='';const results=current.querySelector('[data-skill-results]');if(results)results.innerHTML='';}if(restoreFocus&&wasOpen)document.querySelector('#skill')?.focus({preventScroll:true});return wasOpen;}
 function contains(event){return Boolean(currentRoot()?.contains(event.target));}
 function onClick(event){
  const current=currentRoot();if(!current||!contains(event))return false;
  const toggle=event.target.closest('[data-skill-toggle]');
  if(toggle){event.preventDefault();if(current.open)close({restoreFocus:true});else{current.open=true;refresh();current.querySelector('[data-skill-search]')?.focus({preventScroll:true});}return true;}
  const button=event.target.closest('button');if(!button||button.disabled)return false;
  if(button.hasAttribute('data-skill-close')){close({restoreFocus:true});return true;}
  if(button.hasAttribute('data-skill-group')){if(skillGroups.includes(button.dataset.skillGroup)){group=button.dataset.skillGroup;limit=batchSize;refresh();}return true;}
  if(button.hasAttribute('data-skill-more')){const previous=skillResults(options()).items.length;limit+=batchSize;refresh();current.querySelector(`[data-skill-result-index="${previous}"]`)?.focus({preventScroll:true});return true;}
  if(button.hasAttribute('data-skill-value')){
   const value=canonicalSkill(button.dataset.skillValue);
   if(value&&!skillOptions(options()).some(option=>option.tag===value))return true;
   close();onSelect(value);document.querySelector('#skill')?.focus({preventScroll:true});return true;
  }
  return false;
 }
 function onInput(event){if(!contains(event)||!event.target.matches('[data-skill-search]'))return false;query=cleanSkillLabel(event.target.value);limit=batchSize;refresh();return true;}
 function onKeydown(event){
  const current=currentRoot();if(!current?.open||!contains(event))return false;
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation?.();close({restoreFocus:true});return true;}
  if(event.key==='ArrowDown'&&event.target.matches('[data-skill-search]')){const first=current.querySelector('[data-skill-result-index="0"]');if(first){event.preventDefault();first.focus();return true;}}
  return false;
 }
 function onPointerDown(event){if(currentRoot()?.open&&!contains(event))close();return false;}
 function onFocusIn(event){if(currentRoot()?.open&&!contains(event))close();return false;}
 return {onClick,onInput,onKeydown,onPointerDown,onFocusIn,close,refresh,discard(){close();root=null;},get isOpen(){return Boolean(currentRoot()?.open);}};
}
