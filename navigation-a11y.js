export function focusWorkspace(document,selector) {
  const target=(selector&&document.querySelector(selector))||document.querySelector('#main h1')||document.querySelector('#main');
  if(!target)return false;
  if(!target.matches?.('button,a,input,select,textarea,[tabindex]'))target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});return true;
}

// Manual activation avoids opening a hint/solution merely while moving focus.
export function moveTabFocus(event) {
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return false;
  const list=event.target.closest?.('[role="tablist"]'),tab=event.target.closest?.('[role="tab"]');
  if(!list||!tab)return false;
  const tabs=[...list.querySelectorAll('[role="tab"]')].filter(item=>!item.disabled&&item.getAttribute('aria-disabled')!=='true');
  const index=tabs.indexOf(tab);if(index<0||!tabs.length)return false;
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  event.preventDefault();tabs.forEach((item,i)=>item.setAttribute('tabindex',i===next?'0':'-1'));tabs[next].focus();return true;
}
