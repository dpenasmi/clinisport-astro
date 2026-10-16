// Navegación progresiva: sin JS los enlaces y el scroll siguen funcionando.
const slides = [...document.querySelectorAll('.slide')];
const links = [...document.querySelectorAll('[data-section-link]')];
const langLinks = [...document.querySelectorAll('[data-language]')];
const controls = [...document.querySelectorAll('[data-direction]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const fullpage = window.matchMedia('(min-width: 901px) and (min-height: 651px) and (pointer: fine)');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const dialog = document.querySelector('.booking-dialog');
let active = Math.max(0, slides.findIndex(slide => '#' + slide.id === location.hash));
let wheelAmount = 0;
let wheelDirection = 0;
let lastWheel = 0;
let lockedUntil = 0;
let scrollFrame = 0;
let announceTimer;

function setMenu(open) {
  if (!menuButton || !menu) return;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

function setActive(index) {
  active = Math.min(slides.length - 1, Math.max(0, index));
  const id = slides[active].id;
  for (const link of links) {
    if (link.dataset.sectionLink === id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  for (const link of langLinks) link.hash = id;
  controls.forEach(button => { button.disabled = Number(button.dataset.direction) < 0 ? active === 0 : active === slides.length - 1; });
  document.querySelector('[data-current]').textContent = String(active + 1).padStart(2, '0');
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    const name = document.querySelector(`.desktop-nav [data-section-link="${id}"]`)?.textContent || '';
    document.querySelector('[data-announcement]').textContent = `${document.body.dataset.slideWord} ${active + 1} ${document.body.dataset.ofWord} ${slides.length}: ${name}`;
  }, 180);
}

function goTo(index, { focus = false, history = true } = {}) {
  if (index < 0 || index >= slides.length) return;
  setMenu(false);
  lockedUntil = performance.now() + (reducedMotion.matches ? 180 : 950);
  wheelAmount = 0;
  setActive(index);
  if (history) window.history.pushState(null, '', '#' + slides[index].id);
  slides[index].scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  if (focus) slides[index].focus({ preventScroll: true });
}

// Todos los enlaces de ancla: rail, cabecera y CTA entre secciones.
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const index = slides.findIndex(slide => '#' + slide.id === anchor.getAttribute('href'));
  if (index === -1) return;
  event.preventDefault();
  goTo(index, { focus: true });
});
controls.forEach(button => button.addEventListener('click', () => goTo(active + Number(button.dataset.direction))));
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
window.matchMedia('(min-width: 1101px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

// Detección por posición real: sincroniza scroll táctil, barra y anclas.
function updateFromScroll() {
  scrollFrame = 0;
  const middle = innerHeight / 2;
  let closest = 0;
  let distance = Infinity;
  slides.forEach((slide, i) => {
    const rect = slide.getBoundingClientRect();
    const d = rect.top <= middle && rect.bottom >= middle ? 0 : Math.min(Math.abs(rect.top - middle), Math.abs(rect.bottom - middle));
    if (d < distance) { distance = d; closest = i; }
  });
  if (closest !== active) setActive(closest);
}
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll); }, { passive: true });
addEventListener('resize', () => { updateFromScroll(); });

// Un gesto de rueda/trackpad = una pantalla en escritorio.
// Los eventos residuales de inercia se ignoran hasta una pausa real.
document.addEventListener('wheel', event => {
  if (!fullpage.matches || reducedMotion.matches || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  if (dialog?.open || menuButton?.getAttribute('aria-expanded') === 'true') return;
  if (!(event.target instanceof Element)) return;
  if (event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
  const now = performance.now();
  const gap = now - lastWheel;
  lastWheel = now;
  // Secciones que crecen por zoom o traducción conservan el scroll nativo.
  if (slides.some(slide => slide.offsetHeight > innerHeight + 5)) return;
  event.preventDefault();
  if (now < lockedUntil) return;
  if (gap < 170 && wheelAmount === 0) return;
  const direction = Math.sign(event.deltaY);
  if (!direction) return;
  if (gap > 170 || direction !== wheelDirection) wheelAmount = 0;
  wheelDirection = direction;
  const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
  wheelAmount += pixels;
  if (Math.abs(wheelAmount) >= 32) goTo(active + direction);
}, { passive: false });

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); return; }
  if (dialog?.open || menuButton?.getAttribute('aria-expanded') === 'true' || !fullpage.matches) return;
  if (!(event.target instanceof Element) || event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
  if (slides.some(slide => slide.offsetHeight > innerHeight + 5)) return;
  const changes = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': event.shiftKey ? -1 : 1 };
  if (event.key in changes) { event.preventDefault(); goTo(active + changes[event.key], { focus: true }); }
  else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : slides.length - 1, { focus: true }); }
});
function syncHash() {
  const index = slides.findIndex(slide => '#' + slide.id === location.hash);
  if (index !== -1) goTo(index, { history: false });
}
addEventListener('hashchange', syncHash);
addEventListener('popstate', syncHash);

// Dialog nativo accesible. Sin JS el CTA conserva el enlace de teléfono.
if (dialog && typeof dialog.showModal === 'function') {
  let opener;
  document.querySelectorAll('[data-booking]').forEach(anchor => anchor.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); setMenu(false); opener = anchor; dialog.showModal();
  }));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (opener && opener.getClientRects().length) opener.focus({ preventScroll: true }); });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: 0 });
  slides.forEach(slide => observer.observe(slide));
  slides[active].classList.add('is-visible');
  document.documentElement.classList.add('enhanced');
}
setActive(active);
if (location.hash) requestAnimationFrame(syncHash);
