
/* =========================================================
   BIRTHDAY MAGIC EFFECTS
   File: js/magic-effects.js
   Works alongside the existing js/script.js
========================================================= */

(() => {
  "use strict";

  if (window.__birthdayMagicStarted) return;
  window.__birthdayMagicStarted = true;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const mobile = window.matchMedia("(max-width: 700px)").matches;
  const smallScreen = mobile || navigator.hardwareConcurrency <= 4;

  const COLORS = [
    "#FFD700",
    "#FFB6C1",
    "#FF4D88",
    "#FC1C2C",
    "#FFFFFF"
  ];

  /* ---------- Canvas setup ---------- */

  const canvas = document.createElement("canvas");
  canvas.id = "birthday-magic-canvas";
  canvas.setAttribute("aria-hidden", "true");

  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "5"
  });

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    canvas.remove();
    return;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frameId = 0;
  let lastFrame = 0;
  let lastSpawn = 0;
  let paused = document.hidden;

  const particles = [];
  const MAX_PARTICLES = reduceMotion ? 35 : smallScreen ? 65 : 115;
  const mouse = { x: -1000, y: -1000, active: false };

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  const magicCanvas = document.getElementById("birthday-magic-canvas");

if (magicCanvas) {
    const magicCtx = magicCanvas.getContext("2d");

    function resizeMagicCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        magicCanvas.width = Math.floor(window.innerWidth * dpr);
        magicCanvas.height = Math.floor(window.innerHeight * dpr);

        magicCanvas.style.width = window.innerWidth + "px";
        magicCanvas.style.height = window.innerHeight + "px";

        magicCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeMagicCanvas();
    window.addEventListener("resize", resizeMagicCanvas);
}

  /* ---------- Particle creation ---------- */

  function addParticle(options = {}) {
    if (reduceMotion && particles.length >= 45) return;
    if (particles.length >= MAX_PARTICLES) return;

    const burst = options.burst === true;

    particles.push({
      x: options.x ?? Math.random() * width,
      y: options.y ?? (burst ? height * 0.48 : -15),
      vx: options.vx ?? (Math.random() - 0.5) * 0.45,
      vy: options.vy ?? (0.35 + Math.random() * 0.75),
      size: options.size ?? (2 + Math.random() * 3.5),
      color: options.color ?? COLORS[
        Math.floor(Math.random() * COLORS.length)
      ],
      type: options.type ?? (
        Math.random() < 0.52 ? "spark" : "heart"
      ),
      alpha: options.alpha ?? (0.45 + Math.random() * 0.5),
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      life: options.life ?? (150 + Math.random() * 150),
      age: 0,
      burst
    });
  }

  function sparkleBurst(x, y, amount = 18) {
    if (reduceMotion) amount = Math.min(amount, 6);

    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.2;

      addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: Math.random() < 0.4 ? "heart" : "spark",
        life: 45 + Math.random() * 40,
        burst: true
      });
    }
  }

  /* ---------- Drawing ---------- */

  function drawHeart(x, y, size, color, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 16, size / 16);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 9;

    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-15, -5, -9, -15, 0, -7);
    ctx.bezierCurveTo(9, -15, 15, -5, 0, 5);
    ctx.fill();

    ctx.restore();
  }

  function drawSpark(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 4;

    if (p.size > 3.5) {
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.8);
      ctx.lineTo(p.size * 0.45, -p.size * 0.45);
      ctx.lineTo(p.size * 1.8, 0);
      ctx.lineTo(p.size * 0.45, p.size * 0.45);
      ctx.lineTo(0, p.size * 1.8);
      ctx.lineTo(-p.size * 0.45, p.size * 0.45);
      ctx.lineTo(-p.size * 1.8, 0);
      ctx.lineTo(-p.size * 0.45, -p.size * 0.45);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* ---------- Animation loop ---------- */

  function animate(timestamp) {
    if (paused) {
      frameId = 0;
      return;
    }

    frameId = requestAnimationFrame(animate);

    if (timestamp - lastFrame < (smallScreen ? 32 : 20)) return;
    lastFrame = timestamp;

    ctx.clearRect(0, 0, width, height);

    if (!reduceMotion && timestamp - lastSpawn > (smallScreen ? 650 : 330)) {
      addParticle();
      if (!smallScreen && Math.random() > 0.55) addParticle();
      lastSpawn = timestamp;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.age++;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      if (p.burst) {
        p.vx *= 0.985;
        p.vy += 0.025;
      } else {
        p.x += Math.sin(p.age * 0.025) * 0.25;
      }

      const remaining = 1 - p.age / p.life;
      p.alpha = Math.max(0, Math.min(1, remaining * 1.3));

      if (p.type === "heart") {
        drawHeart(p.x, p.y, p.size * 2.4, p.color, p.alpha, p.rotation);
      } else {
        drawSpark(p);
      }

      if (
        p.age >= p.life ||
        p.y > height + 50 ||
        p.x < -80 ||
        p.x > width + 80
      ) {
        particles.splice(i, 1);
      }
    }
  }

  function startAnimation() {
    paused = document.hidden;

    if (!paused && !frameId) {
      frameId = requestAnimationFrame(animate);
    }
  }

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;

    if (paused && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else {
      startAnimation();
    }
  });

  startAnimation();

  /* ---------- Mouse sparkle trail ---------- */

  if (!reduceMotion && !mobile) {
    let lastMouseSpark = 0;

    document.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse") return;

      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;

      const now = performance.now();

      if (now - lastMouseSpark > 55) {
        addParticle({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.2 - Math.random() * 0.7,
          size: 1.5 + Math.random() * 2,
          color: Math.random() < 0.5 ? "#FFD700" : "#FFB6C1",
          type: "spark",
          life: 28 + Math.random() * 20
        });

        lastMouseSpark = now;
      }
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
      mouse.active = false;
    });
  }

  /* ---------- Click celebration ---------- */

  document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;
    if (target.closest("input, textarea, select, audio, video")) return;

    const x = event.clientX;
    const y = event.clientY;

    if (target.closest(".btn, button, .logo, .memory-item, .memory-grid img")) {
      sparkleBurst(x, y, smallScreen ? 8 : 16);
    } else if (!reduceMotion) {
      sparkleBurst(x, y, smallScreen ? 4 : 7);
    }
  });

  /* ---------- Reveal elements on scroll ---------- */

  const revealSelector = [
    ".reveal",
    ".memory-item",
    ".timeline-item",
    ".contact-form",
    ".guest-wishes > *",
    ".section-title",
    ".section-sub"
  ].join(",");

  const revealElements = document.querySelectorAll(revealSelector);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("magic-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("magic-visible"));
  }

  /* ---------- Card tilt and glow ---------- */

  if (!reduceMotion && !mobile) {
    document.querySelectorAll(".memory-item").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        card.style.setProperty("--pointer-x", `${x * 100}%`);
        card.style.setProperty("--pointer-y", `${y * 100}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--pointer-x");
        card.style.removeProperty("--pointer-y");
      });
    });
  }

  /* ---------- Button ripple ---------- */

  document.addEventListener("click", event => {
    const button = event.target.closest(".btn, button");

    if (!button || reduceMotion) return;
    if (button.disabled) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.className = "magic-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });

  /* ---------- Photo lightbox celebration ---------- */

  document.addEventListener("click", event => {
    const photo = event.target.closest(
      ".memory-item img, #reelOpen, .reel-photo, .thumb"
    );

    if (!photo) return;

    sparkleBurst(
      Math.round(window.innerWidth / 2),
      Math.round(window.innerHeight / 2),
      smallScreen ? 8 : 22
    );
  });

  /* ---------- DOB entrance enhancement ---------- */

  const dobForm = document.querySelector(
    "#dobForm, #dob-form"
  );

  if (dobForm) {
    dobForm.addEventListener("submit", () => {
      dobForm.classList.add("magic-dob-submit");

      sparkleBurst(
        Math.round(window.innerWidth / 2),
        Math.round(window.innerHeight / 2),
        smallScreen ? 12 : 30
      );

      document.body.classList.add("magic-celebrating");

      window.setTimeout(() => {
        document.body.classList.remove("magic-celebrating");
      }, 1500);
    });
  }

  /* ---------- Wish submission celebration ---------- */

  const guestForm = document.querySelector("#guestForm");

  if (guestForm) {
    guestForm.addEventListener("submit", () => {
      sparkleBurst(
        Math.round(window.innerWidth / 2),
        Math.round(window.innerHeight * 0.65),
        smallScreen ? 10 : 24
      );
    });
  }

  /* ---------- Existing lightbox support ---------- */

  const lightbox = document.querySelector("#lightbox");

  if (lightbox) {
    const lightboxObserver = new MutationObserver(() => {
      const visible =
        lightbox.classList.contains("open") ||
        lightbox.classList.contains("active") ||
        lightbox.getAttribute("aria-hidden") === "false";

      if (visible) {
        sparkleBurst(
          Math.round(window.innerWidth / 2),
          Math.round(window.innerHeight / 2),
          smallScreen ? 6 : 16
        );
      }
    });

    lightboxObserver.observe(lightbox, {
      attributes: true,
      attributeFilter: ["class", "aria-hidden", "style"]
    });
  }

  /* ---------- Intro class ---------- */

  document.documentElement.classList.add("magic-effects-ready");

})();
/* =====================================================
   AUTO FALLING HEARTS, PETALS & SPARKLES
   Starts automatically after DOB unlock
   ===================================================== */

(function () {
    "use strict";

    const STYLE_ID = "auto-romantic-rain-style";
    const LAYER_ID = "auto-romantic-rain";

    if (document.getElementById(LAYER_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
        #auto-romantic-rain {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 9998;
            display: none;
            contain: layout style;
        }

        #auto-romantic-rain.active {
            display: block;
        }

        .romantic-fall {
            position: absolute;
            top: -60px;
            left: 0;
            display: block;
            line-height: 1;
            user-select: none;
            pointer-events: none;
            will-change: transform, opacity;
            animation: romanticFall var(--duration) linear forwards;
            filter: drop-shadow(0 0 7px rgba(255, 64, 150, .65));
        }

        .romantic-fall.spark {
            color: #ffd6f1;
            text-shadow:
                0 0 8px #ff4ca8,
                0 0 16px #ff85d0;
        }

        .romantic-fall.heart {
            color: #ff3e85;
            text-shadow: 0 0 12px #ff0088;
        }

        @keyframes romanticFall {
            0% {
                transform:
                    translate3d(var(--start-x), -70px, 0)
                    rotate(0deg);
                opacity: 0;
            }

            8% {
                opacity: .95;
            }

            85% {
                opacity: .95;
            }

            100% {
                transform:
                    translate3d(
                        calc(var(--start-x) + var(--drift)),
                        calc(100dvh + 100px),
                        0
                    )
                    rotate(var(--rotation));
                opacity: 0;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #auto-romantic-rain {
                display: none !important;
            }
        }
    `;

    document.head.appendChild(style);

    const layer = document.createElement("div");
    layer.id = LAYER_ID;
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const symbols = [
        { char: "❤️", type: "heart" },
        { char: "💖", type: "heart" },
        { char: "💕", type: "heart" },
        { char: "💗", type: "heart" },
        { char: "🌸", type: "petal" },
        { char: "🌹", type: "petal" },
        { char: "✨", type: "spark" },
        { char: "✦", type: "spark" },
        { char: "✧", type: "spark" }
    ];

    const mobile = window.matchMedia("(max-width: 600px)");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let rainTimer = null;
    let burstTimers = [];

    function createFallingParticle() {
        if (!layer.classList.contains("active")) return;

        // Mobile par fewer particles for smooth performance
        const maxParticles = mobile.matches ? 35 : 85;

        if (layer.childElementCount >= maxParticles) return;

        const item = symbols[
            Math.floor(Math.random() * symbols.length)
        ];

        const particle = document.createElement("span");

        particle.className = "romantic-fall " + item.type;
        particle.textContent = item.char;

        const x = Math.random() * window.innerWidth;
        const size = mobile.matches
            ? 9 + Math.random() * 14
            : 11 + Math.random() * 21;

        const duration = 5 + Math.random() * 6;
        const drift = (Math.random() - 0.5) * 180;
        const rotation = (Math.random() - 0.5) * 900;

        particle.style.fontSize = size + "px";
        particle.style.setProperty("--start-x", x + "px");
        particle.style.setProperty("--drift", drift + "px");
        particle.style.setProperty("--rotation", rotation + "deg");
        particle.style.setProperty("--duration", duration + "s");

        layer.appendChild(particle);

        particle.addEventListener("animationend", () => {
            particle.remove();
        }, { once: true });
    }

    function startRomanticRain() {
        if (rainTimer || reducedMotion.matches) return;

        layer.classList.add("active");

        // Birthday page khulte hi first magical burst
        for (let i = 0; i < 45; i++) {
            const timer = setTimeout(() => {
                createFallingParticle();
            }, i * 65);

            burstTimers.push(timer);
        }

        // Continuous automatic falling animation
        rainTimer = setInterval(() => {
            if (!document.hidden) {
                createFallingParticle();

                if (Math.random() > 0.55) {
                    createFallingParticle();
                }
            }
        }, mobile.matches ? 240 : 140);
    }

    function stopRomanticRain() {
        clearInterval(rainTimer);
        rainTimer = null;

        burstTimers.forEach(clearTimeout);
        burstTimers = [];

        layer.classList.remove("active");
        layer.replaceChildren();
    }

    // Public functions for DOB integration
    window.startRomanticRain = startRomanticRain;
    window.stopRomanticRain = stopRomanticRain;

    // Useful diagnostic: returns whether the effect layer is active.
    window.testRomanticRain = function () {
        startRomanticRain();
        return {
            functionAvailable: typeof window.startRomanticRain === "function",
            layerExists: !!document.getElementById(LAYER_ID),
            layerActive: !!document.getElementById(LAYER_ID)?.classList.contains("active"),
            reducedMotion: reducedMotion.matches
        };
    };

    // DOB overlay hidden hone ke baad rain automatically start
    const dobOverlay = document.getElementById("dobOverlay");
    const mainSite = document.getElementById("mainSite");

    function birthdayIsOpen() {
        if (!mainSite || mainSite.hasAttribute("inert")) {
            return false;
        }

        if (!dobOverlay) return true;

        const overlayStyle = getComputedStyle(dobOverlay);

        return (
            overlayStyle.display === "none" ||
            overlayStyle.visibility === "hidden" ||
            overlayStyle.opacity === "0" ||
            !dobOverlay.isConnected
        );
    }

    if (birthdayIsOpen()) {
        startRomanticRain();
    }

    // DOB unlock ke baad mainSite / overlay changes detect karo
    const observer = new MutationObserver(() => {
        if (birthdayIsOpen()) {
            startRomanticRain();
            observer.disconnect();
        }
    });

    if (dobOverlay) {
        observer.observe(dobOverlay, {
            attributes: true,
            attributeFilter: ["style", "class", "hidden"]
        });
    }

    if (mainSite) {
        observer.observe(mainSite, {
            attributes: true,
            attributeFilter: ["style", "class", "inert"]
        });
    }

    // Browser accessibility setting respect karo
    reducedMotion.addEventListener("change", event => {
        if (event.matches) {
            stopRomanticRain();
        } else if (birthdayIsOpen()) {
            startRomanticRain();
        }
    });

})();
