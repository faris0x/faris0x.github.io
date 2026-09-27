/* ============================================================
   Erwin Lejeune — portfolio v2
   ~100 lines of vanilla JS. Everything degrades: without it the
   page is still a complete, readable document.
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme ---------- */

  var themeBtn   = document.getElementById('theme-toggle');
  var themeLabel = document.getElementById('theme-label');

  function paintTheme(theme) {
    root.dataset.theme = theme;
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'light'));

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d0e12' : '#f4ead1');
  }

  paintTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      paintTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- mobile nav ---------- */

  var navToggle = document.getElementById('nav-toggle');
  var nav       = document.getElementById('nav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a[data-nav]')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- scrollspy ---------- */

  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-nav]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length) {
    var ticking = false;

    function syncSpy() {
      ticking = false;

      // The last section whose top has crossed a line 30% down the viewport
      // wins — except at the very bottom of the page, where the final section
      // may be too short to ever reach it.
      var line = window.innerHeight * 0.3;
      var atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      var current = atBottom ? sections[sections.length - 1] : sections[0];

      if (!atBottom) {
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].getBoundingClientRect().top <= line) current = sections[i];
        }
      }

      links.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + current.id);
      });
    }

    function requestSpy() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncSpy);
    }

    addEventListener('scroll', requestSpy, { passive: true });
    addEventListener('resize', requestSpy);
    syncSpy();
  }

  /* ---------- project filters ---------- */

  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#project-grid .card'));
  var empty = document.getElementById('grid-empty');

  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.dataset.filter;
        var shown = 0;

        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });

        cards.forEach(function (card) {
          var match = want === 'all' || card.dataset.cat === want;
          card.hidden = !match;
          if (match) shown++;
        });

        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ---------- discord copy ---------- */

  function copyText(t, btn, doneLabel) {
    function done() {
      if (btn) {
        var old = btn.textContent;
        btn.textContent = doneLabel || 'Copied';
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove('is-copied');
        }, 1400);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done).catch(done);
    } else {
      try {
        var ta = document.createElement('textarea');
        ta.value = t;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {}
      done();
    }
  }

  var dTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-discord]'));
  var dPop = document.getElementById('discord-pop');
  var dCopy = document.getElementById('discord-copy');
  var dHandle = document.getElementById('discord-handle');

  function dText() {
    return dHandle ? dHandle.textContent.replace(/^@/, '') : 'faris0x';
  }

  function dPosition(anchor) {
    if (!dPop) return;
    var r = anchor.getBoundingClientRect();
    var w = dPop.offsetWidth;
    var h = dPop.offsetHeight;
    var arrow = 8;
    var left = r.left + r.width / 2 - w / 2;
    var top = r.top - h - arrow - 8;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    top = Math.max(8, top);
    dPop.style.left = left + 'px';
    dPop.style.top = top + 'px';
  }

  function dShow(anchor) {
    if (!dPop) return;
    dPop.hidden = false;
    dPosition(anchor);
    if (dCopy) {
      dCopy.textContent = 'Copy';
      dCopy.classList.remove('is-copied');
    }
  }

  function dHide() {
    if (dPop) dPop.hidden = true;
  }

  if (dTriggers.length && dPop) {
    dTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        dShow(btn);
      });
    });

    if (dCopy) {
      dCopy.addEventListener('click', function () { copyText(dText(), dCopy); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dHide();
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('#discord-pop') && !e.target.closest('[data-discord]')) dHide();
    });
  }

  var inlineCopies = Array.prototype.slice.call(document.querySelectorAll('.copy-btn[data-copy]'));
  inlineCopies.forEach(function (btn) {
    var handle = btn.closest('.handle');
    var text = handle ? handle.querySelector('.handle-text').textContent.replace(/^@/, '') : 'faris0x';
    btn.addEventListener('click', function () { copyText(text, btn); });
  });
})();
