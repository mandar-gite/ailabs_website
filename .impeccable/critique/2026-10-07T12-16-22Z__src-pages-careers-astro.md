---
target: careers
total_score: 20
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 2
target_identity: "file:/home/mandar/media/G/website_72ai/src/pages/careers.astro"
target_fingerprint: "sha256:82ac0a273d39544a979d94c4968cef61dbd13798fbfb7f8c7b0a13958f64f9d3"
target_path: /home/mandar/media/G/website_72ai/src/pages/careers.astro
timestamp: 2026-10-07T12-16-22Z
slug: src-pages-careers-astro
---
Method: dual-agent (A: design review, isolated; B: detector, own headless browser).
## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility | 2 | Applicants land on sales /thanks |
| 2 | Real world | 2 | H1 "Thanks for your interest" before any action |
| 3 | Control | 3 | Simple form |
| 4 | Consistency | 1 | home.css .value-icon tiles; off-spec submit |
| 5 | Error prevention | 2 | Required unmarked, no autocomplete |
| 6 | Recognition | 3 | Labels above fields |
| 7 | Flexibility | n/a | Short form |
| 8 | Minimalist | 3 | Cleanest page |
| 9 | Error recovery | 2 | Native bubbles only |
| 10 | Help | 2 | No process/timeline/location |
| Total | | 20/36 | Acceptable (56%) |
## Verdict
Generic CV page; values specific. Detector: placeholders 2.2:1, kicker above heading, #0a1535 x2, 6 off-scale sizes, 2 radii.
## Priority Issues
- [P1] No role/location/stack/process; "Share your CV" with no upload or profile URL. clarify.
- [P1] Misleading H1 (:24); _redirect (:85) to sales /thanks. clarify.
- [P2] home.css leak tiles; outline removed, 2.2:1 gold focus border. harden.
- [P2] Drift palette :142,148,217,247. polish.
## Persona Red Flags
Jordan thinks they applied; Casey long textarea no link field; ML engineer "small team" unverified, no stack/work links; vetter no engineering signal.
## Minor
6 em dashes, 4 negation constructions, stale endpoint comment.
