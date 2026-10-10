/* Portfolio interactions for Dinesh Babu G
   Sections: helpers, navigation, scrolling, assets, certificates, form, footer, reveal */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHttp = /^https?:$/.test(window.location.protocol);

  /* Browsers block file existence checks on file://, so we only check when served over http(s). */
  function fileExists(url) {
    if (!isHttp) { return Promise.resolve(true); }
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = $('#nav-toggle');
  var menu = $('#nav-menu');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('open'));
  });
  $$('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      setMenu(false);
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) { setMenu(false); }
  });

  /* ---------- Smooth scrolling ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) { return; }
      var target = document.getElementById(id.slice(1));
      if (!target) { return; }
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (history.pushState) { history.pushState(null, '', id); }
    });
  });

  /* ---------- Header shadow + active nav + back to top ---------- */
  var header = $('#site-header');
  var navLinks = $$('.nav-link');
  var sections = navLinks
    .map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); })
    .filter(Boolean);
  var backBtn = $('#back-to-top');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) { current = s; } });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = sections[sections.length - 1];
    }
    navLinks.forEach(function (l) {
      var active = current && l.getAttribute('href') === '#' + current.id;
      l.classList.toggle('active', active);
      if (active) { l.setAttribute('aria-current', 'true'); } else { l.removeAttribute('aria-current'); }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Profile image fallback (initials "DG") ---------- */
  var avatar = $('#avatar');
  var profileImg = $('#profile-img');
  function checkProfile() {
    var ok = profileImg.complete && profileImg.naturalWidth > 0;
    avatar.classList.toggle('has-photo', ok);
  }
  profileImg.addEventListener('load', checkProfile);
  profileImg.addEventListener('error', function () { avatar.classList.remove('has-photo'); });
  checkProfile();

  /* ---------- Project image fallback (CSS illustration) ---------- */
  $$('.project-media').forEach(function (media) {
    var img = $('.project-img', media);
    function check() {
      var ok = img.complete && img.naturalWidth > 0;
      media.classList.toggle('no-image', !ok);
    }
    img.addEventListener('load', check);
    img.addEventListener('error', function () { media.classList.add('no-image'); });
    if (img.complete) { check(); }
  });

  /* ---------- Project buttons: only show when a real URL is configured ---------- */
  $$('a[data-url]').forEach(function (a) {
    var url = (a.getAttribute('data-url') || '').trim();
    if (url) {
      a.href = url;
      a.hidden = false;
    }
  });

  /* ---------- Resume links ---------- */
  var resumeLinks = $$('[data-resume-link]');
  var resumeNote = $('#resume-note');
  fileExists('assets/Dinesh-Resume.pdf').then(function (ok) {
    if (ok) { return; }
    resumeLinks.forEach(function (l) {
      l.setAttribute('aria-disabled', 'true');
      l.removeAttribute('href');
      l.removeAttribute('download');
      l.hidden = true;
    });
    if (resumeNote) { resumeNote.hidden = false; }
  });

  /* ---------- Optional HCL Python certificate file ---------- */
  var pyBtn = $('#python-cert-btn');
  if (pyBtn && isHttp) {
    fileExists(pyBtn.getAttribute('href')).then(function (ok) { pyBtn.hidden = !ok; });
  }

  /* ---------- Hackathon certificate cards: missing-file handling ---------- */
  function markMissing(card) {
    card.classList.add('is-missing');
    var media = $('[data-cert-media]', card);
    var msg = $('.missing-msg', card);
    if (media) { media.hidden = true; }
    if (msg) { msg.hidden = false; }
    $$('[data-view-cert], [data-download-cert]', card).forEach(function (b) {
      b.setAttribute('aria-disabled', 'true');
      if (b.tagName === 'BUTTON') { b.disabled = true; } else { b.removeAttribute('href'); }
    });
  }

  $$('[data-cert-card]').forEach(function (card) {
    var media = $('[data-cert-media]', card);
    var file = $('[data-download-cert]', card).getAttribute('href');
    if (media && media.tagName === 'IMG') {
      media.addEventListener('error', function () { markMissing(card); });
    }
    fileExists(file).then(function (ok) { if (!ok) { markMissing(card); } });
  });

  /* ---------- Certificate modal ---------- */
  var modal = $('#cert-modal');
  var modalTitle = $('#modal-title');
  var modalContent = $('#modal-content');
  var modalNewTab = $('#modal-newtab');
  var closeBtn = $('#modal-close');
  var lastFocus = null;

  function openModal(type, src, title) {
    if (type === 'pdf' && typeof navigator.pdfViewerEnabled !== 'undefined' && navigator.pdfViewerEnabled === false) {
      // Browser cannot show PDFs inline: open the original file in a new tab instead.
      window.open(src, '_blank', 'noopener');
      return;
    }
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalNewTab.href = src;
    modalContent.textContent = '';

    if (type === 'image') {
      var img = document.createElement('img');
      img.src = src;
      img.alt = title + ' (original certificate image)';
      modalContent.appendChild(img);
    } else {
      var obj = document.createElement('object');
      obj.data = src + '#toolbar=1&view=FitH';
      obj.type = 'application/pdf';
      obj.setAttribute('aria-label', title);
      var fb = document.createElement('p');
      fb.className = 'pdf-fallback';
      fb.innerHTML = 'This browser could not display the PDF. <a target="_blank" rel="noopener noreferrer"></a>';
      var fa = fb.querySelector('a');
      fa.href = src;
      fa.textContent = 'Open the original PDF in a new tab';
      obj.appendChild(fb);
      modalContent.appendChild(obj);
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');
    closeBtn.focus();
  }

  function closeModal() {
    if (modal.hidden) { return; }
    modal.hidden = true;
    modalContent.textContent = '';
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  $$('[data-view-cert]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.type, btn.dataset.src, btn.dataset.title);
    });
  });
  closeBtn.addEventListener('click', closeModal);
  $$('[data-close-modal]').forEach(function (el) { el.addEventListener('click', closeModal); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!modal.hidden) { closeModal(); }
      else if (menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
      return;
    }
    // Keep keyboard focus inside the open modal
    if (e.key === 'Tab' && !modal.hidden) {
      var focusable = $$('button, a[href], object', modal).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
      if (!focusable.length) { return; }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Contact form (mailto-based, honest feedback) ---------- */
  var form = $('#contact-form');
  var status = $('#form-status');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var TO_EMAIL = 'dinehssekar6661@gmail.com';

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
    email: function (v) {
      if (!v.trim()) { return 'Please enter your email address.'; }
      return EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    subject: function (v) { return v.trim().length >= 3 ? '' : 'Please enter a subject.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please write a message of at least 10 characters.'; }
  };

  function validateField(name) {
    var input = form.elements[name];
    var msg = rules[name](input.value);
    $('#' + name + '-err').textContent = msg;
    input.closest('.field').classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    form.elements[name].addEventListener('blur', function () { validateField(name); });
    form.elements[name].addEventListener('input', function () {
      if (form.elements[name].closest('.field').classList.contains('invalid')) { validateField(name); }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstBad) { firstBad = form.elements[name]; }
    });
    if (firstBad) {
      status.textContent = 'Please fix the highlighted fields and try again.';
      firstBad.focus();
      return;
    }

    var body = 'Name: ' + form.elements.name.value.trim() +
      '\nEmail: ' + form.elements.email.value.trim() +
      '\n\n' + form.elements.message.value.trim();
    var href = 'mailto:' + TO_EMAIL +
      '?subject=' + encodeURIComponent(form.elements.subject.value.trim()) +
      '&body=' + encodeURIComponent(body);

    status.classList.add('ok');
    status.textContent = 'Your email app should open with this message ready. Nothing has been sent yet — please press Send in your email app. If it did not open, write directly to ' + TO_EMAIL + '.';
    window.location.href = href;
  });

  /* ---------- Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();