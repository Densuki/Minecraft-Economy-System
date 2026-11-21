/* Busca estilo NEI/JEI:  @mod  #dica  $tag  %aba  &id  ^cor   |  OU   -  excluir   "frase exata"   espaço = E */
function one(it,p){
 const c=p[0],v=norm(p.slice(1));
 if(c==='@')return norm(it.m+' '+(MODS[it.m]||'')).includes(v);
 if(c==='#')return norm(lines(it).map(l=>l[0].replace(/<[^>]*>/g,'')).join(' ')).includes(v);
 if(c==='$'){const w=ORE_ALIAS[v]||v.replace('forge:','');return it.tags.some(g=>g.includes(w))}
 if(c==='%')return it.tab.includes(v);
 if(c==='&')return(it.m+':'+it.id).includes(v);
 if(c==='^')return it.hue.includes(v);
 p=norm(p);return norm(itemName(it.id)).includes(p)||norm(it.en).includes(p)||it.id.replace(/_/g,' ').includes(p);
}
function match(it,q){
 return(q.match(/-?"[^"]*"|\S+/g)||[]).every(tk=>{
  const neg=tk[0]==='-'&&tk.length>1;if(neg)tk=tk.slice(1);
  const ok=tk.replace(/"/g,'').split('|').some(p=>one(it,p));return neg?!ok:ok});
}
const allItems=()=>Object.values(ITEMS).sort((a,b)=>a.ord-b.ord);
