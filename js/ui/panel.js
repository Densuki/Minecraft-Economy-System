/* Painel central: receitas (abas só dos tipos que o item possui), detalhes de preço e tela de informações. */
const TABS=[['c','crafting_table'],['s','furnace'],['b','brewing_stand'],['v','anvil'],['f','coal'],['k','stonecutter'],['m','smithing_table'],['i','book']];
const STN={c:['crafting_table'],s:['furnace','blast_furnace','smoker'],b:['brewing_stand'],v:['anvil'],f:['furnace'],k:['stonecutter'],m:['smithing_table'],i:[]};
const PER={c:2,s:2,b:3,v:4,f:4,k:4,m:3,i:1};
const arrow=anim=>`<div class="arr${anim?'':' s'}"><i></i></div>`,flame=()=>'<div class="fl"><i></i></div>';
const line=(a,b,g)=>`<p${g?' class="t"':''}><span>${a}</span><span>${b}</span></p>`,tot=u=>line(t('total',S.qty),fmt(u*S.qty),1);
const fuelSlot=()=>slot(FUEL_CYCLE.filter(i=>ITEMS[i]),1,'fuel');

/* caixa visual de uma receita */
function recipeBox(r){
 const mm=(h,o='')=>`<div class="rbox" style="${o}">${h}</div>`;
 switch(r.t){
  case'c':{const g=skin('crafting',{in:r.a,out:[r.o],outN:r.n});return mm(g||`<div class="g3">${r.a.map(i=>slot(i)).join('')}</div>${arrow(0)}${slot(r.o,r.n,'big')}`)}
  case's':return mm(`<span class="xp">${t('xp',r.x||.1)}</span><div class="col">${slot(r.a[0])}${flame()}${fuelSlot()}</div>${arrow(1)}${slot(r.o,1,'big')}`);
  case'b':{const g=skin('brewing',{ing:[r.a[0]],bottle:[r.a[1],r.a[1],r.a[1]],fuel:['blaze_powder']},arrow(1)+slot(r.o,1,'big')+`<span class="xp">${t('steps',r.st)}</span>`);if(g)return mm(g,'gap:10px')}
   return mm(`<span class="xp">${t('steps',r.st)}</span><div class="col">${slot(r.a[0])}<div class="flex" style="gap:6px">${slot(r.a[1])}${slot(r.a[1])}${slot(r.a[1])}</div></div>${arrow(1)}${slot(r.o,1,'big')}`,'min-height:130px');
  case'v':{const g=skin('anvil',{a:[r.a[0]],b:[r.a[1]],out:[r.o],outCls:r.e?'ench':'',aCls:r.e?'':'dmg'},`<span class="xp" style="top:auto;bottom:6px;right:48px;color:#3a9a2a">${t('cost',r.l)}</span>`);if(g)return mm(g)}
   return mm(`${slot(r.a[0],1,r.e?'':'dmg')}<b class="op">+</b>${slot(r.a[1])}${arrow(0)}${slot(r.o,1,r.e?'ench':'')}<span class="xp" style="top:auto;bottom:6px;right:48px;color:#3a9a2a">${t('cost',r.l)}</span>`,'min-height:92px;gap:12px');
  case'k':return mm(`${slot(r.a[0])}${arrow(0)}${slot(r.o,r.n,'big')}`,'min-height:92px');
  case'm':return mm(`${slot(r.a[0])}<b class="op">+</b>${slot(r.a[1])}<b class="op">+</b>${slot(r.a[2])}${arrow(0)}${slot(r.o,1,'big')}`,'min-height:92px;gap:10px');
  case'i':{const it=ITEMS[r.o],raw=!(ROUT[r.o]&&ROUT[r.o].length),vs=variantsOf(r.o);
   const vh=vs.length?`<p class="info sub" style="margin-top:8px">${t('variants')}:</p><div class="flex flex-wrap" style="width:300px">${vs.map(v=>slot(v.id,1,'gs')).join('')}</div>`:'';
   return mm(`${slot(r.o,1,'big')}<div style="min-width:0"><p class="info nm">${itemNameHTML(r.o)}</p><p class="info">${r.d?mc(r.d):(raw?t('noraw'):t('norecipe'))}</p><p class="info sub">${it.m}:${bare(it.id)} · ${t('k.'+it.k)}</p>${vh}</div>`,'min-height:150px;align-items:flex-start;gap:14px')}
  case'f':return mm(`${slot(r.a[0],1,'big')}${flame()}<span style="font-size:24px">${t('burn',r.s,+(r.s/10).toFixed(1))}</span>`,'min-height:92px;gap:18px');
 }}

/* linhas de custo (o botão +/− de cada receita expande isto) */
function details(r){
 if(r.t==='i')return line(BASE_PRICE[r.o]!=null?t('base'):t('price'),fmt(price(r.o)))+tot(price(r.o));
 if(r.t==='f')return line(t('burntime'),r.s+'s')+line(t('price'),fmt(price(r.a[0])));
 if(r.t==='v')return line(t('repmat'),fmt(cost(r)))+line(t('repcost'),t('levels',r.l))+tot(cost(r));
 const c={};r.a.filter(Boolean).forEach(i=>{const h=head(i);c[h]=(c[h]||0)+1});
 let h=Object.entries(c).map(([i,n])=>line(`${n}× ${plain(itemName(i))}${r.a.some(x=>Array.isArray(x)&&x[0]===i)?' *':''}`,fmt(price(i)*n))).join('');
 if(r.t==='s')h+=line(t('fuelcost'),fmt(.5));
 const u=cost(r)/r.n;
 return h+'<hr>'+line(t('rcost',r.n,plain(itemName(r.o))),fmt(cost(r)))+line(t('unit'),fmt(u),1)+tot(u)}

function infoPanel(){
 const tt=S.hot.reduce((s,h)=>s+(h?price(h.id)*h.n:0),0),n=Object.keys(ITEMS).length,ld=texLoaded();
 const rows=S.hot.filter(Boolean).map(h=>`<p data-id="${h.id}" style="cursor:pointer"><span><i class="mini" style="background-image:url(${procURL(h.id)})"></i>${h.n}× ${itemNameHTML(h.id)}</span><span>${fmt(price(h.id)*h.n)}</span></p>`).join('')||`<p><span>${t('hotempty')}</span></p>`;
 const st=S.src.status,src=st==='online'?t('d_on',S.src.version):st==='local'?t('ping_loc')+(S.src.version?' '+S.src.version:''):t('d_off');
 return`<p class="ttl">${t('inv')}</p><div class="pbox" style="height:170px">${line(t('hotbar'),fmt(tt),1)}<hr>${rows}</div>
 <div class="pbox" style="margin-top:10px;height:224px">${line(t('nitems'),n)}${line(t('nload'),`${ld}/${n}`)}${line(t('nrec'),new Set(R.map(r=>r.o)).size)}${line(t('nfav'),S.favs.length)}${line(t('src'),src)}${line(t('packs'),(S.src.packs||[]).join(', ')||'-')}${line(t('ping'),pingHTML(S.src.ping,txAct>0))}<hr><p><span>${t('h1')}</span></p><p><span>${t('h2')}</span></p><p><span>${t('h3')}</span></p><p><span>${t('h4')}</span></p><p><span>${t('h5')}</span></p></div>`}

function nei(){
 let body='',av=[];
 if(S.mode==='rec'){
  const all=recipesFor(S.id,S.kind);av=[...new Set(all.map(r=>r.t))];S.av=av;
  if(!av.includes(S.tab))S.tab=av[0]||'c';
  const A=all.filter(r=>r.t===S.tab),P=PER[S.tab]||2,pages=Math.max(1,Math.ceil(A.length/P));S.L=pages;S.idx=Math.min(S.idx,pages-1);
  const L=A.slice(S.idx*P,S.idx*P+P),key=j=>S.id+'_'+S.kind+S.tab+(S.idx*P+j);
  const rw=(r,k)=>{
   let box,pb;
   if(r){box=recipeBox(r);pb=details(r)}
   else{box=`<div class="rbox"><div class="col">${slot(S.id,1,'big')}<span>${t('nouse')}</span></div></div>`;pb=line(t('price'),fmt(price(S.id)))+tot(price(S.id))}
   const o=S.open.has(k);
   return`<div class="rw"><div class="rwb">${box}<button class="btn plus" data-act="open:${k}" aria-label="+/−">${o?'−':'+'}</button></div>${o?`<div class="pbox">${pb}</div>`:''}</div>`};
  const ab=(a,dis)=>`<button class="ab${dis?' dis':''}" data-act="${a}" aria-label="${a}">${a.endsWith('+')?'&gt;':'&lt;'}</button>`;
  body=`<div class="stn">${(STN[S.tab]||[]).map(i=>slot(i)).join('')}</div><div style="margin-left:58px">
   <div class="bar">${ab('tab-',av.length<2)}<div>${t('tab.'+S.tab)}${S.kind==='u'?' '+t('uses'):''}</div>${ab('tab+',av.length<2)}</div>
   <div class="bar">${ab('idx-',pages<2)}<div>${S.idx+1}/${pages}</div>${ab('idx+',pages<2)}</div>
   <div class="rl">${L.length?L.map((r,j)=>rw(r,key(j))).join(''):rw(null,key(0))}</div></div>`;
 }else body=infoPanel();
 /* só aparecem as abas dos tipos de craft/informação que o item realmente tem */
 const tabs=(S.mode==='rec'?TABS.filter(([k])=>av.includes(k)):[]).map(([k,i])=>`<div class="tab${S.tab===k?' on':''}" data-act="tab:${k}" role="button" aria-label="${t('tab.'+k)}">${slot(i,1,'tb2')}</div>`).join('')
  +`<div class="tab${S.mode==='inv'?' on':''}" data-act="tab:inv" style="margin-left:auto" role="button" aria-label="${t('inv')}">${slot('chest',1,'tb2')}</div>`;
 $('#nei').innerHTML=`<div class="flex items-end" style="height:50px;padding:0 6px">${tabs}</div><div class="panel">${body}</div>`;
 $('#qty').textContent=S.qty===64?t('stack'):S.qty;
}
