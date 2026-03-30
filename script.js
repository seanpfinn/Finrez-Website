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

  /* ── Nav CTA: slide in once hero CTA leaves viewport ── */
  const heroCta   = document.querySelector('.hero-btns .btn-dark');
  const desktopNavCta = document.querySelector('.nav-links-desktop .nav-cta');
  if (heroCta && desktopNavCta) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        desktopNavCta.classList.toggle('nav-cta--visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    obs.observe(heroCta);
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
        setTimeout(() => navLinks.classList.remove('open', 'is-closing'), 300);
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

  /* ── Desktop Work dropdown ── */
  const workDropdownBtn = document.querySelector('.nav-work-btn-desktop');
  const workDropdown    = document.getElementById('workDropdown');
  if (workDropdownBtn && workDropdown) {
    workDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = workDropdown.classList.toggle('is-open');
      workDropdownBtn.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', () => {
      workDropdown.classList.remove('is-open');
      workDropdownBtn.setAttribute('aria-expanded', 'false');
    });
    workDropdown.addEventListener('click', (e) => e.stopPropagation());
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
  document.querySelectorAll('.faq-a').forEach(el => {
    const inner = document.createElement('div');
    inner.innerHTML = el.innerHTML;
    el.innerHTML = '';
    el.appendChild(inner);
    el.removeAttribute('hidden');
  });

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.classList.toggle('is-open', !isOpen);
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

  /* ── Mission text: scroll-driven word fill ── */
  const missionText = document.querySelector('.mission-text');
  if (missionText) {
    const nodes = Array.from(missionText.childNodes);
    const fragments = [];
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (part.trim()) {
            const span = document.createElement('span');
            span.className = 'mission-word';
            span.textContent = part;
            fragments.push(span);
          } else if (part) {
            fragments.push(document.createTextNode(part));
          }
        });
      } else {
        const wrapper = document.createElement('span');
        wrapper.className = 'mission-word';
        wrapper.appendChild(node.cloneNode(true));
        fragments.push(wrapper);
      }
    });
    missionText.innerHTML = '';
    fragments.forEach(f => missionText.appendChild(f));

    const wordSpans = Array.from(missionText.querySelectorAll('.mission-word'));
    const missionSection = missionText.closest('.mission');

    const revealWords = () => {
      const rect     = missionSection.getBoundingClientRect();
      const vh       = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh * 0.4)));
      const count    = Math.round(progress * wordSpans.length);
      wordSpans.forEach((span, i) => {
        span.classList.toggle('mission-word--lit', i < count);
      });
    };

    window.addEventListener('scroll', revealWords, { passive: true });
    revealWords();
  }

  /* ── Blur reveal: section headings/copy ── */
  if ('IntersectionObserver' in window) {
    const blurObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          blurObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.sect-blur').forEach(el => blurObs.observe(el));
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

  /* ── Hero cycle: separate then cycle ── */
  const heroCycle = document.querySelector('.hero-cycle');
  if (heroCycle) {
    const isMobile = window.matchMedia('(max-width: 809px)').matches;

    if (isMobile) {
      // On mobile start cycling once the title blur-in finishes (0.2s delay + 0.8s duration)
      setTimeout(() => heroCycle.classList.add('cycling'), 1000);
    } else {
      // Desktop: measure the true rendered width of the widest word.
      // scrollWidth on the actual element works because overflow:hidden clips
      // visually but doesn't affect the scrollable content size.
      let naturalWidth = heroCycle.scrollWidth;

      // Fallback: clone inside hero-title so it inherits the correct font size.
      if (!naturalWidth) {
        const clone = heroCycle.cloneNode(true);
        clone.style.cssText = 'position:absolute;visibility:hidden;width:auto;pointer-events:none';
        heroCycle.parentElement.appendChild(clone);
        naturalWidth = clone.scrollWidth;
        heroCycle.parentElement.removeChild(clone);
      }

      // Start after the title blur-in finishes (0.18s delay + 0.65s duration)
      setTimeout(() => {
        heroCycle.style.transition = 'width 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
        heroCycle.style.width = naturalWidth + 'px';

        // Use transitionend so cycling starts at exactly the right moment
        heroCycle.addEventListener('transitionend', () => {
          heroCycle.classList.add('cycling');
        }, { once: true });
      }, 850);
    }
  }

  /* ── Ticker: touch swipe with seamless resume ── */
  const tickerList = document.querySelector('.ticker-list');
  if (tickerList) {
    const ANIM_DURATION = 28; // must match ticker-scroll CSS duration
    let touchStartX  = 0;
    let dragStartPx  = 0;
    let dragging     = false;

    const readTranslateX = () =>
      new DOMMatrix(getComputedStyle(tickerList).transform).m41;

    const wrapPx = (px) => {
      const half = tickerList.scrollWidth / 2;
      return px - Math.floor(px / (-half)) * (-half);
    };

    tickerList.addEventListener('touchstart', (e) => {
      dragging    = true;
      touchStartX = e.touches[0].clientX;
      dragStartPx = readTranslateX();
      tickerList.style.animationPlayState = 'paused';
      tickerList.style.transform = `translateX(${dragStartPx}px)`;
    }, { passive: true });

    tickerList.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const delta = e.touches[0].clientX - touchStartX;
      tickerList.style.transform =
        `translateX(${wrapPx(dragStartPx + delta)}px)`;
    }, { passive: true });

    tickerList.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      const half     = tickerList.scrollWidth / 2;
      const endPx    = wrapPx(readTranslateX());
      const progress = Math.abs(endPx) / half;
      tickerList.style.transform          = '';
      tickerList.style.animationDelay     = `${-(progress * ANIM_DURATION)}s`;
      tickerList.style.animationPlayState = 'running';
    });
  }

  /* ── Footer logo: reveal with gradient blur on page-end reached ── */
  const footerLogoWrap = document.querySelector('.footer-logo-wrap');
  if (footerLogoWrap) {
    const checkPageEnd = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total    = document.documentElement.scrollHeight;
      if (scrolled >= total - 4) {
        footerLogoWrap.classList.add('logo-revealed');
        window.removeEventListener('scroll', checkPageEnd);
      }
    };
    window.addEventListener('scroll', checkPageEnd, { passive: true });
    checkPageEnd();
  }

  /* ── Work panel cursor pill ── */
  const workCursor = document.getElementById('work-cursor');
  if (workCursor) {
    let rafId;
    const panels = document.querySelectorAll('.work-panel');

    const setCursorPos = (x, y) => {
      workCursor.style.setProperty('--cx', x + 'px');
      workCursor.style.setProperty('--cy', y + 'px');
    };

    const onMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setCursorPos(e.clientX, e.clientY));
    };

    panels.forEach(panel => {
      panel.addEventListener('mouseenter', (e) => {
        setCursorPos(e.clientX, e.clientY);
        workCursor.classList.add('visible');
        document.addEventListener('mousemove', onMove);
      });
      panel.addEventListener('mouseleave', () => {
        workCursor.classList.remove('visible');
        document.removeEventListener('mousemove', onMove);
      });
    });
  }

})();

/* ── ASCII Waveform Hero ── */
/* ── Mobile VS accordion ── */
if (window.matchMedia('(max-width: 809px)').matches) {
  document.querySelectorAll('.vs-row-group').forEach(group => {
    const label  = group.querySelector('.vs-cell--label');
    const ft     = group.querySelector('.vs-cell--ft');
    const finrez = group.querySelector('.vs-cell--finrez');

    // Column labels inside value cells
    const ftLbl = document.createElement('span');
    ftLbl.className = 'vs-cell-col-label';
    ftLbl.textContent = 'Full-Time Senior Designer';
    ft.prepend(ftLbl);

    const finrezLbl = document.createElement('span');
    finrezLbl.className = 'vs-cell-col-label';
    finrezLbl.textContent = 'Finrez';
    finrez.prepend(finrezLbl);

    // Wrap value cells in container (always open)
    const valuesWrap  = document.createElement('div');
    valuesWrap.className = 'vs-accordion-values';
    const valuesInner = document.createElement('div');
    valuesInner.className = 'vs-accordion-values-inner';
    valuesWrap.appendChild(valuesInner);
    valuesInner.appendChild(ft);
    valuesInner.appendChild(finrez);
    group.appendChild(valuesWrap);

    // Always open
    group.classList.add('is-open');
  });
}

/* ── ASCII Waveform Hero ── */
(function () {
  const canvas = document.getElementById('ascii-waveform');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = '░▒▓█▄▀·:;,.\'"` ~-_=+*#@%&FINREZ';

  const COL_SIZE = 14;
  const ROW_SIZE = 18;

  let W, H, t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const cols = Math.ceil(W / COL_SIZE);
    const rows = Math.ceil(H / ROW_SIZE);

    ctx.font = `${ROW_SIZE * 0.7}px "IBM Plex Mono", monospace`;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const nx = col / cols;
        const ny = row / rows;

        const wave1 = Math.sin(nx * 8  + t * 0.8)               * 0.5 + 0.5;
        const wave2 = Math.sin(ny * 6  - t * 0.5 + nx * 4)      * 0.5 + 0.5;
        const wave3 = Math.sin((nx + ny) * 10 + t * 1.2)         * 0.5 + 0.5;

        const combined = wave1 * 0.4 + wave2 * 0.4 + wave3 * 0.2;

        const charIdx = Math.floor(combined * (chars.length - 1));
        const alpha   = combined * 0.12 + 0.02;

        ctx.fillStyle = `rgba(17, 17, 17, ${alpha})`;
        ctx.fillText(chars[charIdx], col * COL_SIZE, row * ROW_SIZE + ROW_SIZE * 0.75);
      }
    }

    t += 0.015;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();
