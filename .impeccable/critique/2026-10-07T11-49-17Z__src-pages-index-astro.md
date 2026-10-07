---
target: homepage
total_score: 16
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/index.astro"
target_fingerprint: "sha256:e5af43ecdeb037c26fc2160c133c59e1600e8d5204c46681afb1d0c3191225d4"
target_path: /home/mandar/media/G/website_72ai/src/pages/index.astro
timestamp: 2026-10-07T11-49-17Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review, isolated context; B: detector + browser overlay, isolated context). A's tab briefly received B's overlay via shared browser; A reports its findings come from source and its own measurements.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Submit shows "Sending…" then always redirects to /thanks |
| 2 | Match System / Real World | 2 | Tally/GST/POS/call recordings only in sr-only text; "PoC", "pipeline" leak |
| 3 | User Control and Freedom | 3 | Exit popup has Escape, overlay, button and focus return |
| 4 | Consistency and Standards | 1 | 3 palettes, blue #2563EB popup CTA, home.css centring leak, two id="contact" |
| 5 | Error Prevention | 2 | Required phone with no format hint, 13px consent checkbox |
| 6 | Recognition Rather Than Recall | 3 | Short page, clear nav, contact reachable 3 ways |
| 7 | Flexibility and Efficiency | n/a | Single-goal landing page |
| 8 | Aesthetic and Minimalist Design | 2 | Second logo in form card, "100%" twice, centred hero buttons under left copy |
| 9 | Error Recovery | 1 | Failed submission invisible; user lands on /thanks |
| 10 | Help and Documentation | n/a | Marketing surface |
| Total | | 16/32 | Acceptable (50%) |

## Design Specificity Verdict
Category template (eyebrow pill, accent-line hero, fake macOS pipeline window, floating 100% card, logo-less trust bar, 6-card icon grid, 3 steps, 3-up stats, "Not a demo" CTA). Differentiators hidden: owner's real data types only in sr-only TL;DR (index.astro:18), founder absent, 9 projects unlinked, 72° story reduced to 9px SVG label, ownership in ~7px aria-hidden badges (:104-109), capability grid misaligned with solutions.json (no Document & OCR).
Detector: CLI 23 findings (14 off-ramp font sizes, 7 off-palette colours incl. #2563EB/#1d4ed8 in ExitIntentPopup.astro:113,125, 1 side-tab, 1 overused-font Inter at Layout.astro:81). Overlay 20: low-contrast x9 (eyebrow 2.6:1, #8A93A3 labels 3.1:1, footer 2.6:1), justified-text x2, tight-leading consent label, kicker-above-heading, em-dash overuse (18), Inter loaded but unused. False positives: window dots, cap-card hover edge (DESIGN.md-specified), dark-glow and text-occlusion (detector's own overlay).

## Priority Issues
- [P0] Unverified proof rendered as fact: trust bar (:122-137), "5+ Industries served" (:246), "100% Custom-built" float card (:112). Fix: replace with linked real projects, founder, "9 systems built"; drop 100% card. Command: clarify.
- [P1] Contact form swallows failures: ContactForm.astro:77-90 Promise.allSettled then unconditional redirect. Fix: redirect only on an ok response; inline error, mailto fallback, keep fields, aria-live. Command: harden.
- [P1] Conversion block least on-system: #DDA744, rounded-lg/shadow-xl, centred labels from home.css, inner logo, duplicate id="contact" (index.astro:262, ContactForm.astro:7), 141px 2-col inputs at 390px, 13px checkbox, 36px submit, form at y~5630 of 6446. Fix: DESIGN.md specs, single column <768px, 48px full-width submit. Command: polish then adapt.
- [P1] Generic composition hides differentiators. Fix: relabel graphic inputs to Tally export/invoice PDFs/call recordings/POS, visible ownership line, founder strip, project teasers, realign cards to practice areas. Command: shape then bolder.
- [P2] Copy breaks voice rules: 18 em dashes (incl. SEO title :7), "Not a demo. Not a template." (:266), "not generic demos", "not just clicks", "keeping you up at night", "move the needle". Command: clarify.

## Persona Red Flags
- Jordan: equal-weight hero CTAs with primary styling on the exit; deliverable undefined; "PoC" unexplained; no "what happens next".
- Riley: offline submit still thanks; refresh loses input; phone accepts anything; ambiguous #contact anchor.
- Casey: 141px inputs, 13px checkbox, 36px submit, justified-text rivers, ~7px SVG labels, 40s popup, unused Inter weights.
- SME owner on Tally: no Tally/GST/invoices/missed calls visible; "0 migrations" buried; no price/engagement-size signal; no face.

## Minor Observations
Hero buttons centred via home.css:51; default black focus outlines, faint #DDA744 input ring; blue mobile nav hover (Nav.astro:136); "Contact Us" vs "Contact"; 6-card chunk; 14 off-ramp font sizes; black popup scrims.

## Questions to Consider
- Would an owner's own Tally export in the hero make the trust bar unnecessary?
- Why is the founder invisible on a founder-led studio's homepage?
- Which hero button is the conversion, and why does the other get primary styling?
- What if the stat band showed 3 real, linkable project outcomes?
