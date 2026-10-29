// Private account work stays in memory and the account API. Guest work uses
// separate keys and is never automatically imported when somebody signs in.
const clone=value=>structuredClone(value);
export function createLabStore({kind,empty,normalize,api,session={},guestStorage,onStatus=()=>{},debounceMs=600}) {
 if(!['debugging','design','diagnostic','cases','circuit','fullhdl','collections'].includes(kind))throw Error('Unknown practice workspace.');
 const accountId=session.signedIn&&session.user?.id?String(session.user.id):null;
 const signedIn=Boolean(accountId),guestMode=session.signedIn===false,key=`ohm_guest_lab_${kind}_v1`;
 let value=empty(),revision=0,ready=false,pending=false,saving=false,error='',conflict=null,authLost=false,disposed=false,serial=0,readGeneration=0,timer=null,operation=null,promise=null,loadPromise=null,baseRaw=null;
 const status=()=>({signedIn,ready,pending,saving,error,conflict:Boolean(conflict),authLost});
 const notify=()=>{if(!disposed)onStatus(status());};
 const checked=raw=>{if(JSON.stringify(raw).length>90000)throw Error('This practice workspace is too large to save.');return normalize(raw);};
 const ensure=()=>{if(disposed||authLost)throw Error('Your sign-in changed. Reload before changing this practice workspace.');if(!ready)throw Error('Wait for saved practice to load.');if(conflict)throw Error('Practice changed elsewhere. Load the saved version before continuing.');};
 function fail(e){if(e.status===401||e.data?.accountChanged)authLost=true;error=authLost?'Your sign-in changed. Sign back into the original account before saving.':e.message||'Practice could not be saved. Keep this tab open and retry.';notify();}
 async function request(method,body){
  const result=await api(`/api/account/labs/${kind}`,{method,signal:AbortSignal.timeout(20000),headers:{'X-Ohm-Account-ID':accountId,...(method==='GET'?{}:{'X-CSRF-Token':session.csrfToken})},...(body?{body:JSON.stringify(body)}:{})});
  if(String(result?.accountId)!==accountId)throw Object.assign(Error('Your sign-in changed.'),{status:409,data:{accountChanged:true}});
  if(!Number.isSafeInteger(result.revision)||result.revision<0)throw Error('The saved practice response was invalid. Retry to recover it.');
  return {...result,value:checked(result.value)};
 }
 async function load(){
  if(loadPromise)return loadPromise;
  if(disposed||pending||authLost)throw Error('Save or resolve your current practice before loading it.');
  const sequence=serial,generation=readGeneration;
  const loading=(async()=>{try{
   if(signedIn){const result=await request('GET');if(disposed||authLost||generation!==readGeneration||serial!==sequence||pending)return clone(value);value=result.value;revision=result.revision;}
   else if(guestMode){if(!guestStorage)throw Error('Browser storage is unavailable.');const raw=guestStorage.getItem(key),restored=raw?checked(JSON.parse(raw)):empty();value=restored;baseRaw=raw;}
   else throw Error('Your sign-in could not be checked. Reload to continue.');
   ready=true;error='';notify();return clone(value);
  }catch(e){
   if(disposed||generation!==readGeneration)return clone(value);
   if(guestMode){ready=true;error='Saved browser practice could not be read. New work is kept in this tab until it can be saved.';notify();return clone(value);}
   fail(e);throw e;
  }})();loadPromise=loading;
  try{return await loading;}finally{if(loadPromise===loading)loadPromise=null;}
 }
 function set(next){ensure();value=checked(next);serial++;pending=true;error='';clearTimeout(timer);timer=setTimeout(()=>{timer=null;void flush();},debounceMs);notify();}
 async function flush(){
  if(promise)return promise;
  clearTimeout(timer);timer=null;
  if(disposed||!ready||!pending||authLost||conflict)return status();
  if(!signedIn){
   try{
    if(!guestStorage)throw Error('Browser storage is unavailable. Keep this tab open and retry.');
    const remoteRaw=guestStorage.getItem(key);
    if(remoteRaw!==baseRaw){conflict={value:remoteRaw?checked(JSON.parse(remoteRaw)):empty(),raw:remoteRaw};error='Practice changed in another tab. Load the saved version to replace this tab’s unsaved changes.';}
    else{const raw=JSON.stringify(value);guestStorage.setItem(key,raw);baseRaw=raw;pending=false;error='';}
   }catch(e){fail(e);}notify();return status();
  }
  operation||={revision,operationId:crypto.randomUUID(),value:clone(value),serial};
  const sending=operation;saving=true;error='';
  promise=(async()=>{
   try{
    const {serial:sequence,...body}=sending,result=await request('PUT',body);
    if(disposed||authLost)return status();
    revision=result.revision;operation=null;
    if(serial===sequence){value=result.value;pending=false;}
   }catch(e){if(!disposed){
    if(e.status===409&&e.data?.current&&!e.data?.accountChanged){
     try{const remote=e.data.current;if(!Number.isSafeInteger(remote.revision)||remote.revision<0)throw Error('Invalid saved revision');conflict={value:checked(remote.value),revision:remote.revision};operation=null;}catch{error='The saved practice response was invalid. Keep this tab open and retry.';notify();return status();}
    }else if(e.status&&e.status<500&&![401,408,429].includes(e.status))operation=null;
    fail(e);
   }}finally{saving=false;promise=null;notify();}
   if(!disposed&&pending&&!error&&!conflict&&!authLost)return flush();
   return status();
  })();notify();return promise;
 }
 async function retry(){if(authLost||disposed||conflict)return status();if(!ready){try{await load();}catch{return status();}}error='';return flush();}
 function useRemote(){if(disposed||authLost||!ready)throw Error('Reload this practice workspace.');if(!conflict)return clone(value);value=clone(conflict.value);if(signedIn)revision=conflict.revision;else baseRaw=conflict.raw;conflict=null;pending=false;operation=null;error='';serial++;notify();return clone(value);}
 function beforeUnload(event){if(pending){event.preventDefault();event.returnValue='';}}
 globalThis.window?.addEventListener('beforeunload',beforeUnload);
 return {get state(){return clone(value);},get status(){return status();},get hasPending(){return pending;},load,set,flush,retry,useRemote,
  invalidateAuth(){authLost=true;readGeneration++;loadPromise=null;clearTimeout(timer);error='Your sign-in changed. Reload before continuing.';notify();},
  async resumeAuth(current){if(!current.signedIn||String(current.user?.id)!==accountId)throw Error('Sign back into the original account to save this practice.');session.csrfToken=current.csrfToken;authLost=false;return retry();},
  dispose(){disposed=true;clearTimeout(timer);value=empty();globalThis.window?.removeEventListener('beforeunload',beforeUnload);}
 };
}
