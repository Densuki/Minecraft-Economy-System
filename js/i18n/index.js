/* Tradução: textos da interface (t) e nomes de itens (itemName). Idiomas em en.js e pt.js;
   nomes de itens vêm do JSON (name.en / name.pt), de data/<pack>/lang/pt.json e, por fim, das regras de pt.js. */
const I18N={en:{ui:{},desc:{}},pt:{ui:{},desc:{}}};
const PT_DICT={};   // id -> nome em português (preenchido pelos JSONs)
let PT_RULE=()=>null; // regras que compõem nomes (ferramentas, cores, madeiras...) em pt.js
const t=(k,...a)=>{let s=I18N[CFG.lang].ui[k]??I18N.en.ui[k]??k;a.forEach((v,i)=>s=s.split('{'+i+'}').join(v));return s};
const L10N=o=>o&&typeof o==='object'?(o[CFG.lang]??o.en??Object.values(o)[0]):o;   // {en,pt} -> texto do idioma atual
const descOf=id=>{const it=ITEMS[id];return(it&&it.desc?L10N(it.desc):null)||I18N[CFG.lang].desc[id]||I18N.en.desc[id]||null};
/* Nome do item (texto puro, pode ter códigos &). Sem tradução coerente em português, mantém o inglês. */
function itemName(id){
  const it=ITEMS[id];if(!it)return id;
  if(it.names&&it.names[CFG.lang])return it.names[CFG.lang];
  if(CFG.lang==='pt'){const p=PT_DICT[id]||PT_RULE(id.includes(':')?id.split(':')[1]:id);if(p)return p}
  return(it.names&&it.names.en)||it.en;
}
const itemNameHTML=id=>mc(itemName(id));
