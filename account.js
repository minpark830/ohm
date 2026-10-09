export function createAccount({externalFrontend=false,accountError='',shell,esc,icon,getSession,getStore,getGuest,getGuestPending=()=>false,auth,api,beforeAuth=async()=>{},afterAuth=async()=>location.reload(),problems,toast,render}) {
  let importing=false,imported=false,importId,authMode='signin',authEmail='',authMessage=auth?.error||accountError||'',authBusy=false,showLogin=new URL(location.href).searchParams.get('auth')==='reauth';
  try{importId=localStorage.getItem('ohm-guest-import-id')}catch{}
  if(!importId){importId=crypto.randomUUID();try{localStorage.setItem('ohm-guest-import-id',importId)}catch{}}
  const accountPath=auth?.accountPath||(externalFrontend?'/ohm/#account':'/#account');
  const reauthPath=auth?.reauthPath||(externalFrontend?'/ohm/?auth=reauth#account':'/?auth=reauth#account');
  const externalAvailable=()=>auth?.config.enabled&&(auth.config.github||auth.config.google||auth.config.email);
  const statusText=()=>{
    const session=getSession(),status=getStore().status;
    if(!session.signedIn)return getGuestPending()?'Guest changes are only in this tab · retry saving before closing':'Guest · saved on this device';
    if(status.authLost)return 'Sign-in changed · reload to continue';
    if(status.conflicts.length)return 'Changes need your review';
    if(status.error)return 'Not synced · open Account to retry';
    if(!status.ready)return 'Loading your account…';
    if(status.pending||status.syncing)return 'Saving to your account…';
    return 'All changes saved to your account';
  };
  function page(){
    const session=getSession(),store=getStore(),status=store.status;
    if(status.authLost&&store.hasPending){
      shell(`<div class="page account-page"><section class="auth-card rail-card"><h1>Keep this tab open.</h1><p>Your sign-in changed. Your unsaved work is still held in this tab.</p><a class="button primary" href="${esc(reauthPath)}" target="_blank" rel="noopener">Sign in again in a new tab</a><p class="auth-help">Use the original account, then return here to save your changes.</p><button class="button" data-auth-action="resume">Resume saving here</button><div class="auth-notice" role="status">${esc(authMessage)}</div></section></div>`);return;
    }
    if(auth?.recovery){authForm(true);return;}
    if(session.pendingAccount){
      const pending=session.pendingAccount;
      if(externalFrontend){
        shell(`<div class="page account-page"><section class="auth-card rail-card"><div class="account-symbol">Ω</div><span class="eyebrow muted">WELCOME TO OHM</span><h1>Create your practice account.</h1><p class="muted">Signed in as ${esc(pending.email)}. Save your solves, notes, and bookmarked problems with your GitHub sign-in.</p><div class="auth-notice" role="status">${esc(authMessage)}</div><button class="button primary" data-auth-action="finish-new" ${authBusy?'disabled':''}>Create practice account</button><p class="auth-help">You can choose to import this browser’s guest progress after creating your account.</p><button class="button link" data-auth-action="cancel">Sign out</button></section></div>`);return;
      }
      shell(`<div class="page account-page"><section class="auth-card rail-card"><div class="account-symbol">Ω</div><span class="eyebrow muted">WELCOME TO OHM</span><h1>Keep your progress together.</h1><p class="muted">Signed in as ${esc(pending.email)}. Choose where you’d like to begin.</p><div class="auth-notice" role="status">${esc(authMessage)}</div><button class="button primary" data-auth-action="finish-new" ${authBusy?'disabled':''}>Start a new practice account</button><div class="auth-divider">Already practiced with ChatGPT?</div>${pending.legacy?`<p class="small muted">Connect the progress saved under ${esc(pending.legacy.email)}. Only connect accounts that belong to you.</p><button class="button" data-auth-action="finish-legacy" ${authBusy?'disabled':''}>Connect my earlier progress</button>`:'<button class="button" data-auth-action="connect-legacy">Sign in to connect earlier progress</button>'}<p class="auth-help">Connecting is a one-time choice. Accounts are never combined just because they share an email address.</p><button class="button link" data-auth-action="cancel">Sign out</button></section></div>`);return;
    }
    if((!session.signedIn||showLogin||status.authLost)&&externalAvailable()){authForm();return;}
    if(!session.signedIn&&externalFrontend){
      shell(`<div class="page account-page"><section class="account-welcome"><div class="account-symbol">Ω</div><span class="eyebrow muted">YOUR OHM ACCOUNT</span><h1>Practice here.<br>Keep your momentum.</h1><p>GitHub sign-in is currently unavailable. You can keep practicing as a guest; your solves, bookmarks, notes, and drafts are saved in this browser.</p><div class="auth-notice" role="status">${esc(authMessage)}</div>${accountError?'<button class="button" data-action="reload">Retry account connection</button>':''}<button class="button primary" data-view="problems">Keep practicing ${icon('chevron',17)}</button><p class="account-fine">You can import this browser’s guest progress after signing in.</p></section></div>`);return;
    }
    if(!session.signedIn){shell(`<div class="page account-page"><section class="account-welcome"><div class="account-symbol">Ω</div><span class="eyebrow muted">YOUR OHM ACCOUNT</span><h1>Good practice.<br>Lasting progress.</h1><p>Pick up where you left off, on any device. Keep your solves, saved problems, notes, and answers together.</p><button class="button primary account-signin" data-auth-action="legacy">Continue with ChatGPT ${icon('chevron',17)}</button><p class="account-fine">Your first sign-in creates your Ohm account.<br>You can import this browser’s progress after signing in.</p><button class="button link" data-view="problems">Keep practicing as a guest</button></section><div class="account-benefits"><article>${icon('chart',24)}<h3>See how far you’ve come</h3><p>Your solved problems and submission history travel with you.</p></article><article>${icon('book',24)}<h3>Keep your place</h3><p>Bookmarks, answer drafts, and scratchpad notes are saved automatically.</p></article><article>${icon('check',24)}<h3>One familiar sign-in</h3><p>Use your ChatGPT account. No separate Ohm password to remember.</p></article></div></div>`);return;}
    const profile=store.profile||session.user||{},state=store.state,guest=getGuest();
    const guestCount=guest.solved.length+guest.bookmarks.length+guest.attempts.length+Object.keys(guest.notes).length+Object.keys(guest.drafts).length;
    const value=(field,v)=>field==='bookmark'?(v?'Saved problem':'Not saved'):(v||'(empty)');
    shell(`<div class="page account-page"><div class="page-heading"><div><span class="eyebrow muted">YOUR OHM ACCOUNT</span><h1>A place for your progress.</h1><p>Practice here. Pick it up anywhere.</p></div><button class="button" data-account-signout>Sign out</button></div><section class="account-profile rail-card"><div class="avatar account-avatar">${esc((profile.name||profile.email||'EE').slice(0,2).toUpperCase())}</div><div><h2>${esc(profile.name||'Your learning workspace')}</h2><p class="muted">${esc(profile.email)}</p></div><span class="account-pill">${session.provider==='supabase'?'Ohm account':'Connected with ChatGPT'}</span></section>${session.provider==='chatgpt'&&externalAvailable()?'<button class="button" data-auth-action="show-login">Connect another sign-in method</button>':''}<section class="account-sync rail-card" aria-live="polite"><div><h3 data-sync-status>${esc(statusText())}</h3><p>${status.error?esc(status.error):'Solves, bookmarks, notes, drafts, and submission history are stored privately with your account.'}</p></div><div class="button-row">${status.authLost?'<button class="button primary" data-action="reload">Reload account</button>':`${status.error?'<button class="button primary" data-account-action="retry">Retry sync</button>':''}<button class="button" data-account-action="refresh" ${status.loading||status.syncing?'disabled':''}>${status.loading?'Refreshing…':'Refresh progress'}</button>`}</div></section>${status.authLost?'':`<div class="progress-top"><div class="stat-card"><p>Problems solved</p><strong>${state.solved.length}</strong><p>Keep building your intuition</p></div><div class="stat-card"><p>Saved problems</p><strong>${state.bookmarks.length}</strong><p>Ready for another look</p></div><div class="stat-card"><p>Submissions</p><strong>${state.attemptCount}</strong><p>A record of your practice</p></div></div>`}${!status.authLost&&status.conflicts.length?`<section class="account-conflicts"><h2>Choose which changes to keep</h2><p class="muted">This field changed in another tab or device. Both versions are shown below.</p>${status.conflicts.map(c=>`<article class="rail-card"><h3>${esc(problems().find(p=>p.id===c.problemId)?.title||`Problem ${c.problemId}`)} · ${esc(c.field==='note'?'Scratchpad':c.field==='draft'?'Answer draft':'Bookmark')}</h3><div class="conflict-versions"><div><h4>Your changes</h4><pre>${esc(value(c.field,c.localValue))}</pre><button class="button primary" data-conflict="${esc(c.key)}" data-choice="local">Keep my changes</button></div><div><h4>Saved version</h4><pre>${esc(value(c.field,c.remoteValue))}</pre><button class="button" data-conflict="${esc(c.key)}" data-choice="remote">Use saved version</button></div></div></article>`).join('')}</section>`:''}<section class="rail-card account-import"><div><span class="eyebrow muted">FROM THIS DEVICE</span><h2>Bring your earlier practice along.</h2><p>Import guest progress from this browser into this account. Existing account notes, drafts, and bookmark choices are kept.</p><p class="small muted">${guest.solved.length} solved · ${guest.bookmarks.length} saved · ${guest.attempts.length} submissions</p><p class="tiny muted">Only import if this browser’s guest practice belongs to you. The most recent 1,000 guest submissions are imported as browser history; older history stays on this device.</p></div><button class="button ${imported?'':'primary'}" data-account-action="import" ${!guestCount||importing||imported||!status.ready||status.authLost?'disabled':''}>${importing?'Importing…':imported?'Progress imported':guestCount?'Import browser progress':'No guest progress to import'}</button></section></div>`);
  }
  async function onClick(event){
    const action=event.target.closest('[data-auth-action]');
    if(action){void authAction(action.dataset.authAction);return;}
    const signout=event.target.closest('[data-account-signout]');
    if(signout){event.preventDefault();try{await beforeAuth();if(getSession().provider==='supabase'){await auth.signOut();location.href=accountPath;location.reload();}else{auth?.legacy();window.top.location.href=getSession().signOutUrl;}}catch(e){toast(e.message)}return;}
    const conflict=event.target.closest('[data-conflict]');
    if(conflict){try{getStore().resolveConflict(conflict.dataset.conflict,conflict.dataset.choice);await getStore().flush()}catch(e){toast(e.message)}render();return;}
    const button=event.target.closest('[data-account-action]');if(!button)return;
    try{
      if(button.dataset.accountAction==='import'){importing=true;render();await getStore().importGuest(importId,getGuest());imported=true;toast('Browser progress added to your account.');}
      if(button.dataset.accountAction==='retry'){await getStore().retry();}
      if(button.dataset.accountAction==='refresh'){await getStore().refresh();}
    }catch(e){toast(e.message)}finally{importing=false;render();}
  }
  function authForm(recovering=false){
    if(window.top!==window){shell(`<div class="page account-page"><section class="auth-card rail-card"><div class="account-symbol">Ω</div><h1>Your practice, everywhere.</h1><p>Open Ohm in your browser to sign in and keep your progress connected.</p><button class="button primary" data-auth-action="open-browser">Open Ohm to sign in</button><div class="auth-notice" role="status">${esc(authMessage)}</div></section></div>`);return;}
    const mode=recovering?'password':authMode;
    const heading={signin:'Welcome back.',signup:'Make progress yours.',recovery:'Reset your password.',password:'Choose a new password.'}[mode];
    shell(`<div class="page account-page"><section class="auth-card rail-card"><div class="account-symbol">Ω</div><span class="eyebrow muted">YOUR OHM ACCOUNT</span><h1>${heading}</h1><p class="muted">${recovering?'Use a strong password you haven’t used elsewhere.':'Keep your solves, notes, and saved problems together.'}</p>${['signin','signup'].includes(mode)?`${auth.config.email?`<div class="auth-tabs" role="group" aria-label="Account access"><button data-auth-action="signin" aria-pressed="${mode==='signin'}">Sign in</button><button data-auth-action="signup" aria-pressed="${mode==='signup'}">Create account</button></div>`:''}${auth.config.github?'<button class="button primary" data-auth-action="github">Continue with GitHub</button>':''}${auth.config.google?'<button class="button auth-google" data-auth-action="google">Continue with Google</button>':''}${(auth.config.google||auth.config.github)&&auth.config.email?'<div class="auth-divider">or use email</div>':''}`:''}${auth.config.email||recovering?`<form id="auth-form">${mode!=='password'?`<label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" autocomplete="email" maxlength="320" required value="${esc(authEmail)}">`:''}${mode!=='recovery'?`<label for="auth-password">${mode==='password'?'New password':'Password'}</label><input id="auth-password" name="password" type="password" autocomplete="${mode==='signin'?'current-password':'new-password'}" ${mode==='signin'?'':'minlength="12"'} maxlength="256" required>${mode==='signin'?'':'<p class="auth-help">At least 12 characters.</p>'}`:''}<div class="auth-notice" role="status">${esc(authMessage)}</div><button class="button primary" type="submit" ${authBusy?'disabled':''}>${authBusy?'Please wait…':{signin:'Sign in',signup:'Create account',recovery:'Send reset link',password:'Save new password'}[mode]}</button></form>`:`<div class="auth-notice" role="status">${esc(authMessage)}</div>`}${mode==='signin'&&auth.config.email?'<button class="button link" data-auth-action="recovery">Forgot password?</button>':''}${mode==='recovery'?'<button class="button link" data-auth-action="signin">Back to sign in</button>':''}${['signin','signup'].includes(mode)?`${auth.config.email?'<p class="auth-help">Email links must be opened in the same browser where you started.</p>':''}${externalFrontend?`<p class="auth-help">New to Ohm? Continue with GitHub to create your practice account.</p>`:'<button class="button link" data-auth-action="legacy">Continue with an existing ChatGPT account</button>'}`:''}<button class="button link" data-view="problems">Back to practice</button></section></div>`);
  }
  async function authAction(action){
    if(authBusy)return;
    if(['signin','signup','recovery','show-login'].includes(action)){authMode=action==='show-login'?'signin':action;showLogin=true;authMessage='';render();return;}
    authBusy=true;
    try{
      if(action==='resume'){await afterAuth();return;}
      await beforeAuth();authMessage='';
      if(action==='open-browser'){window.top.location.href=location.origin+accountPath;return;}
      if(action==='legacy'){if(externalFrontend)throw new Error('Use GitHub to sign in here.');auth?.legacy();window.top.location.href=getSession().signInUrl;return;}
      if(action==='connect-legacy'){if(externalFrontend)throw new Error('Account linking is not available here.');auth.keepExternal();window.top.location.href=getSession().signInUrl;return;}
      if(action==='github'){await auth.github();return;}
      if(action==='google'){await auth.google();return;}
      if(action==='cancel'){await auth.signOut();location.href=accountPath;location.reload();return;}
      if(['finish-new','finish-legacy'].includes(action)){
        if(action==='finish-legacy'&&externalFrontend)throw new Error('Account linking is not available here.');
        const session=getSession();
        await api('/api/auth/finish',{method:'POST',headers:{'X-CSRF-Token':session.csrfToken,'X-Ohm-External-Subject':session.pendingAccount?.subject},body:JSON.stringify({choice:action==='finish-new'?'new':'legacy',legacyId:session.pendingAccount?.legacy?.id})});
        await afterAuth();return;
      }
    }catch(e){authMessage=e.message;}finally{authBusy=false;render();}
  }
  function onInput(event){if(event.target.id==='auth-email')authEmail=event.target.value;}
  function onSubmit(event){if(event.target.id!=='auth-form')return false;event.preventDefault();if(authBusy)return true;const fields=new FormData(event.target),password=fields.get('password'),email=String(fields.get('email')||'').trim();void submitAuth(email,password);return true;}
  async function submitAuth(email,password){
    const mode=authMode,recovering=auth.recovery;authBusy=true;
    try{
      await beforeAuth({reauth:mode==='signin'});authMessage='';render();
      if(recovering){await auth.updatePassword(password);authMessage='Password updated. You can continue practicing.';showLogin=false;await afterAuth();}
      else if(mode==='recovery'){await auth.sendRecovery(email);authMessage='If this address has an account, a reset link will arrive shortly. Open it in this browser.';}
      else if(mode==='signup'){const data=await auth.signUp(email,password);if(data.session)await afterAuth();else authMessage='Check your email to confirm your account. Open the link in this browser, then return here.';}
      else{await auth.signIn(email,password);await afterAuth();}
    }catch(e){authMessage=e.message;}finally{authBusy=false;render();}
  }
  return {page,statusText,onClick,onInput,onSubmit};
}
