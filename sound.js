// Audio is optional: it never participates in Hero readiness or changes its clock.
(() => {
 const button=document.querySelector('#musicToggle'),status=document.querySelector('#musicStatus');
 const background=new Audio('assets/background-music.mp3'),awakening=new Audio('assets/awakening-music.mp3');
 background.loop=true;
 background.id='backgroundAudio';awakening.id='awakeningAudio';
 background.hidden=true;awakening.hidden=true;document.body.append(background,awakening);
 for(const audio of [background,awakening]){audio.preload='none';audio.volume=0;}
 let enabled=true,started=false,phase='background',performing=false,generation=0,fade=0,prepared=false,needsGesture=false;
 function label(){button.textContent=needsGesture&&enabled?'♫ 點擊啟用音樂':enabled?'♫ 關閉音樂':'♫ 開啟音樂';button.setAttribute('aria-pressed',String(enabled&&!needsGesture));}
 function blocked(){return document.hidden||[...document.querySelectorAll('video')].some(v=>!v.paused&&!v.ended)||(performing&&!window.SceneMotion?.heroActive);}
 function stop(){generation++;cancelAnimationFrame(fade);background.pause();awakening.pause();}
 function sync(){
  stop();label();if(!started||!enabled||blocked())return;
  const audio=phase==='awakening'?awakening:background,version=generation;
  // The background file already has its gain reduced to 22%.
  const target=phase==='awakening'?.7:1;audio.volume=target;
  const timer=setTimeout(()=>{if(version===generation&&audio.readyState<3){stop();status.textContent='音樂載入較慢，可按音樂開關重試';}},2000);
  audio.play().then(()=>{
   clearTimeout(timer);if(version!==generation)return;needsGesture=false;label();status.textContent='';if(phase==='awakening')return;const from=performance.now();
   function ramp(now){if(version!==generation)return;audio.volume=target*Math.min(1,(now-from)/450);if(now-from<450)fade=requestAnimationFrame(ramp);}
   fade=requestAnimationFrame(ramp);
  }).catch(error=>{clearTimeout(timer);if(version===generation){needsGesture=error.name==='NotAllowedError';label();status.textContent=needsGesture?'點一下頁面即可開啟背景音樂':'音樂未能播放，請按音樂開關重試';}});
 }
 button.addEventListener('click',()=>{enabled=needsGesture?true:!enabled;needsGesture=false;started=true;sync();});
 function unlock(event){
  if(event.target.closest?.('#musicToggle,#castSpell')||!enabled||!prepared||(!needsGesture&&started))return;
  needsGesture=false;started=true;sync();
 }
 document.addEventListener('click',unlock,true);document.addEventListener('keydown',unlock,true);
 window.addEventListener('castle-show-start',()=>{started=true;phase='awakening';performing=true;awakening.currentTime=0;sync();});
 window.addEventListener('castle-show-end',()=>{performing=false;sync();});
 awakening.addEventListener('ended',()=>{phase='background';background.currentTime=0;sync();});
 document.addEventListener('visibilitychange',sync);
 window.addEventListener('scene-motion-change',()=>{
  if(!prepared&&window.HeroAssets?.ready){prepared=true;started=true;for(const audio of [background,awakening]){audio.preload='auto';audio.load();}}
  sync();
 });
 for(const event of ['play','pause','ended'])document.addEventListener(event,e=>{if(e.target.tagName==='VIDEO')sync();},true);
 // Closing a viewer can remove a playing video without emitting pause.
 new MutationObserver(()=>{if(started&&!document.querySelector('video:not([hidden])'))sync();}).observe(document.querySelector('#detailContent'),{childList:true});
 label();
})();
