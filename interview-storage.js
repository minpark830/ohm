// Account interview drafts never use browser persistence. Guest sessions use a
// separate key, and are never imported or copied into an authenticated account.
const empty = () => ({current:null, history:[]});
const clone = value => structuredClone(value);
const key = 'ohm_guest_interviews_v1';
function guestValue(raw) {
  const object = value => Boolean(value && typeof value === 'object' && !Array.isArray(value));
  const integer = value => Number.isSafeInteger(value) && value >= 0;
  if (!object(raw) || !Array.isArray(raw.history) || raw.history.length > 20 || JSON.stringify(raw).length > 500000) throw new Error('Saved browser interview is invalid.');
  const seen=new Set();
  function valid(item, archived=false) {
    if (!object(item) || !object(item.session)) return false;
    const s=item.session;
    if (typeof s.id!=='string' || !s.id || s.id.length>64 || seen.has(s.id) || !Array.isArray(s.problems) || !s.problems.length || s.problems.length>10 || !object(s.answers) || !integer(s.startedAt) || !integer(s.minutes) || s.minutes<1 || s.minutes>180 || s.deadline!==s.startedAt+s.minutes*60000 || !integer(item.questionIndex) || item.questionIndex>=s.problems.length || !object(item.drafts) || !object(item.notes)) return false;
    if (s.endedAt!==null && (!integer(s.endedAt)||s.endedAt<s.startedAt||s.endedAt>s.deadline||!['finished','timeout'].includes(s.reason)) || s.endedAt===null&&(s.reason!==null||archived)) return false;
    seen.add(s.id);
    const ids=new Set();
    for (const p of s.problems) {
      if (!object(p)||!integer(p.id)||p.id===0||!integer(p.version)||p.version===0||ids.has(p.id)||typeof p.title!=='string'||typeof p.category!=='string'||!['numeric','choice','hdl','multipart'].includes(p.type)) return false;
      ids.add(p.id);
      if (p.options!==undefined&&(!Array.isArray(p.options)||p.options.length>30||p.options.some(option=>typeof option!=='string'))) return false;
      if (p.given!==undefined&&(!Array.isArray(p.given)||p.given.length>40||p.given.some(g=>!object(g)))) return false;
      if (p.parts!==undefined&&(!Array.isArray(p.parts)||p.parts.length>10||p.parts.some(part=>!object(part)||typeof part.id!=='string'||typeof part.label!=='string'))) return false;
    }
    for (const [field,max] of [['drafts',2500],['notes',10000]]) {
      if (Object.keys(item[field]).length>10 || Object.entries(item[field]).some(([id,text])=>!ids.has(Number(id))||String(Number(id))!==id||typeof text!=='string'||text.length>max)) return false;
    }
    if (Object.keys(s.answers).length>ids.size) return false;
    for (const [id,a] of Object.entries(s.answers)) if (!object(a)||!ids.has(a.problemId)||String(a.problemId)!==id||typeof a.pass!=='boolean'||!integer(a.startedAt)||!integer(a.receivedAt)||a.startedAt<s.startedAt||a.startedAt>=Math.min(s.deadline,s.endedAt??s.deadline)||a.receivedAt<a.startedAt) return false;
    return true;
  }
  if (raw.current !== null && !valid(raw.current) || raw.history.some(item=>!valid(item,true))) throw new Error('Saved browser interview is invalid.');
  return clone(raw);
}

export function createInterviewStore({api, session = {}, guestStorage, onStatus = () => {}, debounceMs = 600}) {
  const accountId = session.signedIn && session.user?.id ? String(session.user.id) : null;
  const signedIn = Boolean(accountId), guestMode = session.signedIn === false;
  let value = empty(), revision = 0, ready = false, pending = false, saving = false, error = '', conflict = null, authLost = false, disposed = false, operation = null, serial = 0, generation = 0, timer = null, promise = null, loadPromise = null, baseRaw = null;
  const status = () => ({signedIn, ready, pending, saving, error, conflict: Boolean(conflict), authLost});
  const notify = () => { if (!disposed) onStatus(status()); };
  function ensure() { if (disposed) throw new Error('This interview workspace is closed.'); if (authLost) throw new Error('Your sign-in changed. Reload before saving your interview.'); if (!ready) throw new Error('Wait for your saved interviews to load.'); }
  function fail(e, token = generation) {
    if (token === generation && (e.status === 401 || e.data?.accountChanged)) authLost = true;
    error = authLost ? 'Your sign-in changed. Sign back into the original account before saving this interview.' : e.message || 'Your interview could not be saved. Retry before closing this tab.';
    notify();
  }
  async function request(method, body) {
    const result = await api('/api/account/interviews', {method, headers:{'X-Ohm-Account-ID':accountId, ...(method === 'GET' ? {} : {'X-CSRF-Token':session.csrfToken})}, ...(body ? {body:JSON.stringify(body)} : {})});
    if (result?.accountId !== undefined && String(result.accountId) !== accountId) throw Object.assign(new Error('Your sign-in changed.'), {status:409,data:{accountChanged:true}});
    return result;
  }
  async function load() {
    if (loadPromise) return loadPromise;
    if (disposed || pending || authLost) throw new Error('Save or resolve your current interview before reloading it.');
    const sequence = serial, token = generation;
    const loading = (async () => { try {
      if (signedIn) { const result = await request('GET'); if (disposed || authLost || token !== generation || serial !== sequence || pending) return clone(value); value = clone(result.value); revision = result.revision; }
      else if (guestMode) { if (!guestStorage) throw new Error('Browser storage is unavailable.'); const raw = guestStorage.getItem(key), restored = raw ? guestValue(JSON.parse(raw)) : empty(); value = restored; baseRaw = raw; }
      else throw new Error('Your sign-in could not be checked. Reload to continue.');
      ready = true; error = ''; notify(); return clone(value);
    } catch (e) {
      if (disposed || token !== generation) return clone(value);
      if (guestMode) { ready=true; error='Saved browser interviews could not be read. Keep this tab open; new interview changes cannot be saved yet.'; notify(); return clone(value); }
      fail(e, token); throw e;
    } })();
    loadPromise = loading;
    try { return await loading; } finally { if (loadPromise === loading) loadPromise = null; }
  }
  function set(next) {
    ensure();
    if (conflict) throw new Error('Your interview changed elsewhere. Load the saved version before continuing.');
    value = clone(next); serial++; pending = true; error = '';
    clearTimeout(timer); timer = setTimeout(() => {timer=null; void flush();}, debounceMs);
    notify();
  }
  async function flush() {
    if (promise) return promise;
    clearTimeout(timer); timer=null;
    if (disposed || !ready || !pending || authLost || conflict) return status();
    if (!signedIn) {
      try {
        if (!guestStorage) throw new Error('Browser storage is unavailable.');
        const remoteRaw = guestStorage.getItem(key);
        if (remoteRaw !== baseRaw) { conflict = {value:remoteRaw ? guestValue(JSON.parse(remoteRaw)) : empty(), raw:remoteRaw}; error='Your interview changed in another tab. Load the saved version before replacing this tab’s unsaved changes.'; }
        else { const raw = JSON.stringify(value); guestStorage.setItem(key, raw); baseRaw=raw; pending=false; error=''; }
      } catch { fail(new Error('Saved browser interviews could not be read or written. Keep this tab open and retry to retain your work.')); }
      notify(); return status();
    }
    operation ||= {revision, operationId:crypto.randomUUID(), value:clone(value), serial};
    const sending = operation, token = generation;
    saving=true; error='';
    promise=(async () => {
      try {
        const {serial:sequence,...body}=sending;
        const result=await request('PUT',body);
        if (disposed || authLost) return status();
        revision=result.revision; operation=null;
        if (serial===sequence) {value=clone(result.value);pending=false;}
      } catch (e) {
        if (!disposed) {
          if (e.status===409 && e.data?.current && !e.data?.accountChanged) {conflict=clone(e.data.current);operation=null;}
          // Keep unknown outcomes for exact retries; rejected input needs a new key.
          else if (e.status && e.status<500 && ![401,408,429].includes(e.status)) operation=null;
          fail(e, token);
        }
      } finally { saving=false;promise=null;notify(); }
      if (!disposed && pending && !error && !conflict && !authLost) return flush();
      return status();
    })();
    notify(); return promise;
  }
  async function retry() { if (authLost || disposed || conflict) return status(); if (!ready) {try {await load();} catch {return status();}} error=''; return flush(); }
  function useRemote() { ensure(); if (!conflict) return clone(value); value=clone(conflict.value);if(signedIn)revision=conflict.revision;else baseRaw=conflict.raw;conflict=null;pending=false;operation=null;error='';serial++;notify();return clone(value); }
  function beforeUnload(event) {if(pending) {event.preventDefault();event.returnValue='';}}
  globalThis.window?.addEventListener('beforeunload', beforeUnload);
  return {get state(){return clone(value);},get status(){return status();},get hasPending(){return pending;},load,set,flush,retry,useRemote,
    invalidateAuth(){authLost=true;generation++;loadPromise=null;clearTimeout(timer);error='Your sign-in changed. Reload before continuing.';notify();},
    async resumeAuth(current){if(!current.signedIn||String(current.user?.id)!==accountId)throw new Error('Sign back into the original account to save this interview.');generation++;loadPromise=null;session.csrfToken=current.csrfToken;authLost=false;return retry();},
    dispose(){disposed=true;generation++;loadPromise=null;clearTimeout(timer);value=empty();globalThis.window?.removeEventListener('beforeunload',beforeUnload);}};
}
