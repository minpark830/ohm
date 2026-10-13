// Browser calls only Ohm's authenticated API; runner secrets stay on the server.
export function createExecutionClient({api}){
 if(typeof api!=='function')throw new Error('An Ohm API client is required.');
 const operations=new Map();
 return {
  async capabilities(){const value=await api('/api/execution/capabilities');return {available:value?.available===true,hdl:value?.hdl===true,spice:value?.spice===true,reason:typeof value?.reason==='string'?value.reason.slice(0,500):''};},
  async run(job,{signal}={}){
   const key=JSON.stringify(job),now=Date.now();for(const [k,v] of operations)if(v.until<now)operations.delete(k);
   if(!operations.has(key)){if(operations.size>=16)operations.delete(operations.keys().next().value);operations.set(key,{id:crypto.randomUUID(),until:now+120000});}
   const operation=operations.get(key);
   try{const result=await api('/api/account/execution/run',{method:'POST',body:JSON.stringify({...job,operationId:operation.id}),signal});if(operations.get(key)===operation)operations.delete(key);return result;}
   catch(error){if(error.status&&error.status<500&&![408,429].includes(error.status)&&operations.get(key)===operation)operations.delete(key);throw error;}
  }
 };
}
