/* =====================================================
   HAPPY BIRTHDAY CELEBRATION — script.js v2
   DOB gate → home → memories → wishes
===================================================== */
const $ = id => document.getElementById(id);
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const palette = () => ['ruby', 'hot-pink', 'cherry', 'blush', 'silver', 'white'].map(n => cssVar('--color-' + n));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let siteStarted = false;

function startSite() {
  if (siteStarted) return;
  siteStarted = true;

  // Existing website animations
  initBackgroundDecor();
  initRevealOnScroll();
  initTyping();
  initLetterReveal();
  initFooterConfetti();

  // Opening celebration: confetti burst
  initConfettiBurstOnLoad();

  // Start falling hearts, rose petals and romantic particles
  if (!reduceMotion && typeof window.startRomanticRain === "function") {
    window.startRomanticRain();
  }

  // Birthday page entrance animation
  const main = document.getElementById("mainSite");

  if (main && !reduceMotion) {
    main.classList.remove("birthday-entrance");
    void main.offsetWidth;
    main.classList.add("birthday-entrance");

    const entranceItems = main.querySelectorAll(
      ".navbar, .hero, section, .page-divider, footer"
    );

    entranceItems.forEach((item, index) => {
      item.style.setProperty(
        "--entrance-delay",
        `${Math.min(index * 160, 1200)}ms`
      );
      item.classList.add("birthday-fall-in");
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initGallery();
  initWishesFilter();
  initGuestbook();
  initMusicToggle();
  initMemoriesMusic();
  if ($('dobOverlay')) initDobGate(startSite); else startSite();
});

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    spawnTrail(mx, my);
  });

  (function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .glass-card, .wish-card, .filter-btn, .thumb, .reel-open')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
}

function spawnTrail(x, y) {
  if (Math.random() > 0.35) return;
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = x + 'px'; dot.style.top = y + 'px';
  document.body.appendChild(dot);
  let life = 0;
  (function animate() {
    life++;
    dot.style.opacity = Math.max(0, 0.7 - life * 0.06);
    dot.style.transform = `translate(-50%,-50%) scale(${Math.max(0, 1 - life * 0.06)})`;
    if (life < 12) requestAnimationFrame(animate);
    else dot.remove();
  })();
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function initNavbar() {
  const nav    = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!nav) return;

  if (toggle) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });
}

/* ─────────────────────────────────────────────
   BACKGROUND DECOR
───────────────────────────────────────────── */
function initBackgroundDecor() {
  const decor = document.querySelector('.bg-decor');
  if (!decor) return;

  

  // Butterflies
  for (let i = 0; i < 4; i++) {
    const f = document.createElement('div');
    f.className = 'butterfly'; f.textContent = '🌸';
    f.style.top  = (10 + Math.random() * 70) + '%';
    f.style.left = Math.random() * 90 + '%';
    f.style.animationDuration = (10 + Math.random() * 8) + 's';
    f.style.animationDelay    = (Math.random() * 6) + 's';
    decor.appendChild(f);
  }

  // Floating hearts
  for (let i = 0; i < 14; i++) {
    const h = document.createElement('div');
    h.className = 'heart-float';
    h.textContent = ['💗','💖','💕','❤️'][Math.floor(Math.random() * 4)];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDuration = (8 + Math.random() * 10) + 's';
    h.style.animationDelay    = (Math.random() * 12) + 's';
    h.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
    decor.appendChild(h);
  }

  // Sparkles
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top  = Math.random() * 100 + '%';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    s.style.animationDelay    = (Math.random() * 4) + 's';
    decor.appendChild(s);
  }

  // Falling hearts (home page)
  if (document.querySelector('.hero')) {
    for (let i = 0; i < 18; i++) {
      const fh = document.createElement('div');
      fh.className = 'falling-heart';
      fh.textContent = ['💗','💖','💕','❤️','🩷'][Math.floor(Math.random() * 5)];
      fh.style.left = Math.random() * 100 + '%';
      fh.style.animationDuration = (6 + Math.random() * 10) + 's';
      fh.style.animationDelay    = (Math.random() * 10) + 's';
      fh.style.fontSize = (.9 + Math.random() * 1) + 'rem';
      document.body.appendChild(fh);
    }
    // Gift boxes in hero
    const giftPositions = [['10%','30%'],['88%','40%'],['5%','60%'],['92%','65%']];
    giftPositions.forEach(([l, t]) => {
      const g = document.createElement('div');
      g.className = 'gift-float'; g.textContent = '🎁';
      g.style.position = 'fixed'; g.style.left = l; g.style.top = t;
      g.style.zIndex = '1'; g.style.pointerEvents = 'none';
      g.style.animationDelay = (Math.random() * 3) + 's';
      document.body.appendChild(g);
    });
  }
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
}

/* ─────────────────────────────────────────────
   TYPING EFFECT
───────────────────────────────────────────── */
function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const text = el.dataset.text || el.textContent.trim();
  el.textContent = '';
  const cur = document.createElement('span');
  cur.className = 'cursor-blink';
  let i = 0;
  function type() {
    if (i < text.length) { el.textContent += text.charAt(i++); setTimeout(type, 48); }
    else el.appendChild(cur);
  }
  setTimeout(type, 300);
}

/* ─────────────────────────────────────────────
   LETTER REVEAL (message page)
───────────────────────────────────────────── */
function initLetterReveal() {
  document.querySelectorAll('.letterize').forEach(block => {
    const text = block.textContent;
    block.textContent = '';
    [...text].forEach((ch, idx) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = ch;
      span.style.animationDelay = (idx * 0.025) + 's';
      block.appendChild(span);
    });
  });
}

/* ─────────────────────────────────────────────
   WISHES FILTER
───────────────────────────────────────────── */
function initWishesFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.wish-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ─────────────────────────────────────────────
   GUESTBOOK (LocalStorage)
───────────────────────────────────────────── */
function initGuestbook() {
  const form = document.querySelector('#guestForm');
  const list = document.querySelector('#guestWishes');
  if (!form || !list) return;

  const escHtml = str => { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };

  function render() {
    const data = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
    list.innerHTML = '';
    data.slice().reverse().forEach(w => {
      const card = document.createElement('div');
      card.className = 'guest-card';
      card.innerHTML = `<h4>${escHtml(w.name)}</h4><p>${escHtml(w.message)}</p><small>📅 ${w.date}</small>`;
      list.appendChild(card);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !message) return;
    const data = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
    data.push({ name, email, message, date: new Date().toLocaleDateString() });
    localStorage.setItem('birthdayWishes', JSON.stringify(data));
    form.reset();
    render();
    burstConfetti(60);
  });

  render();
}

/* ─────────────────────────────────────────────
   FOOTER CONFETTI
───────────────────────────────────────────── */
function initFooterConfetti() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const emojis = ['💖','💗','🎈','🎂','🌸','💕','❤️'];
  for (let i = 0; i < 20; i++) {
    const c = document.createElement('div');
    c.className = 'footer-confetti';
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = Math.random() * 100 + '%';
    c.style.animationDuration = (3 + Math.random() * 4) + 's';
    c.style.animationDelay    = (Math.random() * 5) + 's';
    footer.appendChild(c);
  }
}

/* ─────────────────────────────────────────────
   CONFETTI ON LOAD (home page only)
───────────────────────────────────────────── */
function initConfettiBurstOnLoad() {
  if (!$('mainSite') || reduceMotion) return;
  setTimeout(() => {
    burstConfetti(130);
    launchFireworks(4);
  }, 500);
}

/* ─────────────────────────────────────────────
   CONFETTI CANVAS
───────────────────────────────────────────── */
function getOrCreateCanvas(id) {
  let c = document.getElementById(id);
  if (!c) { c = document.createElement('canvas'); c.id = id; document.body.appendChild(c); }
  c.width = window.innerWidth; c.height = window.innerHeight;
  return c;
}

function burstConfetti(count = 100, canvasId = 'confettiCanvas') {
  const canvas = getOrCreateCanvas(canvasId);
  const ctx    = canvas.getContext('2d');
  const colors = palette();
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 300,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -10 - 2,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.22,
      life: 0
    });
  }
  let frame = 0;
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
      p.rotation += p.rotSpeed; p.life++;
      if (p.y < canvas.height + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 200);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
      ctx.restore();
    });
    frame++;
    if (alive && frame < 500) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

/* ─────────────────────────────────────────────
   FIREWORKS CANVAS
───────────────────────────────────────────── */
function launchFireworks(bursts = 5) {
  const canvas = getOrCreateCanvas('fireworksCanvas');
  const ctx    = canvas.getContext('2d');
  const colors = palette();
  let particles = [];

  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const cx = canvas.width  * (0.1 + Math.random() * 0.8);
      const cy = canvas.height * (0.1 + Math.random() * 0.5);
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 70; i++) {
        const angle = (Math.PI * 2 * i) / 70;
        const speed = 2 + Math.random() * 5;
        particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, life: 0, maxLife: 60 + Math.random() * 30 });
      }
    }, b * 380);
  }

  let frame = 0;
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life++;
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
    particles = particles.filter(p => p.life < p.maxLife);
    frame++;
    if (frame < bursts * 30 + 90) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

/* Resize */
window.addEventListener('resize', () => {
  ['confettiCanvas','fireworksCanvas'].forEach(id => {
    const c = document.getElementById(id);
    if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
  });
});


/* ═══════════════════════════════════════════════════
   DOB GATE (replaces the old gift-box intro)
═══════════════════════════════════════════════════ */
function spawnFloaters(layer, emojis, n, size) {
  if (!layer || reduceMotion) return;
  for (let i = 0; i < n; i++) setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'dob-float';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.bottom = '-60px';
    el.style.setProperty('--sz', (size[0] + Math.random() * size[1]) + 'rem');
    el.style.setProperty('--dur', (6 + Math.random() * 5) + 's');
    el.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
    layer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }, Math.random() * 1500);
}

function startDobAmbient() {
  const cv = $('dobAmbientCanvas');
  if (reduceMotion || !cv) return () => {};
  const ctx = cv.getContext('2d'), cols = palette();
  const fit = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
  fit();
  window.addEventListener('resize', fit);
  const pts = Array.from({ length: 70 }, () => ({
    x: Math.random(), y: Math.random(), r: 1 + Math.random() * 3,
    c: cols[Math.floor(Math.random() * cols.length)], p: Math.random() * 6.28, s: .5 + Math.random(),
    vx: (Math.random() - .5) * .0002, vy: -Math.random() * .0003
  }));
  let raf, t = 0;
  (function loop() {
    t += .02;
    ctx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach(p => {
      p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
      ctx.globalAlpha = .15 + .75 * Math.abs(Math.sin(t * p.s + p.p));
      ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = p.r * 5;
      ctx.beginPath(); ctx.arc(p.x * cv.width, p.y * cv.height, p.r, 0, 6.283); ctx.fill();
    });
    raf = requestAnimationFrame(loop);
  })();
  const hearts = setInterval(() => spawnFloaters($('dobFloatLayer'), ['💖', '💗', '💕', '🩷'], 1, [.9, 1.2]), 900);
  return () => { cancelAnimationFrame(raf); clearInterval(hearts); window.removeEventListener('resize', fit); };
}

function startMusic(audio) {
  if (!audio) return;
  audio.volume = 0;
  audio.play().then(() => {
    let v = 0;
    const t = setInterval(() => { v = Math.min(.75, v + .0125); audio.volume = v; if (v >= .75) clearInterval(t); }, 33);
  }).catch(() => {});
}

function initDobGate(onReveal) {
  const overlay = $('dobOverlay'), form = $('dobForm'), err = $('dobError'), btn = $('dobSubmit');
  const main = $('mainSite'), audio = $('bdayAudio');
  if (!overlay || !form || !main) { onReveal(); return; }
  const inputs = [...form.querySelectorAll('input')];
  const stopAmbient = startDobAmbient();
  let busy = false;

  inputs.forEach(i => i.addEventListener('input', () => { i.removeAttribute('aria-invalid'); err.textContent = ''; }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (busy) return;
    const empty = inputs.filter(i => !i.value.trim());
    if (empty.length) {
      empty.forEach(i => i.setAttribute('aria-invalid', 'true'));
      err.textContent = 'Please fill in the day, month and year to continue.';
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      empty[0].focus();
      return;
    }
    busy = true;
    inputs.forEach(i => { i.readOnly = true; });
    btn.classList.add('is-opening');
    btn.setAttribute('aria-busy', 'true');
    startMusic(audio);
    setTimeout(() => {
      if (reduceMotion) return;
      burstConfetti(260, 'dobConfettiCanvas');
      spawnFloaters($('dobFloatLayer'), ['💖', '💗', '💕', '❤️', '🩷'], 28, [1.2, 1.4]);
      spawnFloaters($('dobFloatLayer'), ['🎈'], 14, [2, 2]);
    }, 600);
    setTimeout(reveal, 2200);
  });

  function reveal() {
    overlay.classList.add('hide');
    document.body.classList.remove('dob-lock');
    main.classList.add('visible');
    main.removeAttribute('inert');
    stopAmbient();
    onReveal();

    // Explicit fallback: start the automatic falling effects after DOB unlock.
    // The magic-effects file defines this function; calling it twice is safe.
    window.setTimeout(() => {
      if (typeof window.startRomanticRain === 'function') {
        window.startRomanticRain();
      }
    }, 150);

    const h = document.querySelector('.hero h1');
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    setTimeout(() => overlay.remove(), 1000);
  }
}

/* ═══════════════════════════════════════════════════
   MUSIC TOGGLE (replaces the Celebration page player)
═══════════════════════════════════════════════════ */
function initMusicToggle() {
  const audio = $('bdayAudio'), btn = $('musicToggle');
  if (!audio || !btn) return;
  const sync = () => {
    const on = !audio.paused;
    btn.textContent = on ? '🔊' : '🔇';
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Pause birthday music' : 'Play birthday music');
  };
  btn.addEventListener('click', () => { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); });
  ['play', 'pause', 'ended'].forEach(ev => audio.addEventListener(ev, sync));
  sync();
}


/* ─────────────────────────────────────────────
   MEMORIES PAGE MUSIC
   Attempts autoplay when the Memories page opens. Browsers may block it;
   the fixed music button is the reliable one-tap fallback.
───────────────────────────────────────────── */
function initMemoriesMusic() {
  const audio = $('memoriesAudio');
  const btn = $('memoriesMusicToggle');
  if (!audio || !btn) return;

  audio.volume = 0.65;
  const sync = () => {
    const playing = !audio.paused;
    btn.textContent = playing ? '🔊' : '🎵';
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause memories music' : 'Play memories music');
    btn.title = playing ? 'Pause memories music' : 'Play memories music';
  };

  // Try autoplay on entry. Mobile browsers can block this until the visitor taps.
  const attempt = audio.play();
  if (attempt && typeof attempt.then === 'function') {
    attempt.then(sync).catch(sync);
  }

  btn.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); } catch (error) { console.warn('Memories music could not start:', error); }
    } else {
      audio.pause();
    }
    sync();
  });
  ['play', 'pause', 'ended'].forEach(eventName => audio.addEventListener(eventName, sync));
  sync();
}

/* ═══════════════════════════════════════════════════
   MEMORY GALLERY — reveal one photo at a time + lightbox
═══════════════════════════════════════════════════ */
function initGallery() {
  const root = $('memoryReel');
  if (!root) return;
  const card = $('reelCard'), photo = $('reelPhoto'), caption = $('reelCaption'), status = $('reelStatus');
  const prevBtn = $('reelPrev'), nextBtn = $('reelNext'), openBtn = $('reelOpen'), veil = $('reelVeil');
  const lb = $('lightbox'), lbImg = $('lbImg'), lbCap = $('lbCap');
  const lbPrev = $('lbPrev'), lbNext = $('lbNext'), lbClose = $('lbClose');
  const thumbEls = [...root.querySelectorAll('.thumb')];
  let items = [], cur = 0, lbPos = 0, lastFocus = null;
  const seen = new Set();

  const probe = src => new Promise(res => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = src; });

  Promise.all(thumbEls.map(t => probe(t.querySelector('img').src))).then(ok => {
    thumbEls.forEach((t, k) => { if (!ok[k]) t.closest('li').remove(); });
    items = thumbEls.filter((_, k) => ok[k]).map((t, k) => {
      const img = t.querySelector('img');
      return { btn: t, src: img.getAttribute('src'), alt: img.alt, cap: t.dataset.caption || 'Memory ' + (k + 1) };
    });
    if (!items.length) {
      root.innerHTML = '<p class="section-sub">Photos will appear here once they are added to assets/images.</p>';
      return;
    }
    items.forEach((it, k) => it.btn.addEventListener('click', () => go(k)));
    render();
  });

  function render() {
    const it = items[cur], shown = seen.has(cur), last = cur === items.length - 1;
    card.classList.toggle('is-revealed', shown);
    photo.src = it.src; photo.alt = shown ? it.alt : '';
    caption.textContent = it.cap;
    items.forEach((x, k) => {
      x.btn.disabled = !seen.has(k);
      x.btn.classList.toggle('is-current', k === cur);
      x.btn.setAttribute('aria-current', k === cur ? 'true' : 'false');
    });
    prevBtn.disabled = cur === 0;
    nextBtn.textContent = !shown ? 'Reveal this memory 🎁' : last ? 'Back to the first memory' : 'Reveal next memory';
    status.textContent = shown
      ? `Memory ${cur + 1} of ${items.length}` + (seen.size === items.length ? ' · all memories revealed' : '')
      : `Memory ${cur + 1} of ${items.length} is waiting`;
  }
  function go(k) { cur = k; render(); }
  function reveal(k) {
    cur = k; seen.add(k); render();
    card.classList.remove('is-revealing'); void card.offsetWidth; card.classList.add('is-revealing');
  }
  prevBtn.addEventListener('click', () => go(cur - 1));
  nextBtn.addEventListener('click', () => {
    if (!seen.has(cur)) return reveal(cur);
    if (cur < items.length - 1) { const k = cur + 1; if (seen.has(k)) go(k); else reveal(k); }
    else go(0);
  });
  veil.addEventListener('click', () => reveal(cur));

  /* Lightbox — navigates revealed photos only */
  const seenList = () => [...seen].sort((a, b) => a - b);
  function paintLb() {
    const l = seenList(), it = items[l[lbPos]];
    lbImg.src = it.src; lbImg.alt = it.alt;
    lbCap.textContent = `${it.cap} · ${lbPos + 1} of ${l.length}`;
    lbPrev.disabled = lbPos === 0; lbNext.disabled = lbPos === l.length - 1;
  }
  function openLb() {
    if (!seen.has(cur)) return;
    lastFocus = document.activeElement;
    lbPos = seenList().indexOf(cur); paintLb();
    lb.classList.add('active'); document.body.classList.add('lb-open'); lbClose.focus();
  }
  function closeLb() {
    lb.classList.remove('active'); document.body.classList.remove('lb-open');
    if (lastFocus) lastFocus.focus();
  }
  const stepLb = d => { const n = lbPos + d; if (n >= 0 && n < seenList().length) { lbPos = n; paintLb(); } };
  openBtn.addEventListener('click', openLb);
  lbPrev.addEventListener('click', () => stepLb(-1));
  lbNext.addEventListener('click', () => stepLb(1));
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') stepLb(-1);
    else if (e.key === 'ArrowRight') stepLb(1);
    else if (e.key === 'Tab') {
      e.preventDefault();
      const f = [lbClose, lbPrev, lbNext].filter(b => !b.disabled), i = f.indexOf(document.activeElement);
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
}

/* ===== MEMORY GALLERY SCROLL REVEAL ===== */

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(
    ".memory-gallery-section .memory-item.reveal"
  );

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 100, 500)}ms`;
    observer.observe(item);
  });
});

