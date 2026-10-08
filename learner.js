const emptyProgress=()=>({solved:[],bookmarks:[],attempts:[],notes:{},drafts:{},reviews:{},attemptCount:0,acceptedCount:0});
const validId=value=>Number.isSafeInteger(Number(value))&&Number(value)>0;
const ids=values=>[...new Set((Array.isArray(values)?values:[]).filter(validId).map(Number))];
const texts=values=>Object.fromEntries(Object.entries(values&&typeof values==='object'?values:{}).filter(([key,value])=>validId(key)&&typeof value==='string'));
function normalizeReviews(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  return Object.fromEntries(Object.entries(value).filter(([id,review])=>validId(id)&&String(Number(id))===id&&review&&typeof review==='object'&&review.id===Number(id)&&typeof review.lastPass==='boolean'&&typeof review.lastAt==='string'&&Number.isFinite(Date.parse(review.lastAt))&&Number.isSafeInteger(review.successDays)&&review.successDays>=0&&Number.isSafeInteger(review.revision)&&review.revision>0).map(([id,review])=>[id,{id:review.id,lastAt:review.lastAt,lastPass:review.lastPass,successDays:review.successDays,revision:review.revision}]));
}
const copyReviews=reviews=>Object.fromEntries(Object.entries(reviews).map(([id,review])=>[id,{...review}]));
function mergeReviews(current,incoming){
  const result=copyReviews(current);
  for(const [id,review] of Object.entries(incoming))if(!result[id]||review.revision>result[id].revision)result[id]={...review};
  return result;
}
const copy=progress=>({...progress,solved:[...progress.solved],bookmarks:[...progress.bookmarks],attempts:progress.attempts.map(attempt=>({...attempt})),notes:{...progress.notes},drafts:{...progress.drafts},reviews:copyReviews(progress.reviews)});
function normalize(progress={}){
  const attempts=(Array.isArray(progress.attempts)?progress.attempts:[]).filter(attempt=>attempt&&validId(attempt.id)&&typeof attempt.pass==='boolean'&&typeof attempt.at==='string').map(attempt=>({id:Number(attempt.id),pass:attempt.pass,at:attempt.at,...(typeof attempt.submissionId==='string'?{submissionId:attempt.submissionId}:{}),...(['graded','imported'].includes(attempt.source)?{source:attempt.source}:{})}));
  return {solved:ids(progress.solved),bookmarks:ids(progress.bookmarks),attempts,notes:texts(progress.notes),drafts:texts(progress.drafts),reviews:normalizeReviews(progress.reviews),attemptCount:Number.isSafeInteger(progress.attemptCount)&&progress.attemptCount>=0?progress.attemptCount:attempts.length,acceptedCount:Number.isSafeInteger(progress.acceptedCount)&&progress.acceptedCount>=0?progress.acceptedCount:attempts.filter(attempt=>attempt.pass).length};
}
const attemptKey=attempt=>attempt.submissionId||`${attempt.id}:${attempt.at}:${attempt.pass}`;
const mergeAttempts=(first,second)=>[...new Map([...first,...second].map(attempt=>[attemptKey(attempt),attempt])).values()].sort((a,b)=>a.at.localeCompare(b.at)).slice(-1000);

/** Account progress stays in memory. Guest storage is owned by the application. */
export function createLearnerStore({api,session={},guest={},onStatus=()=>{},onRemote=()=>{},debounceMs=600}){
  const accountId=session.signedIn&&session.user?.id?String(session.user.id):null;
  const signedIn=!!accountId;
  const guestMode=session.signedIn===false;
  let state=guestMode?normalize(guest):emptyProgress(),profile=null,ready=guestMode,loading=false,authLost=false,disposed=false,loadError=guestMode||signedIn?'':'Your sign-in could not be checked. Reload to continue.',activity=0,serial=0,loadVersion=0,importOperation=null;
  const revisions=new Map(),fields=new Map(),changed=new Map(),submissions=new Map();
  const uuid=()=>globalThis.crypto.randomUUID();
  const snapshot=()=>copy(state);
  const pending=()=>fields.size+submissions.size+(importOperation?1:0);
  function getStatus(){
    const conflicts=[...fields.entries()].filter(([,entry])=>entry.conflict).map(([key,entry])=>({key,problemId:entry.problemId,field:entry.field,localValue:entry.value,remoteValue:entry.conflict.value,remoteRevision:entry.conflict.revision}));
    const errors=[loadError,...[...fields.values(),...submissions.values(),...(importOperation?[importOperation]:[])].map(entry=>entry.error)].filter(Boolean);
    return {signedIn,ready,loading,pending:pending(),syncing:activity>0,error:authLost?'Your sign-in changed or expired. Reload to continue with the current account.':errors[0]||'',conflicts,authLost};
  }
  const notify=()=>{if(!disposed)onStatus(getStatus());};
  const remote=()=>{if(!disposed)onRemote(snapshot());};
  function ensureActive(requireReady=true){
    if(disposed)throw new Error('This account workspace is closed.');
    if(!signedIn)throw new Error('Sign in to save progress to an account.');
    if(authLost)throw new Error('Your sign-in changed or expired. Reload before saving.');
    if(requireReady&&!ready)throw new Error('Wait until your account progress has loaded before saving.');
  }
  function recordFailure(error){
    if(error.status===401||error.data?.accountChanged){
      authLost=true;
      for(const entry of fields.values()){clearTimeout(entry.timer);entry.timer=null;}
    }
    return error.message||'Progress could not be saved. Please retry.';
  }
  async function request(path,method='GET',body){
    ensureActive(false);
    try{
      const result=await api(path,{method,headers:{'X-Ohm-Account-ID':accountId,...(method==='GET'?{}:{'X-CSRF-Token':session.csrfToken})},...(body===undefined?{}:{body:JSON.stringify(body)})});
      if(result?.accountId!==undefined&&String(result.accountId)!==accountId)throw Object.assign(new Error('Your sign-in changed. Reload before saving.'),{status:409,data:{accountChanged:true}});
      return result;
    }catch(error){recordFailure(error);throw error;}
  }
  function readField(field,problemId,source=state){return field==='bookmark'?source.bookmarks.includes(problemId):(field==='note'?source.notes:source.drafts)[problemId]||'';}
  function writeField(field,problemId,value,target=state){
    if(field==='bookmark')target.bookmarks=value?ids([...target.bookmarks,problemId]):target.bookmarks.filter(id=>id!==problemId);
    else (field==='note'?target.notes:target.drafts)[problemId]=value;
  }
  function applySnapshot(data,startSerial){
    const next=normalize(data.progress);
    // Accepted work is append-only; a slower refresh cannot erase a newer submission.
    next.solved=ids([...next.solved,...state.solved]);
    next.attempts=mergeAttempts(next.attempts,state.attempts);
    next.attemptCount=Math.max(next.attemptCount,state.attemptCount);
    next.acceptedCount=Math.max(next.acceptedCount,state.acceptedCount);
    next.reviews=mergeReviews(state.reviews,next.reviews);
    // Imports and refreshes can finish out of order. Keep the latest confirmed revision.
    for(const [key,revision] of revisions){
      if((data.revisions?.[key]||0)<revision){
        const [field,id]=key.split(':');writeField(field,Number(id),readField(field,Number(id)),next);
      }
    }
    for(const [key,change] of changed){
      if(fields.has(key)||change.serial>startSerial)writeField(change.field,change.problemId,readField(change.field,change.problemId),next);
    }
    state=next;profile=data.profile?{...data.profile}:profile;
    for(const [key,revision] of Object.entries(data.revisions||{})){
      if(!fields.has(key)&&(changed.get(key)?.serial||0)<=startSerial&&revision>=(revisions.get(key)||0))revisions.set(key,revision);
    }
    ready=true;loadError='';remote();
  }
  async function load(){
    if(!signedIn){if(!guestMode)throw new Error(loadError);return snapshot();}
    ensureActive(false);
    const version=++loadVersion,startSerial=serial;
    loading=true;notify();
    try{
      const data=await request('/api/account/progress');
      if(!disposed&&!authLost&&version===loadVersion)applySnapshot(data,startSerial);
      return snapshot();
    }catch(error){if(!disposed&&version===loadVersion)loadError=recordFailure(error);throw error;}
    finally{if(version===loadVersion){loading=false;notify();}}
  }
  function schedule(entry){
    clearTimeout(entry.timer);entry.timer=null;
    if(disposed||authLost||entry.conflict||entry.error)return;
    entry.timer=setTimeout(()=>{entry.timer=null;void saveField(entry);},Math.max(0,debounceMs));
  }
  function setField(field,problemId,value){
    problemId=Number(problemId);
    if(!['bookmark','draft','note'].includes(field)||!validId(problemId))throw new Error('Unknown progress field.');
    if(field==='bookmark'?typeof value!=='boolean':typeof value!=='string')throw new Error('Invalid progress value.');
    if(signedIn)ensureActive();
    else if(!guestMode)throw new Error(loadError);
    else if(disposed)throw new Error('This workspace is closed.');
    const key=`${field}:${problemId}`;
    if(readField(field,problemId)===value)return;
    writeField(field,problemId,value);changed.set(key,{field,problemId,serial:++serial});
    if(!signedIn){remote();return;}
    let entry=fields.get(key);
    if(entry){entry.value=value;entry.sequence++;if(entry.definitive){entry.error='';entry.definitive=false;}}
    else {entry={key,field,problemId,value,revision:revisions.get(key)||0,sequence:1,operation:null,promise:null,timer:null,error:'',conflict:null};fields.set(key,entry);}
    schedule(entry);notify();
  }
  async function saveField(entry){
    if(entry.promise)return entry.promise;
    if(disposed||authLost||entry.conflict||!fields.has(entry.key))return;
    clearTimeout(entry.timer);entry.timer=null;
    const operation=entry.operation||{problemId:entry.problemId,field:entry.field,value:entry.value,revision:entry.revision,operationId:uuid(),sequence:entry.sequence};
    entry.operation=operation;entry.error='';activity++;
    entry.promise=(async()=>{
      try{
        const {sequence,...payload}=operation;
        const result=await request('/api/account/state','PUT',payload);
        if(disposed||authLost)return;
        revisions.set(entry.key,result.revision);entry.revision=result.revision;entry.operation=null;
        if(entry.sequence===sequence||entry.value===result.value){
          fields.delete(entry.key);writeField(entry.field,entry.problemId,result.value);
        }
        // A newer keystroke retains its local value and follows this confirmed revision.
        remote();
      }catch(error){
        if(disposed)return;
        entry.error=recordFailure(error);
        if(!authLost&&error.status===409&&error.data?.current){
          entry.conflict={...error.data.current};entry.operation=null;
          entry.error='This value changed on another device. Choose which version to keep.';
        }else if(!authLost&&!retryable(error)){
          // The server rejected this payload; a corrected value needs a fresh operation.
          entry.operation=null;entry.definitive=true;
        }
      }finally{
        entry.promise=null;activity--;
        if(!disposed&&fields.has(entry.key)&&!entry.error&&!entry.conflict&&!authLost)schedule(entry);
        notify();
      }
    })();
    notify();return entry.promise;
  }
  function resolveConflict(key,choice){
    ensureActive();
    const entry=fields.get(key);
    if(!entry?.conflict||!['local','remote'].includes(choice))return false;
    revisions.set(key,entry.conflict.revision);
    if(choice==='remote'){
      writeField(entry.field,entry.problemId,entry.conflict.value);fields.delete(key);
      changed.set(key,{field:entry.field,problemId:entry.problemId,serial:++serial});remote();
    }else{
      entry.revision=entry.conflict.revision;entry.conflict=null;entry.error='';entry.operation=null;
      schedule(entry);
    }
    notify();return true;
  }
  function retryable(error){return !error.status||error.status>=500||error.status===429||error.status===408;}
  function acceptSubmission(result,operation){
    const attempt=result.attempt||{id:operation.payload.problemId,pass:!!result.pass,at:new Date().toISOString(),submissionId:operation.payload.submissionId};
    const normalized=normalize({attempts:[{...attempt,submissionId:attempt.submissionId||operation.payload.submissionId}]}).attempts;
    state.attempts=mergeAttempts(state.attempts,normalized);
    if(result.solved||result.pass)state.solved=ids([...state.solved,operation.payload.problemId]);
    state.attemptCount=Math.max(state.attemptCount,result.attemptCount??state.attempts.length);
    state.acceptedCount=Math.max(state.acceptedCount,result.acceptedCount??state.attempts.filter(item=>item.pass).length);
    state.reviews=mergeReviews(state.reviews,normalizeReviews(result.reviews));
    serial++;remote();
  }
  async function sendSubmission(operation){
    if(operation.promise)return operation.promise;
    ensureActive();activity++;operation.error='';
    operation.promise=(async()=>{
      try{
        const result=await request('/api/account/submit','POST',operation.payload);
        if(!disposed&&!authLost){acceptSubmission(result,operation);submissions.delete(operation.key);}
        return result;
      }catch(error){
        if(!disposed){operation.error=recordFailure(error);if(!authLost&&!retryable(error))submissions.delete(operation.key);}
        throw error;
      }finally{operation.promise=null;activity--;notify();}
    })();
    notify();return operation.promise;
  }
  function submit({problemId,version,answer}){
    ensureActive();
    const key=JSON.stringify([problemId,version,answer]);
    let operation=submissions.get(key);
    if(!operation){operation={key,payload:{problemId,version,answer,submissionId:uuid()},promise:null,error:''};submissions.set(key,operation);}
    return sendSubmission(operation);
  }
  async function sendImport(operation){
    if(operation.promise)return operation.promise;
    ensureActive();const startSerial=serial;activity++;operation.error='';
    operation.promise=(async()=>{
      try{
        const result=await request('/api/account/import','POST',operation.payload);
        if(!disposed&&!authLost){applySnapshot(result,startSerial);if(importOperation===operation)importOperation=null;}
        return snapshot();
      }catch(error){
        if(!disposed){operation.error=recordFailure(error);if(!authLost&&!retryable(error)&&importOperation===operation)importOperation=null;}
        throw error;
      }finally{operation.promise=null;activity--;notify();}
    })();
    notify();return operation.promise;
  }
  function importGuest(importId,progress=guest){
    ensureActive();
    if(typeof importId!=='string'||!importId)throw new Error('A stable import ID is required.');
    if(importOperation){
      if(importOperation.payload.importId!==importId)throw new Error('Retry the pending import before starting another.');
      return sendImport(importOperation);
    }
    const {attemptCount,acceptedCount,reviews,...portable}=normalize(progress);
    portable.attempts=portable.attempts.slice(-1000);
    importOperation={payload:{importId,progress:portable},promise:null,error:''};
    return sendImport(importOperation);
  }
  async function flush(){
    if(!signedIn||disposed||authLost)return getStatus();
    // A field can gain one more edit while its previous request is in flight.
    while(true){
      const candidates=[...fields.values()].filter(entry=>!entry.error&&!entry.conflict);
      if(!candidates.length)break;
      await Promise.all(candidates.map(entry=>saveField(entry)));
      if(disposed||authLost)break;
    }
    await Promise.allSettled([...submissions.values(),...(importOperation?[importOperation]:[])].map(entry=>entry.promise).filter(Boolean));
    return getStatus();
  }
  async function retry(){
    if(!signedIn||disposed||authLost)return getStatus();
    if(!ready||loadError){try{await load();}catch{return getStatus();}}
    loadError='';
    for(const entry of fields.values())if(!entry.conflict)entry.error='';
    await Promise.allSettled([flush(),...[...submissions.values()].map(sendSubmission),...(importOperation?[sendImport(importOperation)]:[])]);
    return getStatus();
  }
  function beforeUnload(event){if(pending()){event.preventDefault();event.returnValue='';}}
  globalThis.window?.addEventListener('beforeunload',beforeUnload);
  function dispose(){
    disposed=true;loadVersion++;
    for(const entry of fields.values())clearTimeout(entry.timer);
    fields.clear();submissions.clear();importOperation=null;state=emptyProgress();profile=null;
    globalThis.window?.removeEventListener('beforeunload',beforeUnload);
  }
  return {get state(){return snapshot();},get profile(){return profile?{...profile}:null;},get signedIn(){return signedIn;},get status(){return getStatus();},get hasPending(){return pending()>0;},async resumeAuth(current){if(!current.signedIn||String(current.user?.id)!==accountId)throw new Error('Sign back into the original account to save this tab’s pending work. Your changes are still here.');session.csrfToken=current.csrfToken;authLost=false;await retry();},invalidateAuth(){recordFailure({status:401,message:'Your sign-in changed.'});notify();},load,refresh:load,setField,resolveConflict,submit,importGuest,flush,retry,dispose};
}
