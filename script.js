/* ──────────────────────────────────────
   Finrez — Landing Page Scripts
   ────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Elements ── */
  const header     = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  /* ── Scroll: add shadow to header ── */
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu toggle ── */
  if (menuToggle && navLinks) {
    const closeMenu = (instant = false) => {
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      if (instant) {
        navLinks.classList.remove('open', 'is-closing');
      } else {
        navLinks.classList.add('is-closing');
        setTimeout(() => navLinks.classList.remove('open', 'is-closing'), 340);
      }
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        navLinks.classList.remove('is-closing');
        navLinks.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 809) closeMenu(true);
    });
  }

  /* ── Mobile Work submenu toggle ── */
  const workToggle  = document.getElementById('workToggle');
  const workSubmenu = document.getElementById('workSubmenu');
  if (workToggle && workSubmenu) {
    workSubmenu.removeAttribute('hidden');
    workToggle.addEventListener('click', () => {
      const isOpen = workToggle.getAttribute('aria-expanded') === 'true';
      workToggle.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) {
        // Play exit animation, then hide
        workSubmenu.classList.add('is-closing');
        setTimeout(() => {
          workSubmenu.classList.remove('is-open', 'is-closing');
        }, 360);
      } else {
        workSubmenu.classList.add('is-open');
      }
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isOpen);
      if (isOpen) {
        answer.hidden = true;
      } else {
        answer.hidden = false;
      }
    });
  });

  /* ── Work panel label animation ── */
  if ('IntersectionObserver' in window) {
    const labelObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.closest('.work-panel').classList.add('labels-visible');
            labelObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.work-panel-labels').forEach(el => labelObs.observe(el));
  }

  /* ── Smooth reveal on scroll (Intersection Observer) ── */
  const revealTargets = document.querySelectorAll(
    '.testi-card, .work-panel, .pc, .faq-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    /* Add initial hidden state via JS so it degrades gracefully */
    revealTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      revealObs.observe(el);
    });

    /* CSS class to trigger reveal */
    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: none !important; }';
    document.head.appendChild(style);
  }

  /* ── Retainer plan toggle ── */
  const countPrice = (el, from, to, duration = 480) => {
    const startTime = performance.now();
    const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      // ease-in-out cubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      el.textContent = fmt(from + (to - from) * ease);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  document.querySelectorAll('[data-pc="retainer"] .pct-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const card = opt.closest('[data-pc="retainer"]');
      const plan = opt.dataset.plan;
      if (card.dataset.planActive === plan) return;

      // Animate visible price element
      const visiblePrice = card.querySelector(`.pc-price[data-show="${card.dataset.planActive}"]`);
      const targetPrice  = card.querySelector(`.pc-price[data-show="${plan}"]`);
      if (visiblePrice && targetPrice) {
        const from = parseInt(visiblePrice.textContent.replace(/\D/g, ''), 10);
        const to   = parseInt(targetPrice.textContent.replace(/\D/g, ''), 10);
        card.dataset.planActive = plan;
        countPrice(targetPrice, from, to);
      } else {
        card.dataset.planActive = plan;
      }

      opt.closest('.pc-toggle').querySelectorAll('.pct-opt').forEach(o => {
        o.classList.toggle('pct-opt--on', o === opt);
      });
    });
  });

  /* ── Custom cursor ── */
  const cursorEl = document.getElementById('cursor');
  if (cursorEl) {
    document.addEventListener('mousemove', (e) => {
      cursorEl.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      cursorEl.classList.add('visible');
    });
    document.addEventListener('mouseleave', () => cursorEl.classList.remove('visible'));

    // Transparent overlay over Cal.com iframe — tracks cursor & passes clicks through
    const calOverlay = document.getElementById('cal-overlay');
    if (calOverlay) {
      calOverlay.addEventListener('mousemove', (e) => {
        cursorEl.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
        cursorEl.classList.add('visible');
      });
      calOverlay.addEventListener('mouseleave', () => cursorEl.classList.remove('visible'));
      calOverlay.addEventListener('mousedown', () => {
        calOverlay.style.pointerEvents = 'none';
        setTimeout(() => { calOverlay.style.pointerEvents = ''; }, 50);
      });
    }
  }

})();
