export function openDiagramViewer(event){
 const button=event.target.closest('[data-diagram-view]');if(!button)return false;
 const source=button.parentElement.querySelector('svg');if(!source)return true;
 const dialog=document.createElement('dialog');dialog.className='diagram-viewer';dialog.setAttribute('aria-label','Enlarged circuit diagram');
 dialog.innerHTML='<div class="diagram-viewer-header"><div><h2>Circuit diagram</h2><p>Scroll sideways on smaller screens to inspect each component.</p></div><button class="button" type="button">Close</button></div><div class="diagram-viewer-scroll" tabindex="0" role="region" aria-label="Circuit diagram; scroll horizontally"></div>';
 const diagram=source.cloneNode(true);diagram.setAttribute('aria-label',source.getAttribute('aria-label')||source.querySelector('desc')?.textContent||'Circuit diagram');diagram.removeAttribute('aria-labelledby');diagram.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));dialog.querySelector('.diagram-viewer-scroll').append(diagram);document.body.append(dialog);
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{dialog.remove();if(button.isConnected)button.focus();},{once:true});dialog.showModal();return true;
}
