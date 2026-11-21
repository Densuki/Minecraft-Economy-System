/* Ícones dos itens.
   1) texInfo(): onde está a textura — do manifesto local (data/manifest.js) ou do que já foi descoberto (localStorage).
   2) texHTML(): itens = imagem plana (só o 1º quadro, se for animada); blocos = cubo isométrico montado com 3 faces (topo, frente, lado).
   3) texAsk(): o que ainda não se sabe é procurado em minecraft-assets (versões em CFG.assetVersions), em paralelo e com fila.
   4) procHTML(): ícone pixel-art gerado em canvas (offline / enquanto carrega / sem textura). */
const PROC={};
function adj(h,v){const n=parseInt(h.slice(1),16),f=k=>Math.max(0,Math.min(255,((n>>k)&255)+v));return`rgb(${f(16)},${f(8)},${f(0)})`}
function procURL(id){
 if(PROC[id])return PROC[id];const it=ITEMS[id];let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;
 const rnd=()=>(h=(h*1664525+1013904223)>>>0)/4294967296,cv=document.createElement('canvas');cv.width=cv.height=16;const x=cv.getContext('2d');
 for(let j=0;j<16;j++)for(let i=0;i<16;i++){let on=0,e=0;
  switch(it.t){case'b':on=1;e=(i==0||j==0)?18:(i==15||j==15)?-28:0;break;
   case'i':on=i+j>5&&i+j<26&&Math.abs(i-j)<7;break;
   case'g':on=Math.abs(i-7.5)+Math.abs(j-7.5)<7;break;
   case's':on=Math.abs(i+j-15)<2;break;
   case'd':on=((i-7.5)**2+(j-9)**2<30)&&rnd()>.15;break;
   case'a':on=j>2&&i>2&&i<13&&!(j>8&&i>5&&i<10);break;
   case'p':on=(i>5&&i<10&&j<5)||((i-7.5)**2+(j-10)**2<26);break;
   default:on=Math.abs(i+j-15)<2||(j<5&&i>5&&i<15);}
  if(on){x.fillStyle=adj(it.c,((rnd()*36-18)|0)+e);x.fillRect(i,j,1,1)}}
 return PROC[id]=cv.toDataURL()}
const procHTML=id=>`<i class="ic flat" style="background-image:url(${procURL(id)})"></i>`;

/* ---- onde estão as texturas ---- */
const TXC=JSON.parse(LS.get('nei.tex')||'{}'),TXN=new Set(),TXQ=[];let txAct=0,txSave=0,txTotal=0,txDone=0;
const texURL=(p,v)=>(MANIFEST.local||MANIFEST.base)+v+'/'+p+'.png';
function texInfo(id){const it=ITEMS[id];if(it&&it.tex&&(it.tex.k==='u'||CFG.online||MANIFEST.local))return it.tex;const m=MANIFEST.items[id];return m&&m.k?m:TXC[id]||null}   // JSON do pack > manifesto > descoberto no navegador
const texLoaded=()=>Object.keys(ITEMS).filter(i=>{const e=texInfo(i);return e&&e.k!=='n'}).length;
/* cores de bioma (grama, folhas) — as texturas vêm em cinza e o jogo pinta por cima */
const tintOf=p=>/grass_block_top|\/(short_grass|grass|tall_grass_top|fern|large_fern_top)$|sugar_cane/.test(p)?'#7cbd6b':/spruce_leaves/.test(p)?'#619961':/birch_leaves/.test(p)?'#80a755':/_leaves$|vine|lily_pad/.test(p)?'#77ab2f':null;
const NONCUBE=/(_slab|_stairs|_fence|_fence_gate|_wall|_door|_trapdoor|_button|_pressure_plate|_sign|_banner|_bed|_carpet|_pane|_bars|_rail|^rail$|torch|sapling|flower|tulip|dandelion|poppy|orchid|allium|bluet|daisy|grass$|fern|vine|lily|mushroom|coral_fan|candle|_head|_skull|chain|lantern|ladder|lever|cobweb|_roots|_sprouts|kelp|seagrass|bamboo|_rod|cactus|sugar_cane|azalea|bush|chest|anvil|brewing_stand|cauldron|hopper|enchanting|lectern|campfire|bell)/;
const maskVars=(m,c)=>`--m:url(${m});--tc:${c}`;
function texHTML(e,id){
 const u=p=>texURL(p,e.v),it=ITEMS[id]||{};
 if(e.k==='u')return`<i class="ic flat" style="background-image:url(${e.u})"></i>`;
 if(e.k==='c'&&CFG.render3d&&it.render!=='flat'){          // cubo isométrico (opção 3D nas configurações)
  const face=(c,p,tt)=>{const url=u(p);return`<b class="${c}${tt?' tint':''}" style="background-image:url(${url});${tt?maskVars(url,tt):''}"></b>`};
  return`<div class="ic cube">${face('cl',e.f||e.s)}${face('cr',e.s)}${face('ct',e.t,tintOf(e.t))}</div>`}
 const p=e.k==='c'?(e.f||e.s):e.t,url=u(p),tt=e.o?e.c:tintOf(p);   // 2D (padrão): textura plana
 return`<i class="ic flat${tt?' tint':''}" style="background-image:url(${url});${tt?maskVars(e.o?u(e.o):url,tt):''}"></i>`}

/* ---- descoberta em runtime (só para o que não está no manifesto) ---- */
const probe=u=>new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src=u});
const FC=new Map();
const find=(paths,from=0)=>{const k=paths+'|'+from;if(!FC.has(k))FC.set(k,findRaw(paths,from));return FC.get(k)};
async function findRaw(paths,from){
 for(const v of CFG.assetVersions.slice(from)){const ok=await Promise.all(paths.map(p=>probe(texURL(p,v))));const i=ok.indexOf(true);if(i>=0)return{p:paths[i],v}}
 return null}
const vi=r=>CFG.assetVersions.indexOf(r.v);
async function texResolve(id){
 const it=ITEMS[id];
 if(it.potion){const a=await find([it.potion.base]);if(!a)return null;const o=await find([it.potion.over],vi(a));return{k:'f',t:a.p,v:a.v,o:o&&o.p,c:it.c}}   // poção = frasco + líquido colorido
  const cubeLike=(it.isBlock??it.t==='b')&&!NONCUBE.test(id);
 if(!cubeLike){const a=await find([`items/${id}`]);if(a)return{k:'f',t:a.p,v:a.v}}
 const base=id.replace(/_(slab|stairs|fence_gate|fence|wall|button|pressure_plate)$/,''),bs=base!==id?[`blocks/${base}`,`blocks/${base}_planks`,`blocks/${base}s`]:[];   // laje/escada/cerca usam a textura do bloco base
 const side=await find([`blocks/${id}_side`,`blocks/${id}`,`blocks/${id}_front`,...bs]);
 if(!side)return null;
 if(!cubeLike)return{k:'f',t:side.p,v:side.v};
 const top=await find([`blocks/${id}_top`,`blocks/${id}`],vi(side)),front=await find([`blocks/${id}_front`],vi(side));
 return{k:'c',t:(top||side).p,s:side.p,f:front&&front.p!==side.p?front.p:null,v:side.v}}
function texAsk(id){if(!CFG.online||TXN.has(id)||texInfo(id)||!ITEMS[id])return;TXN.add(id);TXQ.push(id);txTotal++;texPump()}
function texPump(){
 while(txAct<8&&TXQ.length){const id=TXQ.shift();txAct++;
  texResolve(id).then(e=>{TXC[id]=e||{k:'n'};if(e){const h=texHTML(e,id);document.querySelectorAll(`[data-id="${id}"] .ic`).forEach(el=>el.outerHTML=h);
    clearTimeout(txSave);txSave=setTimeout(saveTex,800)}}).catch(()=>{}).finally(()=>{txAct--;txDone++;texProg();texPump()})}}
function texProg(){if(txDone>=txTotal){txTotal=txDone=0;loadHide()}else loadShow(t('loading'),txDone/txTotal)}
const saveTex=()=>LS.set('nei.tex',JSON.stringify(Object.fromEntries(Object.entries(TXC).filter(([,e])=>e.k!=='n'))));
/* ctx 'list' = grade/subsets; 'info' = aba Information. Fonte de cada um em CFG.iconSource (prismarine | itemids | local). */
function iconHTML(id,ctx='list'){
 const src=CFG.iconSource[ctx],pv=src&&CFG.providers[src];
 if(pv)return`<img class="ic prov" src="${pv(bare(id))}" alt="" onerror="provErr(this,'${id}')">`;
 const e=texInfo(id);if(e&&e.k!=='n')return texHTML(e,id);if(!e)texAsk(id);return procHTML(id)}
function provErr(el,id){const e=texInfo(id);el.outerHTML=e&&e.k!=='n'?texHTML(e,id):procHTML(id);texAsk(id)}

/* ---- exporta o que o site sabe (itens + receitas + texturas descobertas) como data/manifest.js ---- */
function exportManifest(){
 const items={};
 for(const it of allItems()){const e=texInfo(it.id)||{};items[it.id]={n:it.en,m:it.m==='minecraft'?undefined:it.m,b:(it.isBlock??it.t==='b')?1:0,k:e.k,t:e.t,s:e.s,f:e.f,v:e.v,o:e.o,c:e.c}}
 const rec=(PM.recipes.length?PM.recipes:(MANIFEST.recipes||[]).map(([o,n,a])=>({a,o,n}))).map(r=>[r.o,r.n,r.a]);
 const man={version:S.src.version||MANIFEST.version,base:MANIFEST.base,local:MANIFEST.local,items,foods:Object.fromEntries(Object.entries(FOOD).filter(([i])=>ITEMS[i])),recipes:rec};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['const MANIFEST='+JSON.stringify(man)+';\n'],{type:'text/javascript'}));a.download='manifest.js';a.click()}

/* slot de item: usado em todo lugar. id pode ser lista de alternativas (OreDict): o slot alterna entre elas. */
const slot=(id,n=1,c='')=>{const al=Array.isArray(id)?id:null,f=al?al[0]:id;
 return`<div class="slot ${c}${al?' alt':''}${f&&ENC.has(f)?' ench':''}"${f?` data-id="${f}"`:''}${al?` data-alts="${al.join('|')}"`:''}>${f?iconHTML(f,c.includes('big')?'info':'list'):''}${n>1?`<b class="cnt">${n}</b>`:''}</div>`};
