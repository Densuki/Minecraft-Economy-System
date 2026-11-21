/* Fonte dos dados do jogo (PrismarineJS), em camadas — da mais rápida para a mais lenta:
   1) data/manifest.js  (catálogo LOCAL: itens, receitas, comidas e caminho das texturas; sem rede)
   2) atualização online do minecraft-data (só se o manifesto estiver vazio ou CFG.refresh = true)
   3) texturas que faltarem são descobertas em runtime e guardadas no navegador (ver ui/icons.js)  */
const PM={recipes:[]};
async function fetchJSON(urls){for(const u of urls){try{const r=await fetch(u);if(r.ok)return await r.json()}catch(e){}}return null}
const pingLevel=ms=>ms<120?5:ms<250?4:ms<450?3:ms<800?2:1;

function loadManifest(){
 if(!MANIFEST||!Object.keys(MANIFEST.items).length)return false;
 let i=0;
 for(const [id,o] of Object.entries(MANIFEST.items)){const had=!!ITEMS[id],it=addItem(id,{en:o.n,m:o.m||'minecraft',ord:i++,isBlock:!!o.b});if(!had)it.t=o.b?'b':'g'}
 for(const [id,v] of Object.entries(MANIFEST.foods||{}))if(!FOOD[id])FOOD[id]=v;
 PM.recipes=(MANIFEST.recipes||[]).map(([o,n,a])=>({t:'c',a,o,n}));
 S.src={status:'local',version:MANIFEST.version,ping:S.src.ping};return true}

/* recipes.json: { "<idResultado>": [ {result:{id,count}, inShape:[[ids]], ingredients:[ids]} ] } -> nossas receitas */
function parseRecipes(json,byId){
 const out=[];
 const nm=x=>{x=x&&typeof x==='object'?x.id:x;return x==null||x<0?null:byId[x]||null};
 for(const arr of Object.values(json||{}))for(const r of arr){
  const res=r.result,o=nm(typeof res==='object'?res:{id:res});if(!o)continue;
  const n=(typeof res==='object'&&res.count)||1,a=Array(9).fill(null);
  if(r.inShape)r.inShape.forEach((row,y)=>row.forEach((c,x)=>{if(y<3&&x<3)a[y*3+x]=nm(c)}));
  else if(r.ingredients)r.ingredients.slice(0,9).forEach((c,i)=>a[i]=nm(c));
  else continue;
  if(a.some(Boolean))out.push({t:'c',a,o,n});
 }
 return out}

async function loadPrismarine(){
 if(!CFG.online)return false;
 let gotItems=false,gotRecipes=false;
 loadShow(t('loading'),.1);
 for(const v of CFG.dataVersions){            // 1.21.8 primeiro; se faltar algo, tenta a versão anterior
  const bases=CFG.dataBases(v),t0=performance.now();
  const items=await fetchJSON(bases.map(b=>b+'items.json'));
  if(!Array.isArray(items))continue;
  S.src.ping=pingLevel(performance.now()-t0);
  const byId={};items.forEach(i=>byId[i.id]=i.name);
  if(!gotItems){
   loadShow(t('loading'),.4);
   const [foods,blocks]=await Promise.all(['foods','blocks'].map(f=>fetchJSON(bases.map(b=>b+f+'.json'))));
   const bl=new Set((blocks||[]).map(b=>b.name));
   items.forEach(i=>{const had=!!ITEMS[i.name],it=addItem(i.name,{en:i.displayName,ord:i.id,isBlock:bl.has(i.name)});if(!had)it.t=bl.has(i.name)?'b':'g'});
   (foods||[]).forEach(f=>{if(!FOOD[f.name])FOOD[f.name]=[f.foodPoints,f.saturation]});
   S.src={status:'online',version:v,ping:S.src.ping};gotItems=true;
  }
  if(!gotRecipes){
   loadShow(t('loading'),.7);
   const rj=await fetchJSON(bases.map(b=>b+'recipes.json'));
   if(rj){PM.recipes=parseRecipes(rj,byId);if(PM.recipes.length){gotRecipes=true;S.src.recipes=v}}
  }
  if(gotItems&&gotRecipes)break;
 }
 if(!gotItems)S.src.ping=0;
 if(gotItems)finalizeData();
 loadHide();return gotItems}
