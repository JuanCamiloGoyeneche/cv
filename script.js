/*
  Archivo: script.js
*/

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

/**
 * Marca como activo el enlace de navegación correspondiente
 * a la sección visible en el viewport.
 */
const setActive = () => {
  const scrollY = window.pageYOffset;
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(a => a.classList.remove('active'));
      link && link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', setActive);
window.addEventListener('load', setActive);

/**
 * Copia texto al portapapeles y muestra feedback temporal
 * en el botón con atributo [data-copy-feedback].
 * @param {string} text Texto a copiar
 */
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('[data-copy-feedback]');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = '¡Copiado!';
    setTimeout(() => (btn.textContent = original), 1400);
  });
}

// Expose for inline onclick
window.copyText = copyText;

/**
 * Abre el cuadro de impresión del navegador para permitir
 * guardar como PDF (alternativa al enlace directo del PDF).
 */
function downloadPDF() {
  // Sugerencia: el usuario puede seleccionar "Guardar como PDF"
  window.print();
}

// Expose globally
window.downloadPDF = downloadPDF;

/**
 * Abre/cierra el menú de navegación móvil y actualiza ARIA.
 */
function toggleMenu() {
  const nav = document.getElementById('siteNav');
  const btn = document.querySelector('.menu-toggle');
  if (!nav || !btn) return;
  const isOpen = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(isOpen));
}

window.toggleMenu = toggleMenu;

// Close menu when navigating (mobile)
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.closest && target.closest('#siteNav a')) {
    const nav = document.getElementById('siteNav');
    const btn = document.querySelector('.menu-toggle');
    if (nav && btn && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }
});

// Reset nav state on resize to desktop
window.addEventListener('resize', () => {
  const nav = document.getElementById('siteNav');
  const btn = document.querySelector('.menu-toggle');
  if (window.innerWidth > 768 && nav && btn) {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
});

/**
 * Actualiza accesibilidad (aria/tooltip) del botón de tema.
 * @param {('light'|'dark')} theme Tema actual aplicado
 */
function updateThemeToggleUI(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = theme === 'dark';
  btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  btn.setAttribute('aria-label', label);
  btn.title = label;
}

/**
 * Aplica el tema y lo persiste en localStorage.
 * @param {('light'|'dark')} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (_) {}
  updateThemeToggleUI(theme);
}

/** Alterna entre tema claro/oscuro y lo aplica. */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(current);
}

window.toggleTheme = toggleTheme;

// Initialize theme from preference or storage
(function initTheme() {
  let stored;
  try { stored = localStorage.getItem('theme'); } catch (_) {}
  if (stored) return applyTheme(stored);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {
  const theme = document.documentElement.getAttribute('data-theme');
  updateThemeToggleUI(theme);
});

// Header shadow on scroll
const header = document.querySelector('.header');
function updateHeaderShadow() {
  const atTop = (window.scrollY || document.documentElement.scrollTop) < 2;
  // En CSS se usa .header.scrolled, por lo tanto sincronizamos la clase
  header && header.classList.toggle('scrolled', !atTop);
}
window.addEventListener('scroll', updateHeaderShadow, { passive: true });
updateHeaderShadow();

// KPIs: valores estáticos (sin animación)

// Reveal animations: entrada suave de secciones
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

