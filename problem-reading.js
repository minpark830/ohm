// Description-only presentation. Problem text remains the authoritative model;
// the helper changes reading order without deriving answers or hiding assumptions.
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=value=>typeof value==='string'?value:'';

// Sentence segmentation supplies safe visual paragraph breaks for long prompts.
// Keep every source character, including whitespace, decimal points and symbols.
export function problemReadingParagraphs(prompt,segmenter=undefined){
 const source=text(prompt);if(!source)return [];
 let sentences;
 try{
  const reader=segmenter===undefined?(typeof Intl.Segmenter==='function'?new Intl.Segmenter('en',{granularity:'sentence'}):null):segmenter;
  if(!reader)return [source];
  sentences=[...reader.segment(source)].map(item=>item.segment);
 }catch{return [source];}
 if(sentences.some(sentence=>typeof sentence!=='string')||sentences.join('')!==source)return [source];
 const paragraphs=[];let paragraph='',count=0;
 for(const sentence of sentences){
  paragraph+=sentence;count++;
  if(paragraph.length>=320&&count>=2){paragraphs.push(paragraph);paragraph='';count=0;}
 }
 if(paragraph)paragraphs.push(paragraph);
 return paragraphs;
}

// diagramMarkup and companyMarkup are trusted, pre-escaped markup supplied by
// the existing app renderers. Never take either from owner-authored text fields.
export function problemReadingMarkup({problem={},esc=escape,diagramMarkup='',companyMarkup=''}={}){
 const task=text(problem?.task),prompt=text(problem?.prompt);
 const given=(Array.isArray(problem?.given)?problem.given:[]).filter(item=>item&&typeof item.label==='string'&&typeof item.value==='string');
 const diagram=typeof diagramMarkup==='string'?diagramMarkup:'';
 const company=typeof companyMarkup==='string'?companyMarkup:'';
 return `<div class="problem-reading">${task?`<section class="task-box reading-goal" aria-label="What to find"><h2>What to find</h2><p>${esc(task)}</p></section>`:''}${company}${diagram?`<section class="reading-section reading-diagram" aria-label="Problem diagram"><h2>Diagram</h2>${diagram}</section>`:''}${given.length?`<section class="reading-section reading-data" aria-label="Given values"><h2>Given</h2><dl class="reading-givens">${given.map(item=>`<div><dt>${esc(item.label)}</dt><dd>${esc(item.value)}</dd></div>`).join('')}</dl></section>`:''}${prompt?`<section class="reading-section reading-model" aria-label="Scenario and model assumptions"><h2>Scenario and model</h2>${problemReadingParagraphs(prompt).map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}</section>`:''}</div>`;
}
