// Suspend only work that cannot be seen. Never change the user's motion preference.
(() => {
 const root=document.documentElement,hero=document.querySelector('.hero');
 let inView=hero.getBoundingClientRect().bottom>0,covered=false,previous='';
 const active=()=>!document.hidden&&!covered&&!root.classList.contains('motion-off');
 window.SceneMotion={get heroActive(){return inView&&active()},get ambientActive(){return active()},get heroVisible(){return inView}};
 const toggle=(name,value)=>{if(root.classList.contains(name)!==value)root.classList.toggle(name,value);};
 function sync(){
  covered=!!document.querySelector('dialog[open]');
  toggle('hero-suspended',!inView);
  toggle('modal-suspended',covered);
  toggle('page-suspended',document.hidden);
  const next=[inView,covered,document.hidden,root.classList.contains('motion-off')].join();
  if(next!==previous){previous=next;window.dispatchEvent(new Event('scene-motion-change'));}
 }
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync()},{threshold:0}).observe(hero);
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class']});
 document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['open']}));
 document.addEventListener('visibilitychange',sync);sync();
})();
