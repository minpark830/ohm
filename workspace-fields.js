// Synchronize visible fields with progress that the store has already merged.
// This never dispatches input events or saves data back to the account.
const textField=(values,id)=>values&&typeof values==='object'&&!Array.isArray(values)&&Object.hasOwn(values,id)&&typeof values[id]==='string'?values[id]:null;

function setValue(document,element,value){
 if(!element||element.value===value)return false;
 const focused=document.activeElement===element,start=element.selectionStart,end=element.selectionEnd,direction=element.selectionDirection;
 const top=element.scrollTop,left=element.scrollLeft;
 element.value=value;
 if(focused&&Number.isInteger(start)&&Number.isInteger(end)&&typeof element.setSelectionRange==='function'){
  try{element.setSelectionRange(Math.min(start,value.length),Math.min(end,value.length),direction||'none');}catch{}
 }
 if(Number.isFinite(top))element.scrollTop=top;if(Number.isFinite(left))element.scrollLeft=left;
 return true;
}

export function syncWorkspaceFields({document,problem,progress={},editor}={}){
 const result={answerChanged:false,noteChanged:false};
 if(!document?.querySelector||!problem||!Number.isSafeInteger(problem.id)||problem.id<=0)return result;
 const draft=textField(progress?.drafts,problem.id),note=textField(progress?.notes,problem.id)||'';
 if(problem.type==='numeric')result.answerChanged=setValue(document,document.querySelector('#answer'),draft||'');
 else if(problem.type==='hdl'){
  result.answerChanged=setValue(document,document.querySelector('#hdl'),draft===null?'assign y = 0;':draft);
  if(result.answerChanged){editor?.setDiagnostics?.([]);editor?.refresh?.();}
 }else if(problem.type==='choice'){
  const valid=typeof draft==='string'&&Array.isArray(problem.options)&&problem.options.some((_,index)=>draft===String(index));
  for(const input of document.querySelectorAll?.('input[name=choice]')||[]){
   const checked=Boolean(valid&&input.value===draft);if(input.checked!==checked){input.checked=checked;result.answerChanged=true;}
  }
 }else if(problem.type==='multipart'){
  let values={};if(draft!==null){try{const parsed=JSON.parse(draft);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))values=parsed;}catch{}}
  const ids=new Set((Array.isArray(problem.parts)?problem.parts:[]).map(part=>part.id));
  for(const input of document.querySelectorAll?.('[data-answer-part]')||[]){
   if(!ids.has(input.dataset?.answerPart))continue;
   const value=Object.hasOwn(values,input.dataset.answerPart)&&typeof values[input.dataset.answerPart]==='string'?values[input.dataset.answerPart]:'';
   result.answerChanged=setValue(document,input,value)||result.answerChanged;
  }
 }
 result.noteChanged=setValue(document,document.querySelector('#scratchpad'),note);
 return result;
}
