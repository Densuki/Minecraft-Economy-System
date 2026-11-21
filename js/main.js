/* Ponto de entrada: eventos, ações dos botões e inicialização. */
function renderAll(){nei();grid();favs();buildMenu();buildCfg();lview();$('#sub').title='';$('#qty').textContent=S.qty===64?t('stack'):S.qty}
function setLang(l){CFG.lang=l;LS.set('nei.lang',l);NEI.emit('lang',l);document.documentElement.lang=l==='pt'?'pt-BR':'en';renderAll()}

function pick(id,kind,e){
 click();NEI.emit('pick',{id,kind});
 if(e&&(e.ctrlKey||e.metaKey)){fav(id);return}
 if(e&&e.shiftKey){const k=S.hot.findIndex(h=>h&&h.id===id),n=Math.min(S.qty,64);
  if(k>=0)S.hot[k].n=Math.min(64,S.hot[k].n+n);else{const z=S.hot.findIndex(h=>!h);if(z>=0)S.hot[z]={id,n}}
  pop();nei();return}
 if(S.mode==='rec'&&(S.id!==id||S.kind!==kind))S.hist.push([S.id,S.kind]);
 S.mode='rec';S.id=id;S.kind=kind;S.idx=0;S.tab=null;
 if(S.menu.length){S.menu=[];buildMenu()}
 nei();pop2('.rw',90)}
function back(){const h=S.hist.pop();click();if(h){S.id=h[0];S.kind=h[1];S.idx=0;S.tab=null}else S.mode='inv';nei()}

function act(a,e){
 click();const[k,v]=a.split(':');
 if(k==='pg-'){S.page--;grid()}else if(k==='pg+'){S.page++;grid()}
 else if(k==='fp-'||k==='fp+'){S.fpage+=k==='fp+'?1:-1;favs()}
 else if(k==='tab'){if(v==='inv')S.mode='inv';else if(S.id){S.mode='rec';if(S.av.includes(v)){S.tab=v;S.idx=0}}nei()}
 else if(k==='tab+'||k==='tab-'){const n=S.av.length;if(n>1){S.tab=S.av[(S.av.indexOf(S.tab)+(k==='tab+'?1:n-1))%n];S.idx=0}nei()}
 else if(k==='idx-'||k==='idx+'){if(S.L)S.idx=(S.idx+(k==='idx+'?1:-1)+S.L)%S.L;nei()}
 else if(k==='q-'||k==='q+'){const i=QS.indexOf(S.qty);S.qty=QS[Math.max(0,Math.min(QS.length-1,i+(k==='q+'?1:-1)))];nei()}
 else if(k==='open'){S.open.has(v)?S.open.delete(v):S.open.add(v);nei()}
 else if(k==='menu'){S.menu=S.menu.length?[]:[-1];buildMenu();if(S.menu.length)pop2('#menu .mi',14)}
 else if(k==='sub')subAct(v);
 else if(k==='left'){S.left=v;lview()}
 else if(k==='save'){S.saves[v]=S.hot.map(h=>h&&{...h});pop()}
 else if(k==='tool')tool(+v);
 else if(k==='opt'){CFG.mute=!CFG.mute;LS.set('nei.mute',CFG.mute?'1':'0');buildCfg()}
 else if(k==='lang')setLang(CFG.lang==='pt'?'en':'pt');
 else if(k==='bg')cycleBackground();
 else if(k==='r3d'){CFG.render3d=!CFG.render3d;LS.set('nei.3d',CFG.render3d?'1':'0');renderAll()}
 else if(k==='skins'){CFG.skins=!CFG.skins;LS.set('nei.skins',CFG.skins?'1':'0');renderAll()}
 else if(k==='export')exportManifest();
}

document.addEventListener('click',e=>{
 if(S.menu.length&&!e.target.closest('#menu,#sub')){S.menu=[];buildMenu()}
 const a=e.target.closest('[data-act]');if(a){act(a.dataset.act,e);return}
 const s=e.target.closest('[data-id]');if(s)pick(s.dataset.id,'r',e)});
document.addEventListener('contextmenu',e=>{
 const a=e.target.closest('[data-act^="save"]');
 if(a){e.preventDefault();const n=a.dataset.act.split(':')[1];if(S.saves[n]){S.hot=S.saves[n].map(h=>h&&{...h});pop();nei()}return}
 const s=e.target.closest('[data-id]');if(s){e.preventDefault();pick(s.dataset.id,'u',e)}else if(e.target.closest('#stage'))e.preventDefault()});
document.addEventListener('keydown',e=>{
 if(e.target.id==='q'){if(e.key==='Escape')e.target.blur();return}
 const k=e.key.toLowerCase();
 if(k==='a'&&S.hover)fav(S.hover);else if(k==='r'&&S.hover)pick(S.hover,'r');else if(k==='u'&&S.hover)pick(S.hover,'u');
 else if(k==='backspace'){e.preventDefault();back()}else if(k==='escape'){S.mode='inv';nei()}});
document.addEventListener('mousemove',showTip);
$('#menu').addEventListener('mouseover',e=>{
 const b=e.target.closest('[data-p]');if(!b)return;const p=b.dataset.p.split('.').map(Number);
 if(String(S.menu)!==String(p)&&(subKids(SUB[p[0]])||S.menu.length>1)&&p.length===1){S.menu=p;buildMenu()}
 else if(p.length===2&&String(S.menu)!==String(p)){S.menu=p;buildMenu()}});
$('#q').addEventListener('input',e=>{S.q=e.target.value;e.target.style.color={'@':'#ff55ff','#':'#55ffff','$':'#ffaa00','%':'#55ff55','&':'#ffff55','^':'#ff5555'}[S.q[0]]||'#fff';S.page=0;grid()});
/* slots com alternativas (OreDict, combustíveis) trocam de item a cada 1,6 s */
let altI=0;
setInterval(()=>{altI++;document.querySelectorAll('.slot.alt').forEach(e=>{const l=e.dataset.alts.split('|'),id=l[altI%l.length];e.dataset.id=id;e.classList.toggle('ench',ENC.has(id));e.innerHTML=iconHTML(id);if(window.anime&&!RM)anime({targets:e,scale:[1.12,1],duration:240,easing:'easeOutBack'})})},1600);
function fit(){sc=Math.min(innerWidth/1152,innerHeight/720);$('#stage').style.transform=`translate(-50%,-50%) scale(${sc})`}
addEventListener('resize',fit);

/* texto &k (aleatório) do Minecraft */
setInterval(()=>document.querySelectorAll('.mck').forEach(e=>{const o=e.dataset.o||(e.dataset.o=e.textContent);e.textContent=[...o].map(c=>c===' '?c:'#%&@$*?!'[Math.random()*8|0]).join('')}),100);

async function init(){
 fit();worldInit();
 const hasManifest=loadManifest();                 // 1) catálogo do PrismarineJS gerado por tools/build-manifest.mjs (opcional)
 const hasPacks=await loadPacks();                 // 2) packs: data/Vanilla + data/Mods/* (JSON)
 if(!hasPacks&&!hasManifest&&CFG.online)await loadPrismarine();   // 3) último recurso: baixa do minecraft-data
 finalizeData();document.documentElement.lang=CFG.lang==='pt'?'pt-BR':'en';
 renderAll();skinsProbe();measurePing().then(()=>nei());
 NEI.emit('ready',{items:Object.keys(ITEMS).length,packs:PACKS.map(p=>p.name)});
}
NEI.ready=init();
