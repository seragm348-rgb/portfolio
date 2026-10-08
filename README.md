# Serag Abotaleb — Portfolio

Static site, no build step, no frameworks. Ready for GitHub Pages.

| File | Purpose |
|---|---|
| `index.html` | Markup, SEO/OG/JSON-LD metadata |
| `styles.css` | Design tokens (existing palette, unchanged) + components |
| `content.js` | **All editable data**: links, credentials, skills, experience, services, pricing, project extras, achievements |
| `main.js` | Behaviour: theme, EN/AR, starfield, 3D, case studies, terminal, nav scroll-spy, form |
| `assets/logo.svg` | **Logo — single swap location** (navbar, footer, favicon) |
| `assets/og-image.png` | 1200×630 social image, regenerate with `python3 make_og.py` after swapping the logo |
| `.github/workflows/ci.yml` | GitHub Actions checks on every push/PR (powers the CI badge) — add it via GitHub's web UI: Add file → Create new file → paste |

## Deploy (GitHub Pages)
Pages deploys from the `main` branch root (Settings → Pages → Deploy from a branch). Merging to `main` publishes the site; the `ci` workflow checks files and JS syntax on every push/PR.

## Contact form backend (Formspree, free tier)
1. Sign up at https://formspree.io → New form → copy the endpoint (`https://formspree.io/f/xxxxxxx`).
2. Paste it into `content.js` → `site.formEndpoint`.
3. Submit once from the live site and confirm the email in Formspree.

With `formEndpoint` empty the form opens the visitor's mail app (mailto) — it never fakes a "sent" message.
EmailJS alternative: replace the `fetch(endpoint …)` call in `main.js` (contact form section) with `emailjs.send(...)`.

## Editing content
Everything in `[SQUARE BRACKETS]` is a placeholder and renders highlighted on the page until replaced.
`achievements: []` hides the Achievements section entirely. `site.github: ''` hides every GitHub button.
