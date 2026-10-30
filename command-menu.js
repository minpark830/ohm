const publicViews=new Set(['dashboard','problems','saved','collections','activity','roadmap','review','interview','roles','challenges','plan','diagnostic','learn','community','lab','debug','design','hdl','full-hdl','circuit','cases','progress','insights','account','help','notebook']);
const clean=(value,max=180)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,'').slice(0,max):'';
const folded=value=>clean(value,500).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function commandResults({problems=[],actions=[],query='',limit=12}={}){
 const text=folded(query).trim().slice(0,100),tokens=text.split(/\s+/).filter(Boolean),used=new Set(),entries=[];
 for(const action of Array.isArray(actions)?actions:[]){if(!action||!publicViews.has(action.view)||used.has('view:'+action.view)||!clean(action.title))continue;used.add('view:'+action.view);entries.push({kind:'view',view:action.view,key:'view:'+action.view,title:clean(action.title,100),detail:clean(action.detail),keywords:clean(action.keywords,250)});}
 for(const p of Array.isArray(problems)?problems:[]){if(!p||!Number.isSafeInteger(p.id)||p.id<1||p.id>2147483647||p.published===false||p.published===0||used.has('problem:'+p.id)||!clean(p.title))continue;used.add('problem:'+p.id);entries.push({kind:'problem',id:p.id,key:'problem:'+p.id,title:clean(p.title,150),detail:[clean(p.category,60),clean(p.difficulty,15),'#'+p.id].filter(Boolean).join(' · '),keywords:(Array.isArray(p.tags)?p.tags:[]).map(t=>clean(t,60)).join(' ')});}
 const ranked=[];
 for(const [index,entry] of entries.entries()){
  const title=folded(entry.title),haystack=folded(entry.title+' '+entry.detail+' '+entry.keywords);
  if(tokens.some(t=>!haystack.includes(t.replace(/^#/,''))))continue;
  const score=!text?0:entry.kind==='problem'&&String(entry.id)===text.replace(/^#/,'')?1000:title===text?900:title.startsWith(text)?700:tokens.filter(t=>title.includes(t)).length*50;
  const {keywords,...safe}=entry;ranked.push({...safe,score,index});
 }
 return ranked.sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,Math.max(1,Math.min(30,Number.isInteger(limit)?limit:12))).map(({score,index,...entry})=>entry);
}

export function createCommandMenu({getProblems,getActions,navigate,openProblem,toast=()=>{}}){
 let dialog=null,input=null,list=null,status=null,previous=null,results=[],selected=0;
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function close({restoreFocus=true}={}){if(!dialog?.open)return;dialog.close();input.value='';results=[];list.replaceChildren();if(restoreFocus&&previous?.isConnected)previous.focus();previous=null;}
 function choose(index){const item=results[index];if(!item)return;const focus=previous;close({restoreFocus:false});const changed=item.kind==='problem'?openProblem(item.id):navigate(item.view);if(changed===false){if(focus?.isConnected)focus.focus();toast('Finish the current edit before opening another workspace.');}}
 function draw(){
  results=commandResults({problems:getProblems(),actions:getActions(),query:input.value});selected=Math.min(selected,Math.max(0,results.length-1));
  list.innerHTML=results.map((entry,index)=>`<li id="ohm-command-${index}" role="option" aria-selected="${index===selected}" data-command-index="${index}"><span class="command-result-mark" aria-hidden="true">${entry.kind==='problem'?'#':'↗'}</span><span><strong>${escape(entry.title)}</strong><small>${escape(entry.detail)}</small></span><span class="command-result-kind">${entry.kind==='problem'?'Problem':'Workspace'}</span></li>`).join('');
  status.textContent=results.length?`${results.length} results. Use the arrow keys to choose and Enter to open.`:'No matches. Try a topic, skill, problem number, or workspace.';
  if(results.length)input.setAttribute('aria-activedescendant',`ohm-command-${selected}`);else input.removeAttribute('aria-activedescendant');
 }
 function ensure(){if(dialog)return;dialog=document.createElement('dialog');dialog.className='command-dialog';dialog.setAttribute('aria-labelledby','command-title');dialog.innerHTML='<div class="command-heading"><div><span class="eyebrow muted">QUICK FIND</span><h2 id="command-title">Where will you go next?</h2></div><button type="button" class="icon-button" data-command-close aria-label="Close quick search">×</button></div><label class="command-input"><span aria-hidden="true">⌕</span><input type="search" maxlength="100" placeholder="Search problems, skills, or tools…" aria-label="Search Ohm" role="combobox" aria-controls="command-results" aria-expanded="true" aria-autocomplete="list" autocomplete="off" spellcheck="false"></label><p class="command-status" role="status" aria-live="polite"></p><ul id="command-results" class="command-results" role="listbox" aria-label="Search results"></ul><div class="command-footer"><span>↑ ↓ to choose · Enter to open · Esc to close</span><span>Ctrl / ⌘ K</span></div>';
  document.body.append(dialog);input=dialog.querySelector('input');list=dialog.querySelector('ul');status=dialog.querySelector('.command-status');
  input.addEventListener('input',()=>{selected=0;draw();});
  dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('[data-command-close]'))return close();const item=event.target.closest('[data-command-index]');if(item)choose(Number(item.dataset.commandIndex));});
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  input.addEventListener('keydown',event=>{if(event.isComposing)return;if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();if(!results.length)return;selected=event.key==='Home'?0:event.key==='End'?results.length-1:(selected+(event.key==='ArrowDown'?1:-1)+results.length)%results.length;draw();list.children[selected]?.scrollIntoView({block:'nearest'});}else if(event.key==='Enter'){event.preventDefault();choose(selected);}});
 }
 function open(){ensure();if(dialog.open){input.focus();return;}previous=document.activeElement;selected=0;input.value='';draw();dialog.showModal();input.focus();}
 return {open,close,get isOpen(){return Boolean(dialog?.open);},onKeydown(event){if((event.ctrlKey||event.metaKey)&&!event.altKey&&!event.shiftKey&&event.key.toLowerCase()==='k'&&!event.isComposing){event.preventDefault();dialog?.open?close():open();return true;}return false;},dispose(){close({restoreFocus:false});dialog?.remove();dialog=null;}};
}
