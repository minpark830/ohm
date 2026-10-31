import {describePhasor,fromPolar,operatePhasors} from './phasor-model.js?v=22c97c590ebdf290';

const operations={convert:'Convert A',add:'A + B',subtract:'A − B',multiply:'A × B',divide:'A ÷ B'};
const forms={rectangular:'Rectangular · real + j imaginary',polar:'Polar · magnitude ∠ degrees'};
const blankOperand=()=>({form:'rectangular',rectangular:{first:'',second:''},polar:{first:'',second:''}});
const defaults=()=>({operation:'convert',a:blankOperand(),b:blankOperand()});
const rule={convert:'The magnitude is the distance from the origin. atan2 keeps the phase in the correct quadrant.',add:'Add the real components and the imaginary components separately.',subtract:'Subtract B’s real and imaginary components from A’s.',multiply:'Multiply the magnitudes and add the phases.',divide:'Divide the magnitudes and subtract the phases. B must be nonzero.'};
const numberText=value=>Number(value.toPrecision(7)).toString();
export const rectangularText=p=>`${numberText(p.re)} ${p.im<0?'−':'+'} j${numberText(Math.abs(p.im))}`;
export const polarText=p=>p.angleDegrees===null?`${numberText(p.magnitude)} · phase undefined`:`${numberText(p.magnitude)} ∠ ${numberText(p.angleDegrees)}°`;

// Calculator inputs are separate from question data, drafts and account storage.
export function createPhasorTool({esc,parseNumber}){
 let state=defaults();
 const values=id=>state[id][state[id].form];
 const option=(key,label,current)=>`<option value="${esc(key)}"${key===current?' selected':''}>${esc(label)}</option>`;
 const select=(field,label,options,current)=>`<label class="ee-tool-select-label" for="ee-tool-${field}"><span>${esc(label)}</span><select id="ee-tool-${field}" data-ee-tool-field="${field}">${Object.entries(options).map(([key,text])=>option(key,text,current)).join('')}</select></label>`;
 function input(id,part,label,placeholder){const field=`phasor-${id}-${part}`,data=result(),invalid=data.kind==='error'&&data.field===field;return `<label class="ee-tool-number-label" for="ee-tool-${field}"><span>${esc(label)}</span><input id="ee-tool-${field}" data-ee-tool-field="${field}" type="text" inputmode="text" maxlength="64" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="ee-tool-number-help" aria-invalid="${invalid}"${invalid?' aria-errormessage="ee-tool-result"':''} value="${esc(values(id)[part])}" placeholder="${esc(placeholder)}"></label>`;}
 function operand(id){const polar=state[id].form==='polar';return `<fieldset class="ee-phasor-operand"><legend>Phasor ${id.toUpperCase()}</legend>${select(`phasor-${id}-form`,'Input form',forms,state[id].form)}<div class="ee-tool-pair">${input(id,'first',polar?'Magnitude · nonnegative':'Real component',polar?'e.g. 5':'e.g. 3')}${input(id,'second',polar?'Phase · degrees':'Imaginary component',polar?'e.g. 53.1301':'e.g. 4')}</div></fieldset>`;}
 function fieldsMarkup(){return `<div class="ee-phasor-intro"><p>Work with your own complex values. Choose a form, then enter its components.</p></div>${select('phasor-operation','Operation',operations,state.operation)}${operand('a')}${state.operation!=='convert'?operand('b'):''}<div class="ee-phasor-examples"><span>Try an example</span><div><button type="button" class="button" data-ee-tool-action="phasor-example" data-ee-tool-example="convert">3 + j4</button><button type="button" class="button" data-ee-tool-action="phasor-example" data-ee-tool-example="divide">10 ÷ (3 + j4)</button><button type="button" class="button" data-ee-tool-action="phasor-example" data-ee-tool-example="quadrant">−3 + j4</button></div></div>`;}
 function result(){
  let field=null;
  try{
   const operands={};let missing=false;
   for(const id of state.operation==='convert'?['a']:['a','b']){
    const current=values(id),numbers={};
    for(const part of ['first','second']){field=`phasor-${id}-${part}`;if(!current[part].trim()){missing=true;continue;}numbers[part]=parseNumber(current[part],{label:`${id.toUpperCase()} ${state[id].form==='polar'?(part==='first'?'magnitude':'phase in degrees'):(part==='first'?'real component':'imaginary component')}`,nonnegative:state[id].form==='polar'&&part==='first'});if(state[id].form==='polar'&&part==='second'&&Math.abs(numbers[part])>1e9)throw Error('Use a phase from −1,000,000,000° to 1,000,000,000°.');}
    if(Object.keys(numbers).length===2){field=null;operands[id]=state[id].form==='polar'?fromPolar(numbers.first,numbers.second):describePhasor({re:numbers.first,im:numbers.second});}
   }
   if(missing)return {kind:'empty'};
   field=null;
   if(state.operation==='divide'&&operands.b.magnitude===0){field='phasor-b-first';throw Error('Cannot divide by a zero phasor. Enter a nonzero B.');}
   const value=state.operation==='convert'?operands.a:operatePhasors(operands.a,operands.b,state.operation);
   return {kind:'ready',value,operands};
  }catch(error){return {kind:'error',field,message:error.message};}
 }
 function plot(p){
  const max=Math.max(Math.abs(p.re),Math.abs(p.im)),cx=140,cy=108,dx=max?p.re/max*72:0,dy=max?-p.im/max*72:0,x=cx+dx,y=cy+dy;
  const len=Math.hypot(dx,dy),ux=len?dx/len:0,uy=len?dy/len:0;
  const arrow=len?`<line class="ee-phasor-vector" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><polygon class="ee-phasor-arrow" points="${x},${y} ${x-ux*10-uy*4},${y-uy*10+ux*4} ${x-ux*10+uy*4},${y-uy*10-ux*4}"/>`:`<circle class="ee-phasor-arrow" cx="${cx}" cy="${cy}" r="4"/>`;
  return `<figure class="ee-phasor-plot"><svg viewBox="0 0 280 216" aria-hidden="true"><circle class="ee-phasor-guide" cx="${cx}" cy="${cy}" r="72"/><path class="ee-phasor-axis" d="M25 ${cy}H255 M${cx} 20V196"/><text class="ee-phasor-axis-name" x="253" y="126" text-anchor="end">Re</text><text class="ee-phasor-axis-name" x="150" y="22">Im</text>${max?`<path class="ee-phasor-projection" d="M${x} ${cy}V${y}H${cx}"/><text class="ee-phasor-scale" x="${cx+72}" y="${cy-8}" text-anchor="middle">${esc(numberText(max))}</text><text class="ee-phasor-scale" x="${cx-72}" y="${cy-8}" text-anchor="middle">${esc(numberText(-max))}</text>`:''}${arrow}</svg><figcaption>Result on the complex plane. Both axes use the same scale.${max?' The circle has radius '+esc(numberText(max))+'.':' Zero has no direction.'}</figcaption></figure>`;
 }
 function outputMarkup(data=result()){
  if(data.kind==='empty')return '<p class="ee-tool-empty">Enter both components of each visible phasor, or try an example. Use 0 for a zero component.</p>';
  if(data.kind==='error')return `<p class="ee-tool-error">${esc(data.message)}</p>`;
  return `<dl class="ee-tool-results ee-phasor-results"><div><dt>Rectangular result</dt><dd>${esc(rectangularText(data.value))}</dd></div><div><dt>Polar result · degrees</dt><dd>${esc(polarText(data.value))}</dd></div></dl>${data.value.angleDegrees===null?'<p class="ee-tool-rounding">Zero magnitude has no defined phase.</p>':''}${plot(data.value)}<p class="ee-phasor-rule">${esc(rule[state.operation])}</p><p class="ee-tool-rounding">7 significant digits; calculations use unrounded values.</p>`;
 }
 function methodMarkup(){return `<summary>Formula & assumptions</summary><pre>x + jy = M(cos θ + j sin θ)\nM = hypot(x, y)\nθ = atan2(y, x), converted to degrees\nj² = −1</pre><p>For sinusoidal signals, use one frequency, one time reference, and a consistent cosine convention: Re{X e^(jωt)}. Positive phase is counterclockwise. Do not mix peak and RMS amplitudes.</p><p>Add or subtract only quantities with matching units. Multiplication and division combine units algebraically; this calculator does not assign or convert physical units. Zero has undefined phase. Principal phases use (−180°, 180°].</p><p>Small floating-point residuals can occur. Nonzero numeric inputs range from 1e−100 to 1e100; zero is allowed; polar phase is limited to ±1e9 degrees. Each input form retains its own values when you switch forms.</p><p><a href="https://ocw.mit.edu/courses/es-1803-differential-equations-spring-2024/mites_1803_s24_complex_impedance.pdf" target="_blank" rel="noopener noreferrer">MIT: complex impedance and phasors ↗</a></p>`;}
 function onInput(field,value){const match=/^phasor-([ab])-(first|second)$/.exec(field);if(!match||match[1]==='b'&&state.operation==='convert')return false;values(match[1])[match[2]]=String(value).slice(0,64);return true;}
 function onChange(field,value){if(field==='phasor-operation'){if(Object.hasOwn(operations,value))state.operation=value;return true;}const match=/^phasor-([ab])-form$/.exec(field);if(!match)return false;if(Object.hasOwn(forms,value))state[match[1]].form=value;return true;}
 function example(key){if(!['convert','divide','quadrant'].includes(key))return false;state=defaults();state.a.rectangular={first:key==='quadrant'?'-3':key==='divide'?'10':'3',second:key==='divide'?'0':'4'};if(key==='divide'){state.operation='divide';state.b.rectangular={first:'3',second:'4'};}return true;}
 return {fieldsMarkup,result,outputMarkup,methodMarkup,onInput,onChange,example,clear(){state=defaults();},get state(){return structuredClone(state);}};
}
