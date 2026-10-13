import {lessonForProblem} from './learning-data.js?v=5a6db230efbf0bf2';

// These are general references, separate from problem hints and worked solutions.
// Prefix definitions: https://www.nist.gov/pml/owm/metric-si-prefixes
export const referencePrefixes=Object.freeze([
 {name:'giga',symbol:'G',exponent:9},{name:'mega',symbol:'M',exponent:6},
 {name:'kilo',symbol:'k',exponent:3},{name:'milli',symbol:'m',exponent:-3},
 {name:'micro',symbol:'µ',exponent:-6},{name:'nano',symbol:'n',exponent:-9},
 {name:'pico',symbol:'p',exponent:-12}
].map(Object.freeze));

const DIALOG_ID='ee-reference-drawer';
const cleanString=(value,max=160)=>typeof value==='string'?value.slice(0,max):'';
function referenceProblem(problem){
 if(!problem||typeof problem!=='object'||Array.isArray(problem))return null;
 return {
  title:cleanString(problem.title),category:cleanString(problem.category,80),
  tags:Array.isArray(problem.tags)?problem.tags.filter(tag=>typeof tag==='string').slice(0,20).map(tag=>tag.slice(0,64)):[],
  units:[...new Set([cleanString(problem.unit,80),...(Array.isArray(problem.parts)?problem.parts.slice(0,20).map(part=>cleanString(part?.unit,80)):[])].filter(Boolean))]
 };
}

export function referenceContent(problem,esc){
 const p=referenceProblem(problem),lesson=lessonForProblem(p||{title:'',tags:[],category:''});
 return `<div class="reference-context"><span class="eyebrow">${esc(lesson.category)}</span><p>${p?.title?`For ${esc(p.title)}`:'Keep the basics within reach.'}</p></div>
 <section class="reference-section" aria-labelledby="ee-reference-topic"><h3 id="ee-reference-topic">${esc(lesson.title)}</h3><div class="reference-formula">${esc(lesson.formula)}</div><ol class="reference-method">${lesson.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><div class="reference-caution"><strong>Check the assumptions</strong><p>${esc(lesson.mistake)}</p></div><a class="reference-source" href="${esc(lesson.reference)}" target="_blank" rel="noopener noreferrer">Topic reference <span class="reference-new-tab">(opens a new tab)</span></a></section>
 <details class="reference-details" open><summary>Units & prefixes</summary><div class="reference-details-body">${p?.units.length?`<p class="reference-answer-unit">Workspace answer unit${p.units.length===1?'':'s'}: <strong>${p.units.map(esc).join(', ')}</strong></p>`:''}<p>Convert values to consistent units before substituting. Use the answer unit requested in the workspace.</p><table class="reference-prefixes"><caption>Common decimal prefixes</caption><thead><tr><th scope="col">Prefix</th><th scope="col">Symbol</th><th scope="col">Multiplier</th></tr></thead><tbody>${referencePrefixes.map(prefix=>`<tr><th scope="row">${esc(prefix.name)}</th><td>${esc(prefix.symbol)}</td><td>10<sup>${prefix.exponent}</sup></td></tr>`).join('')}</tbody></table><p><strong>Case matters:</strong> m is milli; M is mega. For example, 1 kΩ = 1,000 Ω and 1 µF = 0.000001 F.</p><a class="reference-source" href="https://www.nist.gov/pml/owm/metric-si-prefixes" target="_blank" rel="noopener noreferrer">NIST prefix reference <span class="reference-new-tab">(opens a new tab)</span></a></div></details>
 <details class="reference-details"><summary>Sign conventions & checks</summary><div class="reference-details-body"><ul><li>Label current arrows and voltage polarities before writing equations. Keep your chosen convention throughout.</li><li>A negative signed current or voltage indicates the opposite reference direction or polarity.</li><li>Check initial conditions, operating regions, and any ideal-model assumptions stated in the problem.</li><li>Keep peak and RMS conventions consistent. If an equation uses angular frequency, convert with ω = 2πf.</li></ul></div></details>`;
}

export function createReferenceDrawer({esc,icon,getProblem,toast=()=>{}}){
 let opened=false,opener=null,activeDialog=null;
 const dialog=()=>document.querySelector(`#${DIALOG_ID}`);
 function buttonMarkup(){return `<button class="button reference-open" type="button" data-reference-action="open" aria-haspopup="dialog" aria-controls="${DIALOG_ID}">${icon('book',16)}EE reference</button>`;}
 function markup(){return `<dialog id="${DIALOG_ID}" class="reference-drawer" aria-modal="true" aria-labelledby="ee-reference-title" aria-describedby="ee-reference-description"><header class="reference-header"><div><span class="eyebrow">QUICK REFERENCE</span><h2 id="ee-reference-title">A little help with the basics.</h2><p id="ee-reference-description">General equations and conventions. Your problem stays open alongside.</p></div><button class="icon-button reference-close" type="button" data-reference-action="close" aria-label="Close EE reference">${icon('close',20)}</button></header><div class="reference-body" data-reference-body></div><footer class="reference-footer">General reference only. Opening this drawer does not record a hint or mark a problem solved.</footer></dialog>`;}
 function close({restoreFocus=true}={}){
  const wasOpen=opened||activeDialog?.open;
  const previous=opener;opened=false;opener=null;
  const current=activeDialog;activeDialog=null;
  if(current?.open)current.close();
  if(wasOpen&&restoreFocus){
   const target=previous?.isConnected&&!previous.disabled?previous:document.querySelector('#main');
   target?.focus({preventScroll:true});
  }
  return Boolean(wasOpen);
 }
 function open(trigger){
  const current=dialog();if(opened&&current===activeDialog&&current?.open)return;
  if(!current||typeof current.showModal!=='function'){toast('The reference could not open. Please reload and try again.');return;}
  if(opened)close({restoreFocus:false});
  const body=current.querySelector('[data-reference-body]');if(!body)return;
  body.innerHTML=referenceContent(getProblem?.(),esc);
  opener=trigger||document.activeElement;activeDialog=current;
  try{current.showModal();opened=true;current.querySelector('[data-reference-action="close"]')?.focus({preventScroll:true});}
  catch{opened=false;activeDialog=null;opener=null;toast('The reference could not open. Please reload and try again.');}
 }
 function onClick(event){
  const action=event.target?.closest?.('[data-reference-action]');
  if(action){if(action.dataset.referenceAction==='open')open(action);else if(action.dataset.referenceAction==='close')close();return true;}
  if(opened&&event.target===activeDialog){
   const rect=activeDialog.getBoundingClientRect();
   if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){close();return true;}
  }
  return false;
 }
 function onKeydown(event){
  if(!opened||!activeDialog?.open)return false;
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation?.();close();return true;}
  if(event.key!=='Tab')return false;
  const focusable=[...activeDialog.querySelectorAll('button:not([disabled]),a[href],summary,input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(node=>!node.hidden&&node.getClientRects().length);
  if(!focusable.length){event.preventDefault();activeDialog.focus();return true;}
  const first=focusable[0],last=focusable.at(-1),focused=document.activeElement;
  if(event.shiftKey&&(focused===first||!activeDialog.contains(focused))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(focused===last||!activeDialog.contains(focused))){event.preventDefault();first.focus();}
  return true;
 }
 return {buttonMarkup,markup,onClick,onKeydown,close,isOpen:()=>opened&&Boolean(activeDialog?.open)};
}
