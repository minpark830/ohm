// Private study organization only. Membership cannot create a solve or grade.
export const collectionLimits=Object.freeze({lists:20,problems:264,name:80,description:240});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
const id=value=>typeof value==='string'&&uuid.test(value);
const problemId=value=>Number.isSafeInteger(value)&&value>0&&value<=2147483647;
const stamp=value=>Number.isSafeInteger(value)&&value>=0&&value<=8640000000000000;
function text(value,max,required=false){
 if(typeof value!=='string'||value.length>max)throw Error(`Use at most ${max} characters.`);
 const clean=value.normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,'');
 if(clean.length>max||required&&!clean.trim())throw Error('Give the collection a name.');
 return required?clean.trim():clean;
}
export const emptyCollectionDraft=()=>({active:false,id:'',name:'',description:'',addProblemId:null});
export const emptyCollectionsState=()=>({schemaVersion:1,selected:null,lists:[],deleted:[],draft:emptyCollectionDraft()});
export function normalizeCollectionsState(raw){
 if(!object(raw)||raw.schemaVersion!==1||!Array.isArray(raw.lists)||!Array.isArray(raw.deleted)||raw.lists.length+raw.deleted.length>collectionLimits.lists)throw Error('The saved collections are invalid or too large.');
 const used=new Set();
 const normalizeList=(value,deleted)=>{
  if(!object(value)||!id(value.id)||used.has(value.id)||!Array.isArray(value.problemIds)||value.problemIds.length>collectionLimits.problems||!Array.from(value.problemIds).every(problemId)||new Set(value.problemIds).size!==value.problemIds.length||!stamp(value.createdAt)||!stamp(value.updatedAt)||value.updatedAt<value.createdAt)throw Error('A saved collection contains invalid data.');
  if(deleted&&(!stamp(value.deletedAt)||value.deletedAt<value.createdAt))throw Error('A deleted collection contains invalid data.');
  used.add(value.id);
  return {id:value.id,name:text(value.name,80,true),description:text(value.description,240),problemIds:[...value.problemIds],createdAt:value.createdAt,updatedAt:value.updatedAt,...(deleted?{deletedAt:value.deletedAt}:{})};
 };
 const lists=Array.from(raw.lists,value=>normalizeList(value,false)),deleted=Array.from(raw.deleted,value=>normalizeList(value,true));
 const draft=own(raw,'draft')?raw.draft:emptyCollectionDraft();
 if(!object(draft)||typeof draft.active!=='boolean'||typeof draft.id!=='string'||draft.id!==''&&!lists.some(list=>list.id===draft.id)||draft.addProblemId!==null&&!problemId(draft.addProblemId))throw Error('The collection draft is invalid.');
 const normalizedDraft={active:draft.active,id:draft.id,name:text(draft.name,80),description:text(draft.description,240),addProblemId:draft.addProblemId};
 return {schemaVersion:1,selected:lists.some(list=>list.id===raw.selected)?raw.selected:lists[0]?.id||null,lists,deleted,draft:normalizedDraft};
}
function modify(raw,change){const state=normalizeCollectionsState(raw);change(state);return normalizeCollectionsState(state);}
const find=(state,listId)=>{const list=state.lists.find(list=>list.id===listId);if(!list)throw Error('Choose a current collection.');return list;};
const nextTime=(list,at)=>{if(!stamp(at))throw Error('Invalid collection time.');return Math.max(list.createdAt,list.updatedAt,at);};
export function saveCollection(raw,{id:listId,name,description='',at=Date.now(),addProblemId=null}={}){
 return modify(raw,state=>{
  if(!id(listId)||!stamp(at)||addProblemId!==null&&!problemId(addProblemId))throw Error('Choose valid collection details.');
  let list=state.lists.find(item=>item.id===listId);
  if(!list){if(state.lists.length+state.deleted.length>=20)throw Error('You have 20 saved collections. Permanently remove a deleted collection before creating another.');if(state.deleted.some(item=>item.id===listId))throw Error('Restore the deleted collection first.');list={id:listId,name:'',description:'',problemIds:[],createdAt:at,updatedAt:at};state.lists.push(list);}
  list.name=text(name,80,true);list.description=text(description,240).trim();list.updatedAt=nextTime(list,at);
  if(addProblemId!==null&&!list.problemIds.includes(addProblemId)){if(list.problemIds.length>=collectionLimits.problems)throw Error(`A collection can hold at most ${collectionLimits.problems} problems.`);list.problemIds.push(addProblemId);}
  state.selected=listId;state.draft=emptyCollectionDraft();
 });
}
export function setCollectionProblem(raw,listId,problem,include,at=Date.now()){
 if(!problemId(problem)||typeof include!=='boolean')throw Error('Choose a valid problem.');
 return modify(raw,state=>{const list=find(state,listId),has=list.problemIds.includes(problem);if(include&&!has){if(list.problemIds.length>=collectionLimits.problems)throw Error(`A collection can hold at most ${collectionLimits.problems} problems.`);list.problemIds.push(problem);}else if(!include&&has)list.problemIds=list.problemIds.filter(value=>value!==problem);list.updatedAt=nextTime(list,at);});
}
export function moveCollectionProblem(raw,listId,problem,direction,at=Date.now()){
 if(!problemId(problem)||![1,-1].includes(direction))throw Error('Choose a valid reorder direction.');
 return modify(raw,state=>{const list=find(state,listId),index=list.problemIds.indexOf(problem),next=index+direction;if(index<0||next<0||next>=list.problemIds.length)return;[list.problemIds[index],list.problemIds[next]]=[list.problemIds[next],list.problemIds[index]];list.updatedAt=nextTime(list,at);});
}
export function deleteCollection(raw,listId,at=Date.now()){
 return modify(raw,state=>{const list=find(state,listId);if(!stamp(at))throw Error('Invalid collection time.');state.lists=state.lists.filter(item=>item.id!==listId);state.deleted.unshift({...list,deletedAt:nextTime(list,at)});if(state.selected===listId)state.selected=state.lists[0]?.id||null;if(state.draft.id===listId)state.draft=emptyCollectionDraft();});
}
export function restoreCollection(raw,listId){
 return modify(raw,state=>{const list=state.deleted.find(item=>item.id===listId);if(!list)throw Error('Choose a deleted collection.');const {deletedAt,...restored}=list;state.deleted=state.deleted.filter(item=>item.id!==listId);state.lists.push(restored);state.selected=listId;});
}
export function purgeCollection(raw,listId){
 return modify(raw,state=>{if(!state.deleted.some(item=>item.id===listId))throw Error('Choose a deleted collection.');state.deleted=state.deleted.filter(item=>item.id!==listId);});
}
export function publicCollectionCatalog(problems){
 const result=new Map();for(const problem of Array.isArray(problems)?problems:[]){if(problem&&problemId(problem.id)&&problem.published!==false&&problem.published!==0&&!result.has(problem.id))result.set(problem.id,problem);}return result;
}
export function collectionSummary(list,problems,progress={}){
 const catalog=publicCollectionCatalog(problems),solved=new Set(Array.isArray(progress?.solved)?progress.solved.filter(problemId):[]),items=(Array.isArray(list?.problemIds)?list.problemIds:[]).map(value=>catalog.get(value)).filter(Boolean),completed=items.filter(problem=>solved.has(problem.id)).length;
 return {items,completed,available:items.length,unavailable:(list?.problemIds?.length||0)-items.length,next:items.find(problem=>!solved.has(problem.id))||null};
}
