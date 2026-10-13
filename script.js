'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cards = [...document.querySelectorAll('.memory')];
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  cards.forEach(card => { card.hidden = category !== 'ALL' && card.dataset.category !== category; });
  document.querySelector('.archive-grid').classList.toggle('filtered', category !== 'ALL');
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#index-count').textContent = 'INDEX — ' + String(count).padStart(3, '0') + '/008';
}));
const dialog = document.querySelector('.lightbox');
let activePhoto;
document.querySelectorAll('.photo').forEach(button => button.addEventListener('click', () => {
  activePhoto = button;
  const image = button.querySelector('img');
  const enlarged = dialog.querySelector('img');
  enlarged.src = image.getAttribute('src');
  enlarged.alt = image.alt;
  document.querySelector('#modal-title').textContent = button.dataset.title;
  document.querySelector('#modal-description').textContent = button.dataset.description;
  document.querySelector('#modal-meta').textContent = button.dataset.number + ' / ' + button.dataset.date + ' / ' + button.dataset.time;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  dialog.querySelector('.close').focus();
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (activePhoto) activePhoto.focus({ preventScroll: true });
});
const cursor = document.querySelector('.cursor');
if (window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
  document.body.classList.add('custom-cursor');
  window.addEventListener('pointermove', event => {
    cursor.style.display = dialog.open ? 'none' : 'flex';
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    const view = !!event.target.closest('.photo');
    cursor.classList.toggle('view', view);
    cursor.textContent = view ? 'VIEW' : 'ECHO°';
  });
  document.addEventListener('pointerleave', () => { cursor.style.display = 'none'; });
  window.addEventListener('blur', () => { cursor.style.display = 'none'; });
}
const heroImage = document.querySelector('.hero-photo img');
if (heroImage && !reducedMotion.matches) {
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      requestAnimationFrame(() => {
        heroImage.style.transform = 'translateY(-' + Math.min(window.scrollY * .12, 65) + 'px)';
        scheduled = false;
      });
      scheduled = true;
    }
  }, { passive: true });
}
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.memory, .section-head, .manifesto h2, .end-note h2').forEach(element => {
    element.classList.add('reveal'); observer.observe(element);
  });
}
