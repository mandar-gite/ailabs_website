---
target: blog index
total_score: 17
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/blog/index.astro"
target_fingerprint: "sha256:3d57d65fca1fc768f257ee1c8fa98aeb201f043e7ac22e308fa24356b703c4f5"
target_path: /home/mandar/media/G/website_72ai/src/pages/blog/index.astro
timestamp: 2026-10-07T12-06-55Z
slug: src-pages-blog-index-astro
---
Method: dual-agent (A: design review, isolated; B: detector in its own headless browser).

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | No active nav state, no post count |
| 2 | Match System / Real World | 3 | Subtitle promises case studies that don't exist |
| 3 | User Control and Freedom | 3 | Simple whole-card links |
| 4 | Consistency and Standards | 1 | Cream, #DDA744 labels, 12px/2px cards, transition:all |
| 5 | Error Prevention | 3 | Little to get wrong |
| 6 | Recognition Rather Than Recall | 2 | Tags look clickable, aren't |
| 7 | Flexibility and Efficiency | 1 | RSS exists but undiscoverable |
| 8 | Aesthetic and Minimalist Design | 2 | Repeated author, 13 tag chips |
| 9 | Error Recovery | n/a | No error states |
| 10 | Help and Documentation | n/a | 3-item list |
| Total | | 17/32 | Acceptable (53%) |

## Design Specificity Verdict
Stock 3-equal-cards-on-cream blog; flagship AutoResearch post weighted like the welcome post; dates read dormant. Detector: CLI 2 advisory (4px :155, 1.5rem :161); overlay 3 (side-tab on header bottom rule = false positive, footer 2.6:1, overused-font = false positive). No overflow at 390.

## Priority Issues
- [P1] Drift palette (:82,90,96,116,144,204), gold labels 2.03:1 on cream. polish.
- [P1] Flagship gets no hierarchy; featured flag set but .featured-badge (:149-158) unwired. layout.
- [P2] RSS undiscoverable (no link rel=alternate). clarify.
- [P2] No path to contact. onboard.

## Persona Red Flags
Casey: card 1 is 642px tall, mostly tags. Vetter: 3 posts, newest 6 months old. Owner: "SMB"/"machine-learning" chips meaningless.

## Minor Observations
"!" in empty state; ad-hoc alpha colour; em dash in excerpt; verify /og-blog.jpg exists.

## Questions to Consider
- Lead with AutoResearch as a feature instead of a grid?
- "Lab notes" instead of "Blog"?
