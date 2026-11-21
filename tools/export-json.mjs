#!/usr/bin/env node
/* Materializa TODOS os itens (os do PrismarineJS que ainda não estão em JSON) em data/Vanilla/items/<categoria>.json,
   com id, nome (en + pt quando há tradução), forma/cor e textura — para você editar nome, preço, oredict, descrição, textura...
   NUNCA sobrescreve o que já existe nos seus JSONs: só ACRESCENTA itens novos.
   Pré-requisito: node tools/build-manifest.mjs  (gera js/data/manifest.js)
   Uso:  node tools/export-json.mjs [--prices]     (--prices também grava o preço atual de cada item novo em prices.json) */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {scan, bundle} from './lib/index.mjs';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), PRICES = process.argv.includes('--prices');
const html = fsSync.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]).filter(s => !/^js\/(ui|main)/.test(s));
const ctx = {console, performance, setTimeout, document: {querySelector: () => null}, matchMedia: () => ({matches: true}),
  fetch: async u => { u = decodeURIComponent(u);
    if (u === 'data/index.json') return {ok: true, json: async () => scan(path.join(ROOT, 'data'))};
    try { const t = fsSync.readFileSync(path.join(ROOT, u), 'utf8'); return {ok: true, json: async () => JSON.parse(t)}; } catch { return {ok: false}; } }};
ctx.window = ctx; vm.createContext(ctx);
for (const s of scripts) { let c = fsSync.readFileSync(path.join(ROOT, s), 'utf8'); if (s === 'js/config.js') c = c.replace('useBundle:true', 'useBundle:false').replace('online:true', 'online:false'); vm.runInContext(c, ctx, {filename: s}); }
const out = JSON.parse(await vm.runInContext(`(async()=>{
  loadManifest();await loadPacks();finalizeData();
  const CAT={block:'blocks',item:'items',food:'food',tool:'tools',weapon:'weapons',armor:'armor',potion:'items'},list=[];
  for(const it of Object.values(ITEMS)){
    if(it.fromPack||it.m!=='minecraft'||it.potion||it.enchants||!MANIFEST.items[it.id])continue;
    const e={id:it.id,name:{en:it.en}},pt=PT_DICT[it.id]||PT_RULE(it.id);if(pt)e.name.pt=pt;
    e.shape=it.t;e.color=it.c;const m=MANIFEST.items[it.id];if(m&&m.k)e.texture={k:m.k,t:m.t,s:m.s||undefined,f:m.f||undefined,v:m.v,o:m.o||undefined,c:m.c||undefined};
    list.push({cat:CAT[it.k]||'items',e,price:${PRICES}?+price(it.id).toFixed(2):null})}
  return JSON.stringify(list)})()`, ctx));
const LBL = {blocks: ['Blocks', 'Blocos'], items: ['Items', 'Itens'], food: ['Food', 'Comidas'], tools: ['Tools', 'Ferramentas'], weapons: ['Weapons', 'Armas'], armor: ['Armor', 'Armaduras']};
const dir = path.join(ROOT, 'data', 'Vanilla'); await fs.mkdir(path.join(dir, 'items'), {recursive: true});
const byCat = {}; out.forEach(o => (byCat[o.cat] ||= []).push(o.e));
for (const [cat, items] of Object.entries(byCat)) {
  const f = path.join(dir, 'items', cat + '.json'); let j = {category: cat, label: {en: LBL[cat][0], pt: LBL[cat][1]}, items: []};
  try { j = JSON.parse(await fs.readFile(f, 'utf8')); } catch {}
  const have = new Set(j.items.map(i => i.id)); j.items.push(...items.filter(i => !have.has(i.id)));
  await fs.writeFile(f, JSON.stringify(j, null, 1));
}
if (PRICES) { const f = path.join(dir, 'prices.json'); let p = {}; try { p = JSON.parse(await fs.readFile(f, 'utf8')); } catch {}
  out.forEach(o => { if (o.price != null && !(o.e.id in p)) p[o.e.id] = o.price; }); await fs.writeFile(f, JSON.stringify(p, null, 1)); }
const b = await bundle(path.join(ROOT, 'data'));
await fs.writeFile(path.join(ROOT, 'data', 'index.json'), JSON.stringify(b.index, null, 1)); await fs.writeFile(path.join(ROOT, 'data', 'bundle.js'), 'window.NEI_BUNDLE=' + JSON.stringify(b) + ';\n');
console.log(`itens novos exportados: ${out.length}` + Object.entries(byCat).map(([c, i]) => `\n  ${c}: ${i.length}`).join('') + '\nindex.json e bundle.js atualizados.');
