/** Convert an original checked answer to the current form's draft representation. */
export function submissionDraftValue(problem,answer){
 if(typeof answer!=='string'||answer.length>2500||!problem)return null;
 if(problem.type==='choice'){const index=problem.options?.indexOf(answer);return index>=0?String(index):null;}
 if(problem.type==='multipart'){try{const value=JSON.parse(answer),ids=new Set((problem.parts||[]).map(part=>part.id));if(!value||typeof value!=='object'||Array.isArray(value)||Object.entries(value).some(([id,text])=>!ids.has(id)||typeof text!=='string'||text.length>256))return null;return JSON.stringify(value);}catch{return null;}}
 return ['numeric','hdl'].includes(problem.type)?answer:null;
}

/** A bounded line diff for comparing two actual saved sources. */
export function compareSourceLines(previous,current){
 const a=String(previous).split('\n'),b=String(current).split('\n');
 if(a.length*b.length>40000)return [...a.map(text=>({kind:'removed',text})),...b.map(text=>({kind:'added',text}))];
 const rows=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)rows[i][j]=a[i]===b[j]?rows[i+1][j+1]+1:Math.max(rows[i+1][j],rows[i][j+1]);
 const result=[];let i=0,j=0;while(i<a.length||j<b.length){if(i<a.length&&j<b.length&&a[i]===b[j]){result.push({kind:'equal',text:a[i]});i++;j++;}else if(i<a.length&&(j===b.length||rows[i+1][j]>=rows[i][j+1]))result.push({kind:'removed',text:a[i++]});else result.push({kind:'added',text:b[j++]});}return result;
}

const validProblem=value=>Number.isSafeInteger(value)&&value>0;
const formatDate=value=>{const date=new Date(value);return Number.isFinite(date.getTime())?date.toLocaleString(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}):'Date unavailable';};
const unavailable='This older browser or imported attempt saved its outcome only. The original answer was not stored.';

/** Account-bound history UI. All source stays in memory; no local storage is used. */
export function createSubmissionHistory({api,getSession=()=>({signedIn:false}),getAuthLost=()=>false,getGuestAttempts=()=>[],readDraft=()=>'',onRestore=()=>false,toast=()=>{},pageSize=10}={}){
 if(typeof api!=='function')throw new Error('An Ohm API client is required.');
 let host=null,problem=null,context='',generation=0,items=[],total=0,nextCursor=null,selectedId=null,selected=null,loading=false,loadingDetail=false,error='',detailError='',restorePending=false,comparison=null,comparing=false,disposed=false,focusDetail=false;
 const details=new Map(),controllers=new Set();
 const account=()=>{const session=getSession();return session?.signedIn&&session.user?.id?String(session.user.id):null;};
 function active(accountId,token){return !disposed&&token===generation&&account()===accountId&&!getAuthLost();}
 function clearRequests(){generation++;for(const controller of controllers)controller.abort();controllers.clear();}
 function reset(){clearRequests();items=[];total=0;nextCursor=null;selectedId=null;selected=null;loading=false;loadingDetail=false;error='';detailError='';restorePending=false;comparison=null;comparing=false;focusDetail=false;details.clear();}
 function node(tag,className,text){const result=host.ownerDocument.createElement(tag);if(className)result.className=className;if(text!==undefined)result.textContent=text;return result;}
 function button(text,handler,{disabled=false,className='button'}={}){const value=node('button',className,text);value.type='button';value.disabled=disabled;value.addEventListener('click',handler);return value;}
 async function request(path,accountId,token){
  if(!active(accountId,token))throw new Error('Your sign-in changed. Reload before viewing submissions.');
  const controller=new AbortController();controllers.add(controller);
  try{const result=await api(path,{method:'GET',headers:{'X-Ohm-Account-ID':accountId},signal:controller.signal});if(!active(accountId,token))throw new Error('Your sign-in changed. Reload before viewing submissions.');if(String(result?.accountId)!==accountId){reset();context='';render();throw Object.assign(new Error('Your sign-in changed. Reload before viewing submissions.'),{accountChanged:true});}return result;}finally{controllers.delete(controller);}
 }
 function summaryMeta(item){return `${formatDate(item.at)} · ${item.version?'v'+item.version:'version unknown'} · ${item.source==='imported'?'imported outcome':item.source==='browser'?'browser outcome':item.assistance==='independent'?'independent':item.assistance==='hint'?'hint viewed':item.assistance==='solution'?'solution viewed':'assistance unknown'}`;}
 function render(){
  if(!host||disposed)return;host.replaceChildren();host.classList.add('submission-history');host.setAttribute('aria-label','Submission history');
  const heading=node('div','sh-heading'),title=node('div');title.append(node('h3','','Submission history'),node('p','sh-privacy',account()?'Private to your account':'Saved in this browser'));heading.append(title);if(account())heading.append(button('Refresh',()=>void refresh(),{disabled:loading||loadingDetail}));host.append(heading);
  const session=getSession();if(getAuthLost()||context!==`${account()||'guest'}:${problem?.id}`){host.append(node('p','sh-notice','Your sign-in changed. Reload before viewing submissions.'));return;}
  if(session?.signedIn!==true&&session?.signedIn!==false){host.append(node('p','sh-notice','Your sign-in status could not be checked. Reload to view submissions.'));return;}
  if(!account())host.append(node('p','sh-notice','Guest history keeps dates and outcomes. Original answers were not saved, so they cannot be viewed or restored. Sign in before submitting to keep future answers in private history.'));
  const status=node('p','sh-status',loading&&!items.length?'Loading your submissions…':`${total} ${total===1?'submission':'submissions'}${account()?' saved':''}`);status.setAttribute('role','status');host.append(status);
  if(error){const message=node('p','sh-error',error);message.setAttribute('role','alert');host.append(message,button('Try again',()=>void loadPage(Boolean(items.length)),{disabled:loading}));}
  if(!items.length&&!loading&&!error)host.append(node('p','sh-empty','Your submissions for this problem will appear here.'));
  const list=node('ol','sh-list');for(const item of items){const row=node('li'),open=button('',()=>void select(item.submissionId),{className:'sh-attempt'});open.setAttribute('aria-pressed',String(selectedId===item.submissionId));const badge=node('span',`sh-outcome ${item.pass?'is-accepted':'is-retry'}`,item.pass?'Accepted':'Needs work'),text=node('span','sh-attempt-text');text.append(node('span','sh-attempt-date',summaryMeta(item)));if(item.staleVersion)text.append(node('span','sh-old-version',`Earlier problem version · current v${item.currentVersion||problem.version}`));open.append(badge,text);row.append(open);list.append(row);}host.append(list);
  if(nextCursor)host.append(button(loading?'Loading…':'Load older submissions',()=>void loadPage(true),{disabled:loading}));
  if(loadingDetail){const status=node('p','sh-status','Loading original answer…');status.setAttribute('role','status');host.append(status);}
  if(detailError){const message=node('p','sh-error',detailError);message.setAttribute('role','alert');host.append(message);}
  if(selected)renderDetail(selected);
 }
 function renderResult(result){
  const section=node('div','sh-result');section.append(node('h4','','Saved result'));if(result.feedback)section.append(node('p','',result.feedback));if(typeof result.score==='number')section.append(node('p','sh-score',`Score: ${Math.round(result.score*100)}%`));
  if(Array.isArray(result.parts)&&result.parts.length){const list=node('ul','sh-parts');for(const part of result.parts)list.append(node('li','',`${part.id}: ${part.pass?'Correct':'Review'}${part.feedback?' — '+part.feedback:''}`));section.append(list);}
  if(Array.isArray(result.rows)&&result.rows.length){const table=node('table','sh-truth-table'),caption=node('caption','','Truth-table result at submission time'),head=node('thead'),header=node('tr'),names=[...(result.inputs||[]),'expected','actual','pass'];for(const name of names)header.append(node('th','',name==='pass'?'Result':name));head.append(header);const body=node('tbody');for(const item of result.rows){const row=node('tr');for(const name of names)row.append(node('td','',name==='pass'?(item.pass?'Pass':'Mismatch'):String(item[name]??'—')));body.append(row);}table.append(caption,head,body);const wrap=node('div','sh-table-wrap');wrap.append(table);section.append(wrap);}return section;
 }
 function renderDetail(item){
  const panel=node('section','sh-detail');panel.tabIndex=-1;panel.setAttribute('aria-label','Selected submission');panel.append(node('h4','',item.pass?'Accepted submission':'Submission to revisit'),node('p','sh-detail-meta',summaryMeta(item)));
  if(item.staleVersion)panel.append(node('p','sh-notice',`This result was checked against problem v${item.version}. The problem is now v${item.currentVersion||problem.version}; restoring an answer does not regrade it.${item.currentVersion&&item.currentVersion!==problem.version?' Reload the problem before submitting this restored answer.':''}`));
  if(typeof item.answer!=='string'){panel.append(node('p','sh-notice',item.unavailableReason||unavailable));if(item.result)panel.append(renderResult(item.result));host.append(panel);if(focusDetail){focusDetail=false;panel.focus({preventScroll:true});}return;}
  const source=node('pre','sh-source'),code=node('code','',item.answer);source.tabIndex=0;source.setAttribute('aria-label','Original submitted answer');source.append(code);panel.append(source);
  const actions=node('div','sh-actions');actions.append(button('Copy answer',()=>void copyAnswer(item)),button('Restore to editor',()=>{restorePending=true;comparison=null;render();},{disabled:submissionDraftValue(problem,item.answer)===null}));
  const compareLabel=node('label','sh-compare-label','Compare with'),selectBox=node('select','sh-compare-select');selectBox.setAttribute('aria-label','Choose answer to compare');const current=node('option','','Current draft');current.value='current';selectBox.append(current);for(const other of items.filter(value=>value.submissionId!==item.submissionId&&value.answerAvailable)){const option=node('option','',`${other.pass?'Accepted':'Needs work'} · ${formatDate(other.at)}`);option.value=other.submissionId;selectBox.append(option);}compareLabel.append(selectBox);actions.append(compareLabel,button(comparing?'Comparing…':'Compare',()=>void compare(item,selectBox.value),{disabled:comparing}));panel.append(actions);
  if(submissionDraftValue(problem,item.answer)===null)panel.append(node('p','sh-notice','This answer does not fit the current problem fields. You can copy or compare the original.'));
  if(restorePending){const confirm=node('div','sh-restore-confirm');confirm.append(node('p','','Replace the current draft with this submitted answer? Your submission history stays saved.'),button('Replace current draft',()=>restore(item)),button('Keep current draft',()=>{restorePending=false;render();}));panel.append(confirm);}
  if(comparison){const section=node('section','sh-comparison');section.append(node('h4','',comparison.title),node('p','sh-diff-legend','− selected submission · + comparison answer'));const diff=node('pre','sh-diff');diff.tabIndex=0;diff.setAttribute('aria-label','Answer comparison');for(const line of compareSourceLines(item.answer,comparison.answer)){const row=node('div',`sh-diff-row sh-diff-${line.kind}`,(line.kind==='added'?'+ ':line.kind==='removed'?'− ':'  ')+line.text);diff.append(row);}section.append(diff);panel.append(section);}
  if(item.result)panel.append(renderResult(item.result));host.append(panel);if(focusDetail){focusDetail=false;panel.focus({preventScroll:true});}
 }
 async function loadPage(append=false){
  if(loading||disposed||!problem)return;const accountId=account(),token=generation,id=problem.id;if(!accountId)return;
  loading=true;error='';render();try{const query=new URLSearchParams({problem:String(id),limit:String(pageSize),...(append&&nextCursor?{cursor:nextCursor}:{})});const result=await request('/api/account/submissions?'+query,accountId,token);if(!active(accountId,token))return;if(result.problemId!==id||!Array.isArray(result.items)||!Number.isSafeInteger(result.total)||result.total<0||!(result.nextCursor===null||typeof result.nextCursor==='string'))throw new Error('The submission history could not be read. Refresh to try again.');const incoming=result.items.filter(item=>item&&item.problemId===id&&typeof item.submissionId==='string'&&typeof item.pass==='boolean'&&typeof item.at==='string');items=append?[...new Map([...items,...incoming].map(item=>[item.submissionId,item])).values()]:incoming;total=result.total;nextCursor=result.nextCursor;}catch(cause){if(active(accountId,token))error=cause.message||'Your history could not be loaded.';}finally{if(token===generation){loading=false;render();}}
 }
 async function getDetail(submissionId,accountId,token){
  if(details.has(submissionId))return details.get(submissionId);const query=new URLSearchParams({problem:String(problem.id),id:submissionId}),result=await request('/api/account/submission?'+query,accountId,token);if(!active(accountId,token))return null;if(result.problemId!==problem.id||result.submission?.submissionId!==submissionId||result.submission?.problemId!==problem.id||!(result.submission.answer===null||typeof result.submission.answer==='string'))throw new Error('This submission could not be read.');details.set(submissionId,result.submission);return result.submission;
 }
 async function select(submissionId){
  const item=items.find(value=>value.submissionId===submissionId);if(!item)return;selectedId=submissionId;selected=null;restorePending=false;comparison=null;detailError='';const token=generation,accountId=account();if(!accountId){selected={...item,answer:null,result:{pass:item.pass},unavailableReason:unavailable};focusDetail=true;render();return;}
  loadingDetail=true;render();try{const detail=await getDetail(submissionId,accountId,token);if(active(accountId,token)&&selectedId===submissionId){selected=detail;focusDetail=true;}}catch(cause){if(active(accountId,token)&&selectedId===submissionId)detailError=cause.message||'This submission could not be loaded.';}finally{if(token===generation&&selectedId===submissionId){loadingDetail=false;render();}}
 }
 async function compare(item,target){
  const token=generation,accountId=account();if(!accountId||!active(accountId,token))return;comparing=true;detailError='';render();try{if(target==='current'){const draft=String(readDraft(problem)||'');comparison={title:'Compare with current draft',answer:problem.type==='choice'&&draft!==''?(problem.options?.[Number(draft)]??draft):draft};}else{const other=await getDetail(target,accountId,token);if(active(accountId,token)&&selectedId===item.submissionId&&typeof other?.answer==='string')comparison={title:'Compare with '+formatDate(other.at),answer:other.answer};}}catch(cause){if(active(accountId,token))detailError=cause.message||'These answers could not be compared.';}finally{if(token===generation){comparing=false;render();}}
 }
 function restore(item){const accountId=account();if(!accountId||!active(accountId,generation)||selectedId!==item.submissionId)return;const draft=submissionDraftValue(problem,item.answer);if(draft===null)return;try{if(onRestore(draft,item,problem)!==false){restorePending=false;comparison=null;toast('Submitted answer restored to your draft. Review it before submitting.');render();}}catch(cause){detailError=cause.message||'This answer could not be restored.';render();}}
 async function copyAnswer(item){const accountId=account(),token=generation;if(!accountId||!active(accountId,token)||typeof item.answer!=='string')return;try{await host.ownerDocument.defaultView.navigator.clipboard.writeText(item.answer);if(active(accountId,token))toast('Original answer copied.');}catch{if(active(accountId,token)){detailError='Select the original answer above and copy it with your keyboard.';render();}}}
 async function refresh(){if(!problem||disposed)return;const id=problem.id;reset();context=`${account()||'guest'}:${id}`;if(account())await loadPage();else{const attempts=getGuestAttempts();items=(Array.isArray(attempts)?attempts:[]).filter(item=>item?.id===id&&typeof item.pass==='boolean').map((item,index)=>({problemId:id,submissionId:'guest:'+index,version:item.version??null,currentVersion:problem.version,staleVersion:item.version?item.version!==problem.version:null,pass:item.pass,at:item.at,source:'browser',assistance:item.assistance||'unknown',answerAvailable:false})).reverse();total=items.length;render();}}
 return {mount(element,nextProblem){if(disposed||!element||!validProblem(nextProblem?.id))return;host=element;problem=nextProblem;const key=`${account()||'guest'}:${problem.id}`;if(context!==key){reset();context=key;void refresh();}else render();},refresh,clear(){reset();context='';host?.replaceChildren();host=null;problem=null;},invalidate(){reset();render();},dispose(){reset();host?.replaceChildren();host=null;disposed=true;},get state(){return {total,loading,selectedId,nextCursor};}};
}
