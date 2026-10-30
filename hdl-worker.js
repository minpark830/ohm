import {runClockedExercise} from './hdl-model.js?v=5601ad9fd5efe681';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
