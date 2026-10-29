const zoomSteps=[.5,.75,1,1.25,1.5,2,3,4];
let activeViewer=null,viewerSequence=0;

export function nextDiagramZoom(current,action){
 const value=Number.isFinite(current)?Math.max(.5,Math.min(4,current)):1;
 if(action==='in')return zoomSteps.find(step=>step>value)||4;
 if(action==='out')return [...zoomSteps].reverse().find(step=>step<value)||.5;
 return 1;
}

// Fit the complete drawing rather than cropping a tall schematic to its width.
export function fitDiagramSize(viewBox,width,height){
 const values=typeof viewBox==='string'?viewBox.trim().split(/[\s,]+/).map(Number):[];
 const valid=values.length===4&&values.every(Number.isFinite)&&values[2]>=1e-6&&values[3]>=1e-6&&values[2]<=1e6&&values[3]<=1e6;
 const sourceWidth=valid?values[2]:720,sourceHeight=valid?values[3]:360;
 const availableWidth=Number.isFinite(width)&&width>0?width:720,availableHeight=Number.isFinite(height)&&height>0?height:360;
 const scale=Math.min(availableWidth/sourceWidth,availableHeight/sourceHeight);
 return {width:sourceWidth*scale,height:sourceHeight*scale};
}

// Keep internal title/description, marker and clip references intact while
// giving every cloned ID its own name. SVG content is cloned, never reparsed.
export function cloneDiagram(source,prefix){
 const diagram=source.cloneNode(true),nodes=[diagram,...diagram.querySelectorAll('*')],ids=new Map();
 nodes.forEach((node,index)=>{const id=node.getAttribute('id');if(id){const replacement=`${prefix}-${index}`;if(!ids.has(id))ids.set(id,replacement);node.setAttribute('id',replacement);}});
 for(const node of nodes)for(const attribute of [...node.attributes]){
  if(['aria-labelledby','aria-describedby','aria-controls','aria-owns','aria-activedescendant','aria-details'].includes(attribute.name)){
   const references=attribute.value.trim().split(/\s+/).map(id=>ids.get(id)).filter(Boolean);
   if(references.length)node.setAttribute(attribute.name,references.join(' '));else node.removeAttribute(attribute.name);
  }else if(['href','xlink:href'].includes(attribute.name)&&attribute.value.startsWith('#')){
   const replacement=ids.get(attribute.value.slice(1));if(replacement)node.setAttribute(attribute.name,'#'+replacement);else node.removeAttribute(attribute.name);
  }else if(attribute.name!=='id'){
   node.setAttribute(attribute.name,attribute.value.replace(/url\(\s*(['"]?)#([^)'"\s]+)\1\s*\)/g,(match,quote,id)=>ids.has(id)?`url(#${ids.get(id)})`:match));
  }
 }
 diagram.setAttribute('role','img');
 if(!diagram.getAttribute('aria-labelledby')&&!diagram.getAttribute('aria-label'))diagram.setAttribute('aria-label',source.querySelector('title')?.textContent||source.querySelector('desc')?.textContent||'Circuit diagram');
 return diagram;
}

export function closeDiagramViewer({restoreFocus=true}={}){
 const current=activeViewer;if(!current)return false;
 current.restoreFocus=restoreFocus;
 if(current.dialog.open)current.dialog.close();else current.cleanup();
 return true;
}

export function openDiagramViewer(event){
 const button=event.target?.closest?.('[data-diagram-view]');if(!button)return false;
 const source=button.parentElement?.querySelector('svg');if(!source)return true;
 const doc=source.ownerDocument||document;
 closeDiagramViewer({restoreFocus:false});
 const prefix=`ohm-diagram-inspect-${++viewerSequence}`,dialog=doc.createElement('dialog');
 dialog.className='diagram-viewer';dialog.setAttribute('aria-label','Circuit diagram inspector');dialog.setAttribute('aria-describedby',prefix+'-help');
 dialog.innerHTML='<div class="diagram-viewer-header"><div><h2>Inspect the circuit.</h2><p>Zoom to read labels, then scroll to explore each component.</p></div><button class="button" type="button" data-diagram-action="close" aria-label="Close circuit diagram">Close</button></div><div class="diagram-viewer-toolbar" role="group" aria-label="Diagram zoom"><button class="button" type="button" data-diagram-action="out" aria-label="Zoom out">−</button><output class="diagram-viewer-zoom" aria-live="polite" aria-label="Zoom relative to fitted diagram">100%</output><button class="button" type="button" data-diagram-action="in" aria-label="Zoom in">+</button><button class="button" type="button" data-diagram-action="fit" aria-label="Fit diagram">Fit</button><span>+ / − to zoom · 0 to fit</span></div><div class="diagram-viewer-scroll" tabindex="0" role="region" aria-label="Circuit diagram; scroll horizontally or vertically"><div class="diagram-viewer-stage"></div></div><p class="diagram-viewer-help">Tab to the diagram and use the arrow keys to scroll. Fit shows the whole drawing; zoom is relative to that fitted size.</p>';
 const region=dialog.querySelector('.diagram-viewer-scroll'),stage=dialog.querySelector('.diagram-viewer-stage'),output=dialog.querySelector('output'),help=dialog.querySelector('.diagram-viewer-help');
 help.id=prefix+'-help';region.setAttribute('aria-describedby',help.id);
 const diagram=cloneDiagram(source,prefix+'-svg');stage.append(diagram);doc.body.append(dialog);
 let zoom=1,box={width:0,height:0},observer=null,cleaned=false;
 const current={dialog,restoreFocus:true,cleanup(){
  if(cleaned)return;cleaned=true;observer?.disconnect();dialog.remove();if(activeViewer===current)activeViewer=null;
  if(current.restoreFocus&&button.isConnected)button.focus({preventScroll:true});
 }};activeViewer=current;
 function render(next,{reset=false}={}){
  const width=region.clientWidth,height=region.clientHeight;
  const centerX=box.width?(region.scrollLeft+width/2-Math.max(0,(width-box.width)/2))/box.width:.5;
  const centerY=box.height?(region.scrollTop+height/2-Math.max(0,(height-box.height)/2))/box.height:.5;
  zoom=next;const fitted=fitDiagramSize(source.getAttribute('viewBox'),width,height);box={width:fitted.width*zoom,height:fitted.height*zoom};
  diagram.style.width=box.width+'px';diagram.style.height=box.height+'px';
  output.textContent=Math.round(zoom*100)+'%';dialog.querySelector('[data-diagram-action="out"]').disabled=zoom<=.5;dialog.querySelector('[data-diagram-action="in"]').disabled=zoom>=4;
  region.scrollLeft=reset?0:Math.max(0,centerX*box.width+Math.max(0,(width-box.width)/2)-width/2);
  region.scrollTop=reset?0:Math.max(0,centerY*box.height+Math.max(0,(height-box.height)/2)-height/2);
 }
 function change(action){if(action==='close'){closeDiagramViewer();return;}render(nextDiagramZoom(zoom,action),{reset:action==='fit'});}
 dialog.addEventListener('click',click=>{
  const action=click.target?.closest?.('[data-diagram-action]');if(action){change(action.dataset.diagramAction);return;}
  if(click.target===dialog){const rect=dialog.getBoundingClientRect();if(click.clientX<rect.left||click.clientX>rect.right||click.clientY<rect.top||click.clientY>rect.bottom)closeDiagramViewer();}
 });
 dialog.addEventListener('keydown',key=>{
  if(key.defaultPrevented||key.isComposing||key.ctrlKey||key.metaKey||key.altKey||key.target?.isContentEditable||key.target?.closest?.('input,textarea,select,[contenteditable="true"],[role="textbox"]'))return;
  const action=['+','='].includes(key.key)?'in':['-','−','_'].includes(key.key)?'out':key.key==='0'?'fit':null;
  if(!action)return;key.preventDefault();key.stopPropagation();change(action);
 });
 dialog.addEventListener('close',current.cleanup,{once:true});
 try{
  if(typeof dialog.showModal!=='function')throw new Error('Modal dialogs unavailable');
  dialog.showModal();render(1,{reset:true});dialog.querySelector('[data-diagram-action="close"]').focus({preventScroll:true});
  if(typeof ResizeObserver==='function'){observer=new ResizeObserver(()=>{if(dialog.open)render(zoom,{reset:zoom===1});});observer.observe(region);}
 }catch{current.restoreFocus=false;current.cleanup();}
 return true;
}
