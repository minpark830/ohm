// Bound both the response headers and body. Caller-owned cancellation keeps
// its own lifetime (for example, the native execution and history readers).
export async function fetchJSON(target,init={}, {fetcher=fetch,timeoutMs=20000}={}) {
 const controller=init.signal?null:new AbortController();
 const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
 try {
  let response,data;
  try { response=await fetcher(target,{...init,...(controller?{signal:controller.signal}:{})}); }
  catch(error) { if(['TimeoutError','AbortError'].includes(error.name))throw new Error('The connection is taking longer than expected. Please try again.');throw error; }
  try { data=await response.json(); }
  catch(error) { throw new Error(['TimeoutError','AbortError'].includes(error.name)?'The connection is taking longer than expected. Please try again.':'The server could not complete the request. Please try again.'); }
  if(!response.ok)throw Object.assign(new Error(data?.error||'The request failed.'),{status:response.status,data});
  return data;
 } finally { if(timer!==null)clearTimeout(timer); }
}
