// A private, self-written learning notebook. Entries never create a grade,
// submission, solve, or mastery claim.
export const notebookReasons=Object.freeze([
 {id:'concept',label:'Concept or method'},
 {id:'sign',label:'Sign or direction'},
 {id:'units',label:'Units or scale'},
 {id:'algebra',label:'Algebra or arithmetic'},
 {id:'assumptions',label:'Model or assumptions'},
 {id:'hdl',label:'HDL or logic'},
 {id:'other',label:'Other takeaway'}
].map(value=>Object.freeze(value)));
export const notebookLimits=Object.freeze({entries:100,note:400,noteBytes:600});
const reasons=new Set(notebookReasons.map(value=>value.id));
const object=value=>Boolean(value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null));
const integer=value=>Number.isSafeInteger(value)&&value>0&&value<=2147483647;
const stamp=value=>Number.isSafeInteger(value)&&value>=0&&value<=8640000000000000;
const bytes=value=>new TextEncoder().encode(value).byteLength;
function noteText(value,required=false){
 if(typeof value!=='string'||value.length>notebookLimits.note)throw Error('Keep this takeaway to 400 characters or fewer.');
 const clean=value.normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,'');
 if(clean.length>notebookLimits.note||bytes(clean)>notebookLimits.noteBytes)throw Error('Keep this takeaway shorter.');
 if(required&&!clean.trim())throw Error('Write a short takeaway before saving.');
 return required?clean.trim():clean;
}
export const emptyNotebookDraft=()=>({active:false,problemId:null,version:1,reason:'concept',note:''});
export const emptyNotebookState=()=>({schemaVersion:1,entries:[],draft:emptyNotebookDraft()});

function normalizeDraft(value){
 if(!object(value)||typeof value.active!=='boolean'||!integer(value.version)||!reasons.has(value.reason)||value.active&&!integer(value.problemId)||!value.active&&value.problemId!==null)throw Error('The saved notebook draft is invalid.');
 const note=noteText(value.note);
 if(!value.active&&(value.version!==1||value.reason!=='concept'||note!==''))throw Error('The saved notebook draft is invalid.');
 return {active:value.active,problemId:value.problemId,version:value.version,reason:value.reason,note};
}
export function normalizeNotebookState(raw){
 if(!object(raw)||raw.schemaVersion!==1||!Array.isArray(raw.entries)||raw.entries.length>notebookLimits.entries)throw Error('The saved notebook is invalid or too large.');
 const seen=new Set();
 const entries=Array.from(raw.entries,value=>{
  if(!object(value)||!integer(value.problemId)||seen.has(value.problemId)||!integer(value.version)||!reasons.has(value.reason)||!['open','reviewed'].includes(value.status)||typeof value.archived!=='boolean'||!stamp(value.createdAt)||!stamp(value.updatedAt)||value.updatedAt<value.createdAt)throw Error('A saved takeaway contains invalid data.');
  seen.add(value.problemId);
  return {problemId:value.problemId,version:value.version,reason:value.reason,note:noteText(value.note,true),status:value.status,archived:value.archived,createdAt:value.createdAt,updatedAt:value.updatedAt};
 });
 const state={schemaVersion:1,entries,draft:normalizeDraft(raw.draft)};
 if(bytes(JSON.stringify(state))>=85000)throw Error('Your notebook is full. Shorten an existing takeaway before saving.');
 return state;
}
function modify(raw,change){const state=normalizeNotebookState(raw);change(state);return normalizeNotebookState(state);}
const entry=(state,problemId)=>{if(!integer(problemId))throw Error('Choose a saved takeaway.');const found=state.entries.find(value=>value.problemId===problemId);if(!found)throw Error('Choose a saved takeaway.');return found;};
const nextTime=(value,at)=>{if(!stamp(at))throw Error('Invalid notebook time.');return Math.max(value.createdAt,value.updatedAt,at);};

export function setNotebookDraft(raw,draft){return modify(raw,state=>{state.draft=normalizeDraft(draft);});}
export function saveNotebookEntry(raw,{problemId,version,reason,note,at=Date.now()}={}){
 return modify(raw,state=>{
  if(!integer(problemId)||!integer(version)||!reasons.has(reason)||!stamp(at))throw Error('Choose valid takeaway details.');
  const text=noteText(note,true);let found=state.entries.find(value=>value.problemId===problemId);
  if(!found){
   if(state.entries.length>=notebookLimits.entries)throw Error('Your notebook holds 100 takeaways, including archived entries. Edit an existing takeaway to keep it up to date.');
   found={problemId,version,reason,note:text,status:'open',archived:false,createdAt:at,updatedAt:at};state.entries.push(found);
  }else{found.version=version;found.reason=reason;found.note=text;found.updatedAt=nextTime(found,at);}
  state.draft=emptyNotebookDraft();
 });
}
export function archiveNotebookEntry(raw,problemId,archived,at=Date.now()){
 if(typeof archived!=='boolean')throw Error('Choose whether to archive this takeaway.');
 return modify(raw,state=>{const found=entry(state,problemId);found.archived=archived;found.updatedAt=nextTime(found,at);});
}
export function reviewNotebookEntry(raw,problemId,reviewed,at=Date.now()){
 if(typeof reviewed!=='boolean')throw Error('Choose whether this takeaway was reviewed.');
 return modify(raw,state=>{const found=entry(state,problemId);found.status=reviewed?'reviewed':'open';found.updatedAt=nextTime(found,at);});
}
