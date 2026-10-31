import {runClockedExercise} from './hdl-model.js?v=22c97c590ebdf290';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
