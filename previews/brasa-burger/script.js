const menuToggle=document.querySelector('.menu-toggle');
const mainNav=document.querySelector('.main-nav');
const siteHeader=document.querySelector('.site-header');
const cartButton=document.querySelector('.cart-button');
const cartPanel=document.querySelector('.cart-panel');
const cartClose=document.querySelector('.cart-close');
const cartBackdrop=document.querySelector('.cart-backdrop');
const cartItems=document.querySelector('.cart-items');
const cartFooter=document.querySelector('.cart-footer');
const cartCount=document.querySelector('.cart-count');
const cartTotal=document.querySelector('.cart-total strong');
const checkoutButton=document.querySelector('.checkout-button');
const toast=document.querySelector('.toast');
const cart=[];
let lastFocus=null;
const hero=document.querySelector('.hero');
const heroImage=document.querySelector('.hero-image');
const heroContent=document.querySelector('.hero-content');
const heroStamp=document.querySelector('.hero-stamp');
const scrollNote=document.querySelector('.scroll-note');
const signature=document.querySelector('.signature');
const signatureImage=document.querySelector('.signature-image-wrap img');
const signatureCopy=document.querySelector('.signature-copy');
const signatureLabel=document.querySelector('.image-label');
const assembly=document.querySelector('.burger-assembly');
const assemblyLayers=[...document.querySelectorAll('.burger-layer')];
const assemblyStatus=document.querySelector('.assembly-status strong');
const assemblyStatusCount=document.querySelector('.assembly-status small');
const assemblyCounter=document.querySelector('.assembly-counter');
const assemblyProgress=document.querySelector('.assembly-progress span');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let scrollTick=false;

const formatPrice=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0}).format(value);

menuToggle.addEventListener('click',()=>{
  const open=menuToggle.getAttribute('aria-expanded')==='true';
  menuToggle.setAttribute('aria-expanded',String(!open));
  menuToggle.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');
  menuToggle.classList.toggle('is-open',!open);
  mainNav.classList.toggle('is-open',!open);
});

mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menu');
  menuToggle.classList.remove('is-open');
  mainNav.classList.remove('is-open');
}));

window.addEventListener('scroll',()=>siteHeader.classList.toggle('is-scrolled',scrollY>40),{passive:true});

const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
function renderScrollMotion(){
  scrollTick=false;
  if(reduceMotion.matches)return;
  const heroProgress=clamp(scrollY/(hero.offsetHeight*.88));
  const compact=innerWidth<620;
  heroImage.style.setProperty('--hero-x',`${heroProgress*(compact?0:-3.4)}%`);
  heroImage.style.setProperty('--hero-y',`${heroProgress*(compact?7:11)}%`);
  heroImage.style.setProperty('--hero-scale',String(1.03+heroProgress*(compact?.08:.15)));
  heroImage.style.setProperty('--hero-rotate',`${heroProgress*(compact?.4:1.35)}deg`);
  heroImage.style.setProperty('--hero-saturation',String(1+heroProgress*.18));
  heroImage.style.setProperty('--hero-brightness',String(1-heroProgress*.18));
  heroContent.style.setProperty('--copy-x',`${heroProgress*(compact?0:-5)}vw`);
  heroContent.style.setProperty('--copy-y',`${heroProgress*(compact?-4:-7)}vh`);
  heroContent.style.setProperty('--copy-opacity',String(1-heroProgress*.86));
  heroStamp.style.setProperty('--stamp-y',`${heroProgress*-60}px`);
  heroStamp.style.setProperty('--stamp-rotate',`${8+heroProgress*42}deg`);
  scrollNote.style.setProperty('--scroll-note-y',`${heroProgress*35}px`);
  scrollNote.style.setProperty('--scroll-note-opacity',String(1-heroProgress*1.4));
  hero.style.setProperty('--glow-x',`${heroProgress*-8}%`);
  hero.style.setProperty('--glow-y',`${heroProgress*8}%`);

  const rect=signature.getBoundingClientRect();
  const signatureProgress=clamp((innerHeight-rect.top)/(innerHeight+rect.height));
  signatureImage.style.setProperty('--signature-y',`${-10+signatureProgress*12}%`);
  signatureImage.style.setProperty('--signature-scale',String(1.13-signatureProgress*.12));
  signatureImage.style.setProperty('--signature-rotate',`${-1.2+signatureProgress*1.6}deg`);
  signatureCopy.style.setProperty('--signature-copy-y',`${(signatureProgress-.5)*-36}px`);
  signatureLabel.style.setProperty('--label-y',`${(signatureProgress-.5)*-28}px`);

  const assemblyRect=assembly.getBoundingClientRect();
  const assemblyProgressValue=clamp(-assemblyRect.top/(assemblyRect.height-innerHeight));
  const compactAssembly=innerWidth<720;
  const layerNames=['Base brioche tostada','Smash com cebola','Smash com cheddar','Bacon crocante','Picles e molho Brasa','Coroa de brioche'];
  const entrances=[
    {x:0,y:compactAssembly?68:72,r:-4},
    {x:compactAssembly?58:64,y:12,r:7},
    {x:compactAssembly?-58:-64,y:8,r:-7},
    {x:compactAssembly?62:68,y:3,r:6},
    {x:compactAssembly?-62:-68,y:-5,r:-6},
    {x:0,y:compactAssembly?-68:-74,r:4}
  ];
  assemblyLayers.forEach(layer=>{
    const step=Number(layer.dataset.step);
    const start=step===0?-.11:.055+step*.135;
    const local=clamp((assemblyProgressValue-start)/.18);
    const eased=1-Math.pow(1-local,3);
    const entrance=entrances[step];
    layer.style.setProperty('--layer-x',`${entrance.x*(1-eased)}vw`);
    layer.style.setProperty('--layer-y',`${entrance.y*(1-eased)}vh`);
    layer.style.setProperty('--layer-rotate',`${entrance.r*(1-eased)}deg`);
    layer.style.setProperty('--layer-scale',String(.82+eased*.18));
    layer.style.setProperty('--layer-opacity',String(clamp(local*1.8)));
    layer.style.setProperty('--layer-blur',`${(1-eased)*9}px`);
  });
  const activeStep=Math.min(5,Math.max(0,Math.floor((assemblyProgressValue-.02)/.135)));
  assemblyStatus.textContent=layerNames[activeStep];
  assemblyStatusCount.textContent=`0${activeStep+1} / 06`;
  assemblyCounter.firstChild.nodeValue=`0${activeStep+1} `;
  assemblyProgress.style.setProperty('--assembly-progress',String(assemblyProgressValue));
  assembly.style.setProperty('--assembly-glow',String(.15+assemblyProgressValue*.85));
}
function requestScrollMotion(){if(!scrollTick){scrollTick=true;requestAnimationFrame(renderScrollMotion)}}
window.addEventListener('scroll',requestScrollMotion,{passive:true});
window.addEventListener('resize',requestScrollMotion,{passive:true});
reduceMotion.addEventListener?.('change',requestScrollMotion);
requestScrollMotion();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal').forEach((element,index)=>{element.style.transitionDelay=`${Math.min(index%3,2)*70}ms`;observer.observe(element)});

const statCounters=[...document.querySelectorAll('.count-up')];
function animateCounter(counter){
  const target=Number(counter.dataset.target);
  const suffix=counter.dataset.suffix||'';
  if(reduceMotion.matches){counter.textContent=`${target}${suffix}`;return}
  const duration=1400;
  const start=performance.now();
  counter.textContent=`0${suffix}`;
  function update(now){
    const progress=clamp((now-start)/duration);
    const eased=1-Math.pow(1-progress,4);
    counter.textContent=`${Math.round(target*eased)}${suffix}`;
    if(progress<1)requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  animateCounter(entry.target);
  counterObserver.unobserve(entry.target);
}),{threshold:.65});
statCounters.forEach(counter=>counterObserver.observe(counter));

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>{item.classList.remove('is-active');item.setAttribute('aria-pressed','false')});
  button.classList.add('is-active');button.setAttribute('aria-pressed','true');
  const filter=button.dataset.filter;
  document.querySelectorAll('.menu-card').forEach(card=>card.hidden=filter!=='all'&&card.dataset.category!==filter);
}));

function announce(message){toast.textContent=message;toast.classList.add('show');clearTimeout(announce.timer);announce.timer=setTimeout(()=>toast.classList.remove('show'),2200)}

function openCart(){lastFocus=document.activeElement;cartBackdrop.hidden=false;requestAnimationFrame(()=>cartPanel.classList.add('is-open'));cartPanel.setAttribute('aria-hidden','false');document.body.classList.add('cart-open');cartClose.focus()}
function closeCart(){cartPanel.classList.remove('is-open');cartPanel.setAttribute('aria-hidden','true');document.body.classList.remove('cart-open');setTimeout(()=>cartBackdrop.hidden=true,350);lastFocus?.focus()}
cartButton.addEventListener('click',openCart);cartClose.addEventListener('click',closeCart);cartBackdrop.addEventListener('click',closeCart);
document.addEventListener('keydown',event=>{
  if(!cartPanel.classList.contains('is-open'))return;
  if(event.key==='Escape'){closeCart();return}
  if(event.key==='Tab'){
    const focusable=[...cartPanel.querySelectorAll('button,a[href]')].filter(item=>!item.hidden&&!item.disabled);
    const first=focusable[0];const last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
});

function renderCart(){
  const quantity=cart.reduce((sum,item)=>sum+item.quantity,0);
  const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  cartCount.textContent=quantity;cartButton.setAttribute('aria-label',`Abrir sacola, ${quantity} ${quantity===1?'item':'itens'}`);
  if(!cart.length){cartItems.innerHTML='<div class="empty-cart"><span>○</span><strong>Sua sacola está vazia</strong><p>Escolha seus favoritos no cardápio.</p></div>';cartFooter.hidden=true;return}
  cartFooter.hidden=false;cartTotal.textContent=formatPrice(total);
  cartItems.innerHTML=cart.map((item,index)=>`<article class="cart-item"><h3>${item.name}</h3><p>${formatPrice(item.price*item.quantity)}</p><div class="item-controls"><button type="button" data-action="decrease" data-index="${index}" aria-label="Diminuir ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-index="${index}" aria-label="Aumentar ${item.name}">+</button><button class="remove-item" type="button" data-action="remove" data-index="${index}">Remover</button></div></article>`).join('');
  const lines=cart.map(item=>`${item.quantity}x ${item.name} — ${formatPrice(item.price*item.quantity)}`).join('\n');
  const message=`Oi, BRASA! Quero fazer este pedido:\n\n${lines}\n\nTotal: ${formatPrice(total)}`;
  checkoutButton.href=`https://wa.me/5551999990000?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('.add-button').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.name;const price=Number(button.dataset.price);const existing=cart.find(item=>item.name===name);
  existing?existing.quantity++:cart.push({name,price,quantity:1});renderCart();announce(`${name} foi adicionado à sacola`);
}));

cartItems.addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]');if(!button)return;
  const index=Number(button.dataset.index);const action=button.dataset.action;
  if(action==='increase')cart[index].quantity++;
  if(action==='decrease'){cart[index].quantity--;if(cart[index].quantity===0)cart.splice(index,1)}
  if(action==='remove')cart.splice(index,1);
  renderCart();
});

renderCart();
