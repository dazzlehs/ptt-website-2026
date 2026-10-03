(function () {
  var app = document.getElementById('app');
  var langMenu = document.getElementById('lang-menu');
  var mobileMenu = document.getElementById('mobile-menu');
  var langLabelEl = document.getElementById('lang-label');
  var quoteForm = document.getElementById('quote-form');
  var quoteSuccess = document.getElementById('quote-success');
  var quoteFormWrap = document.getElementById('quote-form-wrap');
  var quoteError = document.getElementById('quote-error');
  var quoteSubmitBtn = document.getElementById('quote-submit-btn');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  var LANG_LABELS = { th: 'ไทย', en: 'EN', zh: '中文', ja: '日本語' };
  var TITLE_TH = 'น้ำดื่มเพชรทับทิม (Pettubtim Drinking Water)';
  var TITLE_OTHER = 'Pettubtim Drinking Water';

  function setLang(lang) {
    if (!LANG_LABELS[lang]) return;
    app.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    langLabelEl.textContent = LANG_LABELS[lang];
    document.title = lang === 'th' ? TITLE_TH : TITLE_OTHER;
    try { localStorage.setItem('ptt-lang', lang); } catch (e) {}
    closeLangMenu();
  }

  function toggleLangMenu(e) {
    if (e) e.stopPropagation();
    langMenu.hidden = !langMenu.hidden;
  }
  function closeLangMenu() { langMenu.hidden = true; }

  function toggleMenu(e) {
    if (e) e.stopPropagation();
    mobileMenu.hidden = !mobileMenu.hidden;
  }
  function closeMenu() { mobileMenu.hidden = true; }

  // Static site, no server of our own - submissions go to Formspree
  // (https://formspree.io/f/xykrwyzq), which forwards them to info@pettubtim.com.
  function submitQuote(e) {
    if (e && e.preventDefault) e.preventDefault();

    quoteError.hidden = true;
    quoteSubmitBtn.disabled = true;

    fetch(quoteForm.action, {
      method: 'POST',
      body: new FormData(quoteForm),
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      quoteSubmitBtn.disabled = false;
      if (response.ok) {
        quoteFormWrap.hidden = true;
        quoteSuccess.hidden = false;
      } else {
        quoteError.hidden = false;
      }
    }).catch(function () {
      quoteSubmitBtn.disabled = false;
      quoteError.hidden = false;
    });
  }
  function resetQuote() {
    quoteForm.reset();
    quoteError.hidden = true;
    quoteSuccess.hidden = true;
    quoteFormWrap.hidden = false;
  }

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.hidden = false;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  function toggleProcess(el) {
    var card = el.closest('.process-card');
    if (card) card.classList.toggle('open');
  }

  window.toggleProcess = toggleProcess;
  window.setLang = setLang;
  window.toggleLangMenu = toggleLangMenu;
  window.closeLangMenu = closeLangMenu;
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;
  window.submitQuote = submitQuote;
  window.resetQuote = resetQuote;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

  var saved = null;
  try { saved = localStorage.getItem('ptt-lang'); } catch (e) {}
  if (saved && LANG_LABELS[saved]) setLang(saved);

  initMotion();

  // ---- motion: scroll reveal, counters, hero bubbles + tilt, nav, ripples ----
  function initMotion() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { app.setAttribute('data-motion', 'off'); return; }

    // Scroll progress bar and the nav tightening once the page leaves the top.
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var nav = document.querySelector('.nav-wrap');
    var ticking = false;
    function onScroll() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    // Rising bubbles behind the hero copy.
    var hero = document.getElementById('home');
    if (hero) {
      var bubbles = document.createElement('div');
      bubbles.className = 'hero-bubbles';
      bubbles.setAttribute('aria-hidden', 'true');
      var count = window.innerWidth < 640 ? 9 : 18;
      for (var i = 0; i < count; i++) {
        var b = document.createElement('span');
        var size = 6 + Math.random() * 22;
        b.className = 'hero-bubble';
        b.style.width = b.style.height = size + 'px';
        b.style.left = (Math.random() * 100) + '%';
        b.style.setProperty('--bd', (9 + Math.random() * 10) + 's');
        b.style.setProperty('--bdl', (-Math.random() * 18) + 's');
        b.style.setProperty('--bx', (Math.random() * 80 - 40) + 'px');
        b.style.setProperty('--bo', (0.35 + Math.random() * 0.45).toFixed(2));
        bubbles.appendChild(b);
      }
      hero.insertBefore(bubbles, hero.querySelector('.hero-grid'));
    }

    // 3D tilt on the hero product card, desktop pointers only.
    var card = document.querySelector('.hero-card');
    if (card && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    }

    // Water-drop ripple from the click point on the main buttons.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.btn-primary-lg,.btn-primary,.btn-ghost-lg,.nav-cta,.btn-submit,.contact-cta,.mobile-menu-cta,.btn-soft');
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var d = Math.max(r.width, r.height) * 2.2;
      var dot = document.createElement('span');
      dot.className = 'click-ripple';
      dot.style.width = dot.style.height = d + 'px';
      dot.style.left = (e.clientX - r.left) + 'px';
      dot.style.top = (e.clientY - r.top) + 'px';
      btn.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 700);
    });

    if (!('IntersectionObserver' in window)) return;

    // Scroll reveal. Elements are only hidden once JS has tagged them, so the
    // page is fully visible if this script never runs. Each group staggers its
    // children; the attribute is removed after the entrance so hover
    // transforms aren't held back by the finished animation.
    var groups = [
      ['.hero-badge, .hero-title, .hero-lead, .hero-grid > div:first-child > div:nth-child(4), .hero-stats', 'up', 130, true],
      ['.hero-grid > .relative', 'zoom', 0, false, 350],
      ['.section-head, .products-head, .contact-section .container > div:first-child, .standards-section .container > div:nth-child(2)', 'up', 0],
      ['.about-grid > :first-child', 'left', 0],
      ['.about-grid > :last-child', 'right', 0],
      ['.product-feature', 'zoom', 0],
      ['.size-grid > *', 'up', 90, true],
      ['.process-grid > *', 'up', 110, true],
      ['.cert-grid > *', 'up', 120, true],
      ['.clients-grid > *', 'zoom', 35, true],
      ['.areas-grid > *', 'up', 60, true],
      ['.faq-list > *', 'up', 70, true],
      ['.quote-panel', 'up', 0],
      ['.contact-grid > *', 'up', 140, true],
      ['.footer-grid > *', 'up', 110, true]
    ];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add('in');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    groups.forEach(function (g) {
      var els = document.querySelectorAll(g[0]);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.hasAttribute('data-reveal')) continue;
        el.setAttribute('data-reveal', g[1]);
        var delay = (g[4] || 0) + (g[3] ? Math.min(i, 12) * g[2] : 0);
        if (delay) el.style.setProperty('--rd', delay + 'ms');
        el.addEventListener('animationend', function (e) {
          if (e.target !== this) return;
          this.removeAttribute('data-reveal');
          this.classList.remove('in');
          this.style.removeProperty('--rd');
        });
        io.observe(el);
      }
    });

    // Count the hero stats up from zero ("20M+" keeps its M and the + span).
    var stats = document.querySelectorAll('.stat-num');
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        sio.unobserve(en.target);
        setTimeout(countUp, 450, en.target);
      });
    }, { threshold: 0.6 });
    for (var s = 0; s < stats.length; s++) {
      var node = stats[s].firstChild;
      var m = node && node.nodeType === 3 && /^(\d+)(\D*)$/.exec(node.nodeValue.trim());
      if (!m) continue;
      stats[s]._count = { node: node, to: +m[1], suffix: m[2] };
      node.nodeValue = '0' + m[2];
      sio.observe(stats[s]);
    }
    function countUp(el) {
      var c = el._count, start = null, dur = 1800;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        c.node.nodeValue = Math.round(c.to * eased) + c.suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }
})();
