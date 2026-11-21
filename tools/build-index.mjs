#!/usr/bin/env node
/* Gera data/index.json (lista de packs e arquivos) e data/bundle.js (TODOS os JSONs num arquivo só = carrega rápido e funciona até abrindo o index.html direto).
   Rode sempre que adicionar/remover/editar JSONs:   node tools/build-index.mjs */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from './lib/index.mjs';
const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const b = await bundle(DATA);
await fs.writeFile(path.join(DATA, 'index.json'), JSON.stringify(b.index, null, 1));
await fs.writeFile(path.join(DATA, 'bundle.js'), 'window.NEI_BUNDLE=' + JSON.stringify(b) + ';\n');
const n = Object.keys(b.files).length;
console.log(`packs: ${b.index.packs.map(p => p.dir).join(', ')}\narquivos: ${n} -> data/index.json + data/bundle.js`);
