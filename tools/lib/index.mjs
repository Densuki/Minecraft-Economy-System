/* Varre data/Vanilla e data/Mods/<Nome> e monta o índice (e o bundle) dos packs. */
import fs from 'node:fs/promises';
import path from 'node:path';
async function walk(dir, base = '') {
  const out = [];
  for (const e of await fs.readdir(dir, {withFileTypes: true})) {
    if (e.name.startsWith('_') || e.name.startsWith('.') || e.name === 'textures') continue;
    const rel = base ? base + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...await walk(path.join(dir, e.name), rel));
    else if (e.name.endsWith('.json')) out.push(rel);
  }
  return out.sort();
}
export async function scan(dataDir) {
  const packs = [];
  const add = async (dir) => { const files = await walk(path.join(dataDir, dir)); if (files.length) packs.push({dir, files}); };
  try { await fs.access(path.join(dataDir, 'Vanilla')); await add('Vanilla'); } catch {}
  try { for (const m of (await fs.readdir(path.join(dataDir, 'Mods'), {withFileTypes: true})).filter(e => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.')).map(e => e.name).sort()) await add('Mods/' + m); } catch {}
  return {packs};
}
export async function bundle(dataDir) {
  const index = await scan(dataDir), files = {};
  for (const p of index.packs) for (const f of p.files) files[p.dir + '/' + f] = JSON.parse(await fs.readFile(path.join(dataDir, p.dir, f), 'utf8'));
  return {index, files};
}
