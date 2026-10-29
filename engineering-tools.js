// General, browser-only calculations. No problem values, grading data, API
// calls or browser storage participate in these tools.
export const engineeringPrefixes=Object.freeze([
 {exponent:-12,symbol:'p',name:'pico'},{exponent:-9,symbol:'n',name:'nano'},
 {exponent:-6,symbol:'µ',name:'micro'},{exponent:-3,symbol:'m',name:'milli'},
 {exponent:0,symbol:'',name:'none'},{exponent:3,symbol:'k',name:'kilo'},
 {exponent:6,symbol:'M',name:'mega'},{exponent:9,symbol:'G',name:'giga'},
 {exponent:12,symbol:'T',name:'tera'}
].map(Object.freeze));
const prefixMap=new Map(engineeringPrefixes.map(prefix=>[String(prefix.exponent),prefix]));
const fallbackEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decimal=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d{1,3}))?$/;

export function parseToolNumber(raw,{positive=false,nonnegative=false,label='Value'}={}){
 if(typeof raw!=='string'||raw.length>64)throw Error(`${label}: enter a decimal or scientific-notation number.`);
 const text=raw.trim(),match=decimal.exec(text);
 if(!match||match[1]!==undefined&&Math.abs(Number(match[1]))>100)throw Error(`${label}: use a number such as 4.7 or 1e-6, with an exponent from −100 to 100.`);
 const value=Number(text),magnitude=Math.abs(value);
 if(!Number.isFinite(value)||magnitude>1e100||value!==0&&magnitude<1e-100)throw Error(`${label}: use a magnitude from 1e−100 to 1e100, or zero.`);
 if(positive&&value<=0)throw Error(`${label}: enter a value greater than zero.`);
 if(nonnegative&&value<0)throw Error(`${label}: negative values are outside this tool’s model.`);
 return Object.is(value,-0)?0:value;
}
function finite(value,label='Result'){
 if(!Number.isFinite(value)||value!==0&&(Math.abs(value)<1e-250||Math.abs(value)>1e250))throw Error(`${label} is outside this tool’s numeric range. Use less extreme values.`);
 return Object.is(value,-0)?0:value;
}
function nonnegative(value,label){if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw Error(`${label} must be a finite, nonnegative number.`);return value;}
function prefix(exponent){const value=prefixMap.get(String(exponent));if(!value)throw Error('Choose one of the listed decimal prefixes.');return value;}
export function convertEngineeringPrefix(value,from,to){
 if(typeof value!=='number'||!Number.isFinite(value))throw Error('Enter a finite value.');
 return finite(value*10**(prefix(from).exponent-prefix(to).exponent));
}
export function resistorPair(r1,r2){
 nonnegative(r1,'R1');nonnegative(r2,'R2');
 // The min/max form avoids an unnecessary product overflow.
 const low=Math.min(r1,r2),high=Math.max(r1,r2);
 return {series:finite(r1+r2),parallel:low===0?0:finite(low/(1+low/high))};
}
export function rcToolValues(resistance,capacitance){
 if(typeof resistance!=='number'||typeof capacitance!=='number'||!Number.isFinite(resistance)||!Number.isFinite(capacitance)||resistance<=0||capacitance<=0)throw Error('R and C must both be finite and greater than zero.');
 const tau=finite(resistance*capacitance);
 if(tau===0)throw Error('The time constant is outside this tool’s numeric range.');
 return {tau,rise:finite(Math.log(9)*tau),cutoff:finite(1/(2*Math.PI*tau))};
}
export function decibelToolValue(value,{kind='amplitude',direction='ratio-to-db'}={}){
 if(!['amplitude','power'].includes(kind)||!['ratio-to-db','db-to-ratio'].includes(direction)||typeof value!=='number'||!Number.isFinite(value))throw Error('Choose a valid decibel conversion.');
 const factor=kind==='amplitude'?20:10;
 if(direction==='ratio-to-db'){
  if(value<=0)throw Error('The ratio magnitude must be greater than zero.');
  return finite(factor*Math.log10(value));
 }
 if(Math.abs(value)>1000)throw Error('Use a dB value from −1,000 to 1,000.');
 return finite(10**(value/factor));
}
export function engineeringFormat(value,unit=''){
 finite(value);const abs=Math.abs(value);
 if(!abs)return `0${unit?' '+unit:''}`;
 if(abs<1e-12||abs>=1e15)return `${Number(value.toPrecision(7)).toExponential().replace(/\.0+(?=e)/,'')}${unit?' '+unit:''}`;
 const exponent=Math.max(-12,Math.min(12,Math.floor(Math.log10(abs)/3)*3));
 return `${Number((value/10**exponent).toPrecision(7))}${unit?' '+prefix(exponent).symbol+unit:exponent?' × 10^'+exponent:''}`;
}

const toolNames=Object.freeze({resistors:'Two resistors',rc:'RC time & cutoff',decibels:'Ratio ↔ decibels',prefixes:'SI prefix conversion'});
const defaults=()=>({selected:'resistors',values:{
 resistors:{r1:'',r1Prefix:'3',r2:'',r2Prefix:'3'},
 rc:{r:'',rPrefix:'3',c:'',cPrefix:'-9'},
 decibels:{value:'',kind:'amplitude',direction:'ratio-to-db'},
 prefixes:{value:'',unit:'V',from:'-3',to:'0'}
}});
const resistorPrefixes=['0','3','6'],capacitorPrefixes=['-12','-9','-6','-3','0'],allPrefixes=engineeringPrefixes.map(p=>String(p.exponent));
const selectorValues={resistors:{r1Prefix:resistorPrefixes,r2Prefix:resistorPrefixes},rc:{rPrefix:resistorPrefixes,cPrefix:capacitorPrefixes},decibels:{kind:['amplitude','power'],direction:['ratio-to-db','db-to-ratio']},prefixes:{unit:['V','A','Ω','F','s','Hz'],from:allPrefixes,to:allPrefixes}};
const numericFields={resistors:['r1','r2'],rc:['r','c'],decibels:['value'],prefixes:['value']};
const labels={r1:'R1',r2:'R2',r:'R',c:'C',value:'Value'};
const formulas={resistors:'Rseries = R1 + R2\nRparallel = R1R2 / (R1 + R2)',rc:'τ = RC\nt10–90 = ln(9) × τ\nfc = 1 / (2πRC)',decibels:'Amplitude: dB = 20 log10(ratio)\nPower: dB = 10 log10(ratio)',prefixes:'new value = value × 10^(from exponent − to exponent)'};
const notes={resistors:'Ideal, nonnegative resistors. A zero-ohm resistor shorts a parallel pair. These are equivalent resistances, without tolerance or power checks.',rc:'One ideal first-order RC low-pass, with no additional loading. R is the resistance seen by C. Rise time spans 10% to 90% of the total step; cutoff is relative to the DC gain.',decibels:'Use ratio magnitudes, with consistent peak or RMS conventions. A voltage/current ratio describes the same power gain only when the compared impedances are equal. dB alone is a ratio, not an absolute dBm level.',prefixes:'Prefixes change scale within the same unit. Case matters: m means milli and M means mega. This does not convert between different physical dimensions.'};

export function createEngineeringTools({esc=fallbackEscape}={}){
 let state=defaults();
 const selectedValues=()=>state.values[state.selected];
 const option=(value,label,current)=>`<option value="${esc(value)}"${value===current?' selected':''}>${esc(label)}</option>`;
 function select(field,label,values,current){return `<label class="ee-tool-select-label" for="ee-tool-${field}"><span>${esc(label)}</span><select id="ee-tool-${field}" data-ee-tool-field="${field}">${values.map(([value,text])=>option(value,text,current)).join('')}</select></label>`;}
 const prefixOptions=(exponents,unit)=>exponents.map(exponent=>[exponent,`${prefix(exponent).symbol}${unit} · 10^${exponent}`]);
 function number(field,label,value,placeholder){const validation=result(),invalid=validation.kind==='error'&&validation.field===field;return `<label class="ee-tool-number-label" for="ee-tool-${field}"><span>${esc(label)}</span><input type="text" inputmode="text" autocapitalize="off" spellcheck="false" autocomplete="off" id="ee-tool-${field}" data-ee-tool-field="${field}" maxlength="64" aria-describedby="ee-tool-number-help" aria-invalid="${invalid}"${invalid?' aria-errormessage="ee-tool-result"':''} value="${esc(value)}" placeholder="${esc(placeholder)}"></label>`;}
 function fieldsMarkup(){const value=selectedValues();
  if(state.selected==='resistors')return `<div class="ee-tool-pair">${number('r1','R1',value.r1,'e.g. 4.7')}${select('r1Prefix','R1 unit',prefixOptions(resistorPrefixes,'Ω'),value.r1Prefix)}</div><div class="ee-tool-pair">${number('r2','R2',value.r2,'e.g. 10')}${select('r2Prefix','R2 unit',prefixOptions(resistorPrefixes,'Ω'),value.r2Prefix)}</div>`;
  if(state.selected==='rc')return `<div class="ee-tool-pair">${number('r','Resistance R',value.r,'e.g. 10')}${select('rPrefix','Resistance unit',prefixOptions(resistorPrefixes,'Ω'),value.rPrefix)}</div><div class="ee-tool-pair">${number('c','Capacitance C',value.c,'e.g. 100')}${select('cPrefix','Capacitance unit',prefixOptions(capacitorPrefixes,'F'),value.cPrefix)}</div>`;
  if(state.selected==='decibels')return `<div class="ee-tool-select-grid">${select('kind','Ratio type',[['amplitude','Amplitude magnitude · 20 log10'],['power','Power · 10 log10']],value.kind)}${select('direction','Convert from',[['ratio-to-db','Ratio to dB'],['db-to-ratio','dB to ratio']],value.direction)}</div>${number('value',value.direction==='ratio-to-db'?'Ratio magnitude · output / input':'Decibels · dB',value.value,value.direction==='ratio-to-db'?'e.g. 2':'e.g. 6.0206')}`;
  const choices=allPrefixes.map(exponent=>[exponent,`${prefix(exponent).name}${prefix(exponent).symbol?' ('+prefix(exponent).symbol+')':''} · 10^${exponent}`]);
  return `${number('value','Value',value.value,'e.g. 2.5')}<div class="ee-tool-select-grid">${select('unit','Physical unit',selectorValues.prefixes.unit.map(unit=>[unit,unit]),value.unit)}${select('from','From prefix',choices,value.from)}${select('to','To prefix',choices,value.to)}</div>`;
 }
 function result(){
  const value=selectedValues(),numbers={};let missing=false,field=null;
  try{
   for(const key of numericFields[state.selected]){field=key;if(!value[key].trim()){missing=true;continue;}numbers[key]=parseToolNumber(value[key],{label:labels[key],positive:state.selected==='rc'||state.selected==='decibels'&&value.direction==='ratio-to-db',nonnegative:state.selected==='resistors'});}
   if(missing)return {kind:'empty',rows:[]};
   field=null;
   if(state.selected==='resistors'){const r=resistorPair(convertEngineeringPrefix(numbers.r1,value.r1Prefix,0),convertEngineeringPrefix(numbers.r2,value.r2Prefix,0));return {kind:'ready',rows:[['Series',engineeringFormat(r.series,'Ω')],['Parallel',engineeringFormat(r.parallel,'Ω')]]};}
   if(state.selected==='rc'){const r=rcToolValues(convertEngineeringPrefix(numbers.r,value.rPrefix,0),convertEngineeringPrefix(numbers.c,value.cPrefix,0));return {kind:'ready',rows:[['Time constant τ',engineeringFormat(r.tau,'s')],['10–90% rise time',engineeringFormat(r.rise,'s')],['Low-pass cutoff fc',engineeringFormat(r.cutoff,'Hz')]]};}
   if(state.selected==='decibels'){const converted=decibelToolValue(numbers.value,value);return {kind:'ready',rows:[[value.direction==='ratio-to-db'?'Decibels':'Ratio magnitude',value.direction==='ratio-to-db'?`${Number(converted.toPrecision(7))} dB`:Number(converted.toPrecision(7)).toString()]]};}
   const converted=convertEngineeringPrefix(numbers.value,value.from,value.to),unit=prefix(value.to).symbol+value.unit;
   return {kind:'ready',rows:[['Converted value',`${Number(converted.toPrecision(7))} ${unit}`],['Value in base unit',`${Number(convertEngineeringPrefix(numbers.value,value.from,0).toPrecision(7))} ${value.unit}`]]};
  }catch(error){return {kind:'error',field,message:error.message,rows:[]};}
 }
 function outputMarkup(data=result()){
  if(data.kind==='empty')return '<p class="ee-tool-empty">Enter the values above to calculate. Scientific notation such as 1e-6 is supported.</p>';
  if(data.kind==='error')return `<p class="ee-tool-error">${esc(data.message)}</p>`;
  return `<dl class="ee-tool-results">${data.rows.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="ee-tool-rounding">Displayed results use up to 7 significant digits.</p>`;
 }
 function methodMarkup(){return `<summary>Formula & assumptions</summary><pre>${esc(formulas[state.selected])}</pre><p>${esc(notes[state.selected])}</p><p><a href="https://www.nist.gov/pml/owm/metric-si-prefixes" target="_blank" rel="noopener noreferrer">NIST prefix definitions ↗</a>${state.selected==='decibels'?' · <a href="https://www.analog.com/en/resources/glossary/db.html" target="_blank" rel="noopener noreferrer">Decibel reference ↗</a>':''}</p>`;}
 function markup(){return `<section class="ee-tools" data-ee-tools aria-labelledby="ee-tool-title"><div class="ee-tool-intro"><h3 id="ee-tool-title">Check a calculation.</h3><p>General tools for your own values. They do not reveal or submit this problem’s answer.</p></div><label class="ee-tool-selector" for="ee-tool-kind"><span>Calculation</span><select id="ee-tool-kind" data-ee-tool-kind>${Object.entries(toolNames).map(([kind,name])=>option(kind,name,state.selected)).join('')}</select></label><div class="ee-tool-fields" data-ee-tool-fields>${fieldsMarkup()}</div><p id="ee-tool-number-help" class="ee-tool-help">Use numbers only; choose units separately. Expressions, pasted unit text and code are not evaluated.</p><div id="ee-tool-result" class="ee-tool-output" role="status" aria-live="polite" aria-atomic="true" data-ee-tool-result>${outputMarkup()}</div><details class="ee-tool-method">${methodMarkup()}</details><button type="button" class="button ee-tool-clear" data-ee-tool-action="clear-current">Clear this calculation</button><p class="ee-tool-privacy">Values stay in this tab’s memory. They are not saved to your account, browser storage or problem draft.</p></section>`;}
 function update(root,{fields=false}={}){
  if(!root)return;
  if(fields){const host=root.querySelector('[data-ee-tool-fields]');if(host)host.innerHTML=fieldsMarkup();const method=root.querySelector('.ee-tool-method');if(method)method.innerHTML=methodMarkup();}
  const data=result(),output=root.querySelector('[data-ee-tool-result]');if(output)output.innerHTML=outputMarkup(data);
  for(const input of root.querySelectorAll('input[data-ee-tool-field]')){const invalid=data.kind==='error'&&data.field===input.dataset.eeToolField;input.setAttribute('aria-invalid',String(invalid));if(invalid)input.setAttribute('aria-errormessage','ee-tool-result');else input.removeAttribute('aria-errormessage');}
 }
 function onInput(event){const target=event.target,field=target?.dataset?.eeToolField;if(!numericFields[state.selected].includes(field))return false;const root=target.closest?.('[data-ee-tools]');if(!root)return false;selectedValues()[field]=String(target.value).slice(0,64);update(root);return true;}
 function onChange(event){const target=event.target,root=target?.closest?.('[data-ee-tools]');if(!root)return false;
  if(target.dataset?.eeToolKind!==undefined){if(Object.hasOwn(toolNames,target.value)){state.selected=target.value;update(root,{fields:true});}return true;}
  const field=target.dataset?.eeToolField,allowed=selectorValues[state.selected];if(!Object.hasOwn(allowed,field))return false;
  if(allowed[field].includes(target.value)){selectedValues()[field]=target.value;update(root,{fields:state.selected==='decibels'&&field==='direction'});}else{target.value=selectedValues()[field];}return true;
 }
 function onClick(event){const action=event.target?.closest?.('[data-ee-tool-action]');if(!action)return false;if(action.dataset.eeToolAction==='clear-current'){state.values[state.selected]=defaults().values[state.selected];update(action.closest('[data-ee-tools]'),{fields:true});}return true;}
 function clear(){state=defaults();}
 return {markup,onInput,onChange,onClick,clear,reset:clear,get state(){return structuredClone(state);}};
}
