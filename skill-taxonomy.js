// Stable names for equivalent spellings only. Device assumptions, operating
// regions and different concepts remain separate; unknown owner tags survive.
export const skillConcepts=Object.freeze([
 ['kcl','KCL',[],'Circuit analysis'],
 ['kvl','KVL',[],'Circuit analysis'],
 ['nodal-analysis','Nodal analysis',[],'Circuit analysis'],
 ['mesh-analysis','Mesh analysis',[],'Circuit analysis'],
 ['thevenin-equivalent','Thévenin equivalent',['Thevenin equivalent'],'Circuit analysis'],
 ['thevenin-resistance','Thévenin resistance',['Thevenin resistance'],'Circuit analysis'],
 ['norton-equivalent','Norton equivalent',[],'Circuit analysis'],
 ['ac-phasors','AC / phasors',['AC phasors'],'Circuit analysis'],
 ['time-constant','Time constant',[],'RC circuits'],
 ['first-order','First order',['First-order'],'RC circuits'],
 ['filters','Filters',[],'RC circuits'],
 ['initial-conditions','Initial conditions',[],'RC circuits'],
 ['small-signal','Small signal',['Small-signal'],'BJT'],
 ['finite-beta','Finite beta',[],'BJT'],
 ['hybrid-pi-model','Hybrid-π model',['Hybrid-pi model','Hybrid pi model'],'BJT'],
 ['differential-pair','Differential pair',[],'BJT'],
 ['operating-region','Operating region',[],'MOSFET'],
 ['body-effect','Body effect',[],'MOSFET'],
 ['gate-drive','Gate drive',[],'MOSFET'],
 ['square-law-model','Square-law model',[],'MOSFET'],
 ['boolean-logic','Boolean logic',[],'Digital logic'],
 ['static-timing-analysis','Static timing analysis',[],'Digital logic'],
 ['clock-domain-crossing','Clock-domain crossing',['Clock domain crossing'],'Digital logic'],
 ['twos-complement','Two’s complement',["Two's complement"],'Digital logic'],
 ['finite-state-machines','Finite state machines',['Finite-state machines'],'Digital logic'],
 ['multiplexers','Multiplexers',['Multiplexer'],'Digital logic'],
 ['setup-and-hold','Setup and hold',['Setup / hold'],'Digital logic'],
 ['verilog','Verilog',[],'HDL'],
 ['clock-enable','Clock enable',['Clock enables'],'HDL'],
 ['nonblocking-assignments','Nonblocking assignments',['Non-blocking assignments'],'HDL'],
 ['concatenation','Concatenation',['Concatenations'],'HDL'],
 ['ready-and-valid','Ready and valid',[],'HDL']
].map(([id,label,aliases,topic])=>Object.freeze({id,label,aliases:Object.freeze(aliases),topic})));
const byLabel=new Map(),byAlias=new Map();
for(const concept of skillConcepts){byLabel.set(concept.label,concept);for(const alias of concept.aliases)byAlias.set(alias,concept.label);}
export const skillGroups=Object.freeze(['All topics','Circuit analysis','RC circuits','BJT','MOSFET','Digital logic','HDL','Other skills']);
export function cleanSkillLabel(value){
 if(typeof value!=='string')return '';
 const text=value.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,'').normalize('NFC').trim();
 let result='';for(const character of text){if(result.length+character.length>80)break;result+=character;}return result;
}
export function canonicalSkill(value){const label=cleanSkillLabel(value);return byAlias.get(label)||label;}
export const skillConceptFor=value=>byLabel.get(canonicalSkill(value))||null;
export const skillSearchText=value=>cleanSkillLabel(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/π/g,'pi').replace(/[’‘]/g,"'").replace(/[‐‑–—-]/g,' ').toLowerCase();
export function skillSearchTerms(value){const label=canonicalSkill(value),concept=byLabel.get(label);return [label,...(concept?.aliases||[])].map(skillSearchText).join(' ');}
