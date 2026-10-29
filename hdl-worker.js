import {runClockedExercise} from './hdl-model.js?v=d8a3ac5afc6a4ca2';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
