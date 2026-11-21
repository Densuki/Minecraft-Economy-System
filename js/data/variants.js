/* VARIAÇÕES geradas a partir dos JSONs do pack: poções (efeito x formas x estendida/nível II), flechas, livros encantados
   (um por nível) e receitas da Barraca de Poções. Mods podem ter os próprios potions.json / enchantments.json / brewing.json. */
const LANGS=['en','pt'];
function generateVariants(pk){
 const P=pk.data['potions.json'],E=pk.data['enchantments.json'],B=pk.data['brewing.json'];
 if(P)genPotions(pk,P);if(E)genEnchants(pk,E);if(P&&B)genBrewing(pk,P,B)}
const potId=(P,f,p,v)=>P.ids[f].replace('{p}',p+(v?'_'+v:''));

function genPotions(pk,P){
 const variants=d=>[['',d.effects],['long',d.long],['strong',d.strong]].filter(x=>x[1]);
 const make=(form,pId,d,isBase)=>{
  const F=P.forms[form];
  for(const [v,fx] of variants(d)){
   const names={};
   for(const l of LANGS){
    const pn=(d.name[l]||d.name.en)+(v?' '+((P.suffix[v][l]||P.suffix[v].en)):'');
    names[l]=isBase?(form==='potion'?pn:l==='pt'?`${pn} (${form==='splash'?'Arremessável':'Persistente'})`:`${form==='splash'?'Splash':'Lingering'} ${pn}`):(F.name[l]||F.name.en).replace('{0}',pn)}
   const sc=F.durScale,eff=fx.map(([e,dur,amp])=>[e,dur?fmtDur(toSec(dur)*sc):undefined,amp||1]);
   const it=defineItem({id:potId(P,form,pId,v),name:names,category:'potions',shape:'p',color:d.color||P.baseColor,family:'potion:'+pId,fx:eff},pk);
   it.potion={base:F.base,over:F.overlay}}};
 for(const [id,d] of Object.entries(P.bases||{}))['potion','splash','lingering'].forEach(f=>make(f,id,{...d,effects:[],color:P.baseColor},true));
 for(const [id,d] of Object.entries(P.potions))Object.keys(P.forms).forEach(f=>make(f,id,d,false))}

function genEnchants(pk,E){
 for(const [e,d] of Object.entries(E.enchantments)){ENCH[e]=d;
  for(let l=1;l<=d.max;l++)defineItem({id:E.book.id.replace('{e}',e).replace('{l}',l),name:E.book.name,category:'items',shape:'i',color:'#7b3fc4',glint:true,family:'book:'+e,enchants:[[e,l]],texture:E.book.texture,price:(d.price||20)*l},pk)}}

function genBrewing(pk,P,B){
 const res=i=>resolveId(pk.mod,i),id=(f,p,v)=>res(potId(P,f,p,v)),has=(f,p,v)=>!!ITEMS[id(f,p,v)];
 const add=(ing,from,to,st)=>GEN_RECIPES.push({t:'b',a:[res(ing),from],o:to,n:1,st}),pot=(p,v)=>id('potion',p,v);
 B.bases.forEach(b=>add(b.ing,pot(B.water),pot(b.to),1));
 B.mundaneFrom.forEach(ing=>add(ing,pot(B.water),pot(B.mundane),1));
 B.effects.forEach(e=>{if(has('potion',e.to))add(e.ing,pot(B.awkward),pot(e.to),2)});
 for(const [p,d] of Object.entries(P.potions)){
  if(d.long)add(B.modifiers.long,pot(p),pot(p,'long'),3);
  if(d.strong)add(B.modifiers.strong,pot(p),pot(p,'strong'),3)}
 B.corrupt.pairs.forEach(([a,b])=>['','long','strong'].forEach(v=>{if(has('potion',a,v)&&has('potion',b,v))add(B.corrupt.ing,pot(a,v),pot(b,v),3)}));
 for(const p of [...Object.keys(P.potions),...Object.keys(P.bases||{})])['','long','strong'].forEach(v=>{
  if(has('potion',p,v)&&has('splash',p,v)){add(B.modifiers.splash,pot(p,v),id('splash',p,v),4);if(has('lingering',p,v))add(B.modifiers.lingering,id('splash',p,v),id('lingering',p,v),5)}});
 for(const p of Object.keys(P.potions))['','long','strong'].forEach(v=>{
  if(has('arrow',p,v)&&has('lingering',p,v))GEN_RECIPES.push({t:'c',a:[...Array(4).fill('arrow'),id('lingering',p,v),...Array(4).fill('arrow')],o:id('arrow',p,v),n:B.arrowsPerLingering||8})})}

/* regras de receita: reparo na bigorna e melhoria de netherite (parâmetros em recipes/rules.json) */
function buildRuleRecipes(add,has,r){
 if(!r)return;const G=r.gear,sm=r.smithing;
 G.forEach(g=>{const o=sm.to+g;if(has(o))add({t:'m',a:[sm.template,sm.from+g,sm.addition],o,n:1})});
 for(const m in r.repair)G.forEach(g=>{const id=m+'_'+g,[rep,l]=r.repair[m];if(has(id)&&has(rep))add({t:'v',a:[id,rep],o:id,n:1,l})})}
