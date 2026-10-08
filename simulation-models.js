// Units throughout: V, kΩ, mA, μF, ms; BJT base current is μA.
export function series({v,r1,r2}){const i=v/(r1+r2);return {i,v1:i*r1,v2:i*r2,power:v*i};}
export function divider({v,r1,r2,rl,loaded}){const lower=loaded?r2*rl/(r2+rl):r2,out=v*lower/(r1+lower);return {out,input:(v-out)/r1,bottom:out/r2,load:loaded?out/rl:0,unloaded:v*r2/(r1+r2)};}
export function kcl({a,b,c}){return {unknown:a+b-c,incoming:a+b,outgoing:c};}
export function rc({r,c,v,t,mode}){const tau=r*c,initial=mode==='discharge'?v:0,final=mode==='discharge'?0:v,voltage=final+(initial-final)*Math.exp(-t);return {tau,time:t*tau,initial,final,voltage,current:(final-voltage)/r,energy:.5*c*voltage*voltage};}
export function bjt({v,rc:resistance,ib,beta}){const limit=(v-.2)/resistance,ideal=beta*ib/1000,i=Math.min(ideal,limit),vce=v-i*resistance;return {i,vce,ideal,limit,region:ib===0?'Cutoff':ideal>=limit?'Saturation':'Forward active',base:ib/1000,emitter:i+ib/1000};}
export function nmos({vgs,vds,vth,k}){const overdrive=vgs-vth;if(overdrive<=0)return {i:0,overdrive,region:'Cutoff',gm:0};const saturated=vds>=overdrive;return {i:saturated?k*overdrive**2/2:k*(overdrive*vds-vds**2/2),overdrive,region:saturated?'Saturation':'Triode',boundary:Math.abs(vds-overdrive)<1e-9,gm:k*(saturated?overdrive:vds)};}
export function logic({kind,a,b,s}){if(kind==='mux')return {y:s?b:a};if(kind==='adder'){const total=a+b+s;return {sum:total%2,carry:total>=2?1:0};}return {y:a^b};}
export function logicRows(kind){return Array.from({length:kind==='xor'?4:8},(_,n)=>{const a=n>>(kind==='xor'?1:2)&1,b=n>>(kind==='xor'?0:1)&1,s=kind==='xor'?0:n&1;return {a,b,s,...logic({kind,a,b,s})};});}
