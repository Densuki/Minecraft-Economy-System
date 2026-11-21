/* Estado e "banco de dados" do site: itens, receitas, preços. Tudo que a interface consulta passa por aqui.
   Os DADOS vêm dos JSONs em data/ (ver data/loader.js); aqui ficam só as estruturas e a lógica. */
const $=s=>document.querySelector(s);
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const fmt=n=>n.toFixed(2)+'c';
const alt=x=>Array.isArray(x)?x:[x],head=x=>Array.isArray(x)?x[0]:x;   // ingrediente pode ser uma lista de alternativas (OreDict)
const bare=id=>id.includes(':')?id.split(':')[1]:id;                    // "thermal:tin_ingot" -> "tin_ingot"

/* API pública para ligar este site a outros sistemas (economia, loja, servidor...). */
const NEI=window.NEI={economy:{override:null},_h:{},
 on(e,f){(this._h[e]||(this._h[e]=[])).push(f)},emit(e,d){(this._h[e]||[]).forEach(f=>{try{f(d)}catch(x){console.error(x)}})}};

/* tabelas preenchidas pelo loader a partir dos JSONs */
const FOOD={},ATK={},ARM={},FUEL={},BASE_PRICE={},EFFECTS={},ITEM_FX={},TEXMAP={},FX_ICONS=new Set(),FX_COLOR={g:'#5555ff',b:'#ff5555',o:'#5555ff'};
const MODS={minecraft:'Minecraft'},OREDICT={},ENC=new Set();let COLLAPSE=[],ORE_ALIAS={},GUIS=null,SUBTREE=null;

const ITEMS={},R=[],ROUT={},RIN={},SIGS=new Set(),PC={};
const S={left:'fav',fpage:0,open:new Set(),cat:null,menu:[],favs:JSON.parse(LS.get('nei.favs')||'[]'),mode:'inv',id:null,kind:'r',idx:0,tab:null,qty:64,page:0,q:'',hot:Array(9).fill(null),hist:[],saves:{},tools:new Set([2,3,7]),av:[],L:0,hover:null,time:'night',bg:LS.get('nei.bg')||'scene',src:{status:'offline',version:null,ping:null}};
const QS=[1,2,4,8,16,32,64,128,256,512,1024];

/* ---------- itens ---------- */
const title=id=>bare(id).split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
function hashColor(id){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;return'#'+[0,8,16].map(s=>(90+((h>>s)&127)).toString(16).padStart(2,'0')).join('')}
function addItem(id,o={}){const it=ITEMS[id]||(ITEMS[id]={id,m:'minecraft',t:'b',c:null,en:title(id),ord:1e5+Object.keys(ITEMS).length});Object.assign(it,o);it.c=it.c||hashColor(id);return it}
function hue(h){const n=parseInt(h.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,x=Math.max(r,g,b),y=Math.min(r,g,b),d=x-y,l=(x+y)/2;
 if(l>.85)return'white';if(l<.14)return'black';if(d<.12)return'gray';
 const H=60*(x===r?((g-b)/d+6)%6:x===g?(b-r)/d+2:(r-g)/d+4);
 return H<20||H>=345?'red':H<45?(l<.4?'brown':'orange'):H<70?'yellow':H<165?'green':H<200?'cyan':H<260?'blue':H<290?'purple':'pink'}
const SWORD={wooden:4,stone:5,golden:4,copper:5,iron:6,diamond:7,netherite:8};
const ARMV={helmet:{leather:1,golden:2,chainmail:2,iron:2,copper:2,diamond:3,netherite:3,turtle:2},chestplate:{leather:3,golden:5,chainmail:5,iron:6,copper:4,diamond:8,netherite:8},leggings:{leather:2,golden:3,chainmail:4,iron:5,copper:3,diamond:6,netherite:6},boots:{leather:1,golden:1,chainmail:1,iron:2,copper:1,diamond:3,netherite:3}};
const atkOf=id=>{const m=bare(id).match(/^(\w+)_sword$/);return ATK[id]||(m&&SWORD[m[1]])||0};
const armOf=id=>{const m=bare(id).match(/^(\w+)_(helmet|chestplate|leggings|boots)$/);return ARM[id]||(m&&ARMV[m[2]][m[1]])||0};
const fuelSecs=id=>FUEL[id]!=null?FUEL[id]:/_(planks|log|wood|stem|hyphae)$/.test(id)?15:/^wooden_/.test(id)?10:0;
const FUEL_CYCLE=['coal','charcoal','oak_planks','oak_log','stick','coal_block','blaze_rod','lava_bucket'];
const CATKIND={blocks:'block',items:'item',food:'food',tools:'tool',weapons:'weapon',armor:'armor',potions:'potion'};
const oreTags=id=>Object.keys(OREDICT).filter(k=>OREDICT[k](bare(id))).map(k=>k.toLowerCase());
const groupOf=id=>COLLAPSE.find(g=>OREDICT[g]&&OREDICT[g](bare(id)));
function classify(it){const id=it.id,b=bare(id);
 it.k=it.kindOverride||CATKIND[it.cat]||(FOOD[id]?'food':armOf(id)||/_(helmet|chestplate|leggings|boots)$|^(elytra|shield)$/.test(b)?'armor':/_sword$|^(bow|crossbow|trident|mace|arrow|spectral_arrow)$/.test(b)?'weapon':/_(pickaxe|axe|shovel|hoe)$|^(shears|fishing_rod|flint_and_steel|bucket|brush|spyglass|compass|clock)$/.test(b)?'tool':it.t==='p'?'potion':(it.isBlock??it.t==='b')?'block':'item');
 it.tags=[...new Set([...(it.extraOre||[]).map(x=>x.toLowerCase()),...oreTags(id)])];if(fuelSecs(id))it.tags.push('fuel');
 it.tab={block:'building',food:'food',tool:'tools',weapon:'combat',armor:'combat',potion:'brewing',item:'materials'}[it.k];
 if(/redstone|piston|repeater|comparator|observer|hopper|dropper|dispenser|lever|_button|pressure_plate|rail|^tnt$|lamp/.test(b))it.tab='redstone';
 it.hue=hue(it.c)}
/* itens da mesma família (variações: bigorna/lascada/danificada, poção/estendida/II, livro nível 1..5...) */
function variantsOf(id){const f=ITEMS[id]&&ITEMS[id].family;return f?Object.values(ITEMS).filter(i=>i.family===f&&i.id!==id).sort((a,b)=>a.ord-b.ord).slice(0,24):[]}

/* ---------- receitas ---------- */
function addRecipe(r){
 const flat=r.a.flatMap(x=>x?alt(x):[]);
 const sig=r.t+'|'+r.a.map(x=>x?alt(x).join('+'):'').join(',')+'|'+r.o;if(SIGS.has(sig))return;SIGS.add(sig);
 flat.forEach(i=>{if(!ITEMS[i])classify(addItem(i))});if(!ITEMS[r.o])classify(addItem(r.o));
 R.push(r);(ROUT[r.o]||(ROUT[r.o]=[])).push(r);for(const i of new Set(flat))(RIN[i]||(RIN[i]=[])).push(r)}
/* junta receitas que só diferem por itens do mesmo grupo OreDict (ex.: 12 madeiras -> 1 receita alternando) */
function collapse(list){
 const m=new Map(),out=[];
 for(const r of list){
  if(r.t!=='c'){out.push(r);continue}
  const key=r.o+'|'+r.n+'|'+r.a.map(c=>c?(groupOf(c)||c):'').join(','),g=m.get(key);
  if(!g){const nr={...r,a:r.a.slice(),alts:r.a.map(c=>c&&groupOf(c)?new Set([c]):null)};m.set(key,nr);out.push(nr)}
  else r.a.forEach((c,i)=>{if(c&&g.alts[i])g.alts[i].add(c)});
 }
 out.forEach(r=>{if(r.alts){r.a=r.a.map((c,i)=>r.alts[i]&&r.alts[i].size>1?[...r.alts[i]]:c);delete r.alts}});
 return out}
let PACK_RECIPES=[],GEN_RECIPES=[],RULES=null;
function buildRecipes(online=[]){
 R.length=0;SIGS.clear();for(const k in ROUT)delete ROUT[k];for(const k in RIN)delete RIN[k];for(const k in PC)delete PC[k];
 const have=new Set(online.map(r=>r.o));
 collapse([...online,...PACK_RECIPES.filter(r=>!(r.t==='c'&&have.has(r.o)))]).forEach(addRecipe);
 GEN_RECIPES.forEach(addRecipe);
 buildRuleRecipes(addRecipe,id=>!!ITEMS[id],RULES);
}
/* "Information" existe para TODO item (descrição, ou aviso de item bruto) */
function recipesFor(id,kind){
 if(kind==='r')return[...(ROUT[id]||[]),{t:'i',a:[id],o:id,n:1,d:descOf(id)}];
 const l=[...(RIN[id]||[])];const f=fuelSecs(id);if(f)l.push({t:'f',a:[id],o:null,n:1,s:f});return l}

/* ---------- preços (em c; mínimo 1.00c). NEI.economy.override(id) deixa outro sistema mandar no preço ---------- */
function price(id,vis={}){
 if(NEI.economy.override){const o=NEI.economy.override(id);if(o!=null)return o}
 if(PC[id]!=null)return PC[id];
 if(BASE_PRICE[id]!=null)return PC[id]=Math.max(1,BASE_PRICE[id]);
 if(vis[id])return 1;vis[id]=1;
 const r=(ROUT[id]||[]).find(x=>x.t!=='v');let p=1;if(r)p=Math.max(1,cost(r,vis)/r.n);
 delete vis[id];return PC[id]=p}
function cost(r,vis){return r.t==='v'?price(head(r.a[1]),vis||{}):r.a.filter(Boolean).reduce((s,i)=>s+price(head(i),vis||{}),0)+(r.t==='s'?.5:0)}

/* ---------- tooltip: linhas extras (html + cor) ---------- */
const ROMAN=['','I','II','III','IV','V','VI','VII','VIII','IX','X'];
const hud=(cls,n)=>`<i class="h ${cls}"></i>`.repeat(n);
const fxName=id=>{const e=EFFECTS[id];return e?L10N(e.name):id};
function fxLine(id,dur,lvl){const e=EFFECTS[id];if(!e)return null;
 const ic=FX_ICONS.has(id)?`<i class="ei" style="background-image:url(${fxURL(id)})"></i>`:'<i class="ei"></i>';
 return[ic+escH(fxName(id))+(lvl>1?' '+ROMAN[lvl]:'')+(dur?` (${dur})`:''),FX_COLOR[e.cat]||'#aaa']}
function lines(it){const L=[],id=it.id,f=FOOD[id],ar=armOf(id),at=atkOf(id);
 (it.enchants||[]).forEach(([e,l])=>{const E=ENCH[e];if(E)L.push([escH(L10N(E.name))+(E.max>1?' '+ROMAN[l]:''),'#aaaaaa'])});
 if(ar){L.push([t('armorv',ar),'#5555ff']);L.push([hud('ar_full',Math.floor(ar/2))+hud('ar_half',ar%2),'#fff'])}
 else if(at)L.push([t('atkv',at),'#5555ff']);
 (it.tooltip||[]).forEach(x=>L.push([mc(L10N(x)),'#55ff55']));
 (ITEM_FX[id]||[]).forEach(([e,d,l])=>{const x=fxLine(e,d,l);if(x)L.push(x)});
 const fs=fuelSecs(id);if(fs)L.push(['Fuel ('+fs+'s)','#aaaaaa']);
 if(f){L.push([hud('fd_full',Math.floor(f[0]/2))+hud('fd_half',f[0]%2),'#fff']);
  const sx=fxLine('saturation');L.push([(sx?sx[0].replace(/<\/i>.*/,'</i>'):'')+t('sat',f[1].toFixed(1)),'#ffaa00'])}
 return L}
const ENCH={};   // encantamentos (enchantments.json)
