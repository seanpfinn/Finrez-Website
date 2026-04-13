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

      // Set width immediately so "brand" is visible as soon as "Your" fades in.
      heroCycle.style.width = naturalWidth + 'px';

      // Start cycling after the title has fully faded in (~0.18s delay + 0.65s duration + buffer)
      setTimeout(() => {
        heroCycle.classList.add('cycling');
      }, 2000);
    }
  }

  /* ── Hero image slideshow ── */
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  if (heroSlides.length > 1) {
    let currentSlide = 0;

    setInterval(() => {
      const prev = currentSlide;
      currentSlide = (currentSlide + 1) % heroSlides.length;

      // Exit the current slide
      heroSlides[prev].classList.remove('hero-slide--active');
      heroSlides[prev].classList.add('hero-slide--exit');

      // Enter the next slide: snap to right without transition, then animate in
      const next = heroSlides[currentSlide];
      next.style.transition = 'none';
      next.style.transform = 'translateX(100%)';
      next.style.opacity = '0';

      // Double rAF: first frame commits the reset, second frame triggers the transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.style.transition = '';
          next.style.transform = '';
          next.style.opacity = '';
          next.classList.add('hero-slide--active');
        });
      });

      // Clean up exit class after transition ends
      const exitSlide = heroSlides[prev];
      exitSlide.addEventListener('transitionend', () => {
        exitSlide.classList.remove('hero-slide--exit');
        exitSlide.style.transform = '';
        exitSlide.style.opacity = '';
      }, { once: true });
    }, 7000);
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

  /* ── Footer logo: scroll reveal ── */
  const footerLogoWrap = document.querySelector('.footer-logo-wrap');
  if (footerLogoWrap) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footerLogoWrap.classList.add('logo-revealed');
            obs.unobserve(footerLogoWrap);
          }
        });
      }, { threshold: 0 });
      obs.observe(footerLogoWrap);
    } else {
      footerLogoWrap.classList.add('logo-revealed');
    }
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

/* ── Screensaver ── */
(function () {
  const screen   = document.getElementById('screensaver');
  const logo     = document.getElementById('screensaver-logo');
  if (!screen || !logo) return;

  const IDLE_MS   = 15000;
  const SPEED     = 1.4; // px per frame
  let idleTimer, rafId;
  let active = false;

  let x, y, vx, vy;

  function startBounce() {
    const lw = logo.offsetWidth  || 120;
    const lh = logo.offsetHeight || 96;
    x  = Math.random() * (window.innerWidth  - lw);
    y  = Math.random() * (window.innerHeight - lh);
    vx = (Math.random() < 0.5 ? 1 : -1) * SPEED;
    vy = (Math.random() < 0.5 ? 1 : -1) * SPEED;
    logo.style.left = '0';
    logo.style.top  = '0';
    tick();
  }

  function tick() {
    const lw = logo.offsetWidth;
    const lh = logo.offsetHeight;
    x += vx;
    y += vy;
    if (x <= 0)                         { x = 0;                         vx =  Math.abs(vx); }
    if (x >= window.innerWidth  - lw)   { x = window.innerWidth  - lw;   vx = -Math.abs(vx); }
    if (y <= 0)                         { y = 0;                         vy =  Math.abs(vy); }
    if (y >= window.innerHeight - lh)   { y = window.innerHeight - lh;   vy = -Math.abs(vy); }
    logo.style.transform = `translate(${x}px, ${y}px)`;
    rafId = requestAnimationFrame(tick);
  }

  function show() {
    if (active) return;
    active = true;
    screen.classList.add('is-visible');
    startBounce();
  }

  function hide() {
    if (!active) return;
    active = false;
    screen.classList.remove('is-visible');
    cancelAnimationFrame(rafId);
  }

  function resetTimer() {
    hide();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(show, IDLE_MS);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(evt => {
    window.addEventListener(evt, resetTimer, { passive: true });
  });
  screen.addEventListener('click', hide);

  resetTimer();
})();

/* ── Tool sphere: 3D rotating group ── */
(function () {
  const stage = document.querySelector('.tools-stage');
  const chips = Array.from(document.querySelectorAll('.tool-chip'));
  if (!stage || !chips.length) return;

  // ── Config ──────────────────────────────
  const AUTO_ROT_Y   = 0.004;   // radians/frame idle spin
  const DRAG_SENS    = 0.007;   // drag → rotation rate
  const INERTIA      = 0.93;    // velocity decay after release
  const HOVER_SCALE  = 1.45;    // hovered logo scale
  const PUSH_RADIUS  = 160;     // screen-px push radius around hovered logo
  const PUSH_STR     = 55;      // max push displacement in px
  const SPRING_K     = 0.10;    // spring stiffness for push displacement
  const SPRING_D     = 0.75;    // spring damping

  // ── State ────────────────────────────────
  let W, H, R;
  let rotX = -0.25, rotY = 0;
  let velX = 0, velY = 0;
  let isDragging = false, lastMX = 0, lastMY = 0;
  let mouseStageX = -9999, mouseStageY = -9999;
  let hoveredIdx = -1;

  // Fibonacci sphere — evenly distributes N points on a unit sphere
  function fibSphere(n) {
    const pts = [], phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    return pts;
  }

  const base = fibSphere(chips.length);

  // Per-particle: screen-space push displacement, springs toward target
  const particles = chips.map((el, i) => ({
    el,
    base: base[i],   // [x,y,z] on unit sphere
    // projected screen centre this frame
    sx: 0, sy: 0, sz: 0,
    // hover push spring state
    dspX: 0, dspY: 0,
    vspX: 0, vspY: 0,
  }));

  function resize() {
    W = stage.offsetWidth;
    H = stage.offsetHeight;
    R = Math.min(W, H) * 0.36;  // sphere radius
  }

  // Rotate point [px,py,pz] by rotX (pitch) then rotY (yaw)
  function rotPt([px, py, pz]) {
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    let x1 =  px * cy + pz * sy;
    let z1 = -px * sy + pz * cy;
    const cx = Math.cos(rotX), sx2 = Math.sin(rotX);
    let y2 =  py * cx - z1 * sx2;
    let z2 =  py * sx2 + z1 * cx;
    return [x1, y2, z2];
  }

  function tick() {
    // Auto-rotate when not dragging, apply inertia after drag
    if (!isDragging) {
      rotY += AUTO_ROT_Y + velY;
      rotX += velX;
      velX *= INERTIA;
      velY *= INERTIA;
    }

    // Project all particles
    const CS = window.innerWidth < 768 ? 54 : 72;
    particles.forEach(p => {
      const [x, y, z] = rotPt(p.base);
      p.sx = W / 2 + x * R;
      p.sy = H / 2 + y * R;
      p.sz = z; // -1 (back) to +1 (front)
    });

    // Hit-test for hover (front-most particle within radius)
    hoveredIdx = -1;
    let bestZ = -Infinity;
    particles.forEach((p, i) => {
      const dx = mouseStageX - p.sx, dy = mouseStageY - p.sy;
      if (Math.hypot(dx, dy) < CS * 0.6 && p.sz > bestZ) {
        hoveredIdx = i;
        bestZ = p.sz;
      }
    });

    // Compute push target displacements for hover effect
    particles.forEach((p, i) => {
      let tx = 0, ty = 0;
      if (hoveredIdx >= 0 && i !== hoveredIdx) {
        const h = particles[hoveredIdx];
        const dx = p.sx - h.sx, dy = p.sy - h.sy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < PUSH_RADIUS) {
          const str = (1 - dist / PUSH_RADIUS) * PUSH_STR;
          tx = dx / dist * str;
          ty = dy / dist * str;
        }
      }
      // Spring toward target displacement
      const fx = (tx - p.dspX) * SPRING_K;
      const fy = (ty - p.dspY) * SPRING_K;
      p.vspX = p.vspX * SPRING_D + fx;
      p.vspY = p.vspY * SPRING_D + fy;
      p.dspX += p.vspX;
      p.dspY += p.vspY;
    });

    // Sort back-to-front, then render
    const order = particles.slice().sort((a, b) => a.sz - b.sz);
    order.forEach((p, renderOrder) => {
      const depth  = (p.sz + 1) / 2;                         // 0=back, 1=front
      const scale  = 0.42 + depth * 0.58;                    // 0.42–1.0
      const op     = 0.22 + depth * 0.78;                    // 0.22–1.0
      const isHov  = particles.indexOf(p) === hoveredIdx;
      const chipSc = isHov ? scale * HOVER_SCALE : scale;

      const finalX = p.sx + p.dspX - CS / 2;
      const finalY = p.sy + p.dspY - CS / 2;

      p.el.style.transform = `translate(${finalX}px,${finalY}px) scale(${chipSc})`;
      p.el.style.opacity   = String(Math.min(1, op));
      p.el.style.zIndex    = String(renderOrder);

      const label = p.el.querySelector('.tool-name');
      if (label) label.style.opacity = isHov ? '1' : '0';
    });

    requestAnimationFrame(tick);
  }

  // ── Mouse hover (no drag) ─────────────────
  stage.addEventListener('mousemove', e => {
    if (isDragging) return;
    const r = stage.getBoundingClientRect();
    mouseStageX = e.clientX - r.left;
    mouseStageY = e.clientY - r.top;
  });
  stage.addEventListener('mouseleave', () => {
    mouseStageX = -9999; mouseStageY = -9999; hoveredIdx = -1;
  });

  // ── Mouse drag → rotate ───────────────────
  stage.addEventListener('mousedown', e => {
    isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    velX = 0; velY = 0;
    mouseStageX = -9999; hoveredIdx = -1; // suppress hover while dragging
    stage.classList.add('is-dragging');
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastMX, dy = e.clientY - lastMY;
    velY = dx * DRAG_SENS;
    velX = dy * DRAG_SENS;
    rotY += velY; rotX += velX;
    lastMX = e.clientX; lastMY = e.clientY;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
  });

  // ── Touch drag → rotate ───────────────────
  let lastTX = 0, lastTY = 0, touchVX = 0, touchVY = 0;
  stage.addEventListener('touchstart', e => {
    const t = e.touches[0];
    lastTX = t.clientX; lastTY = t.clientY;
    touchVX = 0; touchVY = 0; velX = 0; velY = 0;
  }, { passive: true });
  stage.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - lastTX, dy = t.clientY - lastTY;
    touchVY = dx * DRAG_SENS; touchVX = dy * DRAG_SENS;
    rotY += touchVY; rotX += touchVX;
    lastTX = t.clientX; lastTY = t.clientY;
  }, { passive: false });
  stage.addEventListener('touchend', () => {
    velX = touchVX; velY = touchVY; // release with inertia
  });

  window.addEventListener('resize', resize);
  chips.forEach(c => { c.style.left = '0'; c.style.top = '0'; });
  resize();
  tick();
})();

/* ── Footer logo particle effect ── */
(function () {
  const canvas = document.querySelector('.footer-logo-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const ASPECT = 176.772 / 874.84;

  const SPRING_K    = 0.09;
  const DAMPING     = 0.72;
  const SCATTER_MIN = 50;
  const SCATTER_MAX = 160;
  const P_RADIUS    = 1.1;
  const SAMPLE_STEP = 2;
  const HOVER_R     = 80;   // px radius around cursor that activates particles

  let particles = [];
  let canvasW, canvasH;
  let rafId    = null;
  let logoImg  = null;
  let mouseX   = -9999, mouseY = -9999;
  let active   = false;   // true while mouse is over canvas or particles still moving

  function sizeCanvas() {
    canvasW = canvas.parentElement.offsetWidth;
    canvasH = Math.round(canvasW * ASPECT);
    canvas.width  = canvasW;
    canvas.height = canvasH;
  }

  function buildParticles() {
    const sW  = Math.min(canvasW, 900);
    const sH  = Math.round(sW * ASPECT);
    const off = document.createElement('canvas');
    off.width = sW; off.height = sH;
    const octx = off.getContext('2d');
    octx.drawImage(logoImg, 0, 0, sW, sH);
    const px  = octx.getImageData(0, 0, sW, sH).data;
    const scX = canvasW / sW, scY = canvasH / sH;

    particles = [];
    for (let y = 0; y < sH; y += SAMPLE_STEP) {
      for (let x = 0; x < sW; x += SAMPLE_STEP) {
        if (px[(y * sW + x) * 4 + 3] < 80) continue;
        particles.push({
          hx: x * scX, hy: y * scY,
          x:  x * scX, y:  y * scY,
          vx: 0, vy: 0,
          rf: Math.random(), // random factor for scatter distance, stable per particle
        });
      }
    }
  }

  function tick() {
    let anyDisplaced = false;

    particles.forEach(p => {
      // Is this particle's home within cursor radius?
      const dx   = p.hx - mouseX, dy = p.hy - mouseY;
      const dist = Math.hypot(dx, dy);
      let tx, ty;
      if (dist < HOVER_R && mouseX > -999) {
        // scatter away from cursor
        const angle = Math.atan2(dy, dx) + (p.rf - 0.5) * 1.2;
        const sd    = SCATTER_MIN + p.rf * (SCATTER_MAX - SCATTER_MIN);
        tx = p.hx + Math.cos(angle) * sd;
        ty = p.hy + Math.sin(angle) * sd;
      } else {
        tx = p.hx; ty = p.hy;
      }

      p.vx = p.vx * DAMPING + (tx - p.x) * SPRING_K;
      p.vy = p.vy * DAMPING + (ty - p.y) * SPRING_K;
      p.x += p.vx; p.y += p.vy;

      if (Math.abs(p.x - p.hx) > 0.8 || Math.abs(p.y - p.hy) > 0.8) anyDisplaced = true;
    });

    // 1. Draw solid logo base
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(logoImg, 0, 0, canvasW, canvasH);

    // 2. Punch holes at home positions of displaced particles
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    particles.forEach(p => {
      if (Math.abs(p.x - p.hx) < 0.8 && Math.abs(p.y - p.hy) < 0.8) return;
      ctx.beginPath();
      ctx.arc(p.hx, p.hy, P_RADIUS + 0.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Draw particle dots at current positions
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    particles.forEach(p => {
      if (Math.abs(p.x - p.hx) < 0.8 && Math.abs(p.y - p.hy) < 0.8) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, P_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    });

    // Keep ticking while cursor is over canvas or particles are still moving
    if (active || anyDisplaced) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      // Fully settled — redraw clean solid image
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(logoImg, 0, 0, canvasW, canvasH);
    }
  }

  function startTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    // Scale from CSS px to canvas px
    mouseX = (e.clientX - r.left) * (canvasW / r.width);
    mouseY = (e.clientY - r.top)  * (canvasH / r.height);
    active = true;
    startTick();
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -9999; mouseY = -9999;
    active = false;
    startTick(); // let particles return home
  });

  function init() {
    sizeCanvas();
    if (!logoImg) {
      const img = new Image();
      img.src = 'images/finrez-logo-light.svg';
      img.onload = () => {
        logoImg = img;
        buildParticles();
        ctx.drawImage(logoImg, 0, 0, canvasW, canvasH);
      };
    } else {
      buildParticles();
      ctx.drawImage(logoImg, 0, 0, canvasW, canvasH);
    }
  }

  window.addEventListener('resize', () => {
    sizeCanvas();
    if (logoImg) { buildParticles(); ctx.drawImage(logoImg, 0, 0, canvasW, canvasH); }
  });

  init();
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
