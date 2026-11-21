/* Tooltip no estilo do mod: nome + ID, mod:id, extras, preço (amarelo) e nome do mod. */
let sc=1;
function showTip(e){
 const s=e.target.closest('[data-id]'),tt=$('#tt');S.hover=s?s.dataset.id:null;
 if(!s||!ITEMS[S.hover]){tt.style.display='none';return}
 const it=ITEMS[S.hover],p=Math.max(1,price(it.id));
 tt.innerHTML=`<div>${itemNameHTML(it.id)} ${it.ord<1e5?it.ord:''}</div><div style="color:#aaa">${it.m}:${bare(it.id)}${it.meta!=null?':'+it.meta:''}</div>${lines(it).map(l=>`<div style="color:${l[1]}">${l[0]}</div>`).join('')}<div style="color:#ffff55">${t('tprice',fmt(p))}</div><div style="color:#5555ff;font-style:italic">${escH(MODS[it.m]||it.m)}</div>`;
 tt.style.display='block';const r=$('#stage').getBoundingClientRect(),x=(e.clientX-r.left)/sc;
 tt.style.left=(x+16)+'px';tt.style.top=((e.clientY-r.top)/sc-34)+'px';tt.style.transform=x>800?'translateX(calc(-100% - 32px))':''}
