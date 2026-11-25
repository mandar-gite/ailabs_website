# Case-study pages

25 Nov 2026. Ajay reviewed the case studies and projects on a call with Mandar and was largely happy with them. He asked that each case study point readers who want the technical detail to the project page. Mandar decided to publish the case studies on 72ai.in.

## What ships

- A `case-studies` content collection (`src/content/config.ts`). Each entry names its `project`, and the build fails if that project isn't in `projects.json`.
- `/case-studies/<slug>/` for each published entry, and a `/case-studies/` index.
- Each case study ends its impact section with "Want to know how it's built?" and a link to `/projects/<project>/`.
- A project page with a published case study links back to it under its tagline.
- `/projects/` links to `/case-studies/` once at least 1 case study is published.
- Drafts are filtered everywhere, so a live page never links to an unbuilt case study.
- sitemap lastmod: case-study pages date from their own file; `/projects/`, project pages and the index also date from `src/content/case-studies`.

| Case study | Slug | Project page |
|---|---|---|
| Hindi call scoring for an education NGO | `callmind` | `/projects/callmind/` |
| Teacher assistant on an NGO's own material | `leapbuddy` | `/projects/leapbuddy/` |
| Masked programme reports for an education NGO | `report-copilot` | `/projects/report-copilot/` |
| MCA filings to due-diligence reports | `docintel` | `/projects/docintel/` (nearest page; Mandar, 25 Nov) |

## Source of truth

The text is copied from `72ailabs/72ai-marketing`, `case-studies/2026-11-24-case-study-*.md` on `docs/case-studies-web`. Edit it there first, then copy it here. The H1 moves into `title`, and `https://72ai.in/` links become relative.

## Permissions (Mandar, 25 Nov)

All 4 are anonymised. NEXUS may show "2,000+ documents a month" and "3 months" from proof of concept to production. LeapBuddy is described as a pilot under way, in positive terms, with no usage figures. Client quotes and unconfirmed figures were removed.

## Out of scope

- A "Case studies" nav item (option a). The nav is unchanged for now.
- Homepage "Recent work" and "Latest writing" from `2026-11-21-seo-on-site-fixes.md`.
- A fuller DocIntel project page for the NEXUS work.

## Tests

`tests/e2e/case-studies.spec.ts`: each entry names a live project; each published page returns 200 with 1 H1 and links to its project page, which links back; drafts return 404 and aren't linked; the index lists only published entries and `/projects/` links to it.
