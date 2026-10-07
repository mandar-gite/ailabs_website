---
target: blog post template
total_score: 11
max_score: 28
na_heuristics: 5,9,10
p0_count: 1
p1_count: 3
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/blog/[slug].astro"
target_fingerprint: "sha256:8c51f99ffab4e4b3e22abd68c97bfafb4e603cbec1468db83264a54442fedc13"
target_path: /home/mandar/media/G/website_72ai/src/pages/blog/[slug].astro
timestamp: 2026-10-07T12-06-55Z
slug: src-pages-blog-slug-astro
---
Method: dual-agent (A: design review, isolated; B: detector in its own headless browser). Source-verified: 0 links in autoresearch md; FAQ :16 "7 hours produced 57" vs body :129/:285 "55 + 2"; stale "We'll update this post" (:268); centred meta at [slug].astro:175,218,237.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 1 | 2766 words, 18,655px mobile, no reading time/TOC |
| 2 | Match System / Real World | 2 | Unexplained jargon; lede shown twice |
| 3 | User Control and Freedom | 2 | Back link only at end; no section jumps |
| 4 | Consistency and Standards | 1 | Centred meta under left title; gold links 2.17:1; Courier New; cream |
| 5 | Error Prevention | n/a | Static reading surface |
| 6 | Recognition Rather Than Recall | 2 | Bold pseudo-headings; unlinked tags |
| 7 | Flexibility and Efficiency | 1 | No anchors, copy buttons, TOC |
| 8 | Aesthetic and Minimalist Design | 2 | Duplicate lede and tags; 27 bold runs |
| 9 | Error Recovery | n/a | No error states |
| 10 | Help and Documentation | n/a | FAQ is content |
| Total | | 11/28 | Poor (39%) |

## Design Specificity Verdict
Strong checkable content in a generic template; no sources, TOC, anchors, reading time, repo. Hook headline. Detector: CLI 7 (Courier New :310, blockquote 4px left rule :331, #c49038 :303, 4px :193/:309, 0.95rem :219/:342); overlay: 12 paragraphs at 86-92 chars/line desktop, Featured badge 2.2:1, footer 2.6:1. No page overflow; pre/tables scroll internally without cue.

## Priority Issues
- [P0] Zero outbound links; repo, stars figure, Shopify claim, forks, own fork/logs/results.tsv unlinked. Add sources block + reproduce box. harden.
- [P1] ~87 chars/line at 736px column; no TOC/anchors/reading time. Cap 68ch. typeset then layout.
- [P1] Charts unreadable at 390 (2779px to 342px), default matplotlib styling; tables clip Status column. adapt.
- [P1] Drift colours, header alignment (:175,218,237). polish.
- [P2] Weak conversion footer (26px links), byline "Indian SMBs" contradicts global positioning; no author card, prev/next. onboard.

## Persona Red Flags
Jordan: duplicate lede, unknown length, business angle at 85% depth. Casey: 18,655px, unreadable charts, clipped table, mid-word code clip. Vetter: no links, 57 vs 55+2 contradiction, stale update promise, Courier New. Owner: jargon, buried owner hook.

## Minor Observations
Em dashes (AutoResearch 2+2 JSON-LD, martech 4, welcome 2); "Not X. Y." at :237, :258; "A deep dive into"; martech ASCII diagram breaks from pre line-height 1.8; "here" link; no subscribe for "Stay Updated"; missing main-content id; no image dimensions/lazy; updatedDate unused; h1 tracking normal.

## Questions to Consider
- Would a public repo + 57-row results file beat /projects for a CTO?
- An "Experiment Log" post type with hardware/dataset/commit/status?
- A headline that names the finding?
