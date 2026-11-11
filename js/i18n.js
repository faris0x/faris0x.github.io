(function () {
  'use strict';

  var root = document.documentElement;
  var select = document.getElementById('lang-select');
  var items = [];
  var aria = [];

  function tokenize(el) {
    var clone = el.cloneNode(true);
    var keeps = [];
    var nodes = clone.querySelectorAll('.katex, .latex-logo, code');
    Array.prototype.forEach.call(nodes, function (node) {
      var token = '@@K' + keeps.length + '@@';
      keeps.push(node.outerHTML);
      node.parentNode.replaceChild(document.createTextNode(token), node);
    });
    return { html: clone.innerHTML, keeps: keeps };
  }

  function restore(html, keeps) {
    return html.replace(/@@K(\d+)@@/g, function (match, index) {
      return keeps[Number(index)] || match;
    });
  }

  function collect() {
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-ar]'),
      function (el) {
        items.push({ el: el, base: tokenize(el) });
      }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-ar-aria]'),
      function (el) {
        aria.push({
          el: el,
          base: el.getAttribute('aria-label'),
          ar: el.getAttribute('data-ar-aria')
        });
      }
    );
  }

  function apply(lang) {
    var arabic = lang === 'ar';
    root.lang = arabic ? 'ar' : 'en';
    root.dir = arabic ? 'rtl' : 'ltr';

    items.forEach(function (item) {
      var source = arabic ? item.el.getAttribute('data-ar') : item.base.html;
      item.el.innerHTML = restore(source, item.base.keeps);
    });

    aria.forEach(function (item) {
      item.el.setAttribute('aria-label', arabic ? item.ar : item.base);
    });

    if (select) select.value = arabic ? 'ar' : 'en';

    var label = document.getElementById('theme-label');
    if (label) {
      var light = root.dataset.theme === 'light';
      label.textContent = arabic
        ? (light ? 'فاتح' : 'داكن')
        : (light ? 'Light' : 'Dark');
    }

    document.dispatchEvent(
      new CustomEvent('langchange', { detail: { lang: root.lang } })
    );
  }

  collect();

  apply('en');
})();
