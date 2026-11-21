/* Barra de carregamento (sprites da barra de XP do jogo) + indicador de sinal (ícones de ping do jogo). */
function loadShow(label,p){const e=$('#load');if(!e)return;e.style.display='';e.style.opacity=1;$('#load .xf').style.width=Math.round(Math.min(1,p)*100)+'%';$('#load span').textContent=label+' '+Math.round(Math.min(1,p)*100)+'%'}
function loadHide(){const e=$('#load');if(!e)return;e.style.opacity=0;setTimeout(()=>{if(e.style.opacity==='0')e.style.display='none'},600)}
/* nível 0 = offline (X vermelho), 1..5 = barras verdes; "pinging" = animação azul de "conectando" */
const pingHTML=(lvl,busy)=>`<i class="png ${busy?'pinging':'p'+(lvl||0)}"></i>`;
async function measurePing(){
 if(!CFG.online){S.src.ping=0;return}
 const t0=performance.now(),ok=await probe(texURL('items/apple',CFG.assetVersions[0]));
 S.src.ping=ok?pingLevel(performance.now()-t0):0}
