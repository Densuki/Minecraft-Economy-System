/* Configuração geral: versões do jogo, CDNs e idioma padrão. */
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const guiURL=f=>'assets/gui/'+f;
const fxURL=id=>'assets/effects/'+id+'.png';   // ícones de efeitos (recortados do atlas 24w18a)     // sprites da interface (recortados dos seus screenshots)
const CFG={
  online:true,
  refresh:false,                     // true = baixa itens/receitas do minecraft-data mesmo com manifesto local                       // false = só dados locais (sem PrismarineJS)
  lang:LS.get('nei.lang')||'pt',     // 'pt' (padrão) ou 'en'
  mute:LS.get('nei.mute')==='1',
  clickSrc:'assets/sounds/click.ogg',
  pageSize:50,
  useBundle:true,                    // usa data/bundle.js quando existir (1 arquivo, rápido); false = lê os JSONs soltos
  render3d:LS.get('nei.3d')==='1',   // blocos em cubo 3D (padrão: 2D)
  skins:LS.get('nei.skins')!=='0',   // GUIs oficiais (data/Vanilla/guis.json) quando os PNGs existirem
  iconSource:{list:'prismarine',info:'prismarine'},   // 'prismarine' | 'itemids' (remoto) | 'local' (assets/icons/<id>.png)
  providers:{itemids:id=>`https://static.minecraftitemids.com/64/${id}.png`,local:id=>`assets/icons/${id}.png`},
  // versões tentadas em ordem: se um item/craft/imagem não existir, procura na anterior
  dataVersions:['1.21.8','1.21.4','1.21.1','1.20.4','1.19.4','1.18.2','1.16.5'],
  assetVersions:['1.21.8','1.21.4','1.21.1','1.20.2','1.19.1','1.18.1','1.16.4'],
  dataBases:v=>[`https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/${v}/`,`https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-data@master/data/pc/${v}/`],
};
