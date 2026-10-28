// Full-quality images and fonts prepare concurrently; progress counts decoded assets.
function loadHeroAsset(src,{ImageCtor=Image,timeoutMs=20000}={}){
 return new Promise((resolve,reject)=>{
  const image=new ImageCtor();let settled=false;
  const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(image)};
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
if(typeof module==='object'&&module.exports)module.exports={loadHeroAsset,prepareHeroAssets};
else (()=>{
 const root=document.documentElement,hero=document.querySelector('.hero'),button=document.querySelector('#castSpell'),status=document.querySelector('#heroLoadText'),retry=document.querySelector('#retryHero'),bar=document.querySelector('#heroLoadProgress');
 const background=hero.querySelector('.castle-art').getAttribute('src'),nodes=[...hero.querySelectorAll('image[data-src]')];
 const urls=[...nodes.map(e=>e.getAttribute('data-src')),...[...hero.querySelectorAll('img[src]')].map(e=>e.getAttribute('src'))];
 const total=new Set([background,...urls]).size+1,cache=new Map();let loading=false,fontsDone=false;
 function report(){const done=cache.size+Number(fontsDone),percent=Math.floor(done/total*100);status.textContent=`派對準備中… ${percent}%`;bar.setAttribute('aria-valuenow',percent);bar.setAttribute('aria-valuetext',`${done} / ${total} 項素材已準備`);bar.style.setProperty('--progress',percent+'%');}
 async function fonts(){if(fontsDone)return;let timer;try{await Promise.race([document.fonts?.ready||Promise.resolve(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('字型載入逾時')),20000)})]);fontsDone=true;report();}finally{clearTimeout(timer);}}
 async function prepare(){
  if(loading)return;loading=true;retry.hidden=true;button.disabled=true;report();
  try{
   const results=await Promise.allSettled([prepareHeroAssets(background,urls,loadHeroAsset,{cache,onProgress:report}),fonts()]);
   const failure=results.find(r=>r.status==='rejected');if(failure)throw failure.reason;
   for(const node of nodes){node.setAttribute('href',node.getAttribute('data-src'));node.removeAttribute('data-src');}
   window.HeroAssets.ready=true;button.disabled=false;root.classList.add('hero-ready');
   requestAnimationFrame(()=>cache.clear());
  }catch(error){status.textContent='載入未完成，請重試';retry.hidden=false;}
  finally{loading=false;}
 }
 retry.addEventListener('click',prepare);prepare();
})();
