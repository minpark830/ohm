import {runClockedExercise} from './hdl-model.js?v=92e728f30bc7fefd';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
