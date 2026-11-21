#!/usr/bin/env node
/* Servidor local simples (sem dependências):  node tools/serve.mjs [porta]   ->  http://localhost:8000
   No desenvolvimento ele ignora data/bundle.js e gera data/index.json na hora: basta salvar o JSON e dar F5. */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {scan} from './lib/index.mjs';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +(process.argv[2] || 8000);
const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript', '.json': 'application/json; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.ogg': 'audio/ogg', '.jpg': 'image/jpeg', '.webp': 'image/webp'};
http.createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try {
    if (url === '/data/index.json') { res.writeHead(200, {'content-type': MIME['.json'], 'cache-control': 'no-store'}); return res.end(JSON.stringify(await scan(path.join(ROOT, 'data')))); }
    if (url === '/data/bundle.js') { res.writeHead(404); return res.end(); }
    const file = path.join(ROOT, url === '/' ? 'index.html' : url);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    const body = await fs.readFile(file);
    res.writeHead(200, {'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'}); res.end(body);
  } catch { res.writeHead(404); res.end('404'); }
}).listen(PORT, () => console.log(`NEI Preços em http://localhost:${PORT}  (Ctrl+C para parar)`));
