#!/usr/bin/env node
/* Extrai as texturas OFICIAIS de GUI (crafting, poções, bigorna, fornalhas...) do .jar do seu Minecraft para assets/gui/containers/.
   Onde fica o .jar:  Windows  %APPDATA%\.minecraft\versions\<versão>\<versão>.jar   ·   macOS ~/Library/Application Support/minecraft/versions/...   ·   Linux ~/.minecraft/versions/...
   Uso:  node tools/extract-gui.mjs "C:\caminho\1.20.1.jar" [--all]
   Dica: até a 1.20.1 as partes animadas (bolhas, setas, chama) ficam NO MESMO PNG, como o guis.json espera.
         Da 1.20.2 em diante elas viraram arquivos soltos em textures/gui/sprites/ e os fundos podem mudar: nesse caso use um .jar ≤ 1.20.1 (ou me mande o .jar/PNGs para ajustar o guis.json). */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {openZip} from './lib/zip.mjs';
const jar = process.argv[2];
if (!jar) { console.error('Uso: node tools/extract-gui.mjs <caminho do .jar> [--all]'); process.exit(1); }
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'gui', 'containers');
const WANT = ['crafting_table', 'brewing_stand', 'anvil', 'furnace', 'blast_furnace', 'smoker', 'stonecutter', 'smithing', 'loom', 'cartography_table', 'grindstone', 'enchanting_table', 'beacon', 'hopper', 'generic_54'];
const z = openZip(jar), prefix = 'assets/minecraft/textures/gui/container/';
const all = z.names().filter(n => n.startsWith(prefix) && n.endsWith('.png'));
const pick = process.argv.includes('--all') ? all : all.filter(n => WANT.includes(path.basename(n, '.png')));
await fs.mkdir(OUT, {recursive: true});
for (const n of pick) await fs.writeFile(path.join(OUT, path.basename(n)), z.read(n));
console.log(`extraídos (${pick.length}):`, pick.map(n => path.basename(n)).join(', ') || '(nenhum — esse .jar tem a pasta gui/container?)');
const miss = WANT.filter(w => !pick.some(n => path.basename(n, '.png') === w)); if (miss.length) console.log('não encontrados:', miss.join(', '));
