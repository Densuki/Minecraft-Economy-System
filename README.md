# NEI Preços — site no estilo do Not Enough Items / Just Enough Items

Calculadora econômica de Minecraft: itens, receitas, poções, livros e preços **em JSON editável** (`data/`), visual do mod, PrismarineJS para texturas.

## Rodar
- **Desenvolvimento:** `node tools/serve.mjs` → http://localhost:8000 (lê os JSONs soltos: salvou, F5). Node 18+.
- **Produção (FTP/AlwaysData):** `node tools/build-index.mjs` e suba a pasta inteira (inclui `data/bundle.js`, que junta todos os JSONs: 1 arquivo = carrega rápido, e funciona até abrindo `index.html` direto).
- Primeira vez com texturas: `node tools/build-manifest.mjs --download` (catálogo + imagens locais) e depois `node tools/export-json.mjs` (copia todos os itens para JSON editável; só ACRESCENTA).

## Como mexer
| Quero… | Faça |
|---|---|
| mudar preço / nome / descrição / textura / oredict | edite o JSON em `data/Vanilla/items/*.json`, `prices.json`, `lang/pt.json` (ver `data/README.md`) |
| nomes coloridos | `&4&lAVISO` (tabela de códigos em `data/README.md`) |
| adicionar um mod | copie `data/Mods/_modelo` para `data/Mods/<Nome>` e rode `build-index` |
| controlar a economia de fora | `NEI.economy.override = id => preço` |
| trocar o fundo | botão "Fundo" ou `NEI.setBackground(...)` |
| 2D ↔ 3D | botão "Texturas" (2D padrão; `"render":"flat"` por item) |
| GUIs oficiais (bancada, poções, bigorna) | `node tools/extract-gui.mjs <.jar>` (ver abaixo) |

## Ferramentas (`tools/`)
`serve.mjs` · `build-index.mjs` · `build-manifest.mjs` (PrismarineJS → catálogo/texturas) · `export-json.mjs` · `extract-gui.mjs` (texturas de GUI do seu .jar) · `extract_assets.py` / `extract_hud.py` (sprites dos seus screenshots) · `build_preview.py` (arquivo único para pré-visualizar).

## GUIs oficiais
Os PNGs de GUI vêm do `.jar` do jogo (ex.: `…/.minecraft/versions/1.20.1/1.20.1.jar`): `node tools/extract-gui.mjs "caminho/1.20.1.jar"` grava em `assets/gui/containers/`. As posições estão em `data/Vanilla/guis.json` (formato clássico, até a 1.20.1; da 1.20.2 em diante as partes animadas viraram arquivos soltos). Sem os PNGs o site usa o desenho em CSS.
> Texturas do Minecraft são da Mojang: confira as diretrizes de uso (conteúdo de fã, não comercial) antes de publicar.

## Fonte dos ícones
`js/config.js` → `iconSource`: `{list:'prismarine', info:'prismarine'}`. Alternativas: `'itemids'` (remoto, **hotlink de terceiros: sem permissão documentada**) e `'local'` (`assets/icons/<id>.png`). O Minecraft ID List (grahamedgecombe) **pede para não usar hotlink**: baixe o `items.zip` do `/api` dele e hospede você mesmo.

## Idioma, efeitos, HUD
Configuração (🔧) → idioma, som, fundo, 2D/3D, GUI oficial, exportar. Português é o padrão; sem tradução coerente fica em inglês (regras em `js/i18n/pt.js`; correções em `lang/pt.json`).
Ícones de efeitos (atlas 24w18a) em `assets/effects/` — associação nome↔ícone feita à mão, confira: poison, nausea, oozing, blindness, darkness, invisibility, bad_omen, raid_omen, instant_health/damage.
