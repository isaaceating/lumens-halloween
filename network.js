// Bound both connection and response-body waits; never retry a write automatically.
async function requestJson(url,body,{timeoutMs=15000,fetchImpl=fetch}={}){
 const controller=new AbortController();let timer;
 const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{const error=new Error('連線等候逾時，請檢查網路後重試。');error.uncertain=true;reject(error);controller.abort();},timeoutMs);});
 try{return await Promise.race([(async()=>{let response,data;try{response=await fetchImpl(url,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:controller.signal});data=await response.json();}catch(cause){const error=new Error('連線中斷或回應不完整，請檢查網路後重試。');error.uncertain=true;throw error;}if(!response.ok){const error=new Error(data.error||'服務暫時無法回應，請稍後重試。');error.status=response.status;error.uncertain=response.status>=500;throw error;}return data;})(),timeout]);}finally{clearTimeout(timer);}
}
if(typeof module==='object'&&module.exports)module.exports={requestJson};
