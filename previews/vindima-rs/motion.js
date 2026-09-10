/* Native scroll choreography. Each scroll event schedules at most one frame. */
(() => {
  const story=document.querySelector('.wine-story');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const glass=document.querySelector('#glass-tilt');
  const liquid=document.querySelector('#wine-liquid');
  const surface=document.querySelector('#wine-surface');
  const progress=document.querySelector('.reading-progress');
  const meter=document.querySelector('.ritual-meter span');
  const video=document.querySelector('#wine-video');
  const toggle=document.querySelector('#film-toggle');
  const art=document.querySelector('.wine-art');
  let pending=false,step=-1,amount=0,manual=false,paused=false,filmVisible=false,swirlFrame=0;
  const es=()=>document.documentElement.lang==='es';
  const labels={ritualKicker:['UM RITUAL EM TRÊS TEMPOS','UN RITUAL EN TRES TIEMPOS'],ritualTitle:['Da terra.<br>À taça.<br><em>À memória.</em>','De la tierra.<br>A la copa.<br><em>A la memoria.</em>'],ritualIntro:['Role devagar. Há histórias que merecem ser servidas aos poucos.','Deslice despacio. Hay historias que merecen servirse poco a poco.'],step1:['A origem','El origen'],step2:['O encontro','El encuentro'],step3:['O brinde','El brindis'],note1:['Notas de tempo.','Notas de tiempo.'],note2:['Final de encontro.','Final de encuentro.'],swirl:['Gire a taça','Gire la copa'],wineHelp:['Mova o mouse ou toque para sentir o movimento.','Mueva el ratón o toque para sentir el movimiento.'],filmKicker:['UM INSTANTE PARA FICAR','UN INSTANTE PARA QUEDARSE'],filmTitle:['Sinta a luz.<br><em>Guarde o instante.</em>','Sienta la luz.<br><em>Guarde el instante.</em>'],filmIntro:['A Serra também se descobre nas pequenas pausas.','La Serra también se descubre en las pequeñas pausas.']};
  const captions=[['Tudo começa no cuidado com a terra. Um lugar, uma colheita, uma história.','Todo comienza con el cuidado de la tierra. Un lugar, una cosecha, una historia.'],['O tempo transforma o fruto. A taça revela suas cores, aromas e caminhos.','El tiempo transforma el fruto. La copa revela sus colores, aromas y caminos.'],['Agora, a melhor parte: compartilhar. Porque o que fica é o encontro.','Ahora, la mejor parte: compartir. Porque lo que queda es el encuentro.']];
  const clamp=x=>Math.max(0,Math.min(1,x));
  function setScene(value){amount=clamp(value);liquid.setAttribute('transform',`translate(0 ${115-amount*148})`);liquid.style.transform=`translateY(${115-amount*148}px)`;meter.style.transform=`scaleX(${amount})`;const next=Math.min(2,Math.floor(amount*3));if(next!==step){step=next;document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===step)));}document.querySelector('#ritual-caption').textContent=captions[step][es()?1:0];}
  function paint(){pending=false;const rect=story.getBoundingClientRect();const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;if(!manual&&!reduced.matches)setScene(clamp(-rect.top/Math.max(1,story.offsetHeight-innerHeight)));const hero=document.querySelector('.hero');if(!reduced.matches&&hero.getBoundingClientRect().bottom>0){document.querySelector('.hero-image').style.transform=`translateY(${Math.min(scrollY*.18,130)}px) scale(1.07)`;}}
  function requestPaint(){if(!pending){pending=true;requestAnimationFrame(paint);}}
  addEventListener('scroll',()=>{manual=false;requestPaint();},{passive:true});addEventListener('resize',requestPaint);
  document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{manual=true;setScene([.08,.5,1][Number(b.dataset.step)]);}));
  function resetGlass(){if(!swirlFrame)glass.style.transform='rotate(0deg)';}
  art.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches||swirlFrame)return;const rect=art.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5;glass.style.transform=`rotate(${x*9}deg)`;surface.setAttribute('ry',String(12+Math.abs(x)*9));});
  art.addEventListener('pointerleave',resetGlass);
  document.querySelector('#swirl-wine').addEventListener('click',()=>{cancelAnimationFrame(swirlFrame);if(reduced.matches){manual=true;setScene(amount>.8?.3:1);return;}const start=performance.now();function swirl(now){const t=(now-start)/1500;if(t>=1){swirlFrame=0;glass.style.transform='rotate(0deg)';surface.setAttribute('ry','12');return;}const wave=Math.sin(t*Math.PI*6)*(1-t);glass.style.transform=`rotate(${wave*8}deg)`;surface.setAttribute('ry',String(12+Math.abs(wave)*8));swirlFrame=requestAnimationFrame(swirl);}swirlFrame=requestAnimationFrame(swirl);});
  // Pointer effects are delegated so filtering/re-rendering cannot remove them.
  document.querySelector('#cards').addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;const card=e.target.closest('.card-image');if(!card)return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;card.style.setProperty('--tilt-x',`${(y-.5)*-7}deg`);card.style.setProperty('--tilt-y',`${(x-.5)*7}deg`);card.style.setProperty('--light-x',`${x*100}%`);card.style.setProperty('--light-y',`${y*100}%`);});
  document.querySelector('#cards').addEventListener('pointerout',e=>{const card=e.target.closest('.card-image');if(card&&!card.contains(e.relatedTarget)){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');}});
  const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}}),{threshold:.12});
  document.querySelectorAll('.section-heading,.territory-copy,.map-panel,.season,.closing h2').forEach(el=>{el.classList.add('scroll-reveal');reveals.observe(el);});
  function filmLabel(){toggle.textContent=video.paused?(es()?'Reproducir película':'Reproduzir filme'):(es()?'Pausar película':'Pausar filme');toggle.setAttribute('aria-pressed',String(!video.paused));}
  async function play(){try{await video.play();}catch{}filmLabel();}
  toggle.addEventListener('click',()=>{if(video.paused){paused=false;play();}else{paused=true;video.pause();}});
  video.addEventListener('play',filmLabel);video.addEventListener('pause',filmLabel);
  const filmObserver=new IntersectionObserver(entries=>{filmVisible=entries[0].isIntersecting;if(filmVisible&&!paused&&!reduced.matches&&!document.hidden)play();else video.pause();},{threshold:.15});filmObserver.observe(video);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(filmVisible&&!paused&&!reduced.matches)play();});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(swirlFrame);swirlFrame=0;glass.style.transform='none';if(reduced.matches){setScene(.7);video.pause();}requestPaint();});
  function translate(){document.querySelectorAll('[data-motion-i]').forEach(el=>{const pair=labels[el.dataset.motionI];if(pair)el.innerHTML=pair[es()?1:0].replaceAll('<br>',' <br>');});document.querySelector('#ritual-caption').textContent=captions[Math.max(0,step)][es()?1:0];document.querySelector('.ritual-steps').setAttribute('aria-label',es()?'Etapas del vino':'Etapas do vinho');filmLabel();}
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  setScene(reduced.matches?.7:0);translate();paint();
})();
