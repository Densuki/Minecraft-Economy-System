/* Árvore do "Item SubSets" (menu superior), lida de data/Vanilla/subsets.json.
   Nó: name {en,pt}, match {kind|re|tag|tab|not|mods}, children. O nó "mods" vira 1 filho por pasta de data/Mods. */
const matcher=m=>{if(!m)return null;if(m.mods)return it=>it.m!=='minecraft';
 const re=m.re&&new RegExp(m.re),no=m.not&&new RegExp(m.not);
 return it=>(!m.kind||it.k===m.kind)&&(!re||re.test(bare(it.id)))&&(!m.tag||it.tags.includes(m.tag))&&(!m.tab||it.tab===m.tab)&&(!no||!no.test(bare(it.id)))};
let SUB=[];
const convSub=n=>{const o={name:n.name,f:matcher(n.match)};
 if(n.match&&n.match.mods)o.c=()=>Object.keys(MODS).filter(m=>m!=='minecraft').map(m=>({l:MODS[m],f:it=>it.m===m}));
 else if(n.children)o.c=n.children.map(convSub);return o};
const buildSubsets=tree=>{SUB=tree.map(convSub)};
const subLabel=n=>n.l||L10N(n.name);
const subKids=n=>typeof n.c==='function'?n.c():n.c;
