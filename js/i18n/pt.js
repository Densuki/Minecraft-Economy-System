Object.assign(I18N.pt.ui,{
 'tab.c':'Fabricação','tab.s':'Fundição','tab.b':'Poções','tab.v':'Bigorna','tab.f':'Combustível','tab.k':'Serra de Pedra','tab.m':'Ferraria','tab.i':'Informações',
 uses:'(usos)',price:'Preço',base:'Preço base',total:'Total ×{0}',unit:'Unidade',rcost:'Custo da receita (→ {0}× {1})',fuelcost:'Combustível (estimado)',
 repmat:'Material de reparo',repcost:'Custo na bigorna',levels:'{0} níveis',cost:'Custo: {0}',steps:'Etapas: {0}',burn:'Queima por {0}s ({1} itens)',burntime:'Tempo de queima',
 noraw:'Item bruto, sem receita',norecipe:'Sem receita cadastrada',nouse:'Não é usado em nenhuma receita',
 inv:'Inventário',hotbar:'Valor da hotbar',hotempty:'Hotbar vazia. Shift + clique num item para adicionar.',nitems:'Itens cadastrados',nrec:'Itens com receita',nfav:'Favoritos',src:'Fonte dos dados',
 h1:'Clique no item: ver receita',h2:'Botão direito: ver usos',h3:'Shift + clique: pôr na hotbar',h4:'R / U / A (favoritar) sobre o item',h5:'Busca: @mod #dica $tag %aba &id ^cor',
 favempty:'Sem favoritos. Passe o mouse num item e aperte A, ou use Ctrl + clique.',nofound:'Nenhum item encontrado.',stack:'One stack',
 sound_on:'Som: ON',sound_off:'Som: OFF',langbtn:'Idioma: Português',d_on:'Minecraft {0} · online',d_off:'dados locais (offline)',
 t0:'Limpar hotbar',t1:'Chuva',t2:'Modo criativo',t3:'Ímã de itens',t4:'Amanhecer',t5:'Dia',t6:'Entardecer',t7:'Noite',t8:'Curar',
 sat:'Saturação: {0}',tprice:'Preço: {0}',save:'Save {0}',savetip:'Clique: salvar hotbar · Botão direito: carregar',
 'sub.all':'Todos','sub.blocks':'Blocos','sub.wood':'Madeira','sub.stone':'Pedra','sub.ores':'Minérios','sub.colored':'Coloridos','sub.redstone':'Redstone',
 'sub.items':'Itens','sub.ingots':'Lingotes','sub.gems':'Gemas','sub.dusts':'Pós','sub.fuel':'Combustíveis','sub.food':'Comidas','sub.tools':'Ferramentas','sub.axes':'Machados','sub.hoes':'Enxadas','sub.picks':'Picaretas','sub.shovels':'Pás','sub.other':'Outros',
 'sub.weapons':'Armas','sub.swords':'Espadas','sub.bows':'Arcos','sub.armor':'Armaduras','sub.helmets':'Capacetes','sub.chests':'Peitorais','sub.legs':'Calças','sub.boots':'Botas','sub.potions':'Poções','sub.mods':'Mods','sub.vanilla':'Vanilla',
 'eff.regen2':'Regeneração II (0:05)','eff.absorb':'Absorção (2:00)','eff.heal':'Cura Instantânea','eff.swift':'Rapidez (3:00)','eff.fire':'Resistência ao Fogo (3:00)','eff.str':'Força (3:00)','eff.leap':'Salto (3:00)','eff.poison':'Veneno (0:45)','eff.sheal':'Cura Instantânea (arremessável)','eff.none':'Sem efeitos',
 'eff.sharp':'Afiação V','eff.eff':'Eficiência V','eff.unb':'Inquebrável III','eff.prot':'Proteção IV'
});
Object.assign(I18N.pt.desc,{
 "anvil": "Repara e encanta itens. Combine dois itens iguais ou use o material de reparo; cada uso gasta níveis de XP.",
 "brewing_stand": "Prepara poções a partir de frascos de água. Usa Pó de Blaze como combustível.",
 "furnace": "Funde minérios e cozinha alimentos. Aceita qualquer item inflamável como combustível.",
 "blast_furnace": "Funde minérios e metais duas vezes mais rápido que a fornalha.",
 "smoker": "Cozinha alimentos duas vezes mais rápido que a fornalha.",
 "stonecutter": "Corta pedra em blocos, lajes e escadas gastando menos material que o crafting.",
 "smithing_table": "Usada para melhorar equipamentos de diamante para netherite.",
 "netherite_ingot": "Material mais resistente do jogo. Obtida fundindo Detritos Antigos.",
 "netherite_upgrade_smithing_template": "Necessário na Mesa de Ferraria para melhorar equipamentos para netherite.",
 "lava_bucket": "Também serve de combustível: queima por 1000 s, o bastante para fundir 100 itens.",
 "coal": "Combustível comum. Queima por 80 s, o bastante para fundir 8 itens.",
 "obsidian": "Muito resistente. Só pode ser minerada com picareta de diamante ou melhor.",
 "nether_wart": "Ingrediente base das poções: transforma água em Poção Estranha.",
 "diamond": "Gema rara usada em ferramentas, armaduras e blocos."
});


/* ---- regras que compõem nomes (cobrem centenas de itens: ferramentas, cores, madeiras, minérios...) ---- */
const PT_MAT={wooden:'Madeira',stone:'Pedra',golden:'Ouro',iron:'Ferro',diamond:'Diamante',netherite:'Netherite',copper:'Cobre',leather:'Couro',chainmail:'Cota de Malha',turtle:'Tartaruga'};
const PT_TOOL={pickaxe:'Picareta',axe:'Machado',shovel:'Pá',hoe:'Enxada',sword:'Espada',helmet:'Capacete',chestplate:'Peitoral',leggings:'Calças',boots:'Botas'};
const PT_WOOD={oak:'Carvalho',spruce:'Abeto',birch:'Bétula',jungle:'Selva',acacia:'Acácia',dark_oak:'Carvalho Escuro',mangrove:'Mangue',cherry:'Cerejeira',pale_oak:'Carvalho Pálido',bamboo:'Bambu',crimson:'Carmesim',warped:'Distorcido'};
const PT_WOODITEM={planks:'Tábuas de',log:'Tronco de',wood:'Madeira de',stripped_log:'Tronco Descascado de',stripped_wood:'Madeira Descascada de',leaves:'Folhas de',sapling:'Muda de',stairs:'Escada de',slab:'Laje de',fence:'Cerca de',fence_gate:'Portão de Cerca de',door:'Porta de',trapdoor:'Alçapão de',button:'Botão de',pressure_plate:'Placa de Pressão de',sign:'Placa de',boat:'Barco de'};
const PT_COLOR={white:['Branco','Branca'],orange:['Laranja','Laranja'],magenta:['Magenta','Magenta'],light_blue:['Azul-claro','Azul-clara'],yellow:['Amarelo','Amarela'],lime:['Verde-limão','Verde-limão'],pink:['Rosa','Rosa'],gray:['Cinza','Cinza'],light_gray:['Cinza-claro','Cinza-clara'],cyan:['Ciano','Ciano'],purple:['Roxo','Roxa'],blue:['Azul','Azul'],brown:['Marrom','Marrom'],green:['Verde','Verde'],red:['Vermelho','Vermelha'],black:['Preto','Preta']};
const PT_COLORITEM={wool:['Lã',1],carpet:['Carpete',0],concrete:['Concreto',0],concrete_powder:['Pó de Concreto',0],terracotta:['Terracota',1],glazed_terracotta:['Terracota Esmaltada',1],stained_glass:['Vidro',0],stained_glass_pane:['Painel de Vidro',0],bed:['Cama',1],banner:['Estandarte',0],shulker_box:['Caixa de Shulker',1],candle:['Vela',1],dye:['Corante',0]};
const PT_ORE={coal:'Carvão',iron:'Ferro',gold:'Ouro',copper:'Cobre',diamond:'Diamante',emerald:'Esmeralda',lapis:'Lápis-lazúli',redstone:'Redstone'};
const PT_SUF={ingot:'Barra de',nugget:'Pepita de',block:'Bloco de'};
PT_RULE=function(id){
  let m;
  if((m=id.match(/^(wooden|stone|golden|iron|diamond|netherite|copper|leather|chainmail|turtle)_(pickaxe|axe|shovel|hoe|sword|helmet|chestplate|leggings|boots)$/)))return PT_TOOL[m[2]]+' de '+PT_MAT[m[1]];
  const st=id.startsWith('stripped_'),base=st?id.slice(9):id;
  for(const w in PT_WOOD)if(base.startsWith(w+'_')){const k=(st?'stripped_':'')+base.slice(w.length+1);if(PT_WOODITEM[k])return PT_WOODITEM[k]+' '+PT_WOOD[w]}
  for(const c in PT_COLOR)if(id.startsWith(c+'_')){const x=PT_COLORITEM[id.slice(c.length+1)];if(x)return x[0]+' '+PT_COLOR[c][x[1]]}
  if((m=id.match(/^(deepslate_)?(coal|iron|gold|copper|diamond|emerald|lapis|redstone)_ore$/)))return 'Minério de '+PT_ORE[m[2]]+(m[1]?' de Ardósia Profunda':'');
  if((m=id.match(/^(iron|gold|copper|netherite|tin|lead)_(ingot|nugget)$/))&&PT_MAT[m[1]])return PT_SUF[m[2]]+' '+PT_MAT[m[1]];
  if((m=id.match(/^(.*)_(slab|stairs|wall)$/))){const b=PT_DICT[m[1]]||PT_DICT[m[1]+'s'];if(b)return {slab:'Laje de',stairs:'Escada de',wall:'Muro de'}[m[2]]+' '+b}
  if((m=id.match(/^(.*)_spawn_egg$/))&&PT_DICT[m[1]])return 'Ovo de '+PT_DICT[m[1]];
  return null;
};
Object.assign(I18N.pt.ui,{armorv:'+{0} de Armadura',atkv:'+{0} de Dano de Ataque'});
Object.assign(I18N.pt.ui,{"ef.absorption": "Absorção", "ef.bad_luck": "Azar", "ef.bad_omen": "Mau Presságio", "ef.blindness": "Cegueira", "ef.conduit_power": "Poder do Conduíte", "ef.darkness": "Escuridão", "ef.dolphins_grace": "Graça do Golfinho", "ef.fire_resistance": "Resistência ao Fogo", "ef.glowing": "Brilho", "ef.haste": "Pressa", "ef.health_boost": "Aumento de Vida", "ef.hero_of_the_village": "Herói da Vila", "ef.hunger": "Fome", "ef.infested": "Infestado", "ef.instant_damage": "Dano Instantâneo", "ef.instant_health": "Cura Instantânea", "ef.invisibility": "Invisibilidade", "ef.jump_boost": "Salto Aumentado", "ef.levitation": "Levitação", "ef.luck": "Sorte", "ef.mining_fatigue": "Fadiga de Mineração", "ef.nausea": "Náusea", "ef.night_vision": "Visão Noturna", "ef.oozing": "Escorrendo", "ef.poison": "Veneno", "ef.raid_omen": "Presságio de Ataque", "ef.regeneration": "Regeneração", "ef.resistance": "Resistência", "ef.saturation": "Saciedade", "ef.slow_falling": "Queda Lenta", "ef.slowness": "Lentidão", "ef.speed": "Rapidez", "ef.strength": "Força", "ef.trial_omen": "Presságio de Provação", "ef.water_breathing": "Respiração Aquática", "ef.weakness": "Fraqueza", "ef.weaving": "Tecelagem", "ef.wind_charged": "Carregado de Vento", "ef.wither": "Wither", "nload": "Texturas carregadas", "loading": "Carregando…", "ping": "Conexão", "bgbtn": "Fundo: {0}", "bg_scene": "Cenário", "bg_dark": "Escuro", "bg_image": "Imagem", "bgask": "URL da imagem (ou cor CSS):", "export": "Exportar manifesto", "sat": "Saciedade: {0}", "ping_off": "offline", "ping_loc": "dados locais"});
Object.assign(I18N.pt.ui,{"k.block": "Bloco", "k.item": "Item", "k.food": "Comida", "k.tool": "Ferramenta", "k.weapon": "Arma", "k.armor": "Armadura", "k.potion": "Poção"});
Object.assign(I18N.pt.ui,{"r3dbtn": "Texturas: {0}", "skinbtn": "GUI oficial: {0}", "variants": "Variações"});
Object.assign(I18N.pt.ui,{"packs": "Packs de dados"});
