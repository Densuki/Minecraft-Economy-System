/* Grade da direita (todos os itens), favoritos e o painel esquerdo (favoritos <-> configuração). */
function grid(){
 const f=allItems().filter(it=>(!S.cat||!S.cat.f||S.cat.f(it))&&match(it,S.q));
 const pages=Math.max(1,Math.ceil(f.length/CFG.pageSize));S.page=(S.page+pages)%pages;
 $('#grid').innerHTML=f.slice(S.page*CFG.pageSize,(S.page+1)*CFG.pageSize).map(i=>slot(i.id,1,'gs')).join('')||`<p class="hint">${t('nofound')}</p>`;
 $('#pg').textContent=(S.page+1)+'/'+pages;dis('pg',pages<2);pop2('#grid .slot',6)}

function fav(id){const i=S.favs.indexOf(id);if(i>=0)S.favs.splice(i,1);else if(S.favs.length<200)S.favs.push(id);LS.set('nei.favs',JSON.stringify(S.favs));pop();favs()}
function favs(){
 const pg=Math.max(1,Math.ceil(S.favs.length/CFG.pageSize));S.fpage=(S.fpage+pg)%pg;$('#fpg').textContent=(S.fpage+1)+'/'+pg;dis('fp',pg<2);
 $('#fgrid').innerHTML=S.favs.length?S.favs.slice(S.fpage*CFG.pageSize,(S.fpage+1)*CFG.pageSize).filter(i=>ITEMS[i]).map(i=>slot(i,1,'gs')).join(''):`<p class="hint">${t('favempty')}</p>`}

/* setas claras por padrão; escuras quando não há para onde ir */
const dis=(k,on)=>document.querySelectorAll(`[data-act="${k}-"],[data-act="${k}+"]`).forEach(b=>b.classList.toggle('dis',on));

/* botões do mod (sprites recortados dos screenshots) */
const TOOLN=['trash','rain','moon','magnet','dawn','noon','dusk','night','heal'];
function buildCfg(){
 $('#tools').innerHTML=TOOLN.map((n,i)=>{const on=S.tools.has(i),f=`tool_${n}${on?'_on':(i===2||i===3?'_off':'')}.png`;return`<button class="tb" data-act="tool:${i}" title="${t('t'+i)}" aria-label="${t('t'+i)}" style="background-image:url(${guiURL(f)})"></button>`}).join('');
 $('#saves').innerHTML=[1,2,3,4,5,6,7].map(n=>`<button class="btn" data-act="save:${n}" title="${t('savetip')}" style="width:216px;height:32px;font-size:20px">${t('save',n)}</button>`).join('');
 $('#opt').textContent=CFG.mute?t('sound_off'):t('sound_on');$('#lng').textContent=t('langbtn');
 $('#bgb').textContent=t('bgbtn',t('bg_'+bgKind()));$('#exp').textContent=t('export');$('#r3d').textContent=t('r3dbtn',CFG.render3d?'3D':'2D');$('#gsk').textContent=t('skinbtn',CFG.skins?'ON':'OFF')}
function lview(){
 document.querySelectorAll('.fav').forEach(e=>e.style.display=S.left==='fav'?'':'none');
 document.querySelectorAll('.cfg').forEach(e=>e.style.display=S.left==='cfg'?'':'none');
 $('#bk').style.filter=S.left==='fav'?'brightness(1.3)':'';$('#wr').style.filter=S.left==='cfg'?'brightness(1.3)':''}
function tool(i){
 if(i===0){S.hot.fill(null);nei();return}
 if(i===8){heal();return}
 if(i>=4&&i<=7){[4,5,6,7].forEach(j=>S.tools.delete(j));S.tools.add(i);setTime(['dawn','day','dusk','night'][i-4])}
 else{S.tools.has(i)?S.tools.delete(i):S.tools.add(i);if(i===1)$('#rain').style.opacity=S.tools.has(1)?1:0}
 buildCfg()}
