# Placeholders to fill

All in `content.js` unless noted. Placeholders render highlighted on the page.

## Logo
- [ ] `assets/logo.svg` — replace with the real logo (same filename). Then run `python3 make_og.py` to rebuild `assets/og-image.png`.

## Links
- [x] `site.github` — set to https://github.com/seragm348-rgb
- [ ] `site.formEndpoint` — Formspree endpoint (see README)
- [ ] `projectsExtra.<id>.repo` ×4 — repo or write-up URL per project (`ha-web`, `iam-ec2-s3`, `static-site`, `packet-tracer`)
- [ ] `credentials[].link` — verification URL once a certificate is issued
- [ ] `site.hosting` — keep "GitHub Pages" or change to "S3 + CloudFront"

## Prices (`pricing.plans`)
- [ ] Confirm ranges: IAM Fix $40–120, Architecture Review $60–150, Infrastructure Setup $80–200 (copied from the current site)
- [ ] `[ADD: revisions / turnaround]`, `[ADD: call / revisions]`, `[ADD: support window]`
- [ ] `recommended: true` — move to another plan if preferred

## Metrics / outcomes
- [ ] `projectsExtra.ha-web.metric` and `how` → `[ADD AZ COUNT]`, `[ADD TARGET %]`
- [ ] `projectsExtra.iam-ec2-s3.metric`
- [ ] `projectsExtra.static-site.metric`
- [ ] `projectsExtra.packet-tracer.metric` and `how` → `[EDIT TO MATCH]`

## Experience (`experience`)
- [ ] DEPI: `mode`, `action`, `result`
- [ ] Self-directed labs: start date

## Certificates (`credentials`)
- [ ] Add each real certificate with the template in the file (status `done` + link). Nothing fake is shown; empty filters show an honest empty state.

## Achievements
- [ ] `achievements` — add real items or leave empty (section hidden)
