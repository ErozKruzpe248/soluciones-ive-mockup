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
// Cada tarjeta conserva su portada; las otras fotos se solicitan sólo al abrir su álbum.
const albumExtras = {
  'rotulacion-muros': [
    { src: 'assets/nueva-f09.jpg', alt: 'Gráficos informativos de colores instalados sobre un muro industrial', title: 'Gráficos informativos' },
    { src: 'assets/nueva-f25.jpg', alt: 'Mural histórico con fotografías y texto en blanco y negro', title: 'Mural histórico' }
  ],
  'estructuras-exhibidor': [
    { src: 'assets/nueva-f07.jpg', alt: 'Estructura metálica verde en taller', title: 'Estructura metálica' },
    { src: 'assets/nueva-f16.jpg', alt: 'Estación de trabajo con estructura metálica blanca', title: 'Estación de trabajo' }
  ],
  'anuncios-exterior': [
    { src: 'assets/nueva-f04.jpg', alt: 'Letrero de bienvenida instalado en una fachada', title: 'Letrero de bienvenida' },
    { src: 'assets/nueva-f38.jpg', alt: 'Letras de marca en relieve sobre un panel', title: 'Letras en relieve' }
  ],
  'exhibidores-producto': [
    { src: 'assets/nueva-f27.jpg', alt: 'Exhibidores de prendas deportivas sobre bases negras', title: 'Exhibidores de prendas' },
    { src: 'assets/nueva-f41.jpg', alt: 'Pieza promocional montada sobre una mesa de exhibición', title: 'Pieza de exhibición' }
  ],
  'estructuras-gabinetes': [
    { src: 'assets/nueva-f24.jpg', alt: 'Conjunto de gabinetes metálicos grises con puertas transparentes', title: 'Gabinetes con puertas' },
    { src: 'assets/nueva-f33.jpg', alt: 'Estructura metálica negra de malla en taller', title: 'Estructura de malla' }
  ],
  'pizarrones-procesos': [
    { src: 'assets/nueva-f15.jpg', alt: 'Tablero triple con áreas de seguridad, calidad y productividad', title: 'Tablero de áreas' },
    { src: 'assets/nueva-f34.jpg', alt: 'Tablero informativo sobre estructura metálica móvil', title: 'Tablero móvil' }
  ],
  'rotulacion-espacios': [
    { src: 'assets/nueva-f35.jpg', alt: 'Gráfica de servicio al cliente aplicada sobre ventanales', title: 'Gráfica en vidrio' },
    { src: 'assets/nueva-f36.jpg', alt: 'Gráfica circular informativa aplicada sobre un muro', title: 'Gráfica en muro' }
  ],
  'pizarrones-seguimiento': [
    { src: 'assets/nueva-f39.jpg', alt: 'Tablero móvil de cambios y seguimiento con estructura gris', title: 'Tablero de cambios' },
    { src: 'assets/nueva-f44.jpg', alt: 'Tablero informativo iluminado en un muro', title: 'Tablero iluminado' }
  ],
  'senalizacion-seguridad': [
    { src: 'assets/nueva-f40.jpg', alt: 'Señal naranja de molde de transferencia para área industrial', title: 'Señal industrial' },
    { src: 'assets/nueva-f43.jpg', alt: 'Panel azul de estación de limpieza con siluetas de herramientas', title: 'Estación de limpieza' }
  ],
  'anuncios-graficos': [
    { src: 'assets/nueva-f30.jpg', alt: 'Gráfica comercial roja instalada sobre una estructura larga', title: 'Gráfica de gran formato' },
    { src: 'assets/nueva-f45.jpg', alt: 'Espacio de exhibición comercial con paneles gráficos', title: 'Espacio de exhibición' }
  ]
};
let activeAlbum = [];
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
  const visibleCount = cards.filter(card => !card.hidden).length;
  galleryStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'grupo visible' : 'grupos visibles'}, con tres fotografías por grupo.`;
}));

function showPhoto(index) {
  if (!activeAlbum.length) return;
  currentIndex = (index + activeAlbum.length) % activeAlbum.length;
  const photo = activeAlbum[currentIndex];
  lightboxImage.alt = photo.alt;
  lightboxImage.src = photo.src;
  lightboxTitle.textContent = photo.title;
  lightboxCount.textContent = `${currentIndex + 1} / ${activeAlbum.length}`;
  lightbox.querySelectorAll('.lightbox-arrow').forEach(arrow => { arrow.hidden = activeAlbum.length < 2; });
}

cards.forEach(card => card.querySelector('.project-open').addEventListener('click', event => {
  opener = event.currentTarget;
  const cover = card.querySelector('img');
  activeAlbum = [
    { src: cover.currentSrc || cover.src, alt: cover.alt, title: card.querySelector('figcaption strong').textContent },
    ...albumExtras[card.dataset.album]
  ];
  showPhoto(0);
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
  activeAlbum = [];
  if (opener) opener.focus();
});

let touchStartX = 0;
lightboxImage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightboxImage.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 55) showPhoto(currentIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

const heroCarousel = document.querySelector('.hero-carousel');
if (heroCarousel) {
  const slides = [...heroCarousel.querySelectorAll('.hero-slide')];
  const captions = ['Señalización exterior', 'Estructuras a medida', 'Fabricación metálica'];
  const caption = heroCarousel.querySelector('#hero-slide-caption');
  const counter = heroCarousel.querySelector('.hero-carousel-count');
  const pauseButton = heroCarousel.querySelector('.hero-carousel-pause');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeSlide = 0;
  let paused = prefersReducedMotion.matches;
  let changing = false;

  async function showHeroSlide(index) {
    if (changing || index === activeSlide) return;
    changing = true;
    const nextIndex = (index + slides.length) % slides.length;
    const next = slides[nextIndex];
    if (next.dataset.src) {
      next.src = next.dataset.src;
      delete next.dataset.src;
    }
    try {
      await next.decode();
      slides[activeSlide].classList.remove('is-active');
      slides[activeSlide].setAttribute('aria-hidden', 'true');
      next.classList.add('is-active');
      next.removeAttribute('aria-hidden');
      activeSlide = nextIndex;
      caption.textContent = captions[activeSlide];
      counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      heroCarousel.querySelector('.hero-corner').textContent = `IVE / ${String(activeSlide + 1).padStart(2, '0')}`;
    } catch (error) {
      // Conservar la foto anterior si falla una descarga.
    } finally {
      changing = false;
    }
  }

  heroCarousel.querySelector('.hero-carousel-prev').addEventListener('click', () => showHeroSlide(activeSlide - 1));
  heroCarousel.querySelector('.hero-carousel-next').addEventListener('click', () => showHeroSlide(activeSlide + 1));
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  });
  prefersReducedMotion.addEventListener('change', event => {
    paused = event.matches;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  });
  if (paused) {
    pauseButton.setAttribute('aria-pressed', 'true');
    pauseButton.setAttribute('aria-label', 'Reanudar carrusel');
    pauseButton.textContent = '▶';
  }
  heroCarousel.classList.add('is-ready');
  window.setInterval(() => {
    if (!paused && !prefersReducedMotion.matches && !document.hidden &&
        !heroCarousel.matches(':hover') && !heroCarousel.contains(document.activeElement)) {
      showHeroSlide(activeSlide + 1);
    }
  }, 7000);
}
