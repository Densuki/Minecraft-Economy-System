# NEI Preços — site no estilo do mod Not Enough Items / Just Enough Items

Calculadora de preços para economia de Minecraft. Visual do mod, receitas e itens vindos do **PrismarineJS**.

## Como rodar
Abra `index.html` no navegador (duplo clique funciona) **ou** sirva a pasta:
`python3 -m http.server 8000` → http://localhost:8000
Precisa de internet para: Tailwind/anime.js/fonte (CDNs) e para os dados/texturas do PrismarineJS.
Sem internet o site continua funcionando com os dados locais (modo offline).

## Estrutura
```
index.html              layout (scripts clássicos; a ORDEM de carregamento importa)
css/nei.css             interface (botões, slots, painel, menu, sprites da chama/seta)
css/world.css           cenário de fundo (céu, sol/lua, estrelas, nuvens, chuva)
assets/gui/             sprites recortados dos seus anexos (chama, seta, botões do mod)
assets/sounds/click.ogg som de clique
js/config.js            versões do jogo, CDNs, idioma/som padrão  <- comece por aqui
js/i18n/                index.js (t, itemName) · en.js · pt.js (UI + dicionário + regras de nomes)
js/data/manifest.js     catálogo local gerado (itens, receitas, texturas)
js/data/effects.js      efeitos de poção/comida · js/data/oredict.js  grupos OreDict
js/data/prismarine.js   baixa itens/receitas/comidas do minecraft-data (PrismarineJS)
js/data/meta.js         comida, combustíveis, tags, efeitos, mods
js/data/prices.js       preços base (c). O resto sai das receitas; sem nada = 1.00c
js/data/items-fallback  itens locais (offline e itens custom: poções, livros, mods)
js/data/recipes-base    receitas curadas locais
js/data/recipes-extra   fundição, serra de pedra, ferraria, reparo (o minecraft-data só tem crafting)
js/core/store.js        itens, receitas, preços, tooltips
js/core/search.js       busca @mod #dica $tag %aba &id ^cor | - "frase"
js/core/subsets.js      árvore do menu Item SubSets
js/ui/*.js              ícones/texturas, áudio, cenário, painel, grade, menu, tooltip
js/main.js              eventos e inicialização
tools/build-manifest.mjs gera o manifesto · tools/extract_assets.py / extract_hud.py recortam sprites · tools/build_preview.py gera o preview em 1 arquivo
```

## Rápido de verdade: o manifesto local (leia isto primeiro)
O site lê **`js/data/manifest.js`** (catálogo com `id`, `mod:id`, nome, receitas, comidas e **onde está a imagem** de cada item).
Ele vem vazio; gere uma vez (precisa de Node 18+ e internet):
```
node tools/build-manifest.mjs              # só o catálogo (imagens ainda vêm do GitHub)
node tools/build-manifest.mjs --download   # também baixa as imagens para assets/textures/ (site 100% local)
```
Depois disso o site **não pesquisa imagem por imagem**: carrega o JSON e pronto. O que faltar é descoberto no navegador
(em paralelo, com fila) e guardado no `localStorage` — o botão **Exportar manifesto** (configuração) baixa tudo isso como
`manifest.js` para você colocar em `js/data/`. (Navegador não escreve arquivo sozinho; por isso o "salvar no JSON" é por script ou exportação.)
> Cache: o que usamos é `localStorage` (não é cookie, não vai para o servidor). Ver em F12 → Application → Local Storage (`nei.tex`, `nei.favs`...).

## PrismarineJS (como está ligado)
- **Itens, nomes em inglês, comidas, receitas de crafting:** `minecraft-data` (`items.json`, `foods.json`, `blocks.json`, `recipes.json`)
  tentando `1.21.8` e, se faltar, versões anteriores (`CFG.dataVersions`).
- **Texturas:** `minecraft-assets` (`items/<id>.png`; blocos: `blocks/<id>_top` + `_side` viram um cubo 3D),
  também com fallback de versões (`CFG.assetVersions`). Os arquivos achados ficam em cache no `localStorage`.
- Os dados vêm de `raw.githubusercontent.com` (com espelho no jsDelivr para os JSON). Tudo falha com elegância: sem rede = dados locais.
- **Não verificado:** foi escrito a partir da estrutura conhecida desses repositórios, mas eu não consegui acessar a rede
  durante o desenvolvimento. Se algo não carregar, abra o Console (F12): o formato do `recipes.json` está em `parseRecipes()`
  e as pastas/nomes de textura em `texResolve()` (`js/ui/icons.js`).

## Texturas (blocos 3D, itens planos)
Itens = imagem plana (só o 1º quadro quando a textura é animada). Blocos = cubo isométrico montado com 3 faces (topo, frente, lado),
com tinta de bioma para grama/folhas. O `build-manifest` usa `blocks_models.json` (se existir no repositório) e, senão, o nome do arquivo
(`_top`, `_side`, `_front`). Lajes/escadas/cercas usam a textura do bloco base (planas). Modelos 3D de verdade (escadas, tochas...) **não** são renderizados.

## OreDict (como no Forge / FTB Wiki)
`js/data/oredict.js`: grupos `plankWood`, `logWood`, `barkWood`, `stairWood`, `slabWood`, `fenceWood`, `treeSapling`, `treeLeaves`, `ingotIron`, `oreGold`, `gemDiamond`, `blockCopper`, `dustRedstone`, `wool`, `dye`...
Busca: `$plankWood`, `$ingotIron`, `$orePlanks` (alias de plankWood), `$oreWood` (alias de logWood).
Receitas que só mudam o tipo de madeira (`COLLAPSE`) viram **uma** receita cujo ingrediente alterna; `*` nos detalhes de custo marca esses ingredientes.

## Efeitos, HUD e fundo
- `assets/effects/*.png`: ícones do atlas 24w18a (associação nome↔ícone feita por mim, **confira**: poison, nausea, oozing, blindness, darkness, invisibility, bad_omen, raid_omen, instant_health/damage). Corrija em `tools/extract_hud.py` e rode de novo.
- `assets/gui/`: coração, fome, armadura, ping e barra de XP (do `icons.png` que você enviou, layout anterior à 1.20.2). Usados nos tooltips, na barra de carregamento e no indicador de sinal.
- Fundo: `NEI.setBackground('scene' | '#14161c' | 'https://.../foto.jpg')` ou o botão "Fundo" da configuração. O elemento é `<div id="world">`.

## Idioma
Configuração (🔧 ao lado da busca) → botão de idioma. Português é o padrão. Itens sem tradução coerente ficam em inglês.
Para traduzir mais: `PT_DICT` (nomes exatos) ou `PT_RULE` (regras) em `js/i18n/pt.js`.

## Adicionar coisas
- **Receita:** `RECIPES_BASE` / `SMELT` / `STONECUT` (tipos: c, s, b, v, k, m).
- **Item de mod:** linha em `items-fallback.js` + nome do mod em `MODS` (`meta.js`) + (opcional) preço em `prices.js`.
- **Preço:** `BASE_PRICE` em `prices.js` (mínimo exibido: 1.00c).

## Próximos passos sugeridos
Migrar para Vite + TypeScript (os arquivos já estão separados por responsabilidade) e ligar o seu back-end de preços em `price()` (`js/core/store.js`).
