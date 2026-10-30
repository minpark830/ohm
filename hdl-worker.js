import {runClockedExercise} from './hdl-model.js?v=f7435ebd4a867484';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
