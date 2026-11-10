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
      // Homepage: reveal the wordmark and nav once the visitor starts scrolling
      // (stays revealed while the mobile menu is open)
      if (header.hasAttribute('data-reveal-on-scroll')) {
        const menuOpen = document.getElementById('navLinks')?.classList.contains('open');
        header.classList.toggle('is-revealed', window.scrollY > 10 || !!menuOpen);
      }
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
        }, 420);
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

  /* ── Smooth reveal on scroll (Intersection Observer) ── */
  const revealTargets = document.querySelectorAll(
    '.testi-card, .pc, .faq-item'
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
    let litCount = 0;

    const revealWords = () => {
      const rect     = missionSection.getBoundingClientRect();
      const vh       = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh * 0.4)));
      const count    = Math.round(progress * wordSpans.length);
      if (count === litCount) return;
      const lo = Math.min(count, litCount), hi = Math.max(count, litCount);
      for (let i = lo; i < hi; i++) wordSpans[i].classList.toggle('mission-word--lit', i < count);
      litCount = count;
    };

    window.addEventListener('scroll', revealWords, { passive: true });
    revealWords();
  }

  /* ── Hero entrance: drop the animation once it lands ── */
  /* fill-mode:both keeps the animation applied forever, which leaves
     filter: blur(0px) on the element and softens the text. Removing the
     animation on completion restores unfiltered rendering. */
  /* Not { once: true } — .hero-title contains the cycling word, whose own
     animationend bubbles up and would consume a one-shot listener before the
     title's own animation ever finishes. */
  document.querySelectorAll('.hero-title, .hero-btns')
    .forEach(el => {
      const done = (e) => {
        if (e.target !== el) return;
        el.classList.add('hero-anim-done');
        el.removeEventListener('animationend', done);
      };
      el.addEventListener('animationend', done);
    });

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

  let CS = 72;                  // chip size, px (read once per resize, not per frame)
  function resize() {
    W = stage.offsetWidth;
    H = stage.offsetHeight;
    R = Math.min(W, H) * 0.36;  // sphere radius
    CS = window.innerWidth < 768 ? 54 : 72;
  }

  /* Only animate while the sphere is on screen and the tab is visible —
     it otherwise restyles every chip on every frame for nothing. */
  let onScreen = false, raf = 0;
  const run = () => { if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(tick); };

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

    raf = 0;
    // Project all particles
    particles.forEach(p => {
      const [x, y, z] = rotPt(p.base);
      p.sx = W / 2 + x * R;
      p.sy = H / 2 + y * R;
      p.sz = z; // -1 (back) to +1 (front)
    });

    // Sort back-to-front, then render
    const order = particles.slice().sort((a, b) => a.sz - b.sz);
    order.forEach((p, renderOrder) => {
      const depth  = (p.sz + 1) / 2;                         // 0=back, 1=front
      const scale  = 0.42 + depth * 0.58;                    // 0.42–1.0
      const op     = 0.22 + depth * 0.78;                    // 0.22–1.0

      const finalX = p.sx - CS / 2;
      const finalY = p.sy - CS / 2;

      p.el.style.transform = `translate(${finalX}px,${finalY}px) scale(${scale})`;
      p.el.style.opacity   = String(Math.min(1, op));
      p.el.style.zIndex    = String(renderOrder);
    });

    if (onScreen && !document.hidden) raf = requestAnimationFrame(tick);
  }

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
  tick();                       // place the chips once, even before it scrolls into view
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }, { rootMargin: '100px 0px' }).observe(stage);
  } else { onScreen = true; run(); }
  document.addEventListener('visibilitychange', run);
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

/* ── Hero image field ──
   The camera sits at the center of a sphere, looking out. Project imagery is
   laid on the inside wall in latitude rings, and the view drifts, follows the
   cursor and can be dragged. The field is clipped to the page container.
   Every frame links to its case study (label on hover, drift slows to let you
   click).

   .globe has CSS perspective P and .globe-world is
   translateZ(P) rotateX(pitch) rotateY(yaw), which puts the eye at the world
   origin; the same rotation chain is mirrored in JS to fade cards as they swing
   toward the edge of view. */
(function () {
  const globe = document.querySelector('.hero .globe');
  if (!globe) return;
  const world  = globe.querySelector('.globe-world');
  const hero   = globe.closest('.hero');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery  = window.matchMedia('(max-width: 809px)');
  const DEG = Math.PI / 180;

  /* Project imagery — every 480w case-study frame on the site, tagged by the
     discipline it shows. The tags set each frame's hover label (product /
     website / brand) and are kept for filtering the field by discipline. */
  const PROJECTS = {
    'spectra':        { name: 'Spectra',        n: 12, tags: { brand: [1, 2, 3, 5, 6, 7, 8], website: [9, 10, 11], product: [4, 12], ai: [1, 4, 8, 9, 10, 11, 12] } },
    'minded':         { name: 'MiNDED',         n: 10, tags: { brand: [2, 3, 5, 6, 8, 9], website: [1, 10], product: [4, 7] } },
    'lightspeed':     { name: 'Lightspeed',     n: 10, tags: { brand: [1, 2, 4, 6, 7, 8, 10], website: [5], product: [3, 9] } },
    'vesperia-films': { name: 'Vesperia Films', n: 10, tags: { brand: [2, 3, 4, 5, 6, 8, 9, 10], website: [1, 7] } },
    'rockbridge':     { name: 'RockBridge',     n: 10, tags: { brand: [1, 2, 4, 6, 7, 9, 10], website: [3, 5, 8] } },
    'mudturtles':     { name: 'Union County Rugby Mudturtles', n: 10, tags: { brand: [1, 3, 4], website: [2, 5, 6, 7], product: [8, 9, 10] } },
  };
  const LABELS = { product: 'Product design', website: 'Website', brand: 'Brand identity' };
  const IMAGES = [];
  Object.keys(PROJECTS).forEach(slug => {
    const p = PROJECTS[slug];
    for (let i = 1; i <= p.n; i++) {
      const tags = Object.keys(p.tags).filter(t => p.tags[t].includes(i));
      const kind = ['product', 'website', 'brand'].find(t => tags.includes(t)) || 'brand';
      IMAGES.push({ base: `images/${slug}-${i}`, href: `/${slug}`, name: p.name, label: LABELS[kind], tags });
    }
  });

  /* Seeded PRNG so the arrangement is stable between visits */
  let seed = 7;
  const rand = () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* Fresh image order on every load (Fisher–Yates). The ring layout itself
     stays seeded, so only which image lands where changes. */
  const shuffled = IMAGES.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[r]] = [shuffled[r], shuffled[i]];
  }

  let W = 0, H = 0, P = 600, R = 600;
  let cards = [];   // { el, lat, lon, latDeg, lonDeg, tags, opacity, hover }

  let hovering = 0;
  const HOVER_PULL = 0.86;   // a hovered frame comes 14% closer to the viewer

  function applyCard(c) {
    const r = R * (c.hover ? HOVER_PULL : 1);
    c.r = r;
    c.el.classList.toggle('is-hover', c.hover);
    c.el.style.transform = `rotateY(${c.lonDeg}deg) rotateX(${c.latDeg}deg) translateZ(${-r}px)`;
  }
  /* ── Picking ──
     Browsers hit-test 3D-transformed elements unreliably (the camera sits
     exactly at the perspective point), so we find the frame under the pointer
     ourselves: project each frame's corners with the same rotation chain the
     CSS uses and test the point against the resulting quad. */
  let hoverCard = null, pointer = null, curYaw = 0, curPitch = 0;
  const inQuad = (x, y, q) => {
    let sign = 0;
    for (let i = 0; i < 4; i++) {
      const [ax, ay] = q[i], [bx, by] = q[(i + 1) % 4];
      const cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
      if (cross !== 0) {
        if (sign === 0) sign = Math.sign(cross);
        else if (Math.sign(cross) !== sign) return false;
      }
    }
    return true;
  };
  function pick(clientX, clientY) {
    const rect = globe.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    let best = null, bestFacing = -1;
    for (const c of cards) {
      if (c.opacity < 0.5) continue;
      const quad = [];
      let ok = true;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        let v = [sx * c.w / 2, sy * c.h / 2, -c.r];
        v = rotX(rotY(rotY(rotX(v, c.lat), c.lon), curYaw), curPitch);
        if (v[2] > -1) { ok = false; break; }
        quad.push([cx + v[0] * P / -v[2], cy + v[1] * P / -v[2]]);
      }
      if (!ok || !inQuad(clientX, clientY, quad)) continue;
      const facing = -place(c.lat, c.lon, curYaw, curPitch, 1)[2];
      if (facing > bestFacing) { bestFacing = facing; best = c; }
    }
    return best;
  }
  function setHover(c) {
    if (c === hoverCard) return;
    if (hoverCard) { hoverCard.hover = false; applyCard(hoverCard); }
    hoverCard = c;
    hovering = c ? 1 : 0;
    if (c) { c.hover = true; applyCard(c); }
    globe.classList.toggle('is-pointing', !!c);
  }


  /* Rotation helpers, CSS conventions (y points down) */
  const rotX = (v, a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  };
  const rotY = (v, a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  };
  /* Same chain as the CSS: card rotateY(lon) rotateX(lat) translateZ(−r),
     then world rotateX(pitch) rotateY(yaw) */
  const place = (lat, lon, yaw, pitch, r) =>
    rotX(rotY(rotY(rotX([0, 0, -r], lat), lon), yaw), pitch);

  function layout() {
    W = globe.clientWidth;
    H = globe.clientHeight;

    const mobile = mobileQuery.matches;
    // Wide, slightly fisheye field of view: edge cards stretch as they curve past you
    P = mobile ? Math.max(W * 0.62, H * 0.36) : Math.min(W * 0.55, H * 0.62);
    P = Math.max(P, 260);
    R = P;
    globe.style.perspective = P + 'px';

    const rings = mobile
      ? [{ lat: 0, n: 9 }, { lat: -26, n: 8 }, { lat: 26, n: 8 }, { lat: -50, n: 6 }, { lat: 50, n: 6 }]
      : [{ lat: 0, n: 11 }, { lat: -22, n: 10 }, { lat: 22, n: 10 }, { lat: -42, n: 8 }, { lat: 42, n: 8 }];
    const span = (mobile ? 28 : 22) * DEG;            // card angular width

    world.textContent = '';
    cards = [];
    hovering = 0;
    hoverCard = null;
    seed = 7;
    let k = 0;
    rings.forEach((ring, ri) => {
      const offset = (ri % 2) * 0.5;                   // stagger alternate rings
      for (let i = 0; i < ring.n; i++) {
        const lon = ((i + offset) / ring.n) * 360 + (rand() - 0.5) * 8;
        const lat = ring.lat + (rand() - 0.5) * 6;
        const scale = 0.86 + rand() * 0.28;
        const w = 2 * R * Math.tan(span / 2) * scale;
        const h = w * 9 / 16;

        const item = shuffled[k++ % shuffled.length];

        // Each frame links to its case study; the whole field is decorative to
        // screen readers (the Work section carries the same links), so frames
        // stay out of the tab order.
        const el = document.createElement('a');
        el.className = 'globe-card';
        el.href = item.href;
        el.tabIndex = -1;
        el.draggable = false;
        el.style.width  = w + 'px';
        el.style.height = h + 'px';
        el.style.margin = `${-h / 2}px 0 0 ${-w / 2}px`;

        // No src yet: render() fills it in the first time the frame turns to
        // face the viewer, so frames on the far side of the field don't
        // download until they come around.
        const img = document.createElement('img');
        img.alt = '';
        img.decoding = 'async';
        img.draggable = false;
        el.appendChild(img);

        // No visible hover label; the link still names its project for screen readers
        if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', `${item.name}: ${item.label}`);

        world.appendChild(el);
        const card = { el, img, base: item.base, loaded: false, href: item.href, w, h, r: R, lat: lat * DEG, lon: lon * DEG, latDeg: lat, lonDeg: lon, tags: item.tags, opacity: -1, hover: false };
        applyCard(card);
        cards.push(card);
      }
    });
  }

  /* ── Camera state ── */
  let yaw = -38, pitch = 0;          // degrees
  let spin = 34;                     // deg/s, eases down to DRIFT for the entrance
  const DRIFT = 2.4;
  let lookX = 0, lookY = 0, aimX = 0, aimY = 0;
  let scrollTilt = 0;
  let dragging = false, dragX = 0, dragY = 0, dragPitch = 0, lastMove = 0;
  let pendingYaw = 0;                // wheel pan, eased in over a few frames

  /* ── Scroll capture ──
     While the page sits at the very top, the hero holds on to scroll: wheel
     and trackpad scroll pan the field instead of moving the page. Downward
     scroll also builds "push", which decays quickly, so ordinary scrolling
     only pans; a hard, fast scroll (or a quick upward flick on touch) breaks
     through and glides down to the next section. The hero lifts slightly as
     push builds, so the resistance reads as something to push through. */
  const ESCAPE = 420;                // px of downward scroll, leaky (see PUSH_DECAY)
  const PUSH_DECAY = 0.5;            // s — a fast wheel spin or hard trackpad flick gets through
  let push = 0, escaping = false;
  const container = hero.querySelector('.hero-container');
  const nextSection = hero.nextElementSibling;
  const atTop = () => window.scrollY < 4;
  const captive = () => false;      // the hero no longer holds on to vertical scroll
  function escapeHero() {
    escaping = true;
    push = 0;
    applyPull();
    const top = nextSection
      ? nextSection.getBoundingClientRect().top + window.scrollY
      : hero.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => { escaping = false; syncCaptive(); }, 900);
  }
  let lastPull = 0;
  function applyPull() {
    const pull = Math.min(push / ESCAPE, 1);
    if (Math.abs(pull - lastPull) < 0.002) return;
    lastPull = pull;
    // eased so the first bit of push barely moves and the last bit resists
    const lift = (1 - Math.pow(1 - pull, 2)) * 28;
    container.style.transform = pull > 0.004 ? `translateY(${-lift.toFixed(1)}px)` : '';
  }
  function syncCaptive() {
    hero.classList.remove('is-captive');
  }

  function render() {
    const yawR = (yaw + lookX * 12) * DEG;
    const pitchR = (pitch + dragPitch - lookY * 7 + scrollTilt) * DEG;
    world.style.transform =
      `translateZ(${P}px) rotateX(${pitchR / DEG}deg) rotateY(${yawR / DEG}deg)`;
    curYaw = yawR; curPitch = pitchR;

    /* Fade cards as they swing toward the edge of the hemisphere */
    for (const c of cards) {
      const v = place(c.lat, c.lon, yawR, pitchR, 1);
      const facing = -v[2];
      let o = (facing - 0.12) / 0.3;
      o = o < 0 ? 0 : o > 1 ? 1 : o;
      if (o > 0 && !c.loaded) {
        c.loaded = true;
        // Perspective renders frames near the edges larger than their CSS width
        c.img.sizes = `${Math.round(c.w * 1.6)}px`;
        c.img.srcset = `${c.base}-240w.webp 240w, ${c.base}-480w.webp 480w`;
        c.img.src = `${c.base}-480w.webp`;
      }
      if (Math.abs(o - c.opacity) > 0.01) {
        c.opacity = o;
        c.el.style.opacity = o.toFixed(3);
        c.el.style.visibility = o === 0 ? 'hidden' : 'visible';
      }
    }
  }

  /* ── Loop ── */
  let running = false, visible = true, last = 0;
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;

    if (pendingYaw) {
      const step = pendingYaw * Math.min(1, dt * 9);
      yaw += step;
      pendingYaw = Math.abs(pendingYaw - step) < 0.01 ? 0 : pendingYaw - step;
    }
    if (push) {
      push *= Math.exp(-dt / PUSH_DECAY);
      if (push < 1) push = 0;
      applyPull();
    }
    if (!dragging) {
      const target = hovering ? DRIFT * 0.08 : DRIFT;   // near-stop while a frame is hovered
      spin += (target - spin) * Math.min(1, dt * 1.6);  // ease toward drift
      yaw += spin * dt;
      dragPitch *= Math.pow(0.1, dt);                    // settle back level
    }
    lookX += (aimX - lookX) * Math.min(1, dt * 3);
    lookY += (aimY - lookY) * Math.min(1, dt * 3);
    pitch = Math.sin(now / 9000) * 3;

    render();
    if (pointer && !dragging) setHover(pick(pointer.x, pointer.y));
    requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduceMotion.matches || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  /* ── Input ── */
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    // Ignore the pointer while it's over the copy, so frames behind the text don't light up
    const overCopy = e.target.closest && e.target.closest('.hero-copy a, .hero-title, .hero-hint');
    pointer = overCopy ? null : { x: e.clientX, y: e.clientY };
    if (!pointer) setHover(null);
    else if (!running && !dragging) setHover(pick(pointer.x, pointer.y));
    const r = hero.getBoundingClientRect();
    aimX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    aimY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  hero.addEventListener('pointerleave', () => { aimX = 0; aimY = 0; pointer = null; setHover(null); });

  // Drag to look around (horizontal on touch so vertical scroll still works).
  // A press only becomes a drag after it moves a few pixels, so a plain click
  // or tap on a frame opens its case study.
  let pressed = false, pressX = 0, pressY = 0, suppressClick = false;
  let touchCaptive = false, samples = [];
  globe.addEventListener('pointerdown', (e) => {
    if (reduceMotion.matches || e.button > 0) return;
    pressed = true;
    touchCaptive = e.pointerType === 'touch' && captive();
    samples = [[performance.now(), e.clientY]];
    pressX = dragX = e.clientX; pressY = dragY = e.clientY;
    lastMove = performance.now();
  });
  globe.addEventListener('pointermove', (e) => {
    if (pressed && !dragging) {
      if (Math.hypot(e.clientX - pressX, e.clientY - pressY) < 6) return;
      dragging = true;
      spin = 0;
      setHover(null);
      globe.classList.add('is-dragging');
      try { globe.setPointerCapture(e.pointerId); } catch (_) {}
    }
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - dragX, dy = e.clientY - dragY;
    const degPerPx = 57.3 / P;                 // 1 px ≈ 1 px of arc at the wall
    yaw -= dx * degPerPx;
    if (e.pointerType === 'mouse' || touchCaptive) {
      dragPitch = Math.max(-18, Math.min(18, dragPitch + dy * degPerPx));
    }
    if (touchCaptive) {
      samples.push([now, e.clientY]);
      while (samples.length > 2 && now - samples[0][0] > 120) samples.shift();
      push = Math.max(0, pressY - e.clientY) * 3;   // finger travelling up = scrolling down
      applyPull();
    }
    const dtm = Math.max(now - lastMove, 1) / 1000;
    spin = (-dx * degPerPx) / dtm;             // fling velocity
    spin = Math.max(-180, Math.min(180, spin));
    dragX = e.clientX; dragY = e.clientY; lastMove = now;
  });
  const endDrag = (e) => {
    pressed = false;
    if (touchCaptive && e && e.type === 'pointerup' && samples.length > 1) {
      // A quick upward flick (or a long upward drag) leaves the hero
      const [t0, y0] = samples[0];
      const v = (y0 - e.clientY) / Math.max(performance.now() - t0, 1);   // px/ms, up = +
      const travel = pressY - e.clientY;
      if ((v > 1.1 && travel > 70) || travel > H * 0.5) escapeHero();
    }
    touchCaptive = false;
    if (!escaping) { push = 0; applyPull(); }
    if (!dragging) return;
    dragging = false;
    suppressClick = true;                      // the click that ends a drag isn't a tap
    setTimeout(() => { suppressClick = false; }, 0);
    if (performance.now() - lastMove > 80) spin = 0;
    globe.classList.remove('is-dragging');
  };
  globe.addEventListener('pointerup', endDrag);
  globe.addEventListener('pointercancel', endDrag);
  globe.addEventListener('click', (e) => {
    e.preventDefault();
    if (suppressClick) return;
    const c = pick(e.clientX, e.clientY);
    if (!c) return;
    if (e.metaKey || e.ctrlKey) window.open(c.href, '_blank');
    else window.location.href = c.href;
  });
  globe.addEventListener('dragstart', (e) => e.preventDefault());

  /* Vertical scroll always moves the page (the field just turns a little
     with it); a sideways trackpad swipe over the hero pans the field. */
  hero.addEventListener('wheel', (e) => {
    if (e.ctrlKey || reduceMotion.matches) return;  // ctrl+wheel is pinch-zoom
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? (H || 800) : 1;
    const dx = e.deltaX * k, dy = e.deltaY * k;
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();                          // also stops swipe-to-go-back
      pendingYaw += dx * (57.3 / P) * 0.9;
    } else {
      pendingYaw += dy * (57.3 / P) * 0.25;        // page scrolls; field drifts along
    }
    start();
  }, { passive: false });

  // Look up slightly as the hero scrolls away, so the sphere lags the page,
  // and fade the caption out over the first ~third of the scroll. (The
  // wrapper fades, not .hero-copy, whose entrance animation owns opacity.)
  const heroText = hero.querySelector('.hero-content');
  let textFade = -1;
  const fadeText = () => {
    const f = Math.min(Math.max(window.scrollY / ((H || 800) * 0.32), 0), 1);
    if (Math.abs(f - textFade) < 0.005) return;
    textFade = f;
    if (!heroText) return;
    heroText.style.opacity = (1 - f).toFixed(3);
    heroText.style.transform = f ? `translateY(${(-f * 24).toFixed(1)}px)` : '';
    heroText.style.visibility = f >= 1 ? 'hidden' : '';
  };
  window.addEventListener('scroll', () => {
    syncCaptive();
    const p = Math.min(Math.max(window.scrollY / (H || 1), 0), 1);
    scrollTilt = p * 14;
    fadeText();
    if (!running) render();
  }, { passive: true });
  fadeText();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { layout(); render(); }, 120);
  });

  const init = () => {
    if (reduceMotion.matches) { yaw = 0; spin = 0; }
    layout();
    render();
    syncCaptive();
    requestAnimationFrame(() => globe.classList.add('is-ready'));
    start();
  };
  init();
})();

/* ── New Business stage: pointer glow, live month, pause drift off-screen ── */
(() => {
  const stage = document.querySelector('.nb-stage');
  if (!stage) return;
  const status = stage.querySelector('.nb-status-text');
  if (status) {
    const month = new Date().toLocaleString('en-US', { month: 'long' });
    status.textContent = `Now booking · ${month}`;
  }
  if (window.matchMedia('(hover: hover)').matches) {
    let raf = 0, x = 0, y = 0;
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 100;
      y = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        stage.style.setProperty('--mx', x.toFixed(1) + '%');
        stage.style.setProperty('--my', y.toFixed(1) + '%');
      });
    });
  }
  if ('IntersectionObserver' in window) {
    stage.classList.add('is-paused');
    new IntersectionObserver(([e]) => stage.classList.toggle('is-paused', !e.isIntersecting))
      .observe(stage);
  }
})();

