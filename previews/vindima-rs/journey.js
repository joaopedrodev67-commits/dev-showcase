/* Shared state remains owned by app.js. This layer adds map, seasons and planning. */
(() => {
  const cities = ['Bento Gonçalves', 'Garibaldi', 'Pinto Bandeira'];
  const coordinates = [[233,219], [130,330], [392,122]];
  const ns = 'http://www.w3.org/2000/svg';
  let selectedCity = cities[0], season = 0, dragging = null;
  const palette = ['#793c46','#995426','#485f72','#57703d'];
  const seasons = [
    {names:['Verão','Verano'],title:['A estação dos encontros ao sol.','La estación de los encuentros al sol.'],text:['Vindima, piqueniques e uma taça com vista para os vinhedos.','Vendimia, pícnics y una copa con vistas a los viñedos.'],photo:'assets/picnic-editorial.webp',ids:['piquenique','vinhedo']},
    {names:['Outono','Otoño'],title:['Paisagens douradas. Mesas demoradas.','Paisajes dorados. Mesas sin prisa.'],text:['Sabores regionais e degustações para aproveitar o ritmo mais tranquilo.','Sabores regionales y degustaciones para disfrutar de un ritmo más tranquilo.'],photo:'assets/autumn-editorial.webp',ids:['mesa','sabores']},
    {names:['Inverno','Invierno'],title:['Lá fora, frio. Aqui, boas histórias.','Afuera, frío. Aquí, buenas historias.'],text:['Uma mesa acolhedora e descobertas na taça para os dias frescos.','Una mesa acogedora y descubrimientos en la copa para los días frescos.'],photo:'assets/wine-editorial.webp',ids:['espumantes','mesa']},
    {names:['Primavera','Primavera'],title:['O caminho floresce de novo.','El camino florece de nuevo.'],text:['Caminhadas leves e encontros ao ar livre entre os verdes da Serra.','Paseos suaves y encuentros al aire libre entre los verdes de la Serra.'],photo:'assets/spring-editorial.webp',ids:['caminhos','piquenique']}
  ];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = $('.map-panel svg');
  const routePath = document.createElementNS(ns,'path');
  routePath.id='connected-route'; routePath.setAttribute('fill','none');
  map.append(routePath);
  const mapPoints=[];
  cities.forEach((city,index)=>{
    const [x,y]=coordinates[index], g=document.createElementNS(ns,'g');
    g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',city);g.classList.add('map-city');g.dataset.mapCity=city;
    g.innerHTML=`<circle cx="${x}" cy="${y}" r="25" fill="transparent"/><circle class="map-dot" cx="${x}" cy="${y}" r="12"/><text x="${x}" y="${y+4}" text-anchor="middle"></text>`;
    const select=()=>{selectedCity=city;renderMap();};
    g.addEventListener('click',select);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
    map.append(g);mapPoints.push(g);
  });
  $('.map-panel').insertAdjacentHTML('beforeend','<div id="map-selection" aria-live="polite"></div>');
  function ordered(){return [...state.items].sort((a,b)=>a.day-b.day);}
  function renderMap(){
    const stops=ordered().map(item=>experiences.find(e=>e.id===item.id).city).filter((city,i,a)=>i===0||city!==a[i-1]);
    const d=stops.map((city,i)=>`${i?'L':'M'}${coordinates[cities.indexOf(city)].join(' ')}`).join(' ');
    if(routePath.getAttribute('d')!==d){routePath.setAttribute('d',d);if(d&&stops.length>1&&!reduced()){const length=routePath.getTotalLength();routePath.animate([{strokeDasharray:length,strokeDashoffset:length},{strokeDasharray:length,strokeDashoffset:0}],{duration:850,easing:'ease-out'});}}
    mapPoints.forEach(g=>{const count=state.items.filter(item=>experiences.find(e=>e.id===item.id).city===g.dataset.mapCity).length;g.classList.toggle('has-stop',count>0);g.classList.toggle('selected',g.dataset.mapCity===selectedCity);g.setAttribute('aria-pressed',String(g.dataset.mapCity===selectedCity));g.querySelector('text').textContent=count||'';});
    $('#map-selection').innerHTML=`<h3>${selectedCity}</h3><p>${t('Selecione uma experiência para conhecer ou salvar. A linha acompanha a ordem dos dias do seu roteiro.','Seleccione una experiencia para descubrir o guardar. La línea sigue el orden de los días de su itinerario.')}</p>${experiences.filter(e=>e.city===selectedCity).map(e=>`<div class="map-choice"><button data-details="${e.id}">${title(e)} ↗</button><button class="outline" data-save="${e.id}" aria-pressed="${state.items.some(x=>x.id===e.id)}" aria-label="${t('Salvar','Guardar')} ${title(e)}">${state.items.some(x=>x.id===e.id)?'✓':'+'}</button></div>`).join('')}<p class="disclosure">${t('Percurso esquemático entre cidades, sem cálculo de distâncias ou navegação.','Recorrido esquemático entre ciudades, sin cálculo de distancias ni navegación.')}</p>`;
  }
  const oldPersist=persist;
  persist=()=>{oldPersist();renderMap();};
  const oldRoute=renderRoute;
  renderRoute=()=>{
    oldRoute();
    if(!state.items.length)return;
    $('#route-items').innerHTML=Array.from({length:state.days},(_,index)=>{
      const day=index+1, items=state.items.filter(x=>x.day===day), hours=items.reduce((n,x)=>n+experiences.find(e=>e.id===x.id).hours,0);
      return `<section class="plan-day" data-drop-day="${day}"><div class="day-heading"><h3>${t('Dia','Día')} ${day}</h3><span>${hours}h ${t('de atividades','de actividades')}</span></div>${hours>6?`<p class="day-warning">${t('Dia cheio: mais de 6h de atividades. Reserve tempo para deslocamentos e refeições.','Día completo: más de 6h de actividades. Reserve tiempo para traslados y comidas.')}</p>`:''}${items.length?items.map((item,i)=>{const e=experiences.find(e=>e.id===item.id);return `<article class="route-row" data-route-id="${e.id}"><div><h3>${i+1}. ${title(e)}</h3><p>${e.city} · ${e.hours}h · ${money(e.price)}</p><label>${t('Dia','Día')} <select data-day="${e.id}" aria-label="${t('Dia de','Día de')} ${title(e)}">${Array.from({length:state.days},(_,j)=>`<option value="${j+1}" ${item.day===j+1?'selected':''}>${j+1}</option>`).join('')}</select></label></div><div class="order-controls"><button draggable="true" data-drag="${e.id}" aria-label="${t('Arrastar','Arrastrar')} ${title(e)}" title="${t('Arraste para outro dia ou posição','Arrastre a otro día o posición')}">⠿</button><button data-move="${e.id}" data-direction="-1" ${i===0?'disabled':''} aria-label="${t('Subir','Subir')} ${title(e)}">↑</button><button data-move="${e.id}" data-direction="1" ${i===items.length-1?'disabled':''} aria-label="${t('Descer','Bajar')} ${title(e)}">↓</button><button data-remove="${e.id}">${t('Remover','Quitar')}</button></div></article>`;}).join(''):`<p class="empty-day">${t('Dia livre. Adicione experiências ou arraste uma para cá.','Día libre. Añada experiencias o arrastre una aquí.')}</p>`}</section>`;
    }).join('');
    $('#route-total').textContent+=` · ${state.items.reduce((n,x)=>n+experiences.find(e=>e.id===x.id).hours,0)}h ${t('de atividades no total','de actividades en total')}`;
  };
  function focusItem(id){requestAnimationFrame(()=>document.querySelector(`[data-route-id="${id}"] select`)?.focus());}
  $('#route-items').addEventListener('click',event=>{const b=event.target.closest('[data-move]');if(!b)return;const item=state.items.find(x=>x.id===b.dataset.move), items=state.items.filter(x=>x.day===item.day);const target=items[items.indexOf(item)+Number(b.dataset.direction)];if(!target)return;const a=state.items.indexOf(item),z=state.items.indexOf(target);[state.items[a],state.items[z]]=[state.items[z],state.items[a]];persist();renderRoute();focusItem(item.id);});
  $('#route-items').addEventListener('change',event=>{if(event.target.dataset.day){renderRoute();focusItem(event.target.dataset.day);}});
  $('#route-items').addEventListener('dragstart',event=>{const handle=event.target.closest('[data-drag]');if(!handle)return;dragging=handle.dataset.drag;event.dataTransfer.setData('text/plain',dragging);event.dataTransfer.effectAllowed='move';});
  $('#route-items').addEventListener('dragover',event=>{if(dragging&&event.target.closest('[data-drop-day]')){event.preventDefault();event.dataTransfer.dropEffect='move';}});
  $('#route-items').addEventListener('drop',event=>{const zone=event.target.closest('[data-drop-day]');if(!zone||!dragging)return;event.preventDefault();const item=state.items.find(x=>x.id===dragging);const target=event.target.closest('[data-route-id]');if(target?.dataset.routeId===item.id){dragging=null;return;}state.items=state.items.filter(x=>x.id!==item.id);item.day=Number(zone.dataset.dropDay);const before=target?state.items.findIndex(x=>x.id===target.dataset.routeId):-1;state.items.splice(before<0?state.items.length:before,0,item);dragging=null;persist();renderRoute();focusItem(item.id);});
  $('#route-items').addEventListener('dragend',()=>dragging=null);
  const oldDetails=details;
  details=id=>{
    const source=document.querySelector(`.card [data-details="${id}"]`)?.closest('.card').querySelector('img');
    const from=source?.getBoundingClientRect();
    oldDetails(id);
    const target=$('#detail-content img');
    if(from&&from.bottom>0&&from.top<innerHeight&&!reduced()){
      const to=target.getBoundingClientRect();
      target.animate([{transformOrigin:'top left',transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`,borderRadius:'10px'},{transformOrigin:'top left',transform:'none',borderRadius:'0'}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)'});
    } else if(!reduced()) {
      target.animate([{opacity:.4,transform:'scale(.94)'},{opacity:1,transform:'scale(1)'}],{duration:480,easing:'ease-out'});
    }
  };
  const oldExtras=renderExtras;
  renderExtras=()=>{oldExtras();renderSeason();renderMap();renderCase();};
  function renderSeason(){
    const data=seasons[season];
    $('#seasons').className='season-explorer';
    $('#seasons').innerHTML=`<div class="season-tabs" role="group" aria-label="${t('Estação','Estación')}">${seasons.map((s,i)=>`<button data-season="${i}" aria-pressed="${i===season}">${s.names[lang]}</button>`).join('')}</div><div class="season-feature"><img src="${data.photo}" alt="${data.names[lang]} — ${t('imagem ilustrativa','imagen ilustrativa')}" width="900" height="650" loading="lazy"><div><p class="eyebrow">${data.names[lang]}</p><h3>${data.title[lang]}</h3><p>${data.text[lang]}</p><p>${t('Nossa sugestão para a estação','Nuestra sugerencia para la estación')}</p>${data.ids.map(id=>{const e=experiences.find(x=>x.id===id);return `<button class="season-suggestion" data-details="${id}">${title(e)} <span>↗</span></button>`;}).join('')}</div></div>`;
    document.documentElement.style.setProperty('--wine',palette[season]);
    if(!reduced())$('.season-feature').animate([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:350});
    $('#seasons img').onerror=function(){this.onerror=null;this.src='assets/picnic-editorial.webp';};
  }
  $('#seasons').addEventListener('click',event=>{const b=event.target.closest('[data-season]');if(b){season=Number(b.dataset.season);renderSeason();document.querySelector(`[data-season="${season}"]`).focus();}});
  const caseSection=document.createElement('section');caseSection.id='sobre-projeto';caseSection.className='case-study section';document.querySelector('footer').before(caseSection);
  function renderCase(){caseSection.innerHTML=`<p class="eyebrow">DEV SHOWCASE / ${t('POR TRÁS DA EXPERIÊNCIA','DETRÁS DE LA EXPERIENCIA')}</p><h2>${t('Design que convida.<br><em>Interação que aproxima.</em>','Diseño que invita.<br><em>Interacción que conecta.</em>')}</h2><div class="case-grid"><div><h3>${t('O desafio','El desafío')}</h3><p>${t('Transformar um catálogo de enoturismo em uma viagem que começa antes de sair de casa.','Transformar un catálogo de enoturismo en un viaje que comienza antes de salir de casa.')}</p></div><div><h3>${t('As escolhas','Las decisiones')}</h3><p>${t('Verde profundo, tipografia editorial, imagens autorais e uma taça conduzida pelo scroll. Movimento com propósito e alternativas por toque e teclado.','Verde profundo, tipografía editorial, imágenes originales y una copa guiada por el scroll. Movimiento con propósito y alternativas táctiles y de teclado.')}</p></div><div><h3>${t('O resultado','El resultado')}</h3><p>${t('Mapa conectado ao roteiro, organização por dia, estações interativas e dois idiomas. Uma demonstração funcional, sem reservas ou cobranças reais.','Mapa conectado al itinerario, organización por día, estaciones interactivas y dos idiomas. Una demostración funcional, sin reservas ni cobros reales.')}</p></div></div><a class="button" href="https://github.com/joaopedrodev67-commits/dev-showcase/tree/main/previews/vindima-rs" target="_blank" rel="noopener">${t('Explore o código','Explore el código')} ↗</a>`;}
  renderRoute();renderSeason();renderMap();renderCase();
})();
