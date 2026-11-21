/* Item SubSets: colunas em cascata (categoria > subcategoria > prévia dos itens). Clicar na categoria filtra a grade. */
function buildMenu(){
 const m=S.menu;let h='';
 if(m.length){
  const col=(L,pre)=>`<div class="col2">${L.map((n,i)=>{const p=[...pre,i].join('.');return`<button class="mi${m[pre.length]===i?' on':''}" data-act="sub:${p}" data-p="${p}">${subLabel(n)}${subKids(n)?' ▸':''}</button>`}).join('')}</div>`;
  h=col(SUB,[]);let n=SUB[m[0]];
  if(n&&subKids(n)){h+=`<div class="scr"><i></i></div>`+col(subKids(n),[m[0]]);n=subKids(n)[m[1]]||n}
  if(n&&n.f){const items=allItems().filter(n.f).slice(0,9);h+=`<div class="col2">${items.map(i=>`<button class="mi ico" data-id="${i.id}">${slot(i.id)}</button>`).join('')}</div>`}
 }
 $('#menu').innerHTML=h;$('#sub').textContent=S.cat?'Item SubSets: '+subLabel(S.cat):'Item SubSets'}
function subAct(v){
 const p=v.split('.').map(Number);let n=SUB[p[0]];if(p[1]!=null)n=subKids(n)[p[1]];
 if(n.f||!subKids(n)){S.cat=n.f?n:null;S.page=0;grid()}
 S.menu=subKids(n)&&p.length===1?[p[0]]:[];buildMenu()}
