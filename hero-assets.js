// Decode the full-quality background first, then a bounded queue of scene assets.
function loadHeroAsset(src,{ImageCtor=Image,timeoutMs=20000}={}){
 return new Promise((resolve,reject)=>{
  const image=new ImageCtor();let settled=false;
  const finish=(error)=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(image)};
  const timer=setTimeout(()=>finish(new Error('圖片載入逾時')),timeoutMs);
  image.decoding='async';image.fetchPriority=src.includes('lumens-castle-v6')?'high':'auto';image.src=src;
  image.decode().then(()=>finish(),()=>finish(new Error('圖片載入失敗')));
 });
}
async function prepareHeroAssets(background,urls,load=loadHeroAsset){
 const images=[await load(background)],queue=[...new Set(urls)].filter(src=>src!==background);
 async function worker(){while(queue.length)images.push(await load(queue.shift()));}
 const results=await Promise.allSettled(Array.from({length:Math.min(3,queue.length)},worker));
 const failure=results.find(result=>result.status==='rejected');if(failure)throw failure.reason;return images;
}
if(typeof module==='object'&&module.exports)module.exports={loadHeroAsset,prepareHeroAssets};
else (()=>{
 const root=document.documentElement,hero=document.querySelector('.hero'),button=document.querySelector('#castSpell'),status=document.querySelector('.hero-load-state span'),retry=document.querySelector('#retryHero');
 let loading=false;
 async function prepare(){
  if(loading)return;loading=true;retry.hidden=true;button.disabled=true;status.textContent='古堡準備中…';
  try{
   const background=hero.querySelector('.castle-art').getAttribute('src');
   const nodes=[...hero.querySelectorAll('image[data-src]')];
   const images=await prepareHeroAssets(background,[...nodes.map(e=>e.getAttribute('data-src')),...[...hero.querySelectorAll('img[src]')].map(e=>e.getAttribute('src'))]);
   // The SVG references already decoded cache entries; no lower-resolution substitutes.
   for(const node of nodes){node.setAttribute('href',node.getAttribute('data-src'));node.removeAttribute('data-src');}
   if(document.fonts){let timer;try{await Promise.race([document.fonts.ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('字型載入逾時')),20000)})]);}finally{clearTimeout(timer);}}
   window.HeroAssets.ready=true;button.disabled=false;root.classList.add('hero-ready');
   requestAnimationFrame(()=>{images.length=0});
  }catch(error){status.textContent='古堡未能完成載入，請重試。';retry.hidden=false;}
  finally{loading=false;}
 }
 retry.addEventListener('click',prepare);prepare();
})();
