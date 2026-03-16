/* ===================================================
   DigitaLux DZ — script.js
   Interactions: loader, navbar, mobile menu,
   reveal animations, counters, FAQ, carousel,
   cursor, parallax, form, magnetic buttons
=================================================== */

(function () {
  'use strict';

  /* ========== CUSTOM CURSOR ========== */
  function initCursor() {
    if (window.innerWidth < 900) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function renderCursor() {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      rafId = requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, .service-card, .channel-card, .faq-q').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '56px'; ring.style.height = '56px';
        ring.style.borderColor = 'rgba(59,130,246,0.6)';
        dot.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '36px'; ring.style.height = '36px';
        ring.style.borderColor = 'rgba(59,130,246,0.4)';
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  }

  /* ========== LOADER ========== */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        // Set navbar position accounting for announcement bar
        adjustNavbar();
      }, 1500);
    });
  }

  /* ========== SCROLL PROGRESS ========== */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ========== ANNOUNCEMENT BAR ========== */
  function initAnnouncement() {
    const btn = document.getElementById('closeAnnouncement');
    const bar = document.getElementById('announcementBar');
    if (!btn || !bar) return;
    btn.addEventListener('click', () => {
      bar.style.maxHeight = bar.offsetHeight + 'px';
      requestAnimationFrame(() => {
        bar.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
        bar.style.maxHeight = '0';
        bar.style.opacity = '0';
        bar.style.overflow = 'hidden';
        setTimeout(() => {
          bar.remove();
          adjustNavbar();
        }, 400);
      });
    });
  }

  /* ========== NAVBAR ========== */
  function adjustNavbar() {
    const bar = document.getElementById('announcementBar');
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const offset = bar ? bar.offsetHeight : 0;
    nav.style.top = offset + 'px';
  }

  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    adjustNavbar();
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ========== MOBILE MENU ========== */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-link');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ========== SMOOTH SCROLL ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const nav = document.getElementById('navbar');
        const bar = document.getElementById('announcementBar');
        const offset = (nav ? nav.offsetHeight : 72) + (bar ? bar.offsetHeight : 0);
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ========== REVEAL ANIMATIONS ========== */
  function initReveal() {
    const elements = document.querySelectorAll('[data-reveal], [data-reveal-right]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ========== ANIMATED COUNTERS ========== */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.count), 1800);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  /* ========== FAQ ACCORDION ========== */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const open = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
      });
    });
  }

  /* ========== CAROUSEL ========== */
  function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!track) return;

    let index = 0;
    let autoPlay;
    const cards = track.querySelectorAll('.carousel-card');
    const cardWidth = () => {
      const card = cards[0];
      if (!card) return 0;
      return card.offsetWidth + 24; // gap
    };
    const visibleCount = () => Math.floor(track.parentElement.offsetWidth / cardWidth());
    const maxIndex = () => Math.max(0, cards.length - visibleCount());

    function move(dir) {
      index += dir;
      index = Math.max(0, Math.min(index, maxIndex()));
      track.style.transform = `translateX(-${index * cardWidth()}px)`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoPlay); move(-1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoPlay); move(1); startAuto(); });

    function startAuto() {
      autoPlay = setInterval(() => {
        if (index >= maxIndex()) index = -1;
        move(1);
      }, 3200);
    }
    startAuto();

    // Drag/swipe
    let startX, isDragging = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
    track.addEventListener('mousemove', e => { if (!isDragging) return; });
    track.addEventListener('mouseup', e => {
      if (!isDragging) return; isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 40) { clearInterval(autoPlay); move(diff > 0 ? 1 : -1); startAuto(); }
    });
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { clearInterval(autoPlay); move(diff > 0 ? 1 : -1); startAuto(); }
    });
  }

  /* ========== MAGNETIC BUTTONS ========== */
  function initMagnetic() {
    if (window.innerWidth < 900) return;
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ========== HERO PARALLAX ========== */
  function initParallax() {
    const blobs = document.querySelectorAll('.hero-blob');
    if (!blobs.length) return;
    window.addEventListener('mousemove', (e) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((blob, i) => {
        const strength = (i + 1) * 12;
        blob.style.transform = `translate(${xPct * strength}px, ${yPct * strength}px) scale(1)`;
      });
    }, { passive: true });
  }

  /* ========== FLOAT CARDS PARALLAX ========== */
  function initFloatCards() {
    const cards = document.querySelectorAll('.float-card');
    if (!cards.length) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      cards.forEach((card, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const amt = (scrolled * 0.04 * dir * (i * 0.3 + 1)).toFixed(2);
        card.style.transform = `translateY(${amt}px)`;
      });
    }, { passive: true });
  }

  /* ========== FORM HANDLING ========== */
  function initForm() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>✓ Received!</span>';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ========== FOOTER YEAR ========== */
  function setYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ========== SERVICE CARD 3D TILT ========== */
  function initTilt() {
    if (window.innerWidth < 900) return;
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const tiltX = ((y - cy) / cy) * 5;
        const tiltY = ((cx - x) / cx) * 5;
        card.querySelector('.service-card-inner').style.transform =
          `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01,1.01,1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.querySelector('.service-card-inner').style.transform = '';
      });
    });
  }

  /* ========== ECOSYSTEM CATEGORY HOVER ========== */
  function initEcoCats() {
    document.querySelectorAll('.eco-cat').forEach(cat => {
      cat.addEventListener('mouseenter', () => {
        cat.style.borderColor = 'rgba(59,130,246,0.3)';
        cat.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.05))';
      });
      cat.addEventListener('mouseleave', () => {
        cat.style.borderColor = '';
        cat.style.background = '';
      });
    });
  }

  /* ========== NAV ACTIVE LINK ========== */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.style.color = link.getAttribute('href') === '#' + id ? 'var(--text)' : '';
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => observer.observe(s));
  }

  /* ========== ANNOUNCEMENT LINK CLICK ========== */
  function initAnnouncementLink() {
    const link = document.querySelector('.announcement-cta');
    if (!link) return;
    link.addEventListener('click', () => {
      const bar = document.getElementById('announcementBar');
      if (bar) { bar.style.maxHeight = '0'; bar.style.opacity = '0'; bar.style.overflow = 'hidden'; setTimeout(() => bar.remove(), 400); }
    });
  }

  /* ========== INIT ALL ========== */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollProgress();
    initAnnouncement();
    initAnnouncementLink();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initCounters();
    initFAQ();
    initCarousel();
    initForm();
    setYear();
    initEcoCats();
    initActiveNav();

    // Slight delay for cursor/parallax/tilt (wait for DOM paint)
    requestAnimationFrame(() => {
      initCursor();
      initMagnetic();
      initParallax();
      initFloatCards();
      initTilt();
    });
  });

  /* ========== RESIZE HANDLER ========== */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      adjustNavbar();
    }, 150);
  });

})();
