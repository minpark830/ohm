import {runClockedExercise} from './hdl-model.js?v=ce033701414479af';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
