---
target: callmind detail
total_score: 15
max_score: 32
na_heuristics: 7,9
p0_count: 1
p1_count: 2
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/projects/callmind.astro"
target_fingerprint: "sha256:78eb623362ee9a581b1c4aa61ee6f12e4fe9225c6c15e99ec6d0028810d80544"
target_path: /home/mandar/media/G/website_72ai/src/pages/projects/callmind.astro
timestamp: 2026-10-07T12-16-22Z
slug: src-pages-projects-callmind-astro
---
Method: dual-agent (A: design review, isolated; B: detector, own headless browser). Source-verified: projects.json callmind (sales/support, topic extraction, sentiment) vs website_brief/callmind.md (Hindi script-compliance audit); 8 of 9 detail pages byte-identical after id normalisation.
## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility | 2 | No project status |
| 2 | Real world | 1 | Jargon, no problem statement |
| 3 | Control | 3 | Breadcrumb + back |
| 4 | Consistency | 1 | home.css .cta-section navy slab; gold badge; cream |
| 5 | Error prevention | 2 | Skip link dead; CTA drops context |
| 6 | Recognition | 3 | Scannable sections |
| 7 | Flexibility | n/a | Single read |
| 8 | Minimalist | 2 | Slab outweighs content |
| 9 | Error recovery | n/a | No input |
| 10 | Help | 1 | No demo/related/pilot info |
| Total | | 15/32 | Poor (47%) |
## Verdict
Template: 3 jargon lists + 1 sentence; 9 duplicated files. Detector: badge 2.2:1 (:79), #c49038 (:98), 5 off-scale sizes.
## Priority Issues
- [P0] Page describes a different product than the brief; replace with grounded fields respecting brief fences (no customer name, no README benchmarks, "100%" unverified, status unstated, demo link pending confirmation). clarify.
- [P1] No problem/outcome layer in Project type (src/types.ts:3-15); merge into [id].astro. shape, layout.
- [P1] home.css:206 .cta-section leak on all 9 detail pages. polish.
- [P2] Badge 2.17:1, 0.7-alpha italic, 18-21px links, unlabelled breadcrumb nav. harden.
## Persona Red Flags
Jordan "Diarisation"; Casey navy wall; owner no problem/cost/pilot; vetter no architecture/demo/result, claims mismatch demo.
## Minor
"72° AI Labs" casing in SEO title; generic CTA copy.
