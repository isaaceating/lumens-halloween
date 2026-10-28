// Keep the original particle density and glow; render only when there is visible work.
(() => {
 const root=document.documentElement,hero=document.querySelector('.hero'),canvas=document.querySelector('#magicCanvas'),ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,frame=0,last=0,spawnTime=0,particles=[],ambientTime=0,rect=hero.getBoundingClientRect(),scrollFrame=0;
 const colors=['#b88857','#9c819c','#a5afa1','#795e89','#d49b5d'];
 const off=()=>root.classList.contains('motion-off')||reduced.matches||!window.SceneMotion.ambientActive;
 function updateViewport(){scrollFrame=0;rect=hero.getBoundingClientRect();const travel=scrollY;root.style.setProperty('--scroll',String(travel/Math.max(1,document.documentElement.scrollHeight-innerHeight)));root.style.setProperty('--hero-travel',Math.min(travel,900)+'px');start();}
 function scheduleViewport(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateViewport);}
 function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);scheduleViewport();}
 function add(x,y,n=1,force=1){if(off())return;for(let i=0;i<n;i++){const angle=Math.random()*Math.PI*2,speed=(Math.random()*2+.4)*force;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-.35,life:1,size:Math.random()*3+1.3,decay:.008+Math.random()*.013,color:colors[Math.floor(Math.random()*colors.length)],star:Math.random()>.45});}if(particles.length>160)particles.splice(0,particles.length-160);start();}
 window.addEventListener('hero-magic',e=>add(e.detail.x,e.detail.y,24,2));
 function drawStar(x,y,r){ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x+r*.2,y-r*.2,x+r,y);ctx.quadraticCurveTo(x+r*.2,y+r*.2,x,y+r);ctx.quadraticCurveTo(x-r*.2,y+r*.2,x-r,y);ctx.quadraticCurveTo(x-r*.2,y-r*.2,x,y-r);ctx.fill();}
 function animate(time){frame=0;if(off()){last=0;return;}const dt=Math.min((time-last)/16.67||1,2);last=time;
  ctx.clearRect(0,0,width,height);if(window.SceneMotion.heroActive&&time-ambientTime>260){add(Math.random()*width,Math.max(0,rect.top)+Math.random()*Math.min(rect.height,height),1,.4);ambientTime=time;}
  particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=p.decay*dt;ctx.globalAlpha=Math.max(0,p.life)*.85;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;if(p.star)drawStar(p.x,p.y,p.size*(.6+p.life));else{ctx.beginPath();ctx.arc(p.x,p.y,p.size*.55,0,Math.PI*2);ctx.fill();}}ctx.globalAlpha=1;ctx.shadowBlur=0;
  start();
 }
 function start(){if(!frame&&!off()&&(window.SceneMotion.heroActive||particles.length))frame=requestAnimationFrame(animate);else if(!particles.length&&!window.SceneMotion.heroActive)last=0;}
 window.addEventListener('pointermove',e=>{if(off()||e.pointerType!=='mouse')return;if(window.SceneMotion.heroActive&&e.clientY>=rect.top&&e.clientY<=rect.bottom){hero.style.setProperty('--pointer-x',`${e.clientX-rect.left}px`);hero.style.setProperty('--pointer-y',`${e.clientY-rect.top}px`);}if(performance.now()-spawnTime>26){add(e.clientX,e.clientY,2,.6);spawnTime=performance.now();}},{passive:true});
 hero.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,[role=button]'))return;add(e.clientX,e.clientY,35,2.5);});
 window.addEventListener('scene-motion-change',()=>{if(off()){cancelAnimationFrame(frame);frame=0;last=0;if(root.classList.contains('motion-off'))particles=[];ctx.clearRect(0,0,width,height);}else scheduleViewport();});
 window.addEventListener('scroll',scheduleViewport,{passive:true});window.addEventListener('resize',resize,{passive:true});window.addEventListener('party-entered',scheduleViewport);resize();start();
})();
