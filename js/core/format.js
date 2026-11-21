/* Códigos de formatação do Minecraft (&c, §l ...) -> HTML.
   Cores &0-&f · &k aleatório · &l negrito · &m riscado · &n sublinhado · &o itálico · &r limpa.
   Como no jogo, uma COR nova limpa os estilos anteriores (ponha a cor antes: "&4&lAVISO"). */
const MC_COL={0:'#000000',1:'#0000AA',2:'#00AA00',3:'#00AAAA',4:'#AA0000',5:'#AA00AA',6:'#FFAA00',7:'#AAAAAA',8:'#555555',9:'#5555FF',a:'#55FF55',b:'#55FFFF',c:'#FF5555',d:'#FF55FF',e:'#FFFF55',f:'#FFFFFF'};
const escH=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const plain=s=>String(s==null?'':s).replace(/[&§][0-9a-fk-or]/gi,'');
function mc(src){
 if(src==null)return'';
 const parts=String(src).split(/[&§]([0-9a-fk-or])/i);let st={},out='';
 for(let i=0;i<parts.length;i++){
  if(i%2){const c=parts[i].toLowerCase();
   if(MC_COL[c])st={col:MC_COL[c]};else if(c==='r')st={};else st={...st,[c]:1};continue}
  const txt=escH(parts[i]).replace(/\n/g,'<br>');if(!txt)continue;
  const cls=['l','o','n','m','k'].filter(k=>st[k]).map(k=>'mc'+k).join(' ');
  out+=(st.col||cls)?`<span${cls?` class="${cls}"`:''}${st.col?` style="color:${st.col}"`:''}>${txt}</span>`:txt}
 return out}
/* "m:ss" <-> segundos (durações de poções) */
const toSec=s=>{const [m,x]=String(s).split(':').map(Number);return m*60+(x||0)};
const fmtDur=n=>{n=Math.round(n);return`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`};
