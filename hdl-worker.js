import {runClockedExercise} from './hdl-model.js?v=807fb25cc85c75aa';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
