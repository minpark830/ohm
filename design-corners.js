import {designChallenge,evaluateDesign,normalizeDesignValues} from './design-model.js?v=ceacf964d1420d5c';

// Explicit exercise envelopes, not guaranteed characterizations of a named part.
// Interval endpoints include independent component errors. Common ambient temperature
// is swept separately; the drift magnitude is bounded by the stated absolute TCR.
export const designCornerModels={
 divider:{conditions:['Supply 11.64–12.36 V (±3%)','Load 8–12 kΩ','Resistors ±1%; |TCR| ≤ 100 ppm/°C','Ambient −25 to +75 °C; nominal 25 °C'],cost:'Two 1% resistors. Prices and physical package sizes are not modeled.'},
 rc:{conditions:['Step 4.75–5.25 V (±5%)','Capacitor leakage modeled as 1–2 MΩ to ground','R ±1%, C ±2%; |TCR| ≤ 100 and 50 ppm/°C','Ambient −25 to +75 °C; t90 refers to each corner’s final voltage'],cost:'One 1% resistor and one 2% capacitor. Larger C can require more board area; no price or package is assumed.'},
 filter:{conditions:['Input 0.9–1.1 V RMS; source resistance 50–100 Ω','Output load 1–10 MΩ','R ±1%, C ±2%; |TCR| ≤ 50 and 30 ppm/°C','Ambient −25 to +75 °C; gain is measured from the ideal source'],cost:'One 1% resistor and one 2% capacitor. Tighter capacitance tolerance may restrict part choices; no prices are assumed.'},
 opamp:{conditions:['Supply rails ±4.90 to ±5.10 V; required rail clearance 0.5 V','Peak input 0.45 V; output load 10–100 kΩ','Precision resistors ±0.1%; |TCR| ≤ 25 ppm/°C','Ambient −25 to +75 °C; output-current budget 5 mA','Separate bandwidth estimate: single dominant pole, fixed 1 MHz gain-bandwidth product'],cost:'Two 0.1% feedback resistors and an amplifier. Precision, noise and device specifications affect cost; no price ranking is claimed.'},
 bjt:{conditions:['LED supply 4.95–5.05 V; GPIO 3.201–3.399 V','LED drop 1.85–2.15 V; VBE 0.60–0.80 V; VCE(sat) 0.15–0.25 V','Resistors ±1%; |TCR| ≤ 100 ppm/°C','Ambient −25 to +75 °C; voltage-drop ranges include temperature/device spread'],cost:'Two 1% resistors, LED and transistor. More base drive consumes GPIO current; no device or price guarantee is implied.'}
};
const product=axes=>axes.reduce((rows,[name,values])=>rows.flatMap(row=>values.map(value=>({...row,[name]:value}))),[{}]);
const range=(lo,hi)=>[lo,hi];
const resistor=(nominal,error,temp,ppm)=>nominal*(1+error*(.01+Math.abs(temp-25)*ppm*1e-6));
const check=(label,value,unit,min,max)=>({label,value,unit,min,max,pass:(min===null||value>=min-1e-10)&&(max===null||value<=max+1e-10)});
function cases(id,v){
 const axes=[['ambient',[-25,25,75]],['a',[-1,1]],['b',[-1,1]]];
 if(id==='divider')axes.push(['supply',range(11.64,12.36)],['load',range(8,12)]);
 if(id==='rc')axes.push(['supply',range(4.75,5.25)],['load',range(1000,2000)]);
 if(id==='filter')axes.push(['amplitude',range(.9,1.1)],['source',range(.05,.1)],['load',range(1000,10000)]);
 if(id==='opamp')axes.push(['rail',range(4.9,5.1)],['load',range(10,100)]);
 if(id==='bjt')axes.push(['supply',range(4.95,5.05)],['gpio',range(3.201,3.399)],['vf',range(1.85,2.15)],['vbe',range(.6,.8)],['vce',range(.15,.25)]);
 return product(axes).map(s=>{
  let checks=[],metrics=[];const add=(...args)=>checks.push(check(...args));const m=(label,value,unit)=>metrics.push({label,value,unit});
  if(id==='divider'){
   const r1=resistor(v.r1,s.a,s.ambient,100),r2=resistor(v.r2,s.b,s.ambient,100),low=r2*s.load/(r2+s.load),i=s.supply/(r1+low),out=i*low;
   add('Loaded output',out,'V',3,3.6);add('Supply current',i,'mA',null,2);add('R1 dissipation',i*i*r1,'mW',null,25);add('R2 dissipation',out*out/r2,'mW',null,25);m('Output resistance (source shorted)',r1*r2/(r1+r2),'kΩ');m('Source power',s.supply*i,'mW');
  }
  if(id==='rc'){
   const r=resistor(v.r,s.a,s.ambient,100),c=v.c*(1+s.b*(.02+Math.abs(s.ambient-25)*50e-6)),req=r*s.load/(r+s.load),tau=req*c;
   add('Time to 90% of corner final',Math.log(10)*tau,'ms',220,280);add('Initial source current',s.supply/r,'mA',null,.6);add('Final / supply',s.load/(r+s.load),'V/V',.97,null);m('Final capacitor voltage',s.supply*s.load/(r+s.load),'V');m('Initial resistor power',s.supply*s.supply/r,'mW');m('Stored energy at final voltage',.5*c*(s.supply*s.load/(r+s.load))**2,'μJ');
  }
  if(id==='filter'){
   const r=resistor(v.r,s.a,s.ambient,50)+s.source,c=v.c*(1+s.b*(.02+Math.abs(s.ambient-25)*30e-6)),req=r*s.load/(r+s.load),fc=1e6/(2*Math.PI*req*c),dc=s.load/(r+s.load),w=2*Math.PI*10000,bc=w*c*1e-6,gr=1/s.load,den=(1+r*gr)**2+(r*bc)**2,current=s.amplitude*Math.hypot(gr,bc)/Math.sqrt(den);
   add('Loaded pole (relative to DC gain)',fc,'Hz',950,1100);add('Gain at 100 Hz',dc/Math.hypot(1,100/fc),'V/V',.99,null);add('Gain at 10 kHz',dc/Math.hypot(1,10000/fc),'V/V',null,.11);add('Source current at 10 kHz',current,'mA RMS',null,.5);m('DC insertion gain',dc,'V/V');m('Series-path dissipation at 10 kHz',current**2*r,'mW');
  }
  if(id==='opamp'){
   const rf=v.rf*(1+s.a*(.001+Math.abs(s.ambient-25)*25e-6)),rg=v.rg*(1+s.b*(.001+Math.abs(s.ambient-25)*25e-6)),gain=1+rf/rg,requested=.45*gain,out=Math.min(s.rail-.5,requested),feedback=out/(rf+rg),load=out/s.load;
   add('Closed-loop DC gain',gain,'V/V',9.5,10.5);add('Output headroom margin',s.rail-.5-requested,'V',0,null);add('Peak feedback current',feedback,'mA',null,.2);add('Peak output current including load',feedback+load,'mA',null,5);m('Single-pole bandwidth estimate',1000/gain,'kHz');m('Feedback-path dissipation at peak',out*feedback,'mW');
  }
  if(id==='bjt'){
   const rb=resistor(v.rb,s.a,s.ambient,100),rl=resistor(v.rc,s.b,s.ambient,100),ib=(s.gpio-s.vbe)/rb,ic=(s.supply-s.vf-s.vce)/rl;
   add('Target LED current',ic,'mA',8,12);add('Base current',ib,'mA',null,2);add('Forced beta',ic/ib,'',null,10);add('RB dissipation',ib*ib*rb,'mW',null,125);add('RLED dissipation',ic*ic*rl,'mW',null,125);m('Target LED power (saturation assumed)',s.vf*ic,'mW');m('Target transistor power (saturation assumed)',s.vce*ic,'mW');
  }
  const scenario=Object.entries(s).filter(([key])=>!['a','b'].includes(key)).map(([key,val])=>`${key} ${val}`).join(' · ')+` · first component ${s.a<0?'low':'high'} · second component ${s.b<0?'low':'high'}`;
  return {scenario,checks,metrics};
 });
}
export function analyzeDesignCorners(id,raw){
 const values=normalizeDesignValues(id,raw),runs=cases(id,values),envelope=key=>runs[0][key].map((item,index)=>{const sorted=runs.map(run=>({...run[key][index],scenario:run.scenario})).sort((a,b)=>a.value-b.value),low=sorted[0],high=sorted.at(-1);return {label:item.label,unit:item.unit,min:item.min??null,max:item.max??null,low:low.value,high:high.value,lowScenario:low.scenario,highScenario:high.scenario,pass:key==='checks'?sorted.every(c=>c.pass):undefined};});
 const checks=envelope('checks');return {challengeId:id,values,model:designCornerModels[id],scenarioCount:runs.length,checks,metrics:envelope('metrics'),pass:checks.every(c=>c.pass),nominalPass:evaluateDesign(id,values).pass};
}
const cache=new Map();
export function designTradeoffs(id,raw){
 const challenge=designChallenge(id),values=normalizeDesignValues(id,raw);
 const summarize=choice=>{const nominal=evaluateDesign(id,choice),corners=analyzeDesignCorners(id,choice);let measures;
  if(id==='divider'){const low=choice.r2*10/(choice.r2+10),i=12/(choice.r1+low);measures=[{label:'Source power',value:12*i,unit:'mW'},{label:'Output resistance',value:choice.r1*choice.r2/(choice.r1+choice.r2),unit:'kΩ'}];}
  if(id==='rc')measures=[{label:'Initial power',value:25/choice.r,unit:'mW'},{label:'Capacitance',value:choice.c,unit:'μF'}];
  if(id==='filter'){const current=nominal.checks.find(c=>c.label==='Source current at 10 kHz').value;measures=[{label:'Resistor power at 10 kHz',value:current*current*choice.r,unit:'mW'},{label:'Nominal pole',value:nominal.checks.find(c=>c.label==='−3 dB corner').value,unit:'Hz'}];}
  if(id==='opamp')measures=[{label:'Peak feedback power',value:Math.min(4.5,.45*(1+choice.rf/choice.rg))**2/(choice.rf+choice.rg),unit:'mW'},{label:'Bandwidth estimate',value:1000/(1+choice.rf/choice.rg),unit:'kHz'}];
  if(id==='bjt')measures=[{label:'GPIO source power',value:3.3*2.6/choice.rb,unit:'mW'},{label:'Target LED current',value:2.8/choice.rc,unit:'mA'}];
  return {values:choice,nominalPass:nominal.pass,cornerPass:corners.pass,measures};
 };
 if(!cache.has(id)){
  const valid=[];for(const first of challenge.fields[0].choices)for(const second of challenge.fields[1].choices){const choice={[challenge.fields[0].id]:first,[challenge.fields[1].id]:second};if(evaluateDesign(id,choice).pass){const row=summarize(choice);if(row.cornerPass)valid.push(row);}}
  cache.set(id,valid.sort((a,b)=>a.measures[0].value-b.measures[0].value));
 }
 const all=cache.get(id),selected=summarize(values),distinct=all.filter(row=>JSON.stringify(row.values)!==JSON.stringify(values)),alternatives=distinct.length>1?[distinct[0],distinct.at(-1)]:distinct;
 const explanation={divider:'A lower output resistance reduces load sensitivity but costs supply power. Changing the ratio also shifts the bias.',rc:'For similar RC delay, larger R lowers the initial power but increases leakage sensitivity. Smaller C can ease capacitance requirements; physical size depends on voltage rating and technology.',filter:'Larger R reduces source loading for a comparable pole, but increases thermal voltage-noise density and susceptibility to finite load impedance. Pole frequency also changes if RC is not preserved.',opamp:'Larger feedback resistors reduce feedback-path power. They increase resistor thermal noise and sensitivity to input bias current, neither included in this DC check. Gain and the stated 1 MHz bandwidth estimate trade inversely.',bjt:'Extra base drive adds GPIO power and forced-beta margin. It may increase stored charge in saturation; turn-off dynamics are outside this static model.'}[id];
 return {selected,alternatives,validCornerCombinations:all.length,explanation,cost:designCornerModels[id].cost};
}
