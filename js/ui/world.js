/* Cenário de fundo + animações (anime.js). Botões do mod controlam dia/noite, chuva e "cura". */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
function pop2(sel,st){if(window.anime&&!RM)anime({targets:sel,opacity:[0,1],translateY:[10,0],delay:anime.stagger(st),duration:280,easing:'easeOutQuad'})}
const TM={dawn:{sky:'#7a5470',st:.3,sun:[14,58],moon:[86,125],gr:.8},day:{sky:'#6aa6ee',st:0,sun:[50,12],moon:[50,130],gr:1.15},dusk:{sky:'#7f4560',st:.55,sun:[86,58],moon:[14,70],gr:.7},night:{sky:'#070b18',st:1,sun:[50,130],moon:[50,12],gr:.45}};
function setTime(k){const tm=TM[k];S.time=k;$('#sky').style.backgroundColor=tm.sky;$('#stars').style.opacity=tm.st;$('#ground').style.filter=`brightness(${tm.gr})`;$('#clouds').style.opacity=k==='night'?.15:.85;
 [['.sun',tm.sun],['.moon',tm.moon]].forEach(([s,p])=>{const e=$('#orbit '+s);if(window.anime&&!RM)anime({targets:e,left:p[0]+'%',top:p[1]+'%',duration:2200,easing:'easeInOutSine'});else{e.style.left=p[0]+'%';e.style.top=p[1]+'%'}})}
function heal(){if(window.anime&&!RM)anime({targets:'#flash',opacity:[0,.9,0],duration:900,easing:'easeOutQuad'});pop()}
function worldInit(){
 $('#stars').innerHTML=Array.from({length:70},()=>`<i style="left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${(Math.random()*4).toFixed(1)}s"></i>`).join('');
 $('#clouds').innerHTML=[8,22,35,15,28].map((t,i)=>`<b style="top:${t}%;animation-duration:${70+i*18}s;animation-delay:-${i*17}s"></b>`).join('');
 setTime(S.time);setBackground(S.bg)}

/* Fundo trocável. Uso no seu projeto:  NEI.setBackground('scene') | NEI.setBackground('#14161c') | NEI.setBackground('https://.../foto.jpg')
   O elemento é <div id="world"> (position:fixed, atrás de tudo) — você também pode estilizá-lo direto pelo DOM/CSS. */
const bgKind=()=>S.bg==='scene'?'scene':/^(https?:|data:|\/|\.|url\()/.test(S.bg)?'image':'dark';
function setBackground(v){
 S.bg=v||'scene';LS.set('nei.bg',S.bg);const w=$('#world');
 w.classList.toggle('plain',S.bg!=='scene');
 w.style.background=S.bg==='scene'?'':(bgKind()==='image'?`center/cover no-repeat url(${S.bg.replace(/^url\(|\)$/g,'')})`:S.bg)}
function cycleBackground(){
 const k=bgKind();
 if(k==='scene')setBackground('#14161c');
 else if(k==='dark'){const u=prompt(t('bgask'),'');setBackground(u||'scene')}
 else setBackground('scene');
 buildCfg()}
Object.assign(NEI,{setBackground,cycleBackground,exportManifest:()=>exportManifest(),config:CFG,state:S,items:ITEMS,price});
