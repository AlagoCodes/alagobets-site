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
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const t=id==='#top'?document.body:$(id);if(!t)return;e.preventDefault();lenis?lenis.scrollTo(t,{offset:id==='#top'?0:-96}):t.scrollIntoView({behavior:RM?'auto':'smooth'});if(id!=='#top'&&t.focus){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}}));

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
 document.documentElement.addEventListener('mouseleave',()=>cur.classList.add('away'));document.documentElement.addEventListener('mouseenter',()=>cur.classList.remove('away'));addEventListener('blur',()=>cur.classList.add('away'))}

/* hero logo parallax tilt */
const logo=$('#heroLogo');
if(logo&&FINE&&!RM){let tx=0,ty=0,cx=0,cy=0,run=false;addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5);if(!run){run=true;requestAnimationFrame(step)}},{passive:true});
 function step(){cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;logo.style.transform=`rotateY(${cx*16}deg) rotateX(${-cy*12}deg) translate3d(${cx*14}px,${cy*10+Math.min(scrollY,600)*.15}px,0)`;if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)requestAnimationFrame(step);else run=false}
 addEventListener('scroll',()=>{if(!run){run=true;requestAnimationFrame(step)}},{passive:true})}

/* gold dust */
const cv=$('#dust');
const startDust=()=>{if(cv&&!RM){const ctx=cv.getContext('2d');let W,Hh,dpr=Math.min(devicePixelRatio||1,MOBILE?1.5:2),ps=[],vis=true,mx=-1e3,my=-1e3;const N=MOBILE?38:95;
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
 requestAnimationFrame(draw)}};
if(document.readyState==='complete')setTimeout(startDust,300);else addEventListener('load',()=>setTimeout(startDust,300),{once:true});

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
/* ===== polish pass ===== */
(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ripple */
if(!RM)$$('.btn').forEach(b=>b.addEventListener('pointerdown',e=>{const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2.2,s=document.createElement('span');s.className='ripple';s.style.width=s.style.height=d+'px';s.style.left=e.clientX-r.left-d/2+'px';s.style.top=e.clientY-r.top-d/2+'px';b.appendChild(s);setTimeout(()=>s.remove(),700)}));
/* active nav */
const links=$$('#menu a[href^="#"]'),map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const nio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});const a=map.get(e.target.id);if(a){a.classList.add('active');a.setAttribute('aria-current','true')}}}),{rootMargin:'-45% 0px -50% 0px'});
['about','models','wins','how','community','faq','vip','join'].forEach(id=>{const s=document.getElementById(id);s&&nio.observe(s)});
/* back to top ring + mobile bar */
const tt=$('#totop'),ring=$('#ring'),mbar=$('#mbar'),hero=$('.hero'),join=$('#join'),C=132;
const upd=()=>{const y=scrollY,max=document.documentElement.scrollHeight-innerHeight,p=max>0?y/max:0;ring.style.strokeDashoffset=C*(1-p);tt.classList.toggle('show',y>innerHeight*.8);
 const pastHero=hero.getBoundingClientRect().bottom<0,jr=join.getBoundingClientRect(),nearJoin=jr.top<innerHeight;const show=pastHero&&!nearJoin;mbar.classList.toggle('show',show);tt.classList.toggle('lift',show)};
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
/* discord invite counts: live polling (60s while card + tab visible), count-up, backoff, silent errors */
const inv=document.getElementById('community');
if(inv){const API='https://discord.com/api/v9/invites/qv9yThhm7e?with_counts=true',BASE=60000,MAXB=600000;
 let seen=false,onScreen=false,timer=0,delay=BASE,busy=false,lastAt=0,cur={on:null,mem:null},els=null;
 const fmt=n=>Math.round(n).toLocaleString('en-US');
 const build=()=>{const c=$('#invCounts');c.textContent='';els={};[['on','Online'],['mem','Members']].forEach(([k,l])=>{const s=document.createElement('span'),i=document.createElement('i'),b=document.createElement('b'),n=document.createElement('span');i.className=k;n.className='cnt';b.append(n,' '+l);s.append(i,b);c.append(s);els[k]={n,dot:i}})};
 const tween=(el,from,to)=>{if(RM||from===null){el.textContent=fmt(to);return}const t0=performance.now(),d=900;const f=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 const render=(on,mem)=>{if(!els)build();const ch=cur.on!==null&&(on!==cur.on||mem!==cur.mem);tween(els.on.n,cur.on,on);tween(els.mem.n,cur.mem,mem);
  if(ch&&!RM){[els.on.dot,els.mem.dot].forEach(d=>{d.classList.remove('bump');void d.offsetWidth;d.classList.add('bump')})}cur={on,mem}};
 const active=()=>seen&&onScreen&&!document.hidden;
 const schedule=ms=>{clearTimeout(timer);timer=0;if(active())timer=setTimeout(poll,ms)};
 const poll=()=>{if(busy)return;busy=true;lastAt=Date.now();const ctrl=new AbortController(),kill=setTimeout(()=>ctrl.abort(),8000);
  fetch(API,{signal:ctrl.signal,credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store'}).then(r=>{
   if(r.status===429){const ra=parseFloat(r.headers.get('retry-after'));throw{retry:Number.isFinite(ra)?ra*1000:null}}
   if(!r.ok)throw{};return r.json()}).then(d=>{
   const g=d.guild||{},on=d.approximate_presence_count,mem=d.approximate_member_count;if(g.name)$('#invName').textContent=g.name;
   if(Number.isFinite(on)&&Number.isFinite(mem))render(on,mem);delay=BASE}).catch(e=>{
   delay=Math.min(MAXB,Math.max(e&&e.retry||0,delay*2))/* keep last good values, back off quietly */}).finally(()=>{clearTimeout(kill);busy=false;schedule(delay)})};
 new IntersectionObserver(([e])=>{onScreen=e.isIntersecting;if(onScreen&&!seen){seen=true;poll()}else if(onScreen){if(!timer&&!busy)schedule(Date.now()-lastAt>=delay?0:delay-(Date.now()-lastAt))}else{clearTimeout(timer);timer=0}},{rootMargin:'600px 0px'}).observe(inv);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);timer=0}else if(seen&&onScreen&&!busy&&Date.now()-lastAt>5000){delay=Math.min(delay,BASE);poll()}else schedule(delay)});
 addEventListener('focus',()=>{if(seen&&onScreen&&!busy&&Date.now()-lastAt>5000)poll()});}
})();

/* copy-on-click command chips */
(()=>{const t=document.getElementById('toast');let tm;const show=m=>{t.textContent=m;t.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>t.classList.remove('show'),1800)};
const fallback=s=>{const a=document.createElement('textarea');a.value=s;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}a.remove();return ok};
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',async()=>{const s=c.dataset.cmd;let ok=false;try{await navigator.clipboard.writeText(s);ok=true}catch(e){ok=fallback(s)}
c.classList.add('copied');setTimeout(()=>c.classList.remove('copied'),1200);show(ok?`Copied ${s} — paste it in Discord`:`Type ${s} in Discord`)}))})();

/* discord demo: 5 model tabs; reply layouts mirror each bot's real output (titles/labels from bot code), values are placeholders */
(()=>{const box=document.getElementById('demoBox');if(!box)return;const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const D={
 nfl:{ch:'alago-nfl-model',bot:'Alago NFL Model',cmd:'/nflslate',
  html:`<div class="d-txt"><p><b>🏈 ALAGO PROPS | NFL SLATE BREAKDOWN</b></p><p class="d-sub">Analysis 10:42 AM ET · ESPN schedule + DK prices</p>
<p class="d-line"><b>1. Best supported straight bet:</b> BUF@KC · Chiefs -3.5 · -110 · est. 56.2% (model edge +2.1 pts) · EV +7.3% · QUALIFIED +EV → LEAN</p>
<p class="d-line"><b>2. Best supported player prop:</b> BUF@KC · Josh Allen o1.5 pass TD · +105 · est. 53.0% · EV +8.6% · QUALIFIED +EV → LEAN</p>
<p class="d-line"><b>3. Best potential +EV opportunity:</b> DET@GB · Under 47.5 · -108 · est. 54.8% · EV +5.5% · QUALIFIED +EV → LOW</p>
<p class="d-line"><b>4. Best-supported parlay candidates:</b> Chiefs -3.5 (QUALIFIED +EV); Josh Allen o1.5 pass TD (QUALIFIED +EV)</p>
<p class="d-line"><b>5. Games and markets worth monitoring:</b> PHI@DAL Eagles ML -135 (needs -125 or better)</p></div>`,
  sr:'the Alago NFL Model replies with an NFL slate breakdown listing a sample best straight bet, player prop, +EV opportunity, parlay candidates and games to monitor.'},
 nba:{ch:'alago-nba-model',bot:'Alago NBA Model',cmd:'/nbabestbet',
  html:`<div class="d-embed" style="--ec:#ff8a3d"><p class="d-et">ALAGO PROPS | NBA BEST BET</p>
<div class="d-fld"><p class="d-fn">Sources &amp; freshness</p><p class="d-fv">Schedule: ESPN scoreboard ✓ fetched 3 min ago<br>Odds: Odds API · updated 3 min ago</p></div>
<div class="d-fld"><p class="d-fn">NBA BEST BET</p><p class="d-fv">🏀 ALAGO PROPS | NBA BEST BET<br>Matchup: BOS @ NYK<br>Pick: Celtics -2.5<br>Odds: -110 (DraftKings)<br>Estimated Probability: 55.0% (model estimate)<br>Confidence: Lean<br>PLAY Celtics -2.5 at -110 or better (limit -118). Small, flat stake. Model estimate - not a guarantee.</p></div>
<div class="d-fld"><p class="d-fn">Unverified data</p><p class="d-fv">- Starting lineups not yet confirmed</p></div></div>`,
  sr:'the Alago NBA Model replies with a sample best bet embed: sources and freshness, Celtics minus 2.5 at minus 110 with a 55 percent model estimate, and unverified data.'},
 mlb:{ch:'alago-mlb-model',bot:'Alago MLB Model',cmd:'/mlbnrfi',
  html:`<div class="d-txt"><p><b>⚾ ALAGO PROPS | MLB NRFI / YRFI</b></p><p class="d-sub"><em>First inning simulated from team run projections × fitted inning shares.</em></p>
<p class="d-line">• LAD@SD <b>NRFI</b>: 56.1% (range 51%–61%), fair -128, odds -110, QUALIFIED +EV EV +7.1%, conf LEAN, price limit -122</p>
<p class="d-line">• LAD@SD <b>YRFI</b>: 43.9% (range 39%–49%), fair +128, odds -110, NEGATIVE EV EV -16.2%, conf PASS, price limit none</p>
<p class="d-line">• HOU@SEA <b>NRFI</b>: 52.3% (range 47%–57%), fair -110, odds —, UNPRICED, conf PASS, price limit none</p></div>`,
  sr:'the Alago MLB Model replies with sample NRFI and YRFI lines for two games, each with model percentage, range, fair odds, status and confidence.'},
 nhl:{ch:'alago-nhl-model',bot:'Alago NHL Model',cmd:'/nhlgoalie',
  html:`<div class="d-txt"><p>🥅 <b>Igor Shesterkin</b> (NYR) vs BOS · CONFIRMED starter (NHL boxscore): Igor Shesterkin</p><p class="d-line">Basis: season + recent starts, regressed toward league average</p>
<p class="d-line">Proj sv% 0.914 (regressed) · opp SOG 29.4 · saves 26.9 · GA 2.53</p><p class="d-line">Win 56.0% · Shutout 6.1% · GA u2.5 52.8% <span class="d-note">[model estimates; saves/GA/shutout not backtested]</span></p></div>`,
  sr:'the Alago NHL Model replies with a sample goalie card for Igor Shesterkin: projected save percentage 0.914, 29.4 opponent shots, 26.9 saves, 2.53 goals against, 56 percent win.'},
 props:{ch:'alago-props-model',bot:'Alago Props Model',cmd:'/nba',opts:['firstname: Jayson','lastname: Tatum','prop: Points','line: 26.5'],
  html:`<div class="d-embed" style="--ec:#3b82f6"><p class="d-et">Jayson Tatum · Points</p><div class="d-grid">${[['Player','Jayson Tatum'],['Team','BOS'],['League','NBA'],['Prop','Points'],['Games','10'],['Average','27.20'],['Line','26.5 (your line)'],['Above / Below / Equal','🟩 6 · 🟥 4 · ⬜ 0'],['Hit rate (over)','<b>6/10</b> (60%)']].map(([l,v])=>`<div><p class="d-fn">${l}</p><p class="d-fv">${v}</p></div>`).join('')}</div>
<div class="d-chart" aria-hidden="true"><i class="cl" style="bottom:65%"><span>26.5</span></i><span class="cb o" style="height:89%"><em>31</em></span><span class="cb u" style="height:69%"><em>24</em></span><span class="cb o" style="height:83%"><em>29</em></span><span class="cb u" style="height:63%"><em>22</em></span><span class="cb o" style="height:94%"><em>33</em></span><span class="cb u" style="height:71%"><em>25</em></span><span class="cb u" style="height:54%"><em>19</em></span><span class="cb o" style="height:86%"><em>30</em></span><span class="cb o" style="height:80%"><em>28</em></span><span class="cb o" style="height:89%"><em>31</em></span></div>
<p class="d-foot2">HISTORICAL data from stored source records. Hit rate describes past games; it is not a probability.</p></div>`,
  sr:'the Alago Props Model replies with a sample embed for Jayson Tatum points: last 10 games 31, 24, 29, 22, 33, 25, 19, 30, 28, 31, average 27.2, line 26.5, 6 above and 4 below, hit rate 6 of 10.'}};
const tabs=[...document.querySelectorAll('.dtab')],ty=box.querySelector('.d-type'),rep=document.getElementById('dReply'),srEl=document.getElementById('dSr');
let run=0,cur='nfl',auto=null,userTouched=false,seen=false;
const fill=k=>{const d=D[k];document.getElementById('dChan').textContent=d.ch;document.getElementById('dBot').textContent=d.bot;rep.innerHTML=d.html;box.dataset.k=k;box.setAttribute('aria-labelledby','dt-'+k);srEl.textContent=`Example: a user types ${d.cmd}${d.opts?' with '+d.opts.join(', '):''} and ${d.sr}`};
const optsHtml=d=>d.opts?' '+d.opts.map(o=>`<span class="d-opt">${o}</span>`).join(' '):'';
const play=k=>{const id=++run,d=D[k];fill(k);box.classList.remove('typed','thinking','replied');ty.innerHTML='';
 if(RM){ty.innerHTML=d.cmd+optsHtml(d);box.classList.add('typed','replied');return}
 let i=0;const step=()=>{if(id!==run)return;ty.textContent=d.cmd.slice(0,++i);if(i<d.cmd.length)setTimeout(step,70+Math.random()*50);else{ty.innerHTML=d.cmd+optsHtml(d);box.classList.add('typed');setTimeout(()=>{if(id===run)box.classList.add('thinking')},300);setTimeout(()=>{if(id!==run)return;box.classList.remove('thinking');box.classList.add('replied')},1250)}};setTimeout(step,250)};
const select=(k,focus)=>{cur=k;tabs.forEach(t=>{const on=t.dataset.k===k;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(on&&focus)t.focus()});play(k)};
const stopAuto=()=>{userTouched=true;clearInterval(auto);auto=null};
tabs.forEach((t,i)=>{t.addEventListener('click',()=>{stopAuto();select(t.dataset.k)});t.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==null){e.preventDefault();stopAuto();select(tabs[n].dataset.k,true)}})});
['pointerenter','focusin','touchstart'].forEach(ev=>box.addEventListener(ev,stopAuto,{passive:true}));
const keys=tabs.map(t=>t.dataset.k);fill('nfl');
const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){if(!seen){seen=true;play(cur)}if(!RM&&!userTouched&&!auto)auto=setInterval(()=>{if(document.hidden)return;select(keys[(keys.indexOf(cur)+1)%keys.length])},7000)}else if(auto){clearInterval(auto);auto=null}},{threshold:.35});io.observe(box)})();
