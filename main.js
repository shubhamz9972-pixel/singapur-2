/* ============================================================
   SINGAPUR RESTOBAR — Main JavaScript
   Handles: Nav scroll, mobile menu, scroll reveal animations,
   smooth scroll, FAQ accordion, back to top
   ============================================================ */

'use strict';

// ─── Navigation ──────────────────────────────────────────────
const nav = document.getElementById('main-nav');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

// Scroll-based nav transparency → solid transition
let lastScrollY = 0;
function handleNavScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    nav?.classList.add('nav--scrolled');
  } else {
    nav?.classList.remove('nav--scrolled');
  }
  // Hide nav on scroll down, show on scroll up
  if (scrollY > lastScrollY && scrollY > 200) {
    nav?.classList.add('nav--hidden');
  } else {
    nav?.classList.remove('nav--hidden');
  }
  lastScrollY = scrollY;
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

// Mobile hamburger menu
function openMobileMenu() {
  mobileMenu?.classList.add('mobile-menu--open');
  mobileOverlay?.classList.add('overlay--visible');
  menuToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileMenu?.classList.remove('mobile-menu--open');
  mobileOverlay?.classList.remove('overlay--visible');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.contains('mobile-menu--open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});
mobileOverlay?.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ─── Scroll Reveal Animations ───────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger children reveal
document.querySelectorAll('.reveal-stagger').forEach(parent => {
  const children = parent.querySelectorAll('.stagger-child');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});
document.querySelectorAll('.stagger-child').forEach(el => revealObserver.observe(el));

// ─── FAQ Accordion ──────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('faq-item--open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('faq-item--open');
      const a = i.querySelector('.faq-answer');
      if (a) a.style.maxHeight = '0';
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
    // Open clicked if was closed
    if (!isOpen) {
      item.classList.add('faq-item--open');
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      btn?.setAttribute('aria-expanded', 'true');
    }
  });
  // Init closed
  if (answer) answer.style.maxHeight = '0';
});

// ─── Smooth Scroll ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = nav?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Back to Top ────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    backToTop?.classList.add('btt--visible');
  } else {
    backToTop?.classList.remove('btt--visible');
  }
}, { passive: true });
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Active Nav Link ────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('nav__link--active');
  }
});

// ─── Respect prefers-reduced-motion ─────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion');
}

// ─── Testimonial Carousel ────────────────────────────────────
(function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track || !slides.length) return;

  let current = 0;
  let autoInterval;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle('testimonial-card--active', i === current);
      s.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });
    dots.forEach((d, i) => d.classList.toggle('carousel-dot--active', i === current));
  }

  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoInterval); }

  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  goTo(0);
  startAuto();
})();
