import {runClockedExercise} from './hdl-model.js?v=50be9e1e989012d0';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
