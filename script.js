const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !nav.classList.contains('open')) return;
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  menuButton.focus();
});

const filters = [...document.querySelectorAll('.gallery-filter')];
const cards = [...document.querySelectorAll('.project-card')];
const galleryStatus = document.querySelector('.gallery-status');
document.querySelector('.gallery-filter[data-filter="todos"] span').textContent = String(cards.length);
const lightbox = document.querySelector('#gallery-lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxCount = lightbox.querySelector('.lightbox-count');
let visibleCards = cards;
let currentIndex = 0;
let opener = null;

filters.forEach(filter => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach(item => {
    const selected = item === filter;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  cards.forEach(card => { card.hidden = category !== 'todos' && card.dataset.category !== category; });
  visibleCards = cards.filter(card => !card.hidden);
  galleryStatus.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? 'fotografía visible' : 'fotografías visibles'}.`;
}));

function showPhoto(index) {
  currentIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];
  const photo = card.querySelector('img');
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = card.querySelector('figcaption strong').textContent;
  lightboxCount.textContent = `${currentIndex + 1} / ${visibleCards.length}`;
  lightbox.querySelectorAll('.lightbox-arrow').forEach(arrow => { arrow.hidden = visibleCards.length < 2; });
}

cards.forEach(card => card.querySelector('.project-open').addEventListener('click', event => {
  opener = event.currentTarget;
  showPhoto(visibleCards.indexOf(card));
  lightbox.showModal();
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}));

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentIndex + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentIndex + 1); }
});
lightbox.addEventListener('close', () => {
  document.body.style.overflow = '';
  lightboxImage.removeAttribute('src');
  if (opener) opener.focus();
});

let touchStartX = 0;
lightboxImage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightboxImage.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 55) showPhoto(currentIndex + (distance < 0 ? 1 : -1));
}, { passive: true });
