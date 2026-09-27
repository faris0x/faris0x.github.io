# faris0x.github.io

My portfolio — [faris0x.github.io](https://faris0x.github.io).

Forked from [`guilyx/v2`](https://github.com/guilyx/v2) and rewritten around
systems development, mathematics and quantum computing.

## What it is

One page. No framework, no build step, no dependencies to install.

```
index.html      the whole site
css/style.css   hand-written, CSS custom properties, dark + light
js/main.js      nav, scrollspy, project filters, theme, Discord copy
favicon.svg
apple-touch-icon.svg
```

Open `index.html` in a browser and it works. Deploy by pushing to
`main` — GitHub Pages serves it as-is.

## Sections

About · Experience · Projects · Open Source · Research · Education · Contact

## Notes

- Ships dark by default, respects `prefers-color-scheme` on first visit, and
  remembers the choice in `localStorage`.
- Everything is readable without JavaScript; the script only adds the nav
  toggle, scrollspy, project filters, the theme switch and the Discord copy
  widget.
- The footer equation is typeset by KaTeX (its bundled Computer Modern fonts).
- Honours `prefers-reduced-motion`, has a skip link, visible focus rings and a
  print stylesheet.

## Licence

[MIT](LICENSE)