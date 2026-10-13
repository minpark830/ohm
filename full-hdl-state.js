const ids=['fifo','uart-tx','round-robin','ready-valid'];
export function emptyFullHDLState(){return {schemaVersion:1,selected:'fifo',codes:{}};}
export function normalizeFullHDLState(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return emptyFullHDLState();
 const state=emptyFullHDLState();if(ids.includes(input.selected))state.selected=input.selected;
 if(input.codes&&typeof input.codes==='object'&&!Array.isArray(input.codes))for(const id of ids){const code=input.codes[id];if(code===undefined)continue;if(typeof code!=='string'||code.length>24576)throw new Error('Keep each module draft within 24 KB.');state.codes[id]=code;}
 if(JSON.stringify(state).length>85000)throw new Error('Saved HDL drafts exceed the workspace limit. Download or shorten an older draft before saving.');
 // Compiler results, pass flags, hidden expectations, and scores are never
 // restored from editable browser/account workspace documents.
 return state;
}
