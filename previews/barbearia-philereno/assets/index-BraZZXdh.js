(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var e = {
  name: `Barbearia Philereno`,
  city: `Taquara - RS`,
  whatsappDisplay: `(51) 99762-5870`,
  whatsappNumber: `5551997625870`,
  message: `Olá! Gostaria de agendar um horário.`,
};
(document.querySelectorAll(`[data-business-name]`).forEach((t) => {
  t.textContent = e.name;
}),
  document.querySelectorAll(`[data-city]`).forEach((t) => {
    t.textContent = e.city;
  }),
  document.querySelectorAll(`[data-phone-display]`).forEach((t) => {
    t.textContent = e.whatsappDisplay;
  }));
var t = `https://wa.me/${e.whatsappNumber}?text=${encodeURIComponent(e.message)}`;
document.querySelectorAll(`.whatsapp-link`).forEach((e) => {
  e.href = t;
});
var n = document.querySelector(`.menu-toggle`),
  r = document.querySelector(`.main-nav`);
function i() {
  (n.setAttribute(`aria-expanded`, `false`),
    n.setAttribute(`aria-label`, `Abrir menu`),
    r.classList.remove(`open`),
    document.body.classList.remove(`menu-open`));
}
(n.addEventListener(`click`, () => {
  let e = n.getAttribute(`aria-expanded`) === `true`;
  (n.setAttribute(`aria-expanded`, String(!e)),
    n.setAttribute(`aria-label`, e ? `Abrir menu` : `Fechar menu`),
    r.classList.toggle(`open`, !e),
    document.body.classList.toggle(`menu-open`, !e));
}),
  r.querySelectorAll(`a`).forEach((e) => e.addEventListener(`click`, i)),
  document.addEventListener(`keydown`, (e) => {
    e.key === `Escape` && i();
  }));
var a = document.querySelector(`.site-header`);
window.addEventListener(
  `scroll`,
  () => a.classList.toggle(`scrolled`, window.scrollY > 24),
  { passive: !0 },
);
