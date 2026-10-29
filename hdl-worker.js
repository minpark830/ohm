import {runClockedExercise} from './hdl-model.js?v=6b0d117a75d1508a';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
