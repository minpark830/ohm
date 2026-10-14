import {runClockedExercise} from './hdl-model.js?v=6c6b130bc0f356ca';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
