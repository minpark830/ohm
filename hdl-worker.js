import {runClockedExercise} from './hdl-model.js?v=ceacf964d1420d5c';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
