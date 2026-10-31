import {runClockedExercise} from './hdl-model.js?v=a8dd77a14a7d6aad';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
