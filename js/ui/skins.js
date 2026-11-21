/* SKINS DE GUI com texturas OFICIAIS do jogo (crafting, poções, bigorna...). Os PNGs vêm do .jar (tools/extract-gui.mjs)
   e as posições (crop, slots, sprites animados) estão em data/Vanilla/guis.json. Sem o PNG, volta ao desenho em CSS. */
const SK_OK={};
async function skinsProbe(){
 if(!GUIS)return;let any=false;
 await Promise.all(Object.keys(GUIS).filter(k=>GUIS[k]&&GUIS[k].file).map(async k=>{SK_OK[k]=await probe(GUIS.root+GUIS[k].file);any=any||SK_OK[k]}));
 if(any)nei()}
function skin(name,parts,extra=''){
 const d=GUIS&&GUIS[name];if(!d||!SK_OK[name]||!CFG.skins)return null;
 const sc=GUIS.scale||3,[cx,cy,cw,ch]=d.crop,url=GUIS.root+d.file,sheet=`${256*sc}px ${256*sc}px`;
 let h=`<div class="gui" style="width:${cw*sc}px;height:${ch*sc}px;background:url(${url}) ${-cx*sc}px ${-cy*sc}px/${sheet}">`;
 for(const [g,pos] of Object.entries(d.slots))pos.forEach((p,i)=>{const it=(parts[g]||[])[i];
  if(it!=null)h+=`<div class="sk" style="left:${(p[0]+1-cx)*sc}px;top:${(p[1]+1-cy)*sc}px">${slot(it,i?1:(parts[g+'N']||1),'sk '+(parts[g+'Cls']||''))}</div>`});
 for(const sp of Object.values(d.sprites||{})){const [sx,sy,w,hh]=sp.src;
  h+=`<i class="sp ${sp.anim}" style="left:${(sp.at[0]-cx)*sc}px;top:${(sp.at[1]-cy)*sc}px;width:${w*sc}px;height:${hh*sc}px;background:url(${url}) ${-sx*sc}px ${-sy*sc}px/${sheet}"></i>`}
 return h+'</div>'+extra}
