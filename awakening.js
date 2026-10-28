// An 8.3-second witch-led show with a 3-second fade; all inhabitants return to the dormant scene.
(() => {
 const hero=document.querySelector('.hero'),stage=document.querySelector('.inhabitants>svg'),button=document.querySelector('#castSpell'),root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),ns='http://www.w3.org/2000/svg';
 const make=(tag,attrs={},parent=stage)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);parent.append(e);return e};
 const layer=make('g',{'class':'awakening-lights','aria-hidden':'true'});
 layer.innerHTML='<defs><radialGradient id="awake-halo"><stop stop-color="#ffe7aa" stop-opacity=".9"/><stop offset=".3" stop-color="#ffc36a" stop-opacity=".45"/><stop offset="1" stop-color="#ff9b50" stop-opacity="0"/></radialGradient><linearGradient id="path-warmth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffd687" stop-opacity=".65"/><stop offset="1" stop-color="#ffb44b" stop-opacity="0"/></linearGradient></defs>';
 const lamps=[[1060,650,260],[825,565,125],[1340,460,135],[1055,405,130],[1200,335,140],[1055,315,125],[1055,210,140]].map(([cx,cy,r])=>make('circle',{cx,cy,r,fill:'url(#awake-halo)',opacity:0},layer));
 const road=make('path',{d:'M1015 710 L1110 710 Q1130 820 1230 1024 L650 1024 Q940 830 1015 710Z',fill:'url(#path-warmth)',opacity:0,'class':'wake-road'},layer);
 const tip=make('circle',{cx:1050,cy:100,r:130,fill:'url(#awake-halo)',opacity:0},layer);
 const burst=make('g',{'class':'pumpkin-burst','aria-hidden':'true'});
 const pumpkins=Array.from({length:30},(_,i)=>{const size=40+(i%6)*12;return {e:make('image',{href:'assets/evil-pumpkin-lantern.png',x:-size/2,y:-size/2,width:size,height:size,opacity:0},burst),delay:i*.05,vx:((i*137%29)-14)*19,vy:-90-(i%5)*16,spin:(i%2?1:-1)*(20+i%4*12)}});
 const witch=stage.querySelector('.witch-flight'),heading=stage.querySelector('.witch-heading');
 stage.insertBefore(layer,witch);stage.insertBefore(burst,witch);
 const witchAnimations=[...witch.getAnimations(),...heading.getAnimations()];
 const front=make('image',{href:'assets/witch-casting-front.png',x:-170.2,y:-133.4,width:340.4,height:257.6,opacity:0,'class':'witch-front','aria-hidden':'true'},witch);
 const trail=make('path',{d:'M-80 65 Q-200 100 -330 70 M-100 85 Q-220 130 -370 110',fill:'none',stroke:'#e8aa78','stroke-width':9,'stroke-linecap':'round',opacity:0,'class':'witch-spell-trail'},witch);witch.insertBefore(trail,witch.firstChild);
 const orb=document.createElement('span');orb.className='awakening-orb';orb.setAttribute('aria-hidden','true');hero.append(orb);
 const pumpkinTrail=make('path',{fill:'none',stroke:'#ffbe72','stroke-width':5,'stroke-linecap':'round',opacity:0,'class':'charge-mote','aria-hidden':'true'});
 const castingPumpkin=make('image',{href:'assets/evil-pumpkin-lantern.png',x:-34,y:-34,width:68,height:68,opacity:0,'class':'casting-pumpkin','aria-hidden':'true'});
 const motes=Array.from({length:14},(_,i)=>make('circle',{r:2+i%3,fill:i%2?'#e5bbff':'#ffe7ad',opacity:0,'class':'charge-mote','aria-hidden':'true'}));
 let running=false,elapsed=0,last=0,raf=0,nextSpark=0,voice,spoken=false,cleared=false;
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},mix=(a,b,p)=>a+(b-a)*p;
 const dialogue=detail=>window.dispatchEvent(new CustomEvent('castle-dialogue',{detail}));
 const point=(x,y)=>new DOMPoint(x,y).matrixTransform(stage.getScreenCTM());
 const spark=(x,y)=>window.dispatchEvent(new CustomEvent('hero-magic',{detail:{x,y}}));
 const voices=[{at:4200,selector:'.painted-pumpkin',line:'等你好久啦！'},{at:5200,selector:'.painted-skeleton',line:'宴會，現在開始。'},{at:6800,selector:'.witch-flight',line:'看好了，南瓜派對現在開始！'}];
 function revealParty(){if(root.classList.contains('castle-entered'))return;root.classList.add('castle-entered');try{sessionStorage.setItem('lumens-party-entered','1')}catch{}window.dispatchEvent(new Event('party-entered'))}
 function finish(){running=false;cancelAnimationFrame(raf);hero.classList.remove('awakening');hero.classList.remove('castle-awake');hero.style.setProperty('--cat-form',0);hero.style.setProperty('--wake-level',0);hero.style.removeProperty('--wake-power');hero.style.removeProperty('--resident-energy');delete hero.dataset.awakeningTime;for(const e of [witch,heading])for(const p of ['transform','opacity'])e.style.removeProperty(p);witchAnimations.forEach(a=>{a.currentTime=3200});front.setAttribute('opacity',0);trail.setAttribute('opacity',0);orb.style.opacity=0;orb.style.scale='1';castingPumpkin.setAttribute('opacity',0);pumpkinTrail.setAttribute('opacity',0);motes.forEach(e=>e.setAttribute('opacity',0));lamps.forEach(c=>c.setAttribute('opacity',0));road.setAttribute('opacity',0);tip.setAttribute('opacity',0);pumpkins.forEach(p=>p.e.setAttribute('opacity',0));button.disabled=false;button.textContent='喚醒古堡，派對開場';dialogue(null)}
 function render(actualTime){
  // Map the shorter travel/charge phases onto existing cues; all other durations stay intact.
  const time=actualTime<800?actualTime*1500/800:actualTime<1300?1500+actualTime-800:actualTime<2300?2000+(actualTime-1300)*1.5:actualTime<3800?3500+actualTime-2300:actualTime<4300?5000+(actualTime-3800)*2:6000+actualTime-4300;
  castingPumpkin.setAttribute('opacity',0);pumpkinTrail.setAttribute('opacity',0);
  const startX=innerWidth<=800?680:440,fade=1-smooth((time-10000)/3000);
  const approach=smooth((time-3500)/1500),returning=smooth((time-6500)/3500);
  let x=mix(startX,1050,approach),y=270+approach*10-Math.sin(approach*Math.PI)*65,scale=mix(1.3,1.4,approach);
  if(time>=6500){x=mix(1050,800,returning);y=mix(280,185,returning);scale=mix(1.4,1.3,returning)}
  witch.style.setProperty('transform',`translate(${x}px,${y}px) scale(${scale})`,'important');witch.style.setProperty('opacity','1','important');heading.style.setProperty('transform','none','important');
  const facing=smooth((time-4500)/500)*(1-smooth((time-6500)/500));heading.style.setProperty('opacity',1-facing,'important');front.setAttribute('opacity',facing);trail.setAttribute('opacity',time>=3500&&time<5000?.8*(1-facing):0);
  const hr=hero.getBoundingClientRect(),br=button.getBoundingClientRect(),hand=point(startX+95,270),door=point(1060,650),start={x:br.left+br.width/2,y:br.top+br.height/2};let ball;
  if(time<1500){const p=smooth(time/1500);ball={x:mix(start.x,hand.x,p),y:mix(start.y,hand.y,p)-Math.sin(p*Math.PI)*90}}
  else if(time<2000)ball=hand;
  else {const p=smooth((time-2000)/1500);ball={x:mix(hand.x,door.x,p),y:mix(hand.y,door.y,p)-Math.sin(p*Math.PI)*80}}
  orb.style.left=ball.x-hr.left+'px';orb.style.top=ball.y-hr.top+'px';orb.style.opacity=time<3400?'1':String(1-smooth((time-3400)/450));
  // Both hand charges share converging gold/violet motes and the same orb.
  const secondCharge=time>=5000&&time<6000;
  const charging=(time>=1500&&time<2000)||secondCharge;
  const palm=new DOMPoint(-50.6,-50.6).matrixTransform(witch.getScreenCTM());
  const chargePoint=secondCharge?palm:hand;
  const chargeStart=secondCharge?5000:1500,chargeDuration=secondCharge?1000:500;
  motes.forEach((e,i)=>{if(!charging){e.setAttribute('opacity',0);return}const p=((time-chargeStart)/chargeDuration+i/14)%1,angle=i*2.4+p*2.5,radius=70*(1-p);const screen={x:chargePoint.x+Math.cos(angle)*radius,y:chargePoint.y+Math.sin(angle)*radius*.7};const local=new DOMPoint(screen.x,screen.y).matrixTransform(stage.getScreenCTM().inverse());e.setAttribute('cx',local.x);e.setAttribute('cy',local.y);e.setAttribute('opacity',Math.sin(p*Math.PI))});
  orb.style.scale=charging?String(.55+.65*smooth((time-chargeStart)/chargeDuration)):'1';
  if(time>=5000&&time<6800){const peak=point(1050,100),p=smooth((time-6000)/500);const cast={x:mix(palm.x,peak.x,p),y:mix(palm.y,peak.y,p)-Math.sin(p*Math.PI)*35};orb.style.left=cast.x-hr.left+'px';orb.style.top=cast.y-hr.top+'px';orb.style.opacity=String(1-smooth((time-6500)/300));if(time>=6000){orb.style.opacity=0;const local=new DOMPoint(cast.x,cast.y).matrixTransform(stage.getScreenCTM().inverse()),tail=new DOMPoint(mix(palm.x,peak.x,Math.max(0,p-.22)),mix(palm.y,peak.y,Math.max(0,p-.22))).matrixTransform(stage.getScreenCTM().inverse());castingPumpkin.setAttribute('transform',`translate(${local.x} ${local.y}) rotate(${p*30})`);castingPumpkin.setAttribute('opacity',1-smooth((time-6500)/300));pumpkinTrail.setAttribute('d',`M${tail.x} ${tail.y} L${local.x} ${local.y}`);pumpkinTrail.setAttribute('opacity',.65*(1-smooth((time-6500)/300)))}}
  const level=smooth((time-3500)/650)*fade;const pulse=Math.sin(Math.PI*clamp((time-3500)/800))*.35;const power=level*(1+pulse);hero.style.setProperty('--wake-level',level);hero.style.setProperty('--wake-power',power);hero.style.setProperty('--resident-energy',power);hero.style.setProperty('--cat-form',smooth((time-4000)/1500)*fade);if(time>=3500){hero.classList.add('castle-awake');revealParty()}
  lamps.forEach((c,i)=>c.setAttribute('opacity',smooth((time-3500-i*100)/500)*fade*1.25));road.setAttribute('opacity',power*1.15);tip.setAttribute('opacity',smooth((time-6400)/400)*fade);
  pumpkins.forEach(({e,delay,vx,vy,spin})=>{const age=(time-6500)/1000-delay;if(age<0||age>3.5){e.setAttribute('opacity',0);return}const px=1050+vx*age,py=120+vy*age+95*age*age;e.setAttribute('transform',`translate(${px} ${py}) rotate(${spin*age})`);e.setAttribute('opacity',smooth(age/.2)*(1-smooth((age-2.4)/1.1))) });
  if(time>nextSpark){nextSpark=time+170;if(time>1500&&time<2000)spark(hand.x,hand.y);else if(time>3500&&time<4500){const q=point(1060+(Math.random()-.5)*150,710);spark(q.x,q.y)}}
  if(!spoken&&time>=voice.at){spoken=true;dialogue(voice)}if(spoken&&!cleared&&time>=voice.at+2400){cleared=true;dialogue(null)}
 }
 function frame(now){if(!running)return;const paused=root.classList.contains('motion-off')||document.hidden;if(!paused)elapsed+=Math.min(now-last,100);last=now;hero.dataset.awakeningTime=Math.round(elapsed);if(!paused)render(elapsed);if(elapsed>=11300){finish();return}raf=requestAnimationFrame(frame)}
 function startShow(){if(running)return;if(reduced.matches||root.classList.contains('motion-off')){revealParty();finish();dialogue(voices[0]);setTimeout(()=>dialogue(null),2400);return}running=true;elapsed=0;nextSpark=0;spoken=false;cleared=false;last=performance.now();voice=voices[Math.floor(Math.random()*voices.length)];hero.classList.remove('castle-awake');hero.style.setProperty('--cat-form',0);hero.style.setProperty('--wake-level',0);hero.classList.add('awakening');button.disabled=true;button.textContent='古堡甦醒中…';render(0);raf=requestAnimationFrame(frame)}
 button.addEventListener('click',startShow);
 document.querySelector('#replayCastle').addEventListener('click',()=>startShow());
 reduced.addEventListener('change',()=>{if(reduced.matches&&running){revealParty();finish()}});
})();
