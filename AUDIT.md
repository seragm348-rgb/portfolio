# Audit — what changed and why

Palette, fonts (Inter + JetBrains Mono), starfield, 3D motion system, case-study routing (`#project/<id>`), EN/AR and dark/light are kept as they were. No metric, certificate, or project was invented.

| # | Section | Change | Why |
|---|---|---|---|
| — | Files | Single 220 KB HTML split into `index.html` / `styles.css` / `main.js` / `content.js`; base64 photo extracted to `assets/profile.jpg` | Cacheable, editable, smaller HTML; data separated from code |
| — | Nav | Sticky nav, 7 links + "More" group (Pricing, Terminal, Achievements, Contact), scroll-spy, mobile menu, skip link | ≤8 visible items, current section always shown |
| 1 | Home | Status chip, single 3D name (depth layer is now a CSS pseudo-element, so the name exists once in the DOM), CTAs "View my work" + `./download-cv.sh`, GitHub button (shown when URL set); "View GitHub — Coming soon" removed; hero stat cards replaced by an animated SVG architecture diagram (Users → CDN → ALB → EC2 ×2 AZ → S3) | Clear hiring message; visual shows what you build instead of counts |
| 2 | About | Kept story + the four "How I work" principles | Already strong |
| 3 | Education | GPA 3.08 and 2027 graduation stat cards moved here | Belong with the degree, not the hero |
| 4 | Credentials (new) | Filterable grid (All / AWS / Networking / DevOps), "In progress" badges, honest empty state | Shows DEPI + CCNA honestly, ready for real certs |
| 5 | Skills | Logo stack strip (Docker/Terraform/Git marked Learning) + 5 groups; duplicates removed (AWS Console appeared twice; Git/GitHub unified); Hands-on/Learning badges; 12 highlighted, rest behind "Show all skills" | Faster scan, no repetition |
| 6 | Experience (new) | Timeline with Challenge → Action → Result for DEPI and self-directed labs | Gives training a professional shape |
| 7 | Services | 3 cards with description, deliverables, "Request this" (pre-fills the contact subject); smaller headings | Secondary to hiring sections |
| 8 | Pricing (new) | Plans from your existing ranges, "what's included", recommended plan, custom quote; every price in `content.js → pricing` | One place to edit |
| 9 | Projects | Same cards, filters and case studies; each case study adds Role, Outcome (placeholder), a proof widget (ALB target health, IAM trust-policy diff, bucket policy + 403, `show vlan brief`; fake IDs labelled), README "How it's built" collapse, repo/write-up link | Proof over claims |
| 10 | Terminal (new) | Typed boot, commands help/about/skills/projects/services/pricing/contact/cv/clear, `sudo`/`coffee` easter eggs, scripted AssumeRole incident replay ending in `aws sts assume-role`, tap chips, plain-text fallback | Interactive demo of a real debugging story |
| 11 | Achievements | Renders only if `achievements` has items (currently empty → hidden) | No filler |
| 12 | Contact | Formspree-ready form (mailto fallback, no fake success), copy-email button, GitHub row, CV row, `ssh contact` label | Working contact path |
| 13 | Footer | Logo, extended nav, GitHub/CV links, `● pipeline passing` CI badge placeholder, hosting note | Proof of automation |
| — | SEO | Title, description, canonical, OG + Twitter tags, 1200×630 og-image, JSON-LD Person | Rich link previews and search |
| — | A11y / perf | `<main>`, focus-visible rings, ARIA on menus/filters/terminal log, reduced-motion respected, image dimensions set, no libraries | WCAG + Lighthouse targets |
| — | Automation | `.github/workflows/ci.yml` (required-files + JS syntax check on every push/PR) | Real CI behind the badge |
