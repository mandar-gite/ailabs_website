---
target: solutions
total_score: 9
max_score: 28
na_heuristics: 7,9,10
p0_count: 1
p1_count: 2
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/solutions/index.astro"
target_fingerprint: "sha256:29b7756ce9b1f8b6df6084a3da359524cd0a94fe369f5f90dc011ee9dc1e9a62"
target_path: /home/mandar/media/G/website_72ai/src/pages/solutions/index.astro
timestamp: 2026-10-07T11-58-22Z
slug: src-pages-solutions-index-astro
---
Method: dual-agent (A: design review, isolated; B: detector in its own headless browser). Source-verified: cascade/usedcar missing from projects.json, "Six practice areas" TL;DR, no h1.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 1 | No H1, no active nav, no in-page index |
| 2 | Match System / Real World | 1 | Practice-area jargon + AI buzzwords |
| 3 | User Control and Freedom | 2 | Section ids unlinked |
| 4 | Consistency and Standards | 1 | Nested cards, cream, #DDA744 pill CTA, 12px/2px |
| 5 | Error Prevention | 1 | Missing project ids drop silently |
| 6 | Recognition Rather Than Recall | 2 | Cards repeat section name |
| 7 | Flexibility and Efficiency | n/a | Linear persuasion page |
| 8 | Aesthetic and Minimalist Design | 1 | 3 of 5 sections hold one card |
| 9 | Error Recovery | n/a | No error states |
| 10 | Help and Documentation | n/a | Marketing page |
| Total | | 9/28 | Poor (32%) |

## Design Specificity Verdict
Template, partly broken: 5 boxed sections of generic solutions.json descriptions plus the same ProjectCards as /projects. No owner problem, no ownership/no-lock-in, no Discovery-PoC-Build path. Detector: CLI 3 advisory (50px radius :129, #c49038 :137, 1.5rem :152); overlay 15 (5 side-tab on 3px #DDA744 header borders :78-81, 8 category labels 2.2:1, footer 2.6:1). No overflow at 390.

## Priority Issues
- [P0] cascade (solutions.json:12) and usedcar (:30) absent from projects.json, vanish silently; TL;DR (:20) and meta (:14) promise six areas incl. On-Prem LLM, 5 render. Reconcile, add build-time id check. harden.
- [P1] No H1/thesis/owner framing (:21-25). clarify.
- [P1] Voice: Robust, Comprehensive, AI-powered, Advanced, intelligent; em dash and "not a slide deck" (:20); "tailored to your operational context". clarify.
- [P2] Nested card-in-box, 290px cards at 390, empty single-card rows. layout.
- [P2] Palette drift: cream, #DDA744, #c49038, gold glow, CTA wraps at 390. polish.

## Persona Red Flags
Jordan: jargon headings, no H1. Casey: 4608px page, CTA only at bottom, no jump list, 38px hamburger. SME owner: "for Indian businesses" narrows; no cost/ownership/first step. Vetter: buzzwords, no links to blog depth.

## Minor Observations
CTA heading H3 after H2s; dead .page-title CSS (:143); hidden projects not filtered (:11).

## Cross-page
Same 8 cards on both pages; /projects filtered = /solutions section. Recommend /solutions = owner page (problem-led, ownership line, 3-step path, text links), /projects = vetter page (H1, revived ProjectTable with plain labels, honest tags, CTA); or merge into /work.

## Questions to Consider
- One project per area: practice area or project with a heading?
- Where does an owner learn they own the result and pay no subscription?
