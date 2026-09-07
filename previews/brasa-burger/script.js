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

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal').forEach((element,index)=>{element.style.transitionDelay=`${Math.min(index%3,2)*70}ms`;observer.observe(element)});

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

