// Feedback belongs to one workspace and one submitted answer. This state never
// leaves memory, and is separate from the server's saved submission record.
export function submissionAccountUnchanged(initial,session,authLost=false){
  return initial.signedIn===true
    ?session.signedIn===true&&!authLost&&Boolean(initial.accountId)&&session.user?.id===initial.accountId
    :initial.signedIn===false&&session.signedIn===false;
}

export function createSubmissionFeedback() {
  let generation=0, current=null;
  const snapshot=()=>current?structuredClone(current):null;
  return {
    get state(){return snapshot();},
    get busy(){return current?.phase==='checking';},
    reset(){generation++;current=null;},
    begin({problemId,version,value,runOnly=false}){
      if(current?.phase==='checking')return null;
      const ticket={generation:++generation,problemId,version};
      current={phase:'checking',value:String(value),currentValue:String(value),runOnly:Boolean(runOnly),response:null};
      return Object.freeze(ticket);
    },
    edit(value){if(current)current.currentValue=String(value);},
    finish(ticket,response){
      if(!ticket||ticket.generation!==generation||!current)return false;
      current={...current,phase:'checked',response:structuredClone(response)};return true;
    },
    fail(ticket,message){
      if(!ticket||ticket.generation!==generation||!current)return false;
      current={...current,phase:'error',response:{message:String(message)}};return true;
    }
  };
}

export function feedbackPresentation(state) {
  if(!state)return null;
  const previous=state.currentValue!==state.value;
  if(state.phase==='checking')return {kind:'pending',title:'Checking your submission…',message:previous?'Your answer changed while this check was running. The result will apply to the answer you submitted.':'Comparing your submitted answer with this problem’s requirements.',previous};
  if(state.phase==='error')return {kind:'error',title:'The submission could not be checked',message:state.response?.message||'Please try again.',previous};
  const response=state.response||{},pass=response.pass===true;
  return {
    kind:previous?'previous':pass?'success':'error',
    title:previous?'Previous submission':pass?(state.runOnly?'All tests passed':'Accepted. Nicely reasoned.'):(state.runOnly?'Some tests failed':'Not quite. Give it another try.'),
    message:previous?'You changed your answer after submitting it. The feedback below belongs to the earlier answer; check your current answer again.':response.feedback||(pass?(state.runOnly?'Your logic matches every input combination. Submit to save this solve.':'Your answer checks out. Open the solution to compare the reasoning.'):'Check your units, signs, and assumptions. A hint can help you find the next step.'),
    previous,response
  };
}
