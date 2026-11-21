"""Extrai sprites da interface a partir dos seus screenshots.
Uso: python3 tools/extract_assets.py <pasta_dos_anexos>"""
import sys, os
from PIL import Image
U = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/uploads'
O = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'gui'); os.makedirs(O, exist_ok=True)
BG = (198, 198, 198)

def keyed(im, bg=BG, tol=6):
    im = im.convert('RGBA'); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if abs(r-bg[0]) < tol and abs(g-bg[1]) < tol and abs(b-bg[2]) < tol: px[x, y] = (0, 0, 0, 0)
    return im

bf = Image.open(f'{U}/blast_furnace.png').convert('RGBA')
keyed(bf.crop((176, 0, 190, 14))).save(f'{O}/flame_full.png')
keyed(bf.crop((176, 14, 200, 31))).save(f'{O}/arrow_full.png')
keyed(bf.crop((56, 36, 70, 50))).save(f'{O}/flame_empty.png')
keyed(bf.crop((79, 34, 103, 51))).save(f'{O}/arrow_empty.png')

sh = Image.open(f'{U}/nei-eximg3.png').convert('RGBA')
xs = [20, 80, 140, 200]; ys = [10, 66, 122]
for i, n in enumerate(['trash', 'rain', 'moon', 'magnet', 'dawn', 'noon', 'dusk', 'night', 'heal']):
    sh.crop((xs[i % 4], ys[i // 4], xs[i % 4]+48, ys[i // 4]+48)).save(f'{O}/tool_{n}.png')

def autocrop(path, out, size):
    im = Image.open(path).convert('RGBA'); px = im.load(); bg = px[2, 2]
    pts = [(x, y) for y in range(im.height) for x in range(im.width) if sum(abs(px[x, y][k]-bg[k]) for k in range(3)) > 40]
    x0, y0 = min(p[0] for p in pts), min(p[1] for p in pts); x1, y1 = max(p[0] for p in pts), max(p[1] for p in pts)
    im.crop((x0, y0, x1+1, y1+1)).resize((size, size), Image.LANCZOS).save(out)
autocrop(f'{U}/1794535986150_image.png', f'{O}/btn_bookmark.png', 48)
autocrop(f'{U}/1794535996427_image.png', f'{O}/btn_wrench.png', 48)
print('ok')
