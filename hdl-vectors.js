import {fullHDLExercises} from './full-hdl-catalog.js?v=ceacf964d1420d5c';
// The only editable testbench input is a bounded table of signal values. It
// never accepts source, expected results, commands, timing, or file paths.
export function validateHDLVectors(exerciseId,value){
 const p=fullHDLExercises.find(p=>p.id===exerciseId);
 if(!p)throw new Error('Choose a supported HDL exercise.');
 if(!Array.isArray(value)||value.length<2||value.length>64)throw new Error('Use 2–64 rising-edge input rows.');
 const names=p.inputs.map(s=>s.name);
 const rows=value.map((row,i)=>{
  if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).length!==names.length||Object.keys(row).some(k=>!names.includes(k)))throw new Error(`Row ${i+1}: include exactly ${names.join(', ')}.`);
  return Object.fromEntries(p.inputs.map(s=>{const n=row[s.name];if(!Number.isSafeInteger(n)||n<0||n>2**s.width-1)throw new Error(`Row ${i+1}: ${s.name} must be an unsigned ${s.width}-bit integer.`);return [s.name,n];}));
 });
 if(rows[0].rst!==1)throw new Error('Begin custom inputs with rst=1 to initialize the circuit.');
 return rows;
}
export function parseHDLVectors(exerciseId,text){let value;try{value=JSON.parse(text);}catch{throw new Error('Use a JSON array of input rows.');}return validateHDLVectors(exerciseId,value);}
