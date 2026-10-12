(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],H=document.documentElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,MOBILE=innerWidth<760;
$('#y').textContent=new Date().getFullYear();

/* intro */
const intro=$('#intro');
const endIntro=()=>{if(!intro||intro.classList.contains('gone'))return;intro.classList.add('out');H.classList.remove('wait');try{sessionStorage.setItem('ab-intro','1')}catch(e){}setTimeout(()=>intro.classList.add('gone'),900)};
if(RM||H.classList.contains('no-intro')){intro&&intro.classList.add('gone')}else{H.classList.add('wait');intro.querySelector('.intro-skip').onclick=endIntro;addEventListener('keydown',e=>{if(e.key==='Escape')endIntro()},{once:true});setTimeout(endIntro,1650)}

/* smooth scroll */
let lenis=null;
if(!RM&&window.Lenis){lenis=new Lenis({duration:1.15,smoothWheel:true});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const t=id==='#top'?document.body:$(id);if(!t)return;e.preventDefault();lenis?lenis.scrollTo(t,{offset:id==='#top'?0:-76}):t.scrollIntoView({behavior:RM?'auto':'smooth'});if(id!=='#top'&&t.focus){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}}));

/* nav */
const nav=$('#nav'),b=$('.burger');
b.onclick=()=>{const o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu')};
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');b.setAttribute('aria-expanded',false)}));

/* scroll-linked: progress, nav, timeline */
const prog=$('#prog'),tl=$('#tl'),fill=$('#tlFill'),steps=$$('#tl li');
const onScroll=()=>{const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${max>0?y/max:0})`;nav.classList.toggle('scrolled',y>10);
 const r=tl.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.65-r.top)/r.height));fill.style.transform=`scaleY(${RM?1:p})`;
 steps.forEach(li=>{const lr=li.getBoundingClientRect();li.classList.toggle('lit',lr.top+lr.height/2<innerHeight*.65)})};
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* reveals + count-up */
const count=el=>{const to=parseFloat(el.dataset.to),dec=(el.dataset.to.split('.')[1]||'').length;if(RM){el.textContent=to.toFixed(dec);return}const t0=performance.now(),d=1400;const f=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,4);el.textContent=(to*e).toFixed(dec);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');e.target.querySelectorAll&&e.target.querySelectorAll('.count').forEach(c=>{if(!c.dataset.done){c.dataset.done=1;count(c)}});io.unobserve(e.target)}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach(el=>io.observe(el));const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelector('.rv.mask').classList.add('in');io2.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});$$('.rv.mask').forEach(el=>{io.unobserve(el);io2.observe(el.parentElement)});

/* tilt + spotlight */
if(FINE&&!RM){$$('.tilt').forEach(c=>{let raf=0;c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{c.classList.add('tilting');c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.transform=`perspective(900px) rotateX(${(.5-y)*8}deg) rotateY(${(x-.5)*10}deg) translateY(-4px)`})});c.addEventListener('pointerleave',()=>{cancelAnimationFrame(raf);c.classList.remove('tilting');c.style.transform=''})})}

/* magnetic */
if(FINE&&!RM){$$('.magnetic').forEach(m=>{m.addEventListener('pointermove',e=>{const r=m.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;m.style.transform=`translate(${x*.25}px,${y*.35}px)`;const s=m.firstElementChild;if(s)s.style.transform=`translate(${x*.12}px,${y*.15}px)`});m.addEventListener('pointerleave',()=>{m.style.transition='transform .6s cubic-bezier(.16,1,.3,1)';m.style.transform='';const s=m.firstElementChild;if(s)s.style.transform='';setTimeout(()=>m.style.transition='',600)})})}

/* custom cursor */
if(FINE&&!RM){H.classList.add('has-cursor');const cur=$('.cursor'),dot=$('.c-dot'),ring=$('.c-ring');let mx=-99,my=-99,rx=-99,ry=-99;
 addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px)`},{passive:true});
 const loop=()=>{rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)};loop();
 document.addEventListener('pointerover',e=>cur.classList.toggle('hover',!!e.target.closest('a,button,.carousel')));
 document.addEventListener('pointerleave',()=>{mx=my=-99})}

/* hero logo parallax tilt */
const logo=$('#heroLogo');
if(logo&&FINE&&!RM){let tx=0,ty=0,cx=0,cy=0,run=false;addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5);if(!run){run=true;requestAnimationFrame(step)}},{passive:true});
 function step(){cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;logo.style.transform=`rotateY(${cx*16}deg) rotateX(${-cy*12}deg) translate3d(${cx*14}px,${cy*10+Math.min(scrollY,600)*.15}px,0)`;if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)requestAnimationFrame(step);else run=false}
 addEventListener('scroll',()=>{if(!run){run=true;requestAnimationFrame(step)}},{passive:true})}

/* gold dust */
const cv=$('#dust');
if(cv&&!RM){const ctx=cv.getContext('2d');let W,Hh,dpr=Math.min(devicePixelRatio||1,MOBILE?1.5:2),ps=[],vis=true,mx=-1e3,my=-1e3;const N=MOBILE?38:95;
 const size=()=>{const r=cv.getBoundingClientRect();W=r.width;Hh=r.height;cv.width=W*dpr;cv.height=Hh*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
 const mk=init=>({x:Math.random()*W,y:init?Math.random()*Hh:Hh+10,r:Math.random()*1.8+.4,vy:-(Math.random()*.35+.08),vx:(Math.random()-.5)*.15,a:Math.random()*.6+.2,tw:Math.random()*6.28,g:Math.random()<.18});
 size();ps=Array.from({length:N},()=>mk(true));addEventListener('resize',size);
 cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
 new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis)requestAnimationFrame(draw)}).observe(cv);
 function draw(t){if(!vis||document.hidden){if(!document.hidden)return;setTimeout(()=>requestAnimationFrame(draw),500);return}ctx.clearRect(0,0,W,Hh);
  for(const p of ps){p.x+=p.vx;p.y+=p.vy;p.tw+=.03;const dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<12000){const f=(12000-d2)/12000*.9;p.x+=dx/Math.sqrt(d2+1)*f;p.y+=dy/Math.sqrt(d2+1)*f}
   if(p.y<-10||p.x<-10||p.x>W+10)Object.assign(p,mk(false));const al=p.a*(.6+.4*Math.sin(p.tw));
   ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=p.g?`rgba(61,220,132,${al*.7})`:`rgba(240,200,90,${al})`;ctx.shadowBlur=p.r*6;ctx.shadowColor=p.g?'#3ddc84':'#f0c85a';ctx.fill()}
  ctx.shadowBlur=0;requestAnimationFrame(draw)}
 requestAnimationFrame(draw)}

/* carousel: drag + auto-scroll + arrows (single scroll owner, no fighting) */
const car=$('#car');
if(car){let down=false,sx=0,sl=0,moved=0,hover=false,pos=car.scrollLeft,last=pos,target=null,hold=0,dir=1,cvis=false;
 const now=()=>performance.now(),max=()=>car.scrollWidth-car.clientWidth,pauseFor=ms=>hold=Math.max(hold,now()+ms);
 const cardW=()=>car.querySelector('.slip').offsetWidth+24;
 car.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=car.scrollLeft;car._pid=e.pointerId;target=null});
 car.addEventListener('pointermove',e=>{if(!down)return;const d=e.clientX-sx;moved=Math.max(moved,Math.abs(d));if(moved>5&&!car.classList.contains('drag')){car.classList.add('drag');try{car.setPointerCapture(car._pid)}catch(_){}}if(moved>5){car.scrollLeft=sl-d;pos=last=car.scrollLeft}});
 const up=()=>{if(!down)return;down=false;pauseFor(2500);setTimeout(()=>car.classList.remove('drag'),0)};car.addEventListener('pointerup',up);car.addEventListener('pointercancel',up);
 car.addEventListener('click',e=>{if(moved>5){e.preventDefault();e.stopPropagation();moved=0}},true);
 car.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true});car.addEventListener('pointerleave',()=>hover=false);
 car.addEventListener('touchstart',()=>{target=null;pauseFor(4000)},{passive:true});car.addEventListener('focusin',()=>pauseFor(6000));
 new IntersectionObserver(([e])=>cvis=e.isIntersecting).observe(car);
 const tick=()=>{const cur=car.scrollLeft,m=max();
  if(Math.abs(cur-last)>1.5&&target===null){pos=cur}/* user swiped/scrolled natively */
  if(target!==null){pos+=(target-pos)*(RM?1:.16);if(Math.abs(target-pos)<.6){pos=target;target=null}car.scrollLeft=pos}
  else if(!RM&&cvis&&!hover&&!down&&now()>hold){pos+=.45*dir;if(pos>=m){pos=m;dir=-1}if(pos<=0){pos=0;dir=1}car.scrollLeft=pos}
  last=car.scrollLeft;requestAnimationFrame(tick)};requestAnimationFrame(tick);
 const go=d=>{const w=cardW(),m=max(),base=target!==null?target:car.scrollLeft;let t;if(d>0&&base>=m-4)t=0;else if(d<0&&base<=4)t=m;/* wrap around at ends */
  else t=Math.round(base/w)*w+d*w;
  target=Math.min(m,Math.max(0,t));pauseFor(5000)};
 [['#prev',-1],['#next',1]].forEach(([id,d])=>{const btn=$(id);btn.addEventListener('click',e=>{e.preventDefault();go(d)})});
 car.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}})}

/* lightbox */
const lb=$('#lb'),li=lb.querySelector('img'),lp=lb.querySelector('p');let last;
const close=()=>{lb.hidden=true;lenis&&lenis.start();document.body.style.overflow='';last&&last.focus()};
$$('.zoom').forEach(z=>z.addEventListener('click',()=>{last=z;li.src=z.dataset.src;li.alt=z.querySelector('img').alt;lp.textContent=z.dataset.cap;lb.hidden=false;lenis&&lenis.stop();document.body.style.overflow='hidden';lb.querySelector('.x').focus()}));
lb.addEventListener('click',e=>{if(e.target!==li)close()});addEventListener('keydown',e=>{if(!lb.hidden&&(e.key==='Escape'||e.key==='Tab')){if(e.key==='Tab'){e.preventDefault();lb.querySelector('.x').focus()}else close()}});
})();
