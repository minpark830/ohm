// The Pages build changes externalFrontend to true in its copied output. The
// hosted application retains its same-origin accounts and owner tools.
export const HOSTING=Object.freeze({externalFrontend:true,apiOrigin:'https://ohm-ee-practice.minwoopark2016.chatgpt.site'});

export function hostedUrl(route='account'){
  return `${HOSTING.apiOrigin}/#${route}`;
}

function routeKind(path,method='GET'){
  if(typeof path!=='string')return null;
  const verb=String(method).toUpperCase();
  if(verb==='GET'&&/^\/api\/variations\?kind=(divider|rc|opamp|filter|buck|adc)&seed=\d{1,10}$/.test(path)||verb==='POST'&&path==='/api/variations/check')return 'public';
  if(verb==='GET'&&/^\/api\/account\/export(?:\?table=(learner_accounts|auth_identities|learner_state|learner_solved|learner_attempts|learner_imports|learner_interviews|learner_assistance|learner_labs)&after=\d+)?$/.test(path))return 'account';
  if(/^\/api\/account\/labs\/(debugging|design)$/.test(path)&&['GET','PUT'].includes(verb))return 'account';
  if(path==='/api/account/interviews'&&['GET','PUT'].includes(verb))return 'account';
  if(verb==='GET'&&(path==='/api/problems'||/^\/api\/problems\/[1-9]\d*\/(hints|solution)(\?version=[1-9]\d*)?$/.test(path))||verb==='POST'&&/^\/api\/problems\/[1-9]\d*\/check$/.test(path))return 'public';
  const accountRoutes={
    '/api/auth/config':'GET','/api/session':'GET','/api/auth/finish':'POST',
    '/api/account/progress':'GET','/api/account/state':'PUT',
    '/api/account/submit':'POST','/api/account/import':'POST','/api/account/assistance':'POST','/api/account/delete':'POST'
  };
  return Object.hasOwn(accountRoutes,path)&&accountRoutes[path]===verb?'account':null;
}

export function usesAccountAuth(path,options={},hosting=HOSTING){
  return hosting.externalFrontend?routeKind(path,options.method)==='account'&&path!=='/api/auth/config':path.startsWith('/api/');
}

export function requestTarget(path,options={},hosting=HOSTING){
  if(!hosting.externalFrontend)return path;
  const kind=routeKind(path,options.method);
  if(!kind)throw new Error('This request is unavailable from this website.');
  return hosting.apiOrigin+path.replace('/api/',kind==='public'?'/api/public/':'/api/pages/');
}

export function requestOptions(path,options={},authHeaders={},hosting=HOSTING){
  if(!hosting.externalFrontend)return {...options,credentials:'same-origin',headers:{...authHeaders,...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}};
  const kind=routeKind(path,options.method);
  if(!kind)throw new Error('This request is unavailable from this website.');
  const headers={...(options.body?{'Content-Type':'application/json'}:{})};
  if(kind==='account'&&path!=='/api/auth/config'){
    // Only the auth client supplies the provider/token. Callers may bind a
    // request to an account or confirmation subject, never alter its identity.
    for(const [key,value] of new Headers(authHeaders))if(['x-ohm-auth-provider','x-ohm-access-token'].includes(key))headers[key]=value;
    const bindingHeader=path==='/api/auth/finish'?'x-ohm-external-subject':path.startsWith('/api/account/')?'x-ohm-account-id':null;
    for(const [key,value] of new Headers(options.headers))if(key===bindingHeader)headers[key]=value;
  }
  return {...options,credentials:'omit',mode:'cors',redirect:'error',referrerPolicy:'no-referrer',headers};
}
