// The Pages build changes externalFrontend to true in its copied output. The
// hosted application retains its same-origin accounts and owner tools.
export const HOSTING=Object.freeze({externalFrontend:true,apiOrigin:'https://ohm-ee-practice.minwoopark2016.chatgpt.site'});

export function hostedUrl(route='account'){
  return `${HOSTING.apiOrigin}/#${route}`;
}

function queryRoute(path,base,required,optional={}){
 if(typeof path!=='string'||path.length>8192||path.includes('#')||path.split('?')[0]!==base)return false;
 const query=path.includes('?')?path.slice(path.indexOf('?')+1):'',params=new URLSearchParams(query),keys=[...params.keys()];
 if(keys.length!==new Set(keys).size||keys.some(k=>!Object.hasOwn(required,k)&&!Object.hasOwn(optional,k)))return false;
 for(const [name,check] of Object.entries(required))if(!params.has(name)||!check(params.get(name)))return false;
 for(const [name,check] of Object.entries(optional))if(params.has(name)&&!check(params.get(name)))return false;
 return true;
}
const positiveQuery=value=>/^[1-9]\d{0,14}$/.test(value)&&Number.isSafeInteger(Number(value));
const weekQuery=value=>/^\d{4}-\d{2}-\d{2}$/.test(value);

function routeKind(path,method='GET'){
  if(typeof path!=='string')return null;
  const verb=String(method).toUpperCase();
  if(verb==='GET'&&/^\/api\/challenges\/(archives|ratings)$/.test(path))return 'public';
  if(verb==='GET'&&queryRoute(path,'/api/discussions',{problem:positiveQuery,version:positiveQuery},{after:v=>/^\d{1,15}$/.test(v)&&Number.isSafeInteger(Number(v)),parent:positiveQuery,sort:v=>['oldest','newest','helpful'].includes(v),kind:v=>['all','solution','question'].includes(v),q:v=>v.trim().length<=100}))return 'public';
  if(verb==='GET'&&queryRoute(path,'/api/account/activity',{},{days:v=>['182','364'].includes(v)}))return 'account';
  if(verb==='GET'&&queryRoute(path,'/api/account/submissions',{problem:positiveQuery},{limit:v=>positiveQuery(v)&&Number(v)<=50,cursor:v=>/^[A-Za-z0-9_-]{1,4096}$/.test(v)}))return 'account';
  if(verb==='GET'&&queryRoute(path,'/api/account/submission',{problem:positiveQuery,id:v=>/^[^\u0000-\u001f\u007f]{1,256}$/.test(v)}))return 'account';
  if(path==='/api/account/discussions/helpful'&&['GET','PUT'].includes(verb)||path==='/api/account/challenges/rating'&&['GET','PUT'].includes(verb)||verb==='POST'&&path==='/api/account/challenges/upsolve'||verb==='GET'&&queryRoute(path,'/api/account/challenges/upsolve',{week:weekQuery}))return 'account';
  if(verb==='GET'&&(/^\/api\/(health|execution\/capabilities)$/.test(path)||/^\/api\/challenges(?:\/leaderboard)?(?:\?week=\d{4}-\d{2}-\d{2})?$/.test(path)||/^\/api\/discussions\?problem=[1-9]\d*&version=[1-9]\d*(?:&after=[1-9]\d*)?$/.test(path)))return 'public';
  if(verb==='GET'&&/^\/api\/variations\?kind=(divider|rc|opamp|filter|buck|adc)&seed=\d{1,10}$/.test(path)||verb==='POST'&&path==='/api/variations/check')return 'public';
  if(verb==='GET'&&/^\/api\/account\/export(?:\?table=(learner_accounts|auth_identities|learner_state|learner_solved|learner_attempts|learner_imports|learner_interviews|learner_assistance|learner_labs|community_profiles|discussion_posts|discussion_votes|challenge_runs|challenge_attempts|challenge_upsolve_attempts|challenge_rating_preferences|execution_requests)&after=\d+)?$/.test(path))return 'account';
  if(/^\/api\/account\/labs\/(debugging|design|diagnostic|cases|circuit|fullhdl|collections|notebook)$/.test(path)&&['GET','PUT'].includes(verb))return 'account';
  if(/^\/api\/account\/community-profile$/.test(path)&&['GET','PUT'].includes(verb)||/^\/api\/account\/discussions$/.test(path)&&['GET','POST'].includes(verb)||path==='/api/account/discussions/remove'&&verb==='POST'||/^\/api\/account\/challenges(?:\?week=\d{4}-\d{2}-\d{2})?$/.test(path)&&verb==='GET'||/^\/api\/account\/challenges\/(join|submit|finish)$/.test(path)&&verb==='POST'||path==='/api/account/execution/run'&&verb==='POST')return 'account';
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
