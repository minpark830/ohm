// The Pages build changes guestOnly to true in its copied output. The hosted
// application keeps its existing same-origin accounts and owner tools.
export const HOSTING=Object.freeze({guestOnly:true,apiOrigin:'https://ohm-ee-practice.minwoopark2016.chatgpt.site'});

export function hostedUrl(route='account'){
  return `${HOSTING.apiOrigin}/#${route}`;
}

// Public Pages requests are deliberately limited to the published library and
// anonymous answer checking. Private endpoints fail before any network call.
export function requestTarget(path,{method='GET'}={},hosting=HOSTING){
  if(!hosting.guestOnly)return path;
  if(typeof path!=='string')throw new Error('This request is unavailable in the guest workspace.');
  const verb=String(method).toUpperCase();
  const allowed=verb==='GET'&&(
    path==='/api/problems'||/^\/api\/problems\/[1-9]\d*\/(hints|solution)(\?version=[1-9]\d*)?$/.test(path)
  )||verb==='POST'&&/^\/api\/problems\/[1-9]\d*\/check$/.test(path);
  if(!allowed)throw new Error('Open hosted Ohm to use accounts, reports, or owner tools.');
  return hosting.apiOrigin+path.replace('/api/problems','/api/public/problems');
}
