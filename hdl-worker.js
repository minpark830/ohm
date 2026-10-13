import {runClockedExercise} from './hdl-model.js?v=5a6db230efbf0bf2';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
