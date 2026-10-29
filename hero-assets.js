// Full-quality images stream from immutable sources; readiness still requires decode.
function loadHeroAsset(src,{ImageCtor=Image,timeoutMs=20000}={}){
 return new Promise((resolve,reject)=>{
  const image=new ImageCtor();let settled=false;
  const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);if(error){image.src='';reject(error);}else resolve(image)};
  const timer=setTimeout(()=>finish(new Error('圖片載入逾時')),timeoutMs);
  image.decoding='async';image.src=src;
  image.decode().then(()=>finish(),()=>finish(new Error('圖片載入失敗')));
 });
}
async function prepareHeroAssets(background,urls,load=loadHeroAsset,{cache=new Map(),onProgress=()=>{}}={}){
 const sources=[...new Set([background,...urls])],queue=sources.filter(src=>!cache.has(src)),errors=[];
 const report=()=>onProgress(sources.filter(src=>cache.has(src)).length,sources.length);
 report();
 async function worker(){while(queue.length){const src=queue.shift();try{cache.set(src,await load(src));report();}catch(error){errors.push(error);}}}
 await Promise.all(Array.from({length:Math.min(4,queue.length)},worker));
 if(errors.length)throw errors[0];return sources.map(src=>cache.get(src));
}
// A timeout must abort the transport, not leave an Image request occupying a connection.
async function fetchHeroBytes(url,{fetchImpl=fetch,idleMs=15000,totalMs=180000,onBytes=()=>{},expectedSize=0}={}){
 const controller=new AbortController();let idle,total;
 const arm=()=>{clearTimeout(idle);idle=setTimeout(()=>controller.abort(),idleMs);};
 arm();total=setTimeout(()=>controller.abort(),totalMs);
 try{
  const response=await fetchImpl(url,{signal:controller.signal,cache:'force-cache'});
  if(!response.ok)throw new Error('素材下載失敗（'+response.status+'）');
  const reader=response.body.getReader(),chunks=[];let received=0;
  while(true){const {done,value}=await reader.read();if(done)break;arm();received+=value.byteLength;chunks.push(value);onBytes(received);}
  if(expectedSize&&received!==expectedSize)throw new Error('素材下載不完整');
  const bytes=new Uint8Array(received);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes;
 }finally{clearTimeout(idle);clearTimeout(total);controller.abort();}
}
async function loadHeroTransfer(src,entry,{fetchImpl=fetch,decode=loadHeroAsset,createURL=b=>URL.createObjectURL(b),revokeURL=u=>URL.revokeObjectURL(u),onBytes=()=>{},onAttempt=()=>{},idleMs=15000,totalMs=180000,digest=async b=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b))).map(n=>n.toString(16).padStart(2,'0')).join('')}={}){
 const sources=entry?.url?[entry.url,src+'?hero='+entry.sha.slice(0,12),entry.url+'&recovery=1']:[src,src+'?hero-recovery=1'];
 let last;
 for(let i=0;i<sources.length;i++){
  let objectURL;onAttempt(i);
  try{
   const bytes=await fetchHeroBytes(sources[i],{fetchImpl,idleMs,totalMs,onBytes,expectedSize:entry?.size});
   if(entry?.sha&&await digest(bytes)!==entry.sha)throw new Error('素材完整性驗證失敗');
   objectURL=createURL(new Blob([bytes],{type:'image/webp'}));
   await decode(objectURL,{timeoutMs:30000});return {url:objectURL,size:bytes.length};
  }catch(error){if(objectURL)revokeURL(objectURL);last=error;}
 }
 throw new Error(src.split('/').pop()+'：'+(last?.message||'下載失敗'));
}
async function waitForHeroFonts(fonts,timeoutMs=2500){
 let timer;try{await Promise.race([Promise.resolve(fonts?.ready).catch(()=>{}),new Promise(resolve=>{timer=setTimeout(resolve,timeoutMs);})]);}finally{clearTimeout(timer);}
}
if(typeof module==='object'&&module.exports)module.exports={loadHeroAsset,prepareHeroAssets,fetchHeroBytes,loadHeroTransfer,waitForHeroFonts};
else (()=>{
 const root=document.documentElement,hero=document.querySelector('.hero'),button=document.querySelector('#castSpell'),status=document.querySelector('#heroLoadText'),retry=document.querySelector('#retryHero'),bar=document.querySelector('#heroLoadProgress');
 const background=hero.querySelector('.castle-art').getAttribute('data-src'),nodes=[...hero.querySelectorAll('image[data-src],img[data-src]')];
 const urls=[...new Set(nodes.map(e=>e.getAttribute('data-src')))],manifest=window.HERO_ASSET_MANIFEST||{},cache=new Map(),received=new Map();
 const totalBytes=urls.reduce((n,src)=>n+(manifest[src]?.size||0),0);let loading=false,fontsDone=false,lastPercent=0;
 function report(){const bytes=urls.reduce((n,src)=>n+Math.min(received.get(src)||0,manifest[src]?.size||Infinity),0),fraction=totalBytes?bytes/totalBytes:cache.size/urls.length;
  const complete=cache.size===urls.length&&fontsDone,percent=complete?100:Math.min(99,Math.floor(90*fraction+9*cache.size/urls.length));lastPercent=Math.max(lastPercent,percent);
  status.textContent=`派對準備中… ${lastPercent}%`;
  detail.textContent=totalBytes?`已下載 ${(bytes/1048576).toFixed(1)} / ${(totalBytes/1048576).toFixed(1)} MB · 已準備 ${cache.size}/${urls.length}`:`已準備 ${cache.size}/${urls.length} 項素材`;
  bar.setAttribute('aria-valuenow',lastPercent);bar.setAttribute('aria-valuetext',detail.textContent);bar.style.setProperty('--progress',lastPercent+'%');
 }
 const detail=document.createElement('small');detail.id='heroLoadDetail';bar.after(detail);
 async function fonts(){if(fontsDone)return;await waitForHeroFonts(document.fonts);fontsDone=true;report();}
 async function load(src){const result=await loadHeroTransfer(src,manifest[src],{onBytes:n=>{received.set(src,n);report();},onAttempt:n=>{if(n){status.dataset.recovery='true';detail.textContent='正在自動切換素材來源…';}}});
  for(const node of nodes.filter(n=>n.getAttribute('data-src')===src)){node.setAttribute(node.tagName.toLowerCase()==='img'?'src':'href',result.url);}
  if(src===background)hero.style.setProperty('--hero-background',`url("${result.url}")`);
  return result;
 }
 async function prepare(){
  if(loading)return;loading=true;retry.hidden=true;button.disabled=true;report();
  try{
   const results=await Promise.allSettled([prepareHeroAssets(background,urls,load,{cache,onProgress:report}),fonts()]);
   const failure=results.find(r=>r.status==='rejected');if(failure)throw failure.reason;
   for(const node of nodes)node.removeAttribute('data-src');
   window.HeroAssets.ready=true;button.disabled=false;root.classList.add('hero-ready');
   report();
  }catch(error){status.textContent='連線中斷，尚有素材未完成';detail.textContent=error.message;retry.hidden=false;console.warn('Hero asset preparation:',error.message);}
  finally{loading=false;}
 }
 retry.addEventListener('click',prepare);prepare();
})();
