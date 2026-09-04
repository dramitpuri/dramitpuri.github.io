/* =====================================================================
   Dr. Amit Puri Foundation — main.js
   Interactive Mission Waveform Simulator · Particle Constellation · Typewriter · Scroll Reveal
   Responsive & Touch-Optimized
   ===================================================================== */

(function () {
  'use strict';

  /* ─── 1. Navbar Scroll Behavior & Active Links ────────────────────── */
  const navbar = document.getElementById('fd-navbar');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.fd-navbar__link[href^="#"]');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              const href = a.getAttribute('href');
              if (href === '#' + id) {
                a.classList.add('active');
              } else if (href && href.startsWith('#')) {
                a.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ─── 2. Mobile Nav Hamburger & Touch Overlay ────────────────────── */
  const hamburger = document.getElementById('fd-hamburger');
  const navLinks = document.getElementById('fd-nav-links');
  const navBackdrop = document.getElementById('fd-navbar-backdrop');

  if (hamburger && navLinks) {
    function closeNav() {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (navBackdrop) navBackdrop.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      if (navBackdrop) {
        if (isOpen) navBackdrop.classList.add('is-visible');
        else navBackdrop.classList.remove('is-visible');
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeNav);
    }

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('is-open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        closeNav();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080 && navLinks.classList.contains('is-open')) {
        closeNav();
      }
    }, { passive: true });
  }

  /* ─── 3. Dynamic Typewriter ──────────────────────────────────────── */
  const typeEl = document.getElementById('fd-typewriter');
  if (typeEl) {
    const words = [
      'Human Ingenuity',
      'Arts & Creative Expression',
      'Healthcare AI & Medicine',
      'Education Transformation',
      'Physical AI & Robotics',
      'Human-AI Collaboration',
      'Ethical Reasoning',
      'Cognitive Resilience'
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 70;
    const DEL_SPEED = 35;
    const HOLD_TIME = 2000;

    function runTypewriter() {
      const currentWord = words[wordIdx];

      if (isDeleting) {
        typeEl.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typeEl.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? DEL_SPEED : TYPE_SPEED;

      if (!isDeleting && charIdx === currentWord.length) {
        speed = HOLD_TIME;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 400;
      }

      setTimeout(runTypewriter, speed);
    }

    setTimeout(runTypewriter, 600);
  }

  /* ─── 4. Interactive Signal vs Amplifier Waveform Simulator ─────── */
  const waveCanvas = document.getElementById('fd-wave-canvas');
  const btnScenarioStrong = document.getElementById('btn-scenario-strong');
  const btnScenarioWeak = document.getElementById('btn-scenario-weak');
  const hudHuman = document.getElementById('hud-human-signal');
  const hudAi = document.getElementById('hud-ai-amplification');
  const explanationEl = document.getElementById('fd-signal-explanation');
  const statusBadge = document.getElementById('fd-signal-status-badge');

  let currentScenario = 'strong'; // 'strong' | 'weak'
  let waveTime = 0;

  if (waveCanvas) {
    const waveCtx = waveCanvas.getContext('2d');

    function resizeWaveCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = waveCanvas.getBoundingClientRect();
      const displayWidth = rect.width || 360;
      const displayHeight = rect.height || 140;

      waveCanvas.width = displayWidth * dpr;
      waveCanvas.height = displayHeight * dpr;
      waveCtx.resetTransform ? waveCtx.resetTransform() : waveCtx.setTransform(1, 0, 0, 1, 0, 0);
      waveCtx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeWaveCanvas, { passive: true });
    window.addEventListener('orientationchange', resizeWaveCanvas, { passive: true });
    if ('ResizeObserver' in window && waveCanvas.parentElement) {
      const ro = new ResizeObserver(() => resizeWaveCanvas());
      ro.observe(waveCanvas.parentElement);
    }
    resizeWaveCanvas();

    function drawWaveform() {
      const rect = waveCanvas.getBoundingClientRect();
      const w = rect.width || 360;
      const h = rect.height || 140;
      const midY = h / 2;

      waveCtx.clearRect(0, 0, w, h);

      // Grid Lines
      waveCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      waveCtx.lineWidth = 1;
      for (let x = 0; x < w; x += 36) {
        waveCtx.beginPath();
        waveCtx.moveTo(x, 0);
        waveCtx.lineTo(x, h);
        waveCtx.stroke();
      }
      waveCtx.beginPath();
      waveCtx.moveTo(0, midY);
      waveCtx.lineTo(w, midY);
      waveCtx.stroke();

      if (currentScenario === 'strong') {
        // Human Signal Wave (Gold)
        waveCtx.beginPath();
        waveCtx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
        waveCtx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = midY + Math.sin(x * 0.035 + waveTime) * 16 + Math.cos(x * 0.018 - waveTime * 0.5) * 8;
          if (x === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();

        // AI Carrier Multiplier (Violet)
        waveCtx.beginPath();
        waveCtx.strokeStyle = 'rgba(139, 92, 246, 0.55)';
        waveCtx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = midY + Math.sin(x * 0.07 - waveTime * 1.5) * 20;
          if (x === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();

        // High-Coherence Superposed Resonance (Cyan)
        waveCtx.beginPath();
        waveCtx.strokeStyle = '#22d3ee';
        waveCtx.lineWidth = 2.5;
        waveCtx.shadowColor = '#06b6d4';
        waveCtx.shadowBlur = 10;
        for (let x = 0; x < w; x++) {
          const humanPart = Math.sin(x * 0.035 + waveTime) * 22 + Math.cos(x * 0.018 - waveTime * 0.5) * 10;
          const aiPart = Math.sin(x * 0.07 - waveTime * 1.5) * 15;
          const y = midY + humanPart + aiPart;
          if (x === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();
        waveCtx.shadowBlur = 0;

      } else {
        // Flat/Atrophy Human Signal (Gold Faint)
        waveCtx.beginPath();
        waveCtx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        waveCtx.lineWidth = 1;
        for (let x = 0; x < w; x++) {
          const y = midY + (Math.random() - 0.5) * 4;
          if (x === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();

        // Erratic Hallucination Spikes (Rose)
        waveCtx.beginPath();
        waveCtx.strokeStyle = '#f43f5e';
        waveCtx.lineWidth = 2;
        waveCtx.shadowColor = '#f43f5e';
        waveCtx.shadowBlur = 8;
        for (let x = 0; x < w; x++) {
          const spike = (Math.sin(x * 0.12 + waveTime * 3) > 0.72) ? (Math.random() - 0.5) * 50 : (Math.random() - 0.5) * 12;
          const y = midY + spike;
          if (x === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();
        waveCtx.shadowBlur = 0;
      }

      waveTime += 0.04;
    }

    let isWaveVisible = true;
    let waveAnimId = null;

    function loopWaveform() {
      if (!isWaveVisible) {
        waveAnimId = null;
        return;
      }
      drawWaveform();
      waveAnimId = requestAnimationFrame(loopWaveform);
    }

    if ('IntersectionObserver' in window) {
      const waveObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isWaveVisible = entry.isIntersecting;
          if (isWaveVisible && !waveAnimId) {
            loopWaveform();
          }
        });
      }, { threshold: 0.05 });
      waveObserver.observe(waveCanvas);
    } else {
      loopWaveform();
    }

    function setScenario(type) {
      currentScenario = type;
      if (type === 'strong') {
        btnScenarioStrong.classList.add('is-active');
        btnScenarioStrong.setAttribute('aria-selected', 'true');
        btnScenarioWeak.classList.remove('is-active');
        btnScenarioWeak.setAttribute('aria-selected', 'false');

        if (hudHuman) {
          hudHuman.textContent = 'Active (Deep Reasoning)';
          hudHuman.style.color = 'var(--fd-gold-light)';
        }
        if (hudAi) {
          hudAi.textContent = 'Disciplined 4.5x';
          hudAi.style.color = 'var(--fd-cyan-light)';
        }
        if (statusBadge) {
          statusBadge.textContent = 'High Coherence';
          statusBadge.style.color = 'var(--fd-emerald)';
          statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        }
        if (explanationEl) {
          explanationEl.innerHTML = '<strong>Breakthrough Resonance:</strong> Human provides rigorous critical thinking, discernment, and ethical direction; AI multiplies execution speed and exploratory depth without eroding cognitive rep.';
        }
      } else {
        btnScenarioWeak.classList.add('is-active');
        btnScenarioWeak.setAttribute('aria-selected', 'true');
        btnScenarioStrong.classList.remove('is-active');
        btnScenarioStrong.setAttribute('aria-selected', 'false');

        if (hudHuman) {
          hudHuman.textContent = 'Atrophied (Skipping Reps)';
          hudHuman.style.color = '#f87171';
        }
        if (hudAi) {
          hudAi.textContent = 'Ungrounded 8.0x';
          hudAi.style.color = 'var(--fd-rose)';
        }
        if (statusBadge) {
          statusBadge.textContent = 'Hallucination & Drift';
          statusBadge.style.color = 'var(--fd-rose)';
          statusBadge.style.borderColor = 'rgba(244, 63, 94, 0.3)';
          statusBadge.style.background = 'rgba(244, 63, 94, 0.15)';
        }
        if (explanationEl) {
          explanationEl.innerHTML = '<strong>The Swap Trap:</strong> Handing advanced work to AI before foundational human skills are solidified results in fluent-sounding, superficial output attached to a person who cannot defend, extend, or explain it.';
        }
      }
    }

    if (btnScenarioStrong && btnScenarioWeak) {
      btnScenarioStrong.addEventListener('click', () => setScenario('strong'));
      btnScenarioWeak.addEventListener('click', () => setScenario('weak'));
    }
  }

  /* ─── 5. Constellation & Particle Background Canvas (Power-Optimized) ─ */
  const bgCanvas = document.getElementById('fd-particle-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;

    function resizeBackground() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeBackground);
    resizeBackground();

    const particles = [];
    const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 30), 40);
    const MAX_DISTANCE = 110;

    const palette = [
      'rgba(245, 158, 11,',  // Gold
      'rgba(139, 92, 246,',  // Violet
      'rgba(6, 182, 212,',   // Cyan
      'rgba(255, 255, 255,'  // White
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.6;
        this.colorBase = palette[Math.floor(Math.random() * palette.length)];
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.alpha + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      // Draw static ambient particles once — zero continuous CPU/battery drain
      particles.forEach((p) => p.draw());
    } else {
      let isBgVisible = true;
      let bgAnimId = null;

      function animateParticles() {
        if (!isBgVisible) {
          bgAnimId = null;
          return;
        }
        ctx.clearRect(0, 0, width, height);

        // Connection lines
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_DISTANCE) {
              const lineAlpha = (1 - dist / MAX_DISTANCE) * 0.12;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
              ctx.lineWidth = 0.65;
              ctx.stroke();
            }
          }
        }

        // Update & Draw particles
        particles.forEach((p) => {
          p.update();
          p.draw();
        });

        bgAnimId = requestAnimationFrame(animateParticles);
      }

      if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isBgVisible = entry.isIntersecting;
            if (isBgVisible && !bgAnimId) {
              animateParticles();
            }
          });
        }, { threshold: 0.05 });
        bgObserver.observe(bgCanvas);
      } else {
        animateParticles();
      }
    }
  }

  /* ─── 6. Intersection Observer Scroll Reveal ─────────────────────── */
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const isMobile = window.innerWidth <= 768;
            const rawDelay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
            const delay = isMobile ? Math.min(rawDelay, 60) : rawDelay;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 80px 0px' }
    );

    animatedElements.forEach((el) => revealObserver.observe(el));
  }

  /* ─── 7. Repeated-Item Filtering & Instant Search (Clean Website Prompt) ─ */

  // 7a. Pillars Filter Tabs
  const pillarFilters = document.querySelectorAll('.fd-filter-bar [data-filter]');
  const pillarCards = document.querySelectorAll('#fd-pillars-grid .fd-uniform-card');
  if (pillarFilters.length && pillarCards.length) {
    pillarFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        pillarFilters.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        pillarCards.forEach((card) => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 7b. Research Filter Tabs & Instant Text Search
  const researchFilters = document.querySelectorAll('[data-research-filter]');
  const searchInput = document.getElementById('research-search-input');
  const searchClear = document.getElementById('research-search-clear');
  const researchCards = document.querySelectorAll('#fd-research-grid .fd-uniform-card');

  let activeResearchFilter = 'all';
  let currentSearchQuery = '';

  function applyResearchFiltering() {
    researchCards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const text = (card.getAttribute('data-search-text') || '').toLowerCase();
      const matchesCat = (activeResearchFilter === 'all' || cat === activeResearchFilter);
      const matchesSearch = !currentSearchQuery || text.includes(currentSearchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (researchFilters.length && researchCards.length) {
    researchFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeResearchFilter = btn.getAttribute('data-research-filter');
        researchFilters.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        applyResearchFiltering();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = currentSearchQuery ? 'flex' : 'none';
      }
      applyResearchFiltering();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      searchClear.style.display = 'none';
      applyResearchFiltering();
      searchInput.focus();
    });
  }

  // 7c. Affiliated Ecosystem Filter Tabs
  const ecoFilters = document.querySelectorAll('[data-ecosystem-filter]');
  const ecoCards = document.querySelectorAll('#fd-ecosystem-grid .fd-uniform-card');
  if (ecoFilters.length && ecoCards.length) {
    ecoFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-ecosystem-filter');
        ecoFilters.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        ecoCards.forEach((card) => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 7d. Backward-compatible Legacy Stage Deck (if present on subpages)
  const dockButtons = document.querySelectorAll('.fd-dock-btn');
  const stagePanels = document.querySelectorAll('.fd-stage-panel');
  if (dockButtons.length && stagePanels.length) {
    dockButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        dockButtons.forEach((b, i) => b.classList.toggle('is-active', i === idx));
        stagePanels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      });
    });
  }

})();

