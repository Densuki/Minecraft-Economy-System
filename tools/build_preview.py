"""Gera um ÚNICO arquivo HTML (preview) juntando css, js e imagens/som em base64.
Usado para pré-visualizar no Claude (que não deixa carregar arquivos externos nem o PrismarineJS).
Uso: python3 tools/build_preview.py  ->  nei-precos-preview.html (na pasta acima)"""
import re, base64, os, glob
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
rd = lambda p: open(os.path.join(R, p), encoding='utf-8').read()
b64 = lambda p, mime: f"data:{mime};base64," + base64.b64encode(open(os.path.join(R, p), 'rb').read()).decode()
gui = {os.path.basename(f): b64(f'assets/gui/{os.path.basename(f)}', 'image/png') for f in glob.glob(os.path.join(R, 'assets/gui/*.png'))}
fx = {os.path.basename(f)[:-4]: b64(f'assets/effects/{os.path.basename(f)}', 'image/png') for f in glob.glob(os.path.join(R, 'assets/effects/*.png'))}
os.system(f'cd "{R}" && node tools/build-index.mjs > /dev/null')
html = rd('index.html')
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', lambda m: '<style>' + rd(m.group(1)) + '</style>', html)
def js(m):
    c = rd(m.group(1))
    if m.group(1) == 'js/config.js':
        c = c.replace('online:true', 'online:false')
        c = c.replace("clickSrc:'assets/sounds/click.ogg'", "clickSrc:'" + b64('assets/sounds/click.ogg', 'audio/ogg') + "'")
        c = c.replace("const guiURL=f=>'assets/gui/'+f;", "const GUI=" + str(gui).replace("'", '"') + ";const guiURL=f=>GUI[f];")
        c = c.replace("const fxURL=id=>'assets/effects/'+id+'.png';", "const FX=" + str(fx).replace("'", '"') + ";const fxURL=id=>FX[id];")
    return '<script>' + c + '</script>'
html = re.sub(r'<script src="((?:js|data)/[^"]+)"></script>', js, html)
def sub_css(m): return gui[m.group(1)] if m.group(1) in gui else m.group(0)
html = re.sub(r'(?<=url\()\.\./assets/gui/([\w\-.]+)(?=\))', lambda m: gui[m.group(1)], html)
html = re.sub(r'(?<=url\()assets/gui/([\w\-.]+)(?=\))', lambda m: gui[m.group(1)], html)
out = os.path.join(R, '..', 'nei-precos-preview.html'); open(out, 'w', encoding='utf-8').write(html); print(out, len(html)//1024, 'KB')
