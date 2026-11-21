/* CARREGADOR DE PACKS. Cada pasta de data/ é um "pack": data/Vanilla e data/Mods/<Nome do mod>, todas com a MESMA estrutura:
     pack.json · items/*.json · recipes/*.json · prices.json · lang/<idioma>.json · oredict.json · effects.json ...
   O que o carregador lê vira, no site, exatamente igual ao que foi gerado automaticamente.
   Ordem de camadas (a de baixo vence a de cima): manifesto do PrismarineJS < Vanilla < Mods.   Fonte: data/bundle.js (rápido) ou data/index.json + arquivos. */
const PACKS=[];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
async function readFile(path){
 if(window.NEI_BUNDLE&&CFG.useBundle)return NEI_BUNDLE.files[path]||null;
 try{const r=await fetch('data/'+path.split('/').map(encodeURIComponent).join('/'));return r.ok?await r.json():null}catch(e){return null}}
async function readIndex(){
 if(window.NEI_BUNDLE&&CFG.useBundle)return NEI_BUNDLE.index;
 for(const u of ['data/index.json','data/index.php']){try{const r=await fetch(u);if(r.ok)return await r.json()}catch(e){}}
 return null}
const qualify=(mod,id)=>id.includes(':')||mod==='minecraft'?id:`${mod}:${id}`;
const resolveId=(mod,id)=>{if(!id)return id;if(id.includes(':'))return id.replace(/^minecraft:/,'');const q=`${mod}:${id}`;return mod!=='minecraft'&&ITEMS[q]?q:id};
let ordN=1e5;

/* textura vinda do JSON: "blocks/stone" (PrismarineJS) | "arquivo.png" (da pasta do pack) | URL | objeto completo */
function normTexture(tx,pk){
 if(!tx)return null;if(typeof tx==='object')return tx;
 if(/^(https?:)?\/\/|^data:/.test(tx))return{k:'u',u:tx};
 if(/\.(png|jpe?g|gif|webp)$/i.test(tx))return{k:'u',u:(pk.meta.textureRoot||`data/${pk.dir}/textures/`)+tx};
 return{k:'f',t:tx,v:CFG.assetVersions[0]}}
function defineItem(raw,pk,cat){
 const key=qualify(pk.mod,raw.id),nm=typeof raw.name==='string'?{en:raw.name}:(raw.name||{}),had=!!ITEMS[key];
 const o={m:pk.mod,names:{...(ITEMS[key]&&ITEMS[key].names),...nm},cat:raw.category||cat,kindOverride:raw.kind,extraOre:raw.oredict,desc:raw.desc,tooltip:raw.tooltip,render:raw.render,family:raw.family,meta:raw.meta,enchants:raw.enchants};
 if(raw.texture)o.tex=normTexture(raw.texture,pk);
 Object.keys(o).forEach(k=>o[k]===undefined&&delete o[k]);
 if(nm.en)o.en=nm.en;if(raw.color)o.c=raw.color;if(raw.shape)o.t=raw.shape;
 const it=addItem(key,o);if(!had){it.ord=ordN++;it.isBlock=it.t==='b'}
 it.fromPack=pk.dir;   // marca: este item está descrito em JSON (o exportador só acrescenta os que não estão)
 if(raw.price!=null)BASE_PRICE[key]=raw.price;
 if(raw.fuel!=null)FUEL[key]=raw.fuel;
 if(raw.food)FOOD[key]=[raw.food.hunger,raw.food.saturation];
 if(raw.attack!=null)ATK[key]=raw.attack;if(raw.armor!=null)ARM[key]=raw.armor;
 if(raw.fx)ITEM_FX[key]=raw.fx;if(raw.glint)ENC.add(key);
 return it}
function compileGroup(g){const re=g.re&&new RegExp(g.re),no=g.not&&new RegExp(g.not),ids=g.ids&&new Set(g.ids);return id=>(ids?ids.has(id):re.test(id))&&!(no&&no.test(id))}

function mergeTables(pk){
 const D=pk.data,res=id=>resolveId(pk.mod,id);
 for(const [id,v] of Object.entries(D['prices.json']||{}))if(!id.startsWith('_'))BASE_PRICE[res(id)]=v;
 for(const [f,j] of Object.entries(D)){const m=f.match(/^lang\/(\w+)\.json$/);if(!m||!j)continue;
  for(const [id,n] of Object.entries(j)){const k=res(id);if(ITEMS[k])(ITEMS[k].names=ITEMS[k].names||{})[m[1]]=n;else if(m[1]==='pt')PT_DICT[k]=n}}
 const od=D['oredict.json'];if(od){for(const [n,g] of Object.entries(od.groups||{}))OREDICT[n]=compileGroup(g);
  (od.collapse||[]).forEach(c=>{if(!COLLAPSE.includes(c))COLLAPSE.push(c)});Object.assign(ORE_ALIAS,od.aliases||{})}
 const ef=D['effects.json'];if(ef){Object.assign(FX_COLOR,ef.colors||{});for(const [id,e] of Object.entries(ef.effects||{})){EFFECTS[id]=e;if(e.icon)FX_ICONS.add(id)}}
 if(D['subsets.json'])SUBTREE=D['subsets.json'].tree;
 if(D['guis.json'])GUIS=D['guis.json'];
 if(D['recipes/rules.json'])RULES=D['recipes/rules.json'];
}
function collectRecipes(pk){
 const res=id=>id==null?null:Array.isArray(id)?id.map(res):resolveId(pk.mod,id);
 for(const [f,j] of Object.entries(pk.data)){if(!/^recipes\//.test(f)||/rules\.json$/.test(f)||!j)continue;
  (Array.isArray(j)?j:j.recipes||[]).forEach(r=>PACK_RECIPES.push({...r,a:r.a.map(res),o:res(r.o)}))}}
function applyFamilies(fam){
 if(!fam)return;
 for(const [g,ids] of Object.entries(fam.groups||{}))ids.forEach(i=>{if(ITEMS[i])ITEMS[i].family=g});
 const rules=(fam.auto||[]).map(a=>[new RegExp(a.re),a.key]);
 for(const it of Object.values(ITEMS)){if(it.family)continue;
  for(const [re,key] of rules){const m=re.exec(bare(it.id));if(m){it.family=key.replace('$1',m[1]).replace('$2',m[2]);break}}}}

function finalizeData(){Object.values(ITEMS).forEach(classify);buildRecipes(PM.recipes);buildSubsets(SUBTREE||[])}

async function loadPacks(){
 const idx=await readIndex();if(!idx)return false;
 for(const p of idx.packs){
  const meta=(await readFile(p.dir+'/pack.json'))||{};
  const pk={dir:p.dir,files:p.files,meta,mod:meta.id||(p.dir==='Vanilla'?'minecraft':slug(p.dir.split('/').pop())),name:meta.name||p.dir.split('/').pop(),data:{}};
  MODS[pk.mod]=meta.displayName||pk.name;
  await Promise.all(p.files.filter(f=>f!=='pack.json').map(async f=>{pk.data[f]=await readFile(p.dir+'/'+f)}));
  PACKS.push(pk)}
 for(const pk of PACKS)for(const [f,j] of Object.entries(pk.data)){   // 1) itens
  if(!/^items\//.test(f)||!j)continue;(Array.isArray(j)?j:j.items||[]).forEach(raw=>defineItem(raw,pk,j.category))}
 for(const pk of PACKS)mergeTables(pk);     // 2) preços, idiomas, oredict, efeitos, subsets, guis
 for(const pk of PACKS)generateVariants(pk);// 3) poções, livros encantados, receitas de poção
 for(const pk of PACKS)collectRecipes(pk);  // 4) receitas dos JSONs
 const fam=PACKS.map(p=>p.data['families.json']).filter(Boolean);fam.forEach(applyFamilies);
 S.src.packs=PACKS.map(p=>p.name);
 return true}
