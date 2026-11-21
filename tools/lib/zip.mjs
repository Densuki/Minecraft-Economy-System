/* Leitor mínimo de .zip/.jar (sem dependências): lista e extrai arquivos (métodos "stored" e "deflate"). */
import zlib from 'node:zlib';
import fs from 'node:fs';
export function openZip(file) {
  const buf = fs.readFileSync(file);
  let e = buf.length - 22;
  while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) e--;
  if (e < 0) throw new Error('Não parece um .zip/.jar válido');
  const n = buf.readUInt16LE(e + 10); let p = buf.readUInt32LE(e + 16);
  const entries = new Map();
  for (let i = 0; i < n; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Diretório central corrompido');
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), lho = buf.readUInt32LE(p + 42);
    entries.set(buf.toString('utf8', p + 46, p + 46 + nl), {method, csize, lho});
    p += 46 + nl + el + cl;
  }
  return {
    names: () => [...entries.keys()],
    read(name) {
      const x = entries.get(name); if (!x) return null;
      const start = x.lho + 30 + buf.readUInt16LE(x.lho + 26) + buf.readUInt16LE(x.lho + 28), data = buf.subarray(start, start + x.csize);
      return x.method === 0 ? data : zlib.inflateRawSync(data);
    }
  };
}
