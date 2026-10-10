// A bounded educational interpreter, not a general Verilog compiler. No eval,
// dynamic functions, system tasks, imports, files, network, or user JS execute.
export const hdlExercises=[
 {id:'counter',title:'4-bit enabled counter',width:4,description:'On each rising edge, reset clears q to zero. Otherwise, enable increments q modulo 16; enable = 0 holds the current value. Reset has priority.',signals:['reset','enable'],starter:'always @(posedge clk) begin\n  if (reset) q <= 0;\n  else if (enable) q <= q; // increment here\nend',reference:'always @(posedge clk) begin\n  if (reset) q <= 0;\n  else if (enable) q <= q + 1;\nend',inputs:Array.from({length:22},(_,i)=>({reset:i===0||i===20?1:0,enable:i===3||i===6||i===20?0:1})),expected:(q,r)=>r.reset?0:r.enable?(q+1)&15:q,notes:'The 4-bit q register wraps from 15 to 0. Values are sampled immediately after each rising edge.'},
 {id:'register',title:'Enabled D flip-flop',width:1,description:'Implement a 1-bit register. A synchronous reset clears q. Otherwise, enable loads d; when enable is low q holds. Reset has priority over enable.',signals:['reset','enable','d'],starter:'always @(posedge clk) begin\n  if (reset) q <= 0;\n  else if (enable) q <= 0; // load d here\nend',reference:'always @(posedge clk) begin\n  if (reset) q <= 0;\n  else if (enable) q <= d;\nend',inputs:[{reset:1,enable:1,d:1},{reset:0,enable:1,d:1},{reset:0,enable:0,d:0},{reset:0,enable:1,d:0},{reset:0,enable:0,d:1},{reset:1,enable:0,d:1},{reset:0,enable:1,d:1},{reset:1,enable:1,d:1}],expected:(q,r)=>r.reset?0:r.enable?r.d:q,notes:'This is a synchronous reset: it takes effect on the clock edge, not immediately between edges.'},
 {id:'fsm',title:'Three-state sequence controller',width:2,description:'Encode IDLE=0, RUN=1, DONE=2 in q. Synchronous reset returns to IDLE. In IDLE, start=1 moves to RUN. In RUN, done=1 moves to DONE. DONE returns to IDLE on the next edge. An invalid state returns to IDLE.',signals:['reset','start','done'],starter:'always @(posedge clk) begin\n  if (reset) q <= 0;\n  else begin\n    case (q)\n      0: if (start) q <= 1;\n      1: if (done) q <= 1; // choose next state\n      2: q <= 0;\n      default: q <= 0;\n    endcase\n  end\nend',reference:'always @(posedge clk) begin\n  if (reset) q <= 0;\n  else begin\n    case (q)\n      0: if (start) q <= 1;\n      1: if (done) q <= 2;\n      2: q <= 0;\n      default: q <= 0;\n    endcase\n  end\nend',inputs:[{reset:1,start:0,done:0},{reset:0,start:0,done:1},{reset:0,start:1,done:0},{reset:0,start:0,done:0},{reset:0,start:1,done:1},{reset:0,start:1,done:1},{reset:0,start:1,done:0},{reset:1,start:0,done:1},{reset:0,start:1,done:1},{reset:0,start:0,done:1},{reset:0,start:0,done:0}],expected:(q,r)=>r.reset?0:q===0?(r.start?1:0):q===1?(r.done?2:1):0,notes:'States are represented as the 2-bit q bus. The testbench reports the expected next state after each rising edge.'}
];

export function compileClockedBlock(source,exercise){
 if(typeof source!=='string'||source.length>6000)throw new Error('Keep the clocked block under 6,000 characters.');
 // Scan comments in lexical order: a /* inside a // comment does not start a block.
 let clean='';for(let i=0;i<source.length;){
  if(source.startsWith('//',i)){const end=source.indexOf('\n',i+2);i=end<0?source.length:end;clean+=' ';}
  else if(source.startsWith('/*',i)){const end=source.indexOf('*/',i+2);if(end<0)throw new Error('Close the block comment with */.');i=end+2;clean+=' ';}
  else clean+=source[i++];
 }
 clean=clean.trim();
 const match=/^always\s*@\s*\(\s*posedge\s+clk\s*\)\s*([\s\S]+)$/.exec(clean);
 if(!match)throw new Error('Start with always @(posedge clk), then your clocked statements. Module ports are supplied by the exercise.');
 const src=match[1],tokens=[];let at=0,pos=0;
 const token=/\s*(\d+'[bBdDhH][0-9a-fA-F]+|\d+|[A-Za-z_]\w*|<=|>=|==|!=|&&|\|\||<<|>>|[()+\-*%&|^~!<>?:;])/y;
 while(at<src.length){if(!src.slice(at).trim())break;token.lastIndex=at;const m=token.exec(src);if(!m)throw new Error('Unsupported syntax. Use q <= expression, if/else, begin/end, or case/endcase.');tokens.push(m[1]);at=token.lastIndex;if(tokens.length>800)throw new Error('Simplify the block to fewer than 800 tokens.');}
 const peek=()=>tokens[pos],take=()=>tokens[pos++],expect=t=>{if(take()!==t)throw new Error(`Expected ${t}.`);};let depth=0;
 const guard=fn=>{if(++depth>40)throw new Error('Simplify deeply nested expressions.');try{return fn();}finally{depth--;}};
 const binaryLevels=[['||'],['&&'],['|'],['^'],['&'],['==','!='],['<','>','<=','>='],['<<','>>'],['+','-'],['*','%']];
 function primary(){return guard(()=>{const t=take();if(t==='('){const n=expression();expect(')');return n;}if(['!','~','-','+'].includes(t))return {op:'unary',kind:t,value:primary()};if(/^\d+(?:'[bBdDhH][0-9a-fA-F]+)?$/.test(t||'')){const literal=/^(\d+)'([bBdDhH])([0-9a-fA-F]+)$/.exec(t);let value,width=32,signed=!literal;if(literal){width=Number(literal[1]);const base={b:2,d:10,h:16}[literal[2].toLowerCase()];if(width<1||width>16||!(base===2?/^[01]+$/:base===10?/^\d+$/:/^[0-9a-fA-F]+$/).test(literal[3]))throw new Error('Use valid unsigned literals, 1–16 bits wide.');if(literal[3].length>32)throw new Error('Keep a based literal to 32 digits or fewer.');value=Number(BigInt((base===2?'0b':base===16?'0x':'')+literal[3])&((1n<<BigInt(width))-1n));}else value=Number(t);if(!Number.isSafeInteger(value)||value>65535)throw new Error('Use integer constants from 0 to 65535.');return {op:'number',value,width,signed};}if(t==='q'||exercise.signals.includes(t))return {op:'signal',name:t,width:t==='q'?exercise.width:1};throw new Error(`Unknown signal or expression: ${t||'end of block'}.`);});}
 function binary(level=0){if(level===binaryLevels.length)return primary();let left=binary(level+1);while(binaryLevels[level].includes(peek())){const op=take(),right=binary(level+1);left={op,left,right};}return left;}
 function expression(){return guard(()=>{const condition=binary();if(peek()!=='?')return condition;take();const yes=expression();expect(':');return {op:'conditional',condition,yes,no:expression()};});}
 function statement(){return guard(()=>{const t=take();if(t==='begin'){const statements=[];while(peek()!=='end'){if(!peek())throw new Error('Missing end.');statements.push(statement());}expect('end');return {type:'block',statements};}if(t==='if'){expect('(');const condition=expression();expect(')');const yes=statement(),no=peek()==='else'?(take(),statement()):null;return {type:'if',condition,yes,no};}if(t==='case'){expect('(');const selector=expression();expect(')');const cases=[];let fallback=null;while(peek()!=='endcase'){if(!peek())throw new Error('Missing endcase.');if(peek()==='default'){take();expect(':');if(fallback)throw new Error('Use one default case.');fallback=statement();}else{const value=take();if(!/^\d+$/.test(value))throw new Error('Use decimal case labels.');if(!Number.isSafeInteger(Number(value))||Number(value)>65535)throw new Error('Use decimal case labels from 0 to 65535.');expect(':');cases.push({value:Number(value),statement:statement()});}}expect('endcase');if(new Set(cases.map(c=>c.value)).size!==cases.length)throw new Error('Use unique case labels.');return {type:'case',selector,cases,fallback};}if(t==='q'){expect('<=');const value=expression();expect(';');return {type:'assign',value};}if(t===';')return {type:'empty'};throw new Error('Use only nonblocking q assignments, if/else, and case statements inside this clocked block.');});}
 const tree=statement();if(pos!==tokens.length)throw new Error('Use one clocked block with all statements inside begin/end.');
 // IEEE 1364-2005 §§5.4–5.5: determine width and signedness, then
 // propagate assignment/operator context before evaluating. Unsized decimal
 // literals are signed 32-bit; based literals and exercise ports are unsigned.
 // BigInt keeps multiplication exact; every operation is truncated to ≤32 bits.
 const comparison=new Set(['==','!=','<','>','<=','>=']),logical=new Set(['&&','||']);
 const types=new WeakMap();
 function typeOf(n){
  if(types.has(n))return types.get(n);let type;
  if(n.op==='number'||n.op==='signal')type={width:n.width,signed:n.op==='number'&&n.signed};
  else if(n.op==='unary')type=n.kind==='!'?{width:1,signed:false}:typeOf(n.value);
  else if(comparison.has(n.op)||logical.has(n.op))type={width:1,signed:false};
  else if(n.op==='<<'||n.op==='>>')type=typeOf(n.left);
  else {const a=typeOf(n.op==='conditional'?n.yes:n.left),b=typeOf(n.op==='conditional'?n.no:n.right);type={width:Math.max(a.width,b.width),signed:a.signed&&b.signed};}
  types.set(n,type);return type;
 }
 const wrap=(value,width)=>BigInt.asUintN(width,value);
 const numeric=(bits,type)=>type.signed?BigInt.asIntN(type.width,bits):bits;
 function evalNode(n,env,context){
  const own=typeOf(n),type={width:Math.max(own.width,context?.width||0),signed:context?.signed??own.signed};
  if(n.op==='number'||n.op==='signal'){
   let value=BigInt(n.op==='number'?n.value:env[n.name]);
   if(type.signed&&own.signed)value=BigInt.asIntN(own.width,value);
   return wrap(value,type.width);
  }
  if(n.op==='unary'){
   if(n.kind==='!')return evalNode(n.value,env)===0n?1n:0n;
   const v=evalNode(n.value,env,type);return wrap(n.kind==='~'?~v:n.kind==='-'?-v:v,type.width);
  }
  if(n.op==='conditional')return evalNode(evalNode(n.condition,env)!==0n?n.yes:n.no,env,type);
  if(logical.has(n.op)){
   const a=evalNode(n.left,env)!==0n;
   return BigInt(n.op==='&&'?(a&&evalNode(n.right,env)!==0n):(a||evalNode(n.right,env)!==0n));
  }
  if(comparison.has(n.op)){
   const l=typeOf(n.left),r=typeOf(n.right),operand={width:Math.max(l.width,r.width),signed:l.signed&&r.signed};
   const a=numeric(evalNode(n.left,env,operand),operand),b=numeric(evalNode(n.right,env,operand),operand);
   return BigInt(n.op==='=='?a===b:n.op==='!='?a!==b:n.op==='<'?a<b:n.op==='>'?a>b:n.op==='<='?a<=b:a>=b);
  }
  const a=evalNode(n.left,env,type);
  if(n.op==='<<'||n.op==='>>'){
   const amount=numeric(evalNode(n.right,env),typeOf(n.right));
   if(amount<0n)throw new Error('Use a nonnegative shift amount.');
   if(amount>=BigInt(type.width))return 0n;
   return wrap(n.op==='<<'?a<<amount:a>>amount,type.width);
  }
  const b=evalNode(n.right,env,type);let value;
  switch(n.op){
   case '+':value=a+b;break;case '-':value=a-b;break;case '*':value=a*b;break;
   case '%':if(b===0n)throw new Error('Remainder by zero produces X, which this two-state runner does not support.');value=numeric(a,type)%numeric(b,type);break;
   case '&':value=a&b;break;case '|':value=a|b;break;case '^':value=a^b;break;
   default:throw new Error('Unknown expression.');
  }
  return wrap(value,type.width);
 }
 // All nonblocking assignments read old q; the last executed assignment wins.
 return (q,inputs)=>{const env={...inputs,q};let next=q;
  function run(n){
   if(!n)return;
   if(n.type==='block')n.statements.forEach(run);
   else if(n.type==='assign')next=Number(wrap(evalNode(n.value,env,{width:exercise.width,signed:typeOf(n.value).signed}),exercise.width));
   else if(n.type==='if')run(evalNode(n.condition,env)!==0n?n.yes:n.no);
   else if(n.type==='case'){
    // Decimal case labels are signed 32-bit; they and the selector share width.
    const selector=Number(evalNode(n.selector,env,{width:32,signed:typeOf(n.selector).signed}));
    run(n.cases.find(c=>c.value===selector)?.statement||n.fallback);
   }
  }
  run(tree);return next;
 };
}

export function runClockedExercise({id,code,inputs}){
 const exercise=hdlExercises.find(x=>x.id===id);if(!exercise)throw new Error('Choose an available HDL exercise.');
 const rows=inputs??exercise.inputs;
 if(!Array.isArray(rows)||rows.length<1||rows.length>64)throw new Error('Use 1–64 clock cycles.');
 for(const row of rows){if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).length!==exercise.signals.length||exercise.signals.some(s=>!Object.hasOwn(row,s)||(row[s]!==0&&row[s]!==1)))throw new Error(`Each cycle needs exactly these 0/1 inputs: ${exercise.signals.join(', ')}.`);}
 if(rows[0].reset!==1)throw new Error('Start your testbench with reset = 1 to establish a known state.');
 const step=compileClockedBlock(code,exercise);let actual=0,expected=0;
 const result=rows.map((inputs,index)=>{actual=step(actual,inputs);expected=exercise.expected(expected,inputs);return {cycle:index+1,...inputs,actual,expected,pass:actual===expected};});
 return {id,width:exercise.width,signals:exercise.signals,rows:result,pass:result.every(r=>r.pass),passed:result.filter(r=>r.pass).length};
}
