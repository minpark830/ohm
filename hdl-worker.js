import {runClockedExercise} from './hdl-model.js?v=dc7cdecf1d31ff61';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runClockedExercise(event.data)});}catch(error){self.postMessage({ok:false,error:error.message});}};
