#!/usr/bin/env node
/* Gera data/manifest.js: catálogo LOCAL com itens (id, mod:id, nome), receitas, comidas e o caminho de cada textura
   (usando as listas de arquivos e, se existir, blocks_models.json do minecraft-assets). Roda UMA vez; depois o site
   não precisa pesquisar imagem por imagem.
   Requer Node 18+.   Uso:
     node tools/build-manifest.mjs                 -> só o manifesto (as imagens continuam vindo do GitHub)
     node tools/build-manifest.mjs --download      -> também baixa as imagens para assets/textures/ (site 100% local)
     node tools/build-manifest.mjs --versions=1.21.8,1.21.4 --out=outro.js */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = n => (process.argv.find(a => a.startsWith(`--${n}=`)) || '').split('=')[1];
const DOWNLOAD = process.argv.includes('--download');
const DATA_V = (arg('versions') || '1.21.8,1.21.4,1.21.1,1.20.4,1.19.4,1.18.2,1.16.5').split(',');
const ASSET_V = ['1.21.8', '1.21.4', '1.21.1', '1.20.2', '1.19.1', '1.18.1', '1.16.4'];
const OUT = arg('out') || path.join(ROOT, 'js', 'data', 'manifest.js');
const RAW_D = v => `https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/${v}/`;
const RAW_A = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/';
const TREE = (v, d) => `https://api.github.com/repos/PrismarineJS/minecraft-assets/git/trees/master:data/${v}/${d}`;
const NONCUBE = /(_slab|_stairs|_fence|_fence_gate|_wall|_door|_trapdoor|_button|_pressure_plate|_sign|_banner|_bed|_carpet|_pane|_bars|_rail|^rail$|torch|sapling|flower|tulip|dandelion|poppy|orchid|allium|bluet|daisy|grass$|fern|vine|lily|mushroom|coral_fan|candle|_head|_skull|chain|lantern|ladder|lever|cobweb|_roots|_sprouts|kelp|seagrass|bamboo|_rod|cactus|sugar_cane|azalea|bush|chest|anvil|brewing_stand|cauldron|hopper|enchanting|lectern|campfire|bell)/;

const log = (...a) => console.log(...a);
async function json(url) { try { const r = await fetch(url, {headers: {'user-agent': 'nei-precos'}}); return r.ok ? await r.json() : null; } catch { return null; } }
async function pool(list, n, fn) { let i = 0; await Promise.all(Array.from({length: n}, async () => { while (i < list.length) { const x = list[i++]; await fn(x); } })); }

/* ---- 1) itens / blocos / comidas / receitas (minecraft-data) ---- */
let items = null, dataVer = null;
for (const v of DATA_V) { const j = await json(RAW_D(v) + 'items.json'); if (Array.isArray(j)) { items = j; dataVer = v; break; } }
if (!items) { console.error('Não consegui baixar items.json (sem internet?).'); process.exit(1); }
const blocks = new Set(((await json(RAW_D(dataVer) + 'blocks.json')) || []).map(b => b.name));
const foodsJ = (await json(RAW_D(dataVer) + 'foods.json')) || [];
let recipes = [];
for (const v of DATA_V.slice(DATA_V.indexOf(dataVer))) {
  const its = v === dataVer ? items : await json(RAW_D(v) + 'items.json'); const rj = await json(RAW_D(v) + 'recipes.json');
  if (!its || !rj) continue;
  const byId = {}; its.forEach(i => byId[i.id] = i.name);
  const nm = x => { x = x && typeof x === 'object' ? x.id : x; return x == null || x < 0 ? null : byId[x] || null; };
  for (const arr of Object.values(rj)) for (const r of arr) {
    const res = r.result, o = nm(typeof res === 'object' ? res : {id: res}); if (!o) continue;
    const n = (typeof res === 'object' && res.count) || 1, a = Array(9).fill(null);
    if (r.inShape) r.inShape.forEach((row, y) => row.forEach((c, x) => { if (y < 3 && x < 3) a[y * 3 + x] = nm(c); }));
    else if (r.ingredients) r.ingredients.slice(0, 9).forEach((c, i) => a[i] = nm(c));
    else continue;
    if (a.some(Boolean)) recipes.push([o, n, a]);
  }
  if (recipes.length) { log(`receitas: ${recipes.length} (versão ${v})`); break; }
}

/* ---- 2) quais arquivos existem em minecraft-assets (listas por versão; se a API falhar, testa um a um) ---- */
const lists = {}, probeCache = new Map();
for (const v of ASSET_V) {
  lists[v] = {};
  for (const d of ['items', 'blocks']) {
    const t = await json(TREE(v, d));
    lists[v][d] = t && t.tree ? new Set(t.tree.filter(f => f.path.endsWith('.png')).map(f => f.path.slice(0, -4))) : null;
  }
}
async function exists(v, p) {
  const [d, n] = p.split('/'), L = lists[v] && lists[v][d];
  if (L) return L.has(n);
  const k = v + p; if (!probeCache.has(k)) probeCache.set(k, fetch(RAW_A + v + '/' + p + '.png', {method: 'HEAD'}).then(r => r.ok).catch(() => false));
  return probeCache.get(k);
}
async function find(paths, from = 0) {
  for (const v of ASSET_V.slice(from)) for (const p of paths) if (await exists(v, p)) return {p, v};
  return null;
}
const vi = r => ASSET_V.indexOf(r.v);

/* ---- 3) modelos de bloco (se o repositório tiver blocks_models.json) ---- */
let models = null;
for (const v of ASSET_V) { models = await json(RAW_A + v + '/blocks_models.json'); if (models) { log('modelos de bloco:', v); break; } }
const tex = s => typeof s === 'string' ? s.replace(/^minecraft:/, '').replace(/^block\//, 'blocks/').replace(/^item\//, 'items/') : null;
function faces(id) {   // {t: topo, s: lado, f: frente} a partir do modelo, quando possível
  const m = models && (models[id] || models['block/' + id] || models['minecraft:block/' + id]); if (!m) return null;
  const T = m.textures || (m.variants && Object.values(m.variants)[0] && Object.values(m.variants)[0].textures); if (!T) return null;
  const all = tex(T.all), top = tex(T.top || T.up || T.end || T.all), side = tex(T.side || T.north || T.all), front = tex(T.front);
  return top && side ? {t: top, s: side, f: front && front !== side ? front : null} : (all ? {t: all, s: all, f: null} : null);
}

/* ---- 4) resolve cada item ---- */
const out = {version: dataVer, base: RAW_A, local: DOWNLOAD ? 'assets/textures/' : null, items: {}, foods: {}, recipes};
foodsJ.forEach(f => out.foods[f.name] = [f.foodPoints, f.saturation]);
const used = new Set(); let ok = 0;
await pool(items, 12, async it => {
  const id = it.name, isB = blocks.has(id), cubeLike = isB && !NONCUBE.test(id);
  const e = {n: it.displayName, b: isB ? 1 : 0};
  let r = null;
  if (cubeLike) {
    const fm = faces(id);
    if (fm) { const s = await find([fm.s]); if (s) { const t = await find([fm.t], vi(s)); r = {k: 'c', t: (t || s).p, s: s.p, f: fm.f, v: s.v}; } }
    if (!r) {
      const side = await find([`blocks/${id}_side`, `blocks/${id}`, `blocks/${id}_front`]);
      if (side) { const top = await find([`blocks/${id}_top`, `blocks/${id}`], vi(side)), front = await find([`blocks/${id}_front`], vi(side));
        r = {k: 'c', t: (top || side).p, s: side.p, f: front && front.p !== side.p ? front.p : null, v: side.v}; }
    }
  } else {
    const a = await find([`items/${id}`]);
    if (a) r = {k: 'f', t: a.p, v: a.v};
    else {
      const base = id.replace(/_(slab|stairs|fence_gate|fence|wall|button|pressure_plate)$/, ''), bs = base !== id ? [`blocks/${base}`, `blocks/${base}_planks`, `blocks/${base}s`] : [];
      const fm = faces(id), m = fm && await find([fm.s]);
      const b = m || await find([`blocks/${id}`, `blocks/${id}_front`, `blocks/${id}_side`, ...bs]);
      if (b) r = {k: 'f', t: b.p, v: b.v};
    }
  }
  if (r) { ok++; Object.assign(e, r); [r.t, r.s, r.f].filter(Boolean).forEach(p => used.add(r.v + '/' + p)); } else e.k = 'n';
  out.items[id] = e;
});
// mantém a ordem do jogo
out.items = Object.fromEntries(items.map(i => [i.name, out.items[i.name]]));
log(`itens: ${items.length} · com textura: ${ok}`);

/* ---- 5) (opcional) baixa as imagens ---- */
if (DOWNLOAD) {
  await pool([...used], 8, async u => {
    const file = path.join(ROOT, 'assets', 'textures', u + '.png');
    try { const r = await fetch(RAW_A + u + '.png'); if (!r.ok) return; await fs.mkdir(path.dirname(file), {recursive: true}); await fs.writeFile(file, Buffer.from(await r.arrayBuffer())); } catch {}
  });
  log(`imagens baixadas: ${used.size} -> assets/textures/`);
}
await fs.mkdir(path.dirname(OUT), {recursive: true});
await fs.writeFile(OUT, `/* gerado por tools/build-manifest.mjs em ${new Date().toISOString()} */\nconst MANIFEST=${JSON.stringify(out)};\n`);
log('gravado:', OUT);
