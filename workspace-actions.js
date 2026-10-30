import {focusWorkspace} from './navigation-a11y.js?v=5601ad9fd5efe681';

// Update existing controls so an autosave never detaches the focused button or
// a modal's return-focus target. No drafts or feedback are replaced here.
export function updateWorkspaceNavigation({document,problem,selection=[],bookmarked=false}) {
 const region=document.querySelector('[data-workspace-navigation]');if(!region||!problem)return;
 const position=selection.findIndex(item=>item.id===problem.id);
 const previous=region.querySelector('[data-action="previous"]'),next=region.querySelector('[data-action="next"]'),count=region.querySelector('[data-selection-position]'),bookmark=region.querySelector('[data-bookmark]');
 if(previous)previous.disabled=position<=0;
 if(next)next.disabled=position<0||position===selection.length-1;
 if(count)count.textContent=position>=0?`${position+1} / ${selection.length}`:'Outside current filters';
 if(bookmark){bookmark.classList.toggle('saved',bookmarked);bookmark.setAttribute('aria-label',bookmarked?'Unsave problem':'Save problem');bookmark.setAttribute('aria-pressed',String(bookmarked));}
}

const editable=target=>Boolean(target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])'));

export function createWorkspaceActions({document,getProblem=()=>null,onSubmit=()=>{}}) {
 let dialog=null,previous=null;
 function close({restoreFocus=true}={}) {
  if(!dialog?.open)return false;
  dialog.close();if(restoreFocus&&previous?.isConnected)previous.focus({preventScroll:true});previous=null;return true;
 }
 function open(trigger) {
  if(!dialog){
   dialog=document.createElement('dialog');dialog.className='shortcut-dialog';dialog.setAttribute('aria-labelledby','ohm-shortcuts-title');
   dialog.innerHTML='<header><div><span class="eyebrow muted">MAKE IT YOUR WORKSPACE</span><h2 id="ohm-shortcuts-title">A few useful shortcuts.</h2></div><button type="button" class="icon-button" aria-label="Close keyboard shortcuts">×</button></header><div class="shortcut-body"><dl><div><dt>Find a problem or tool</dt><dd><kbd>Ctrl / ⌘</kbd> <kbd>K</kbd></dd></div><div><dt>Search the library</dt><dd><kbd>/</kbd></dd></div><div><dt>Show these shortcuts</dt><dd><kbd>?</kbd></dd></div><div><dt>Close the top dialog</dt><dd><kbd>Esc</kbd></dd></div><div><dt>Move between tab headings</dt><dd><kbd>←</kbd> <kbd>→</kbd> then <kbd>Enter</kbd></dd></div></dl><h3>In your answer field</h3><dl><div><dt>Submit a number, expression, or choice</dt><dd><kbd>Ctrl / ⌘</kbd> <kbd>Enter</kbd></dd></div><div><dt>Run a Verilog test</dt><dd><kbd>Ctrl / ⌘</kbd> <kbd>Enter</kbd></dd></div><div><dt>Submit Verilog</dt><dd><kbd>Ctrl / ⌘</kbd> <kbd>Shift</kbd> <kbd>Enter</kbd></dd></div></dl><p>Typing in your scratchpad never submits an answer. The code editor also shows its indentation and completion shortcuts below the code.</p><p>On smaller screens, use <strong>Problem</strong>, <strong>Answer</strong>, and <strong>Notes</strong> at the bottom to move around a long question.</p></div>';
   document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>close());dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  }
  if(dialog.open)return;
  previous=trigger||document.activeElement;dialog.showModal();dialog.querySelector('button').focus();
 }
 function jump(section) {
  if(!getProblem()||document.querySelector('dialog[open]'))return false;
  const selector={problem:'#problem-information',answer:'#answer-form input:not([disabled]),#answer-form textarea:not([disabled])',notes:'#scratchpad'}[section];
  if(!selector)return false;
  const target=document.querySelector(selector);if(!target)return false;
  focusWorkspace(document,selector);target.scrollIntoView?.({block:'start',behavior:'auto'});return true;
 }
 function onClick(event) {
  const button=event.target.closest?.('[data-workspace-jump],[data-workspace-shortcuts]');if(!button)return false;
  if(button.hasAttribute('data-workspace-shortcuts'))open(button);else jump(button.dataset.workspaceJump);return true;
 }
 function onKeydown(event) {
  if(dialog?.open)return true;
  if(event.defaultPrevented||event.isComposing||event.repeat||document.querySelector('dialog[open]'))return false;
  if(!event.ctrlKey&&!event.metaKey&&!event.altKey&&event.key==='?'&&!editable(event.target)){event.preventDefault();open();return true;}
  if(getProblem()?.type!=='hdl'&&getProblem()&&(event.ctrlKey||event.metaKey)&&!event.shiftKey&&!event.altKey&&event.key==='Enter'&&event.target.closest?.('#answer-form')){event.preventDefault();onSubmit();return true;}
  return false;
 }
 return {open,close,jump,onClick,onKeydown,get isOpen(){return Boolean(dialog?.open);},
  helpButton:()=>'<button class="icon-button workspace-shortcuts" type="button" data-workspace-shortcuts aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">?</button>',
  quickNavigation:()=>'<nav class="workspace-quick-nav" aria-label="Workspace sections"><button type="button" data-workspace-jump="problem" aria-controls="problem-information">Problem</button><button type="button" data-workspace-jump="answer" aria-controls="answer-form">Answer</button><button type="button" data-workspace-jump="notes" aria-controls="scratchpad">Notes</button></nav>'};
}
