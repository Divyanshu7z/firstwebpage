# Build Log — experimental site

A small static site: 3 pages, no build tools, no dependencies to install.

## Structure

```
index.html      home page — hero + scroll-driven sections + parallax band
work.html       short project index
contact.html    contact info + static demo form
assets/css/style.css   all styling (design tokens at the top)
assets/js/main.js      scroll progress rail, reveal-on-scroll, parallax, form demo
```

## Run it

Just open `index.html` in a browser — no server or build step required.
For best results (some browsers restrict local file access), you can
also serve it with any static server, e.g.:

```
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Notes

- Fonts (Space Grotesk / Inter / IBM Plex Mono) load from Google Fonts —
  everything else works offline.
- All visuals are inline SVG, so there are no external image files to
  go missing.
- Scroll effects respect `prefers-reduced-motion`.
- The contact form is front-end only — it does not send anywhere yet.
  Hook it up to an email service (e.g. Formspree) or a small backend
  when this becomes more than an experiment.

## Customize

- Colors, fonts, and spacing are all defined as CSS variables at the
  top of `assets/css/style.css` under `:root`.
- Swap the placeholder project entries in `work.html` for real ones.
- Update the email/GitHub links in `contact.html`.
