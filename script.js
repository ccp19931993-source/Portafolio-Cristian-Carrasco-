const langButtons = document.querySelectorAll('.lang-btn');
const translatable = document.querySelectorAll('[data-es][data-en]');

function setLang(lang){
  document.documentElement.lang = lang;
  translatable.forEach(el => {
    el.textContent = el.dataset[lang];
  });
  langButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.lang === lang));
  try { localStorage.setItem('portfolio-lang', lang); } catch(e) {}
}

langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
try {
  const stored = localStorage.getItem('portfolio-lang');
  if(stored === 'en' || stored === 'es') setLang(stored);
} catch(e) {}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12, rootMargin: '0px 0px -40px'});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const glow = document.querySelector('.cursor-glow');
if(glow && window.matchMedia('(pointer:fine)').matches){
  window.addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, {passive:true});
}

// Keep the header subtle while scrolling.
const header = document.querySelector('.site-header');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.boxShadow = y > 40 ? '0 8px 30px rgba(0,0,0,.045)' : 'none';
  lastY = y;
}, {passive:true});

// Image lightbox for photography, illustration and proof captures.
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
let lastFocused = null;

function openLightbox(src, alt = ''){
  if(!lightbox || !lightboxImage) return;
  lastFocused = document.activeElement;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  if(lightboxCaption) lightboxCaption.textContent = alt;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-open');
  lightboxClose?.focus();
}
function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('lightbox-open');
  if(lightboxImage) lightboxImage.src = '';
  lastFocused?.focus?.();
}

document.querySelectorAll('[data-lightbox]').forEach(item => {
  item.tabIndex = 0;
  item.setAttribute('role','button');
  item.setAttribute('aria-label', item.querySelector('img')?.alt || 'Ampliar imagen');
  const run = () => {
    const img = item.querySelector('img');
    if(img) openLightbox(img.src, img.alt);
  };
  item.addEventListener('click', run);
  item.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); run(); } });
});

document.querySelectorAll('[data-proof]').forEach(btn => {
  btn.addEventListener('click', () => openLightbox(btn.dataset.proof, btn.dataset.es || 'Resultados'));
});
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox(); });
