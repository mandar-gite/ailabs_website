---
target: projects
total_score: 14
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 3
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/projects/index.astro"
target_fingerprint: "sha256:ae78ea746b5ee537303b1950b8d709460583a8a6cb45ca4d94486d934392f728"
target_path: /home/mandar/media/G/website_72ai/src/pages/projects/index.astro
timestamp: 2026-10-07T11-58-22Z
slug: src-pages-projects-index-astro
---
Method: dual-agent (A: design review, isolated; B: detector in its own headless browser). Source-verified: hidden TL;DR claims, missing #main-content, no h1, ProjectTable unimported.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 1 | No filter result count/URL state; no active nav state |
| 2 | Match System / Real World | 1 | Code names and category jargon, not owner problems |
| 3 | User Control and Freedom | 2 | Filter state lost on back, unshareable |
| 4 | Consistency and Standards | 1 | Cream/#DDA744/8px cards; 1400px column vs 1200px nav |
| 5 | Error Prevention | 3 | Little to get wrong |
| 6 | Recognition Rather Than Recall | 2 | Categories unexplained |
| 7 | Flexibility and Efficiency | 2 | Filter over 8 items; no vetter scan path |
| 8 | Aesthetic and Minimalist Design | 2 | Clean but empty, ragged 3-3-2 grid |
| 9 | Error Recovery | n/a | No error states |
| 10 | Help and Documentation | n/a | Static index |
| Total | | 14/32 | Poor (44%) |

## Design Specificity Verdict
Category template: opens on "Filter by: All Categories", no title/intro/CTA, nothing says 72°. Blurbs are the specific layer. ProjectTable.astro (data types/methods for vetters) is unimported dead code. Detector: CLI 5 advisory (radius 6px :80,:118; ProjectCard 4px :66, 1.25rem :54, 0.95rem :79); overlay 10 (8 category labels #DDA744 2.2:1 at ProjectCard.astro:73, footer 2.6:1, overused-font false positive). No overflow at 390.

## Priority Issues
- [P1] sr-only TL;DR (:19) claims "9 live projects ... All built on real client data"; 8 render, client-data unconfirmed. Fix count, remove claim. harden.
- [P1] No H1/headline (:20-23); headings start at H3; skip-link target #main-content missing. clarify.
- [P1] Dead end: no /#contact link in main. onboard.
- [P2] Legacy drift: cream (:51), ProjectCard 2px/8px/#DDA744/transition:all, no press-back. polish.
- [P2] Categories carry meaning instead of owner problems; filter overhead at 8 items. distill.

## Persona Red Flags
Jordan: first paint "Filter by:"; opaque names. Casey: 38px hamburger, top select, 2481px no CTA. SME owner: "Finance Automation" framing, no outcome. Vetter: no stack/data signal on index; buzzwords without links.

## Minor Observations
Dead toggle CSS (:64-101, :137-166); select focus = hover, <3:1; detail badge white on #DDA744 ~2.2:1 (callmind.astro:77).

## Questions to Consider
- Fewer projects with honest labels vs 8 unlabelled?
- Category filter vs "your problem → what we built" rows?
