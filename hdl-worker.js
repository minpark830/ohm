import {runClockedExercise} from './hdl-model.js?v=6a634941589c3c0e';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
