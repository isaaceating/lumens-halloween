// Separate lighting from Luna's cue clock: all windows lit, then a 0.6s hold.
function castleShowTiming(actualTime){
 const flightStart=3700,arrival=5200,turnStart=5400,chargeStart=5750,showEnd=12700,total=13700;
 const t=actualTime;
 const actor=t<1000?1500+t*.5:t<2000?2000+(t-1000)*1.5:t<flightStart?3500:t<arrival?3500+t-flightStart:t<chargeStart?5000:t<6250?5000+(t-chargeStart)*2:6000+t-6250;
 return {actor,lighting:t<2000?actor:3500+t-2000,flightStart,arrival,turnStart,chargeStart,turnProgress:Math.max(0,Math.min(1,(t-turnStart)/(chargeStart-turnStart))),showEnd,total};
}
// Independent landing positions preserve natural overlap without a shared edge clamp.
function pumpkinSpec(i){
 const depth=i%2===0?'front':i%3===0?'middle':'back',k=Math.floor(i/2),factor=depth==='middle'?1:.78;
 const size=depth==='front'?76+(i%5)*14:(40+(i%6)*12)*factor;
 const right=depth==='front'?k%2===1:i%4<2,landing=right?35+Math.floor((i*.61803398875%1)*230):-(80+(i*71%340));
 return {depth,size,delay:i*.05,vx:landing/3.5,sway:8+(i*7%13),phase:i*2.399,vy:depth==='front'?-105-(k*31%90):(-90-(i%5)*16)*factor,gravity:depth==='front'?100+(k*7%25):depth==='middle'?95:82,spin:((depth==='front'?k:i)%2?1:-1)*(20+i%4*12)};
}
function pumpkinPosition(p,age){return {x:1050+p.vx*age+p.sway*Math.sin(age*1.7+p.phase)*Math.sin(Math.PI*age/3.5),y:30+p.vy*age+p.gravity*age*age};}
function witchReturnPose(t,mobile=false){
 const u=Math.max(0,Math.min(1,(t-11700)/1000)),p=u*u*(3-2*u);
 const handoff=Math.max(0,Math.min(1,(t-12700)/1000)),travel=500*handoff*handoff,q=travel/2400;
 return {x:1050-250*p+(mobile?360:410)*q,y:280-95*p+(mobile?25:20)*q,scale:1.4-.1*p-.05*q,rotation:mobile?0:2*q,cycleTime:3200+travel};
}
if(typeof module==='object'&&module.exports)module.exports={castleShowTiming,pumpkinSpec,pumpkinPosition,witchReturnPose};
else (() => {
 const hero=document.querySelector('.hero'),stage=document.querySelector('.inhabitants>svg'),button=document.querySelector('#castSpell'),root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),ns='http://www.w3.org/2000/svg';
 const attr=(e,key,value)=>{const text=String(value);if(e.getAttribute(key)!==text)e.setAttribute(key,text)};
 const make=(tag,attrs={},parent=stage)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(tag==='image'&&k==='href'?'data-src':k,v);parent.append(e);return e};
 const layer=make('g',{'class':'awakening-lights','aria-hidden':'true'});
 layer.innerHTML='<defs><radialGradient id="awake-halo"><stop stop-color="#ffe7aa" stop-opacity=".9"/><stop offset=".3" stop-color="#ffc36a" stop-opacity=".45"/><stop offset="1" stop-color="#ff9b50" stop-opacity="0"/></radialGradient><linearGradient id="path-warmth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffd687" stop-opacity=".65"/><stop offset="1" stop-color="#ffb44b" stop-opacity="0"/></linearGradient></defs>';
 const lamps=[[1060,650,260],[825,565,125],[1340,460,135],[1055,405,130],[1200,335,140],[1055,315,125],[1055,210,140]].map(([cx,cy,r])=>make('circle',{cx,cy,r,fill:'url(#awake-halo)',opacity:0},layer));
 const road=make('path',{d:'M1015 710 L1110 710 Q1130 820 1230 1024 L650 1024 Q940 830 1015 710Z',fill:'url(#path-warmth)',opacity:0,'class':'wake-road'},layer);
 const tip=make('circle',{cx:1050,cy:30,r:130,fill:'url(#awake-halo)',opacity:0},layer);
 const witch=stage.querySelector('.witch-flight'),heading=stage.querySelector('.witch-heading');
 const bursts={back:make('g',{'class':'pumpkin-burst pumpkin-back','aria-hidden':'true'}),middle:make('g',{'class':'pumpkin-burst pumpkin-middle','aria-hidden':'true'}),front:make('g',{'class':'pumpkin-burst pumpkin-front','aria-hidden':'true'})};
 stage.insertBefore(layer,witch);stage.insertBefore(bursts.back,witch);stage.insertBefore(bursts.middle,witch);stage.insertBefore(bursts.front,witch.nextSibling);
 const pumpkins=Array.from({length:30},(_,i)=>{const p=pumpkinSpec(i);return {...p,e:make('image',{href:'assets/evil-pumpkin-lantern.webp',x:-p.size/2,y:-p.size/2,width:p.size,height:p.size,opacity:0},bursts[p.depth])};});
 const witchAnimations=[...witch.getAnimations(),...heading.getAnimations()];
 const front=make('image',{href:'assets/witch-casting-front.webp',x:-161.69,y:-126.73,width:323.38,height:244.72,opacity:0,'class':'witch-front','aria-hidden':'true'},witch);
 const trail=make('path',{d:'M-80 65 Q-200 100 -330 70 M-100 85 Q-220 130 -370 110',fill:'none',stroke:'#e8aa78','stroke-width':9,'stroke-linecap':'round',opacity:0,'class':'witch-spell-trail'},witch);witch.insertBefore(trail,witch.firstChild);
 const orb=document.createElement('span');orb.className='awakening-orb';orb.setAttribute('aria-hidden','true');hero.append(orb);
 const pumpkinTrail=make('path',{fill:'none',stroke:'#ffbe72','stroke-width':5,'stroke-linecap':'round',opacity:0,'class':'charge-mote','aria-hidden':'true'});
 const castingPumpkin=make('image',{href:'assets/evil-pumpkin-lantern.webp',x:-34,y:-34,width:68,height:68,opacity:0,'class':'casting-pumpkin','aria-hidden':'true'});
 const motes=Array.from({length:14},(_,i)=>make('circle',{r:2+i%3,fill:i%2?'#e5bbff':'#ffe7ad',opacity:0,'class':'charge-mote','aria-hidden':'true'}));
 let running=false,elapsed=0,last=0,raf=0,nextSpark=0,stageMatrix;
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},mix=(a,b,p)=>a+(b-a)*p;
 const dialogue=detail=>window.dispatchEvent(new CustomEvent('castle-dialogue',{detail}));
 const point=(x,y)=>new DOMPoint(x,y).matrixTransform(stageMatrix);
 const spark=(x,y)=>window.dispatchEvent(new CustomEvent('hero-magic',{detail:{x,y}}));
 function revealParty(){if(root.classList.contains('castle-entered'))return;root.classList.add('castle-entered');try{sessionStorage.setItem('lumens-party-entered','1')}catch{}window.dispatchEvent(new Event('party-entered'))}
 function finish(){running=false;cancelAnimationFrame(raf);hero.classList.remove('awakening');hero.classList.remove('castle-awake');hero.style.setProperty('--cat-form',0);hero.style.setProperty('--wake-level',0);hero.style.removeProperty('--wake-power');hero.style.removeProperty('--resident-energy');delete hero.dataset.awakeningTime;for(const e of [witch,heading])for(const p of ['transform','opacity'])e.style.removeProperty(p);witchAnimations.forEach(a=>{a.currentTime=witchReturnPose(castleShowTiming(elapsed).total).cycleTime});attr(front,'opacity',0);attr(trail,'opacity',0);orb.style.opacity=0;orb.style.setProperty('--orb-scale','1');attr(castingPumpkin,'opacity',0);attr(pumpkinTrail,'opacity',0);motes.forEach(e=>attr(e,'opacity',0));lamps.forEach(c=>attr(c,'opacity',0));attr(road,'opacity',0);attr(tip,'opacity',0);pumpkins.forEach(p=>attr(p.e,'opacity',0));button.disabled=false;button.textContent='喚醒古堡，派對開場';dialogue(null)}
 function render(actualTime){
  const {actor:time,lighting:lightTime,flightStart,showEnd,chargeStart:frontChargeStart,turnProgress}=castleShowTiming(actualTime);
  stageMatrix=stage.getScreenCTM();const inverse=stageMatrix.inverse(),hr=hero.getBoundingClientRect();
  attr(castingPumpkin,'opacity',0);attr(pumpkinTrail,'opacity',0);
  const startX=innerWidth<=800?680:440,fade=1-smooth((actualTime-showEnd)/1000);
  const approach=smooth((time-3500)/1500);
  let x=mix(startX,1050,approach),y=270+approach*10-Math.sin(approach*Math.PI)*65,scale=mix(1.3,1.4,approach);
  let rotation=0;if(time>=11450){({x,y,scale,rotation}=witchReturnPose(actualTime,innerWidth<=800));}
  witch.style.setProperty('transform',`translate(${x}px,${y}px) scale(${scale}) rotate(${rotation}deg)`,'important');witch.style.setProperty('opacity','1','important');heading.style.setProperty('transform','none','important');
  const facing=smooth(turnProgress)*(1-smooth((time-11450)/500));heading.style.setProperty('opacity',1-facing,'important');attr(front,'opacity',facing);attr(trail,'opacity',actualTime>=flightStart&&time<5000?.8*(1-facing):0);
  const hand=point(startX+95,270),door=point(1060,650);let ball;
  if(time<2000)ball=hand;
  else {const p=smooth((time-2000)/1500);ball={x:mix(hand.x,door.x,p),y:mix(hand.y,door.y,p)-Math.sin(p*Math.PI)*80}}
  orb.style.transform=`translate3d(${ball.x-hr.left}px,${ball.y-hr.top}px,0) translate(-50%,-50%) scale(var(--orb-scale,1))`;orb.style.opacity=lightTime<3400?'1':String(1-smooth((lightTime-3400)/450));
  // Both hand charges share converging gold/violet motes and the same orb.
  const secondCharge=actualTime>=frontChargeStart&&time<6000;
  const charging=(time>=1500&&time<2000)||secondCharge;
  const palm=point(x-48.07*scale,y-48.07*scale);
  const chargePoint=secondCharge?palm:hand;
  const chargeStart=secondCharge?5000:1500,chargeDuration=secondCharge?1000:500;
  motes.forEach((e,i)=>{if(!charging){attr(e,'opacity',0);return}const p=((time-chargeStart)/chargeDuration+i/14)%1,angle=i*2.4+p*2.5,radius=70*(1-p);const screen={x:chargePoint.x+Math.cos(angle)*radius,y:chargePoint.y+Math.sin(angle)*radius*.7};const local=new DOMPoint(screen.x,screen.y).matrixTransform(inverse);attr(e,'cx',local.x);attr(e,'cy',local.y);attr(e,'opacity',Math.sin(p*Math.PI))});
  orb.style.setProperty('--orb-scale',charging?String(.3+1.15*smooth((time-chargeStart)/chargeDuration)):time>=2000&&time<3500?'1.45':'1');
  if(actualTime>=frontChargeStart&&time<6800){const peak=point(1050,30),p=smooth((time-6000)/500);const cast={x:mix(palm.x,peak.x,p),y:mix(palm.y,peak.y,p)-Math.sin(p*Math.PI)*35};orb.style.transform=`translate3d(${cast.x-hr.left}px,${cast.y-hr.top}px,0) translate(-50%,-50%) scale(var(--orb-scale,1))`;orb.style.opacity=String(1-smooth((time-6500)/300));if(time>=6000){orb.style.opacity=0;const local=new DOMPoint(cast.x,cast.y).matrixTransform(inverse),tail=new DOMPoint(mix(palm.x,peak.x,Math.max(0,p-.22)),mix(palm.y,peak.y,Math.max(0,p-.22))).matrixTransform(inverse);attr(castingPumpkin,'transform',`translate(${local.x} ${local.y}) rotate(${p*30})`);attr(castingPumpkin,'opacity',1-smooth((time-6500)/300));attr(pumpkinTrail,'d',`M${tail.x} ${tail.y} L${local.x} ${local.y}`);attr(pumpkinTrail,'opacity',.65*(1-smooth((time-6500)/300)))}}
  const level=smooth((lightTime-3500)/650)*fade;const pulse=Math.sin(Math.PI*clamp((lightTime-3500)/800))*.35;const power=level*(1+pulse);hero.style.setProperty('--wake-level',level);hero.style.setProperty('--wake-power',power);hero.style.setProperty('--resident-energy',power);hero.style.setProperty('--cat-form',smooth((lightTime-4000)/1500)*fade);if(lightTime>=3500){hero.classList.add('castle-awake');revealParty()}
  lamps.forEach((c,i)=>attr(c,'opacity',smooth((lightTime-3500-i*100)/500)*fade*1.25));attr(road,'opacity',power*1.15);attr(tip,'opacity',smooth((time-6400)/400)*fade);
  pumpkins.forEach(p=>{const {e,delay,spin}=p,age=(time-6500)/1000-delay;if(age<0||age>3.5){attr(e,'opacity',0);return}const {x:px,y:py}=pumpkinPosition(p,age);attr(e,'transform',`translate(${px} ${py}) rotate(${spin*age})`);attr(e,'opacity',smooth(age/.2)*(1-smooth((age-2.4)/1.1))) });
  if(lightTime>nextSpark){nextSpark=lightTime+170;if(time>1500&&time<2000)spark(hand.x,hand.y);else if(lightTime>3500&&lightTime<4500){const q=point(1060+(Math.random()-.5)*150,710);spark(q.x,q.y)}}

 }
 function frame(now){if(!running)return;const paused=!window.SceneMotion.heroActive;if(paused){raf=0;last=now;return;}if(!paused)elapsed+=Math.min(now-last,100);last=now;hero.dataset.awakeningTime=Math.round(elapsed);if(!paused)render(elapsed);if(elapsed>=castleShowTiming(elapsed).total){finish();return}raf=requestAnimationFrame(frame)}
 function startShow(){if(running||!window.HeroAssets?.ready)return;if(reduced.matches||root.classList.contains('motion-off')){revealParty();finish();return}dialogue(null);running=true;elapsed=0;nextSpark=0;last=performance.now();hero.classList.remove('castle-awake');hero.style.setProperty('--cat-form',0);hero.style.setProperty('--wake-level',0);hero.classList.add('awakening');button.disabled=true;button.textContent='古堡甦醒中…';render(0);raf=requestAnimationFrame(frame)}
 window.addEventListener('scene-motion-change',()=>{if(!running)return;if(!window.SceneMotion.heroActive){cancelAnimationFrame(raf);raf=0;}else if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}});
 button.addEventListener('click',startShow);
 reduced.addEventListener('change',()=>{if(reduced.matches&&running){revealParty();finish()}});
})();
