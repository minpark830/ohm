const prefix='ohm-guest-v2:';
const validId=id=>Number.isSafeInteger(Number(id))&&Number(id)>0;
const empty=()=>({solved:[],bookmarks:[],attempts:[],notes:{},drafts:{}});
const attempt=a=>a&&validId(a.id)&&typeof a.pass==='boolean'&&typeof a.at==='string'&&Number.isFinite(Date.parse(a.at));
export function readGuest(storage){
 const state=empty();let cached={};
 const raw=storage.getItem('ohm-progress');try{cached=JSON.parse(raw||'{}')||{};}catch{}
 for(const field of ['solved','bookmarks'])state[field]=[...new Set((Array.isArray(cached[field])?cached[field]:[]).filter(validId).map(Number))];
 state.attempts=(Array.isArray(cached.attempts)?cached.attempts:[]).filter(attempt).map(a=>({id:Number(a.id),pass:a.pass,at:a.at,version:Number.isSafeInteger(a.version)&&a.version>0?a.version:null,assistance:['independent','hint','solution'].includes(a.assistance)?a.assistance:'unknown'}));
 for(const field of ['notes','drafts'])state[field]=Object.fromEntries(Object.entries(cached[field]&&typeof cached[field]==='object'?cached[field]:{}).filter(([id,v])=>validId(id)&&typeof v==='string'));
 // Each field and submission has its own key. A tab never replaces another
 // tab's unrelated work with its older in-memory snapshot.
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);if(!key?.startsWith(prefix))continue;
  let value;try{value=JSON.parse(storage.getItem(key));}catch{continue;}
  const [field,id]=key.slice(prefix.length).split(':');
  if(field==='attempt'&&attempt(value))state.attempts.push({...value,id:Number(value.id)});
  else if(validId(id)){
   if(field==='bookmark'&&typeof value==='boolean')state.bookmarks=value?[...new Set([...state.bookmarks,Number(id)])]:state.bookmarks.filter(x=>x!==Number(id));
   if(['note','draft'].includes(field)&&typeof value==='string')state[field==='note'?'notes':'drafts'][Number(id)]=value;
  }
 }
 state.attempts.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 state.solved=[...new Set([...state.solved,...state.attempts.filter(a=>a.pass).map(a=>a.id)])];
 return state;
}
export function writeGuestField(storage,field,id,value){
 if(!validId(id)||!['bookmark','note','draft'].includes(field)||(field==='bookmark'?typeof value!=='boolean':typeof value!=='string'))throw new Error('Invalid guest progress.');
 storage.setItem(`${prefix}${field}:${Number(id)}`,JSON.stringify(value));
 storage.removeItem('ohm-guest-import-id');return readGuest(storage);
}
export function recordGuestAttempt(storage,value){
 if(!attempt(value))throw new Error('Invalid guest submission.');
 const submissionId=/^[0-9a-f-]{36}$/i.test(value.submissionId||'')?value.submissionId:crypto.randomUUID();
 storage.setItem(`${prefix}attempt:${submissionId}`,JSON.stringify({...value,submissionId}));
 storage.removeItem('ohm-guest-import-id');return readGuest(storage);
}
export const isGuestStorageKey=key=>key===null||key==='ohm-progress'||key?.startsWith(prefix);

export function createGuestStore(getStorage){
 let state=empty();const fields=new Map(),attempts=new Map();
 const snapshot=()=>structuredClone(state);
 function refresh(){
  try{state=readGuest(getStorage());}catch{}
  for(const {field,id,value} of fields.values()){
   if(field==='bookmark')state.bookmarks=value?[...new Set([...state.bookmarks,id])]:state.bookmarks.filter(x=>x!==id);
   else state[field==='note'?'notes':'drafts'][id]=value;
  }
  for(const value of attempts.values()){
   if(!state.attempts.some(a=>a.submissionId===value.submissionId))state.attempts.push({...value});
   if(value.pass&&!state.solved.includes(value.id))state.solved.push(value.id);
  }
  state.attempts.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));return snapshot();
 }
 function flush(){
  try{
   const storage=getStorage();
   for(const [key,value] of fields){writeGuestField(storage,value.field,value.id,value.value);fields.delete(key);}
   for(const [key,value] of attempts){recordGuestAttempt(storage,value);attempts.delete(key);}
  }catch{}
  return refresh();
 }
 refresh();
 return {
  get state(){return snapshot();},get hasPending(){return fields.size+attempts.size>0;},refresh,flush,
  setField(field,id,value){
   id=Number(id);if(!validId(id)||!['bookmark','note','draft'].includes(field)||(field==='bookmark'?typeof value!=='boolean':typeof value!=='string'))throw new Error('Invalid guest progress.');
   fields.set(`${field}:${id}`,{field,id,value});refresh();return flush();
  },
  record(value){
   if(!attempt(value))throw new Error('Invalid guest submission.');
   const record={...value,submissionId:crypto.randomUUID()};attempts.set(record.submissionId,record);refresh();return flush();
  }
 };
}
