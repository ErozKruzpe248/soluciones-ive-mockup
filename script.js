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
  'acrilicos-proteccion': [
    { src: 'assets/album-acrilicos-buzon.webp', alt: 'Buzón transparente de ideas y sugerencias fabricado en acrílico', title: 'Buzón de acrílico' },
    { src: 'assets/album-acrilicos-seguridad.webp', alt: 'Tablero transparente de seguridad y calidad', title: 'Tablero de seguridad' }
  ],
  'acrilicos-documentos': [
    { src: 'assets/album-acrilicos-tableros.webp', alt: 'Documentos organizados en paneles transparentes', title: 'Paneles para documentos' },
    { src: 'assets/album-acrilicos-cultura.webp', alt: 'Gráfico de cultura operacional montado en acrílico', title: 'Gráfico informativo' }
  ],
  'estructuras-modulo': [
    { src: 'assets/album-estructuras-estanteria.webp', alt: 'Estantería metálica azul en un espacio de trabajo', title: 'Estantería metálica' },
    { src: 'assets/album-estructuras-contenedor.webp', alt: 'Contenedor metálico azul fabricado en taller', title: 'Contenedor metálico' }
  ],
  'estructuras-malla': [
    { src: 'assets/album-estructuras-gabinete-abierto.webp', alt: 'Gabinete metálico de malla con puertas abiertas', title: 'Gabinete de malla' },
    { src: 'assets/album-estructuras-gabinete.webp', alt: 'Gabinete metálico blanco con paneles de malla', title: 'Estructura de gabinete' }
  ],
  'anuncios-letras': [
    { src: 'assets/album-anuncios-dental.webp', alt: 'Letras luminosas azules para un negocio dental', title: 'Letras luminosas azules' },
    { src: 'assets/album-anuncios-lemon.webp', alt: 'Letras y logotipo iluminados en un acceso comercial', title: 'Anuncio iluminado' }
  ],
  'pizarrones-procesos': [
    { src: 'assets/album-pizarrones-seguimiento.webp', alt: 'Tablero de seguimiento de procesos sobre estructura móvil', title: 'Tablero de seguimiento' },
    { src: 'assets/album-pizarrones-registros.webp', alt: 'Pizarrón de registros con recuadros para información de procesos', title: 'Pizarrón de registros' }
  ],
  'rotulacion-puerta': [
    { src: 'assets/album-rotulacion-logotipo.webp', alt: 'Logotipo aplicado sobre un muro interior', title: 'Logotipo en muro' },
    { src: 'assets/album-rotulacion-mural.webp', alt: 'Gráfico de colores aplicado en un muro interior', title: 'Gráfico en muro' }
  ],
  'rotulacion-vidrio': [
    { src: 'assets/album-rotulacion-franjas.webp', alt: 'Franjas de vinil colocadas en una mampara de vidrio', title: 'Franjas en vidrio' },
    { src: 'assets/album-rotulacion-esmerilado.webp', alt: 'Puerta de vidrio con aplicación de vinil esmerilado', title: 'Vinil esmerilado' }
  ],
  'senalizacion-velocidad': [
    { src: 'assets/album-senalizacion-velocidad-20.jpg', alt: 'Señal de velocidad máxima de veinte kilómetros por hora instalada en exterior', title: 'Señal de velocidad instalada' },
    { src: 'assets/album-senalizacion-seguridad.webp', alt: 'Señal informativa de seguridad en un taller', title: 'Señal de seguridad' }
  ],
  'senalizacion-direcciones': [
    { src: 'assets/album-senalizacion-sanitarios.webp', alt: 'Señal azul de sanitarios para mujeres', title: 'Señal de sanitarios' },
    { src: 'assets/album-senalizacion-directorio.webp', alt: 'Directorio vertical con nombres y flechas de orientación', title: 'Directorio de orientación' }
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
  const captions = ['Fabricación metálica', 'Señalización visual', 'Rotulación de espacios'];
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
