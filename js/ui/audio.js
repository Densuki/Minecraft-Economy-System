/* Sons: clique real do mod (assets/sounds/click.ogg). Se o navegador não tocar .ogg, usa um som sintetizado. */
let AC,CLK=null,okAud=true;
function snd(f,d,ty,v){if(CFG.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function click(){
 if(CFG.mute)return;
 if(okAud){try{CLK=CLK||new Audio(CFG.clickSrc);const a=CLK.cloneNode();a.volume=.8;a.play().catch(()=>{okAud=false;snd(1300,.025,'square',.04)});return}catch(e){okAud=false}}
 snd(1300,.025,'square',.04);snd(260,.07,'triangle',.09)}
const pop=()=>{snd(520,.06,'sine',.08);snd(780,.08,'sine',.05)};
