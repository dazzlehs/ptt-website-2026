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
  var TITLE_TH = 'น้ำดื่มเพชรทับทิม | บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด';
  var TITLE_OTHER = 'Pettubtim Drinking Water';

  function setLang(lang) {
    if (!LANG_LABELS[lang]) return;
    app.setAttribute('data-lang', lang);
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
})();
