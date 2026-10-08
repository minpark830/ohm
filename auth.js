// Supabase owns passwords, PKCE and refresh tokens. Ohm's API independently
// verifies each access token before resolving a private progress account.
export async function createAuth({config,createClient,storage,location=window.location,history=window.history,onChange=()=>{}}){
  if(!storage){try{storage=globalThis.localStorage;}catch{}}
  storage ||= {getItem:()=>null,setItem:()=>{throw new Error('Browser storage is unavailable.');},removeItem:()=>{}};
  const providerKey='ohm-auth-provider';
  let provider='chatgpt',client=null,recovery=false,error='',subject=null;
  try{const saved=storage.getItem(providerKey);if(['supabase','chatgpt','guest'].includes(saved))provider=saved;}catch{}
  const select=value=>{storage.setItem(providerKey,value);provider=value;};
  const requireStorage=()=>{try{storage.setItem('ohm-auth-probe','1');storage.removeItem('ohm-auth-probe');}catch{throw new Error('Allow browser storage to sign in. You can keep practicing as a guest.');}};
  const callback=kind=>location.origin+'/?auth='+kind+'#account';
  if(config.enabled){
    client=createClient(config.url,config.publishableKey,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'ohm-supabase-auth',storage}});
    client.auth.onAuthStateChange((event,session)=>{
      if(event==='PASSWORD_RECOVERY')recovery=true;
      // Do not call async SDK methods from its locked event callback.
      if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED','PASSWORD_RECOVERY'].includes(event))setTimeout(()=>onChange({event,subject:session?.user?.id||null}),0);
    });
    const url=new URL(location.href);
    try{
      if(url.searchParams.has('code')){
        requireStorage();select('supabase');
        const result=await client.auth.exchangeCodeForSession(url.searchParams.get('code'));
        if(result.error)throw new Error('This sign-in link expired or was opened in a different browser. Start sign-in again here.');
        recovery=recovery||url.searchParams.get('auth')==='recovery';
        history.replaceState(null,'',recovery?'/?auth=recovery#account':'/#account');
      }else if(url.searchParams.has('error')||location.hash.includes('error=')){
        throw new Error('Sign-in was not completed. Please try again.');
      }
      const result=await client.auth.getSession();
      if(result.error)throw result.error;
      subject=result.data.session?.user?.id||null;
      if(subject){if(!storage.getItem(providerKey))select('supabase');recovery=recovery||url.searchParams.get('auth')==='recovery';}
    }catch(e){error=e.message;history.replaceState(null,'','/#account');}
  }
  const requireClient=()=>{if(!client)throw new Error('Email and Google sign-in are not available yet.');requireStorage();return client;};
  const checked=async promise=>{const result=await promise;if(result.error)throw result.error;return result.data;};
  return {
    config,get provider(){return provider;},get recovery(){return recovery;},get error(){return error;},get subject(){return subject;},
    async headers(){
      // Honor changes in another tab without ever silently selecting a fallback.
      try{const current=storage.getItem(providerKey);if(['supabase','chatgpt','guest'].includes(current))provider=current;}catch{}
      if(provider!=='supabase')return {'X-Ohm-Auth-Provider':provider};
      const result=client?await client.auth.getSession():null;
      if(result?.error)throw new Error('Sign-in could not be refreshed. Please try again.');
      const token=result?.data?.session?.access_token;
      return {'X-Ohm-Auth-Provider':'supabase',...(token?{'X-Ohm-Access-Token':token}:{})};
    },
    async signIn(email,password){if(!config.email)throw new Error('Email sign-in is not available yet.');const sdk=requireClient();const data=await checked(sdk.auth.signInWithPassword({email,password}));select('supabase');return data;},
    async signUp(email,password){if(!config.email)throw new Error('Email sign-up is not available yet.');const sdk=requireClient();const data=await checked(sdk.auth.signUp({email,password,options:{emailRedirectTo:callback('callback')}}));if(data.session)select('supabase');return data;},
    async google(){if(!config.google)throw new Error('Google sign-in is not available yet.');const sdk=requireClient();select('supabase');return checked(sdk.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback('callback')}}));},
    async sendRecovery(email){if(!config.email)throw new Error('Password recovery is not available yet.');return checked(requireClient().auth.resetPasswordForEmail(email,{redirectTo:callback('recovery')}));},
    async updatePassword(password){await checked(requireClient().auth.updateUser({password}));recovery=false;history.replaceState(null,'','/#account');},
    async signOut(){if(client)await checked(client.auth.signOut({scope:'local'}));select('guest');},
    legacy(){try{select('chatgpt');}catch{provider='chatgpt';}},
    keepExternal(){requireStorage();select('supabase');}
  };
}
