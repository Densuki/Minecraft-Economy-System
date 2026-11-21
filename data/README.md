# Dados (JSON) — referência

Tudo que o site mostra vem daqui. **Edite os JSONs** (nomes, preços, descrições, texturas, oredict...) e rode `node tools/build-index.mjs`
(ou use `node tools/serve.mjs`, que lê os arquivos soltos: salvou, F5).

## Packs (pastas)
```
data/
  Vanilla/                 ← o jogo base
  Mods/
    Thermal Expansion/     ← um mod = uma pasta com a MESMA estrutura da Vanilla
    Thaumcraft/
    _modelo/               ← copie e renomeie (pastas com _ são ignoradas)
  index.json, bundle.js    ← gerados por tools/build-index.mjs (não edite)
```
Dentro de um pack (tudo opcional, exceto o que você usar):
`pack.json` · `items/*.json` · `recipes/*.json` · `prices.json` · `lang/pt.json` (`en.json`...) · `oredict.json` · `effects.json` · `families.json`
· Vanilla também: `potions.json` `enchantments.json` `brewing.json` `subsets.json` `guis.json` `recipes/rules.json`

**Camadas (a de baixo vence):** manifesto do PrismarineJS < Vanilla < Mods. Itens de mod ficam como `idDoMod:item` (ex.: `thermal:tin_ingot`);
dentro do pack você escreve só `tin_ingot`.

## pack.json
`{"id":"thermal","name":"Thermal Expansion","displayName":"…","textureRoot":"data/Mods/Thermal Expansion/textures/"}`

## Item (`items/*.json` = `{"category":"tools","label":{"en":"Tools","pt":"Ferramentas"},"items":[ ... ]}`)
| campo | exemplo | o que faz |
|---|---|---|
| `id` | `"ruby"` | identificador (único no pack) |
| `name` | `"Ruby"` ou `{"en":"Ruby","pt":"&cRubi"}` | nome; aceita códigos de cor (abaixo) |
| `price` | `50` | preço base (c). Sem preço = calculado pelas receitas (mínimo 1.00c) |
| `oredict` | `["gemRuby"]` | grupos extras (filtro `$gemRuby`) |
| `desc` | `{"en":"…","pt":"&7Texto\nlinha 2"}` | descrição (aba Information), com cores e `\n` |
| `tooltip` | `["&6linha extra"]` | linhas extras no tooltip |
| `texture` | `"ruby.png"` · `"items/apple"` · `"https://…"` | arquivo na pasta `textures/` do pack · textura do PrismarineJS · URL |
| `render` | `"flat"` | força 2D mesmo com a opção 3D ligada |
| `shape` / `color` | `"g"` / `"#e0115f"` | ícone gerado quando não há textura (b bloco, i barra, g gema, s graveto, d pó, t ferramenta, a armadura, p frasco) |
| `kind` | `"weapon"` | força a categoria (block, item, food, tool, weapon, armor, potion) |
| `family` / `meta` | `"anvil"` / `1` | variações: itens com a mesma `family` aparecem lado a lado na aba Information; `meta` aparece no tooltip (`mod:id:meta`) |
| `fuel` | `120` | segundos de queima |
| `food` | `{"hunger":4,"saturation":2.4}` | comida (mostra coxinhas e saciedade) |
| `attack` / `armor` | `8` / `3` | linhas de dano/defesa no tooltip |
| `fx` | `[["speed","0:30",1]]` | efeitos (id de effects.json, duração, nível) |
| `glint` / `enchants` | `true` / `[["sharpness",5]]` | brilho de encantado / lista de encantamentos |

## Receita (`recipes/*.json` = `{"recipes":[ ... ]}`)
`{"t":"c","a":[9 células],"o":"saída","n":1}`  — `t`: `c` crafting · `s` fundição (`x` = XP) · `b` poção (`st` = etapas) · `v` bigorna (`l` = níveis) · `k` serra de pedra · `m` ferraria.
Uma célula pode ser uma lista de alternativas: `["oak_planks","birch_planks"]`.

## Outros arquivos
- `prices.json`: `{"iron_ingot":8, ...}` — a economia, num arquivo só.
- `lang/pt.json`: `{"id":"nome corrigido"}` — correções de tradução.
- `oredict.json`: `{"groups":{"gemRuby":{"ids":["ruby"]},"plankWood":{"re":"_planks$"}},"collapse":["plankWood"]}` (`re` = regex no id, `not` = exclusão, `collapse` = receitas que viram uma só, alternando).
- `effects.json`, `potions.json`, `enchantments.json`, `brewing.json`: geram **todas as poções** (efeito × formas × estendida/nível II), **flechas** e **livros encantados** (um por nível) e as receitas da Barraca. Mods podem ter os próprios.
- `subsets.json`: árvore do menu Item SubSets (`match`: `kind`, `re`, `tag`, `tab`, `not`, `mods`).
- `guis.json`: posições das GUIs oficiais (ver `tools/extract-gui.mjs`).

## Códigos de formatação (nomes, descrições, tooltips)
`&` ou `§` + código. Cores: `0` preto `1` azul-escuro `2` verde-escuro `3` ciano-escuro `4` vermelho-escuro `5` roxo `6` dourado `7` cinza `8` cinza-escuro `9` azul `a` verde `b` ciano `c` vermelho `d` rosa `e` amarelo `f` branco.
Estilos: `l` negrito · `o` itálico · `n` sublinhado · `m` riscado · `k` aleatório · `r` limpa. Uma cor nova limpa os estilos (escreva `&4&lAVISO`, não `&l&4AVISO`).

## Ligar a outros sistemas (economia, loja, servidor…)
```js
NEI.economy.override = id => meuSistema.precoDe(id) ?? null;   // null = usa o preço do JSON
NEI.on('pick', e => …);  NEI.on('lang', …);  NEI.on('ready', …);
NEI.items; NEI.price(id); NEI.setBackground('#14161c' | 'https://…jpg' | 'scene');
```
