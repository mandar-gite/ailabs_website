# 26 Nov 2026: project pages, TreadCycle and 8 case studies, releases 0.21.0 to 0.23.0

3 releases went live today. Every project page now has full copy, the ML work has its own group name, TreadCycle is on the site, and 72ai.in carries 8 case studies, up from 4. Git strategy, the sitemap date fix and the analytics fixes from the same day are in `~/72ai/docs/changelog/2026-11-26-git-strategy-and-growth-fixes.md`.

## 0.21.0: full copy for 10 project pages (tag v0.21.0, 13:24 IST)

- **PR #114.** Full copy for every project but NextSurge, from the 22 Nov drafts in the marketing repo.
- **4 claims settled before merge.** CallMind now says "a pilot is running there". JNVessays keeps "multilingual", GradeQP keeps "University of Mumbai rules" (the rulebook matches the official circular), and LeapBuddy keeps "Every turn is logged" (the data policy is approved).
- **Thin content fixed.** Main content now runs 387 to 567 words on those 10 pages, against 22 to 375 words of project text before. NextSurge still has 145.

## 0.22.0: ML group, NextSurge, TreadCycle (tag v0.22.0, 15:35 IST)

- **ML group (PR #119).** "Data Engineering & Reporting" is now "ML, Data Engineering & Reporting", in the group lists, the about page, the solutions page, the company schema and `llms.txt`. The id stays `data-engineering`, so old anchor links still work. CI caught 1 missed place, the site-wide company description.
- **NextSurge (PR #118).** "NextSurge Momentum Alpha" is now "NextSurge".
- **TreadCycle (PR #120).** The tyre replacement GMM proof of concept is back on the site, in the ML group. The client is "a tyre manufacturer", no car maker is named, the data limit is stated (4 years of replacements hides the long lags) and no timing-certainty figures appear. Copy comes from a brief written from the `oem_recursion` code (`website_brief/tyre-life.md`, gitignored). `PRODUCT.md` records the new rule.

## 0.23.0: 4 more case studies and claim fixes (tag v0.23.0, 17:38 IST)

- **Case studies (PR #131).** Contract Risk Radar, Farm Wildlife Alerts, GradeQP and Valent, copied from the marketing repo above the `---` line. A DataForSEO check (US / India monthly volume) set the titles:

  | Case study | Term | Volume |
  |---|---|---|
  | Contract Risk Radar | ai contract review | 880 / 70 |
  | Farm Wildlife Alerts | crop protection from animals | 10 / 90 |
  | GradeQP | ai question paper | 10 / 880 |
  | Valent | liquidation preference | 590 / 140 |

  Farm Wildlife Alerts moved from "wildlife detection", which gets under 20 searches a month.
- **Case studies menu (PR #128).** A new optional `navTitle` field gives each case study a short menu label with no project name and no client type, such as "Hindi call audits for calling teams". An e2e test fails on a project name or "NGO" in either menu. SEO titles stay as they were.
- **Farm Wildlife Alerts (PR #126).** "Licence-checked" is gone: v4 was trained mostly on non-commercial images. "A small raider half-hidden behind a large animal" became what the code does: each animal is classified on its own crop.
- **Contract Risk Radar (PRs #127, #130).** The page says only the company's security team can see contracts and findings. The long-contract challenge now says what `src/pipeline/l1_judgment.py` does: 10 obligations per model call, on contracts of nearly 200 clauses.
- **Footer (PR #129).** The Resources links drop to `--text-sm`.

## Marketing repo (`72ailabs/72ai-marketing`)

- **#66, #68.** The tyre-life case study was rewritten as TreadCycle from the code. The 25 Nov draft described usage logs and a survival model, neither of which the project used. The dashboard sign-in line came out once Mandar decided against a sign-in.
- **#69, #70, #71, #72.** Mandar's answers on the Farm Wildlife Alerts, GradeQP, Valent and Contract Risk Radar case studies: Maharashtra only (Akola cut), data handling left out of GradeQP and Valent, the Valent cap table is a demo, and Contract Risk Radar names who sees the findings.

## Housekeeping

- 40 merged remote branches deleted across the website, marketing and analytics repos, and branch auto-delete turned on in all 8 repos.
- Every release used a worktree and a `chore/back-merge-x.y.z` branch, per `docs/GIT_STRATEGY.md`.
