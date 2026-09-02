// ============================================================
// Scroll progress rail
// ============================================================
(function progressRail() {
  const fill = document.querySelector(".progress-rail__fill");
  if (!fill) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.height = Math.min(100, Math.max(0, pct)) + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// ============================================================
// Reveal-on-scroll (IntersectionObserver)
// ============================================================
(function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

// ============================================================
// Parallax band — subtle layered drift tied to scroll position
// ============================================================
(function parallaxBand() {
  const band = document.querySelector(".parallax-band");
  if (!band) return;

  const layers = band.querySelectorAll(".parallax-band__layer");
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced || !layers.length) return;

  let ticking = false;

  function update() {
    const rect = band.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress: -1 (band above viewport) .. 1 (band below viewport)
    const progress = (rect.top / vh) * -1;

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed || "0.1");
      const offset = progress * speed * 100;
      layer.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
})();

// ============================================================
// Contact form — local-only demo handling (no backend in this experiment)
// ============================================================
(function contactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent =
        "This is a static demo — no message was actually sent.";
    }
    form.reset();
  });
})();

// ============================================================
// Mark current year in footer
// ============================================================
(function footerYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
