# SEO quick wins from the 21 Oct audit

Date: 2026-11-03. Source: `72ai-marketing/research/2026-10-21-seo-audit.md` (merged in 72ai-marketing PR #8), "Quick wins" table and "On-page issues". Built on `develop` at `007b85c`.

## Goal

Ship the audit fixes that need no founder decision: the NextSurge disclaimer, buyer-term titles, descriptions under 160 chars, no em dashes in metadata, a self-hosted font that stops blocking render, and underlined breadcrumb links.

## Out of scope

- **Homepage, About copy and site-wide schema to the 4 practice areas.** Positioning decision 1 is still open (Mandar, 3 Nov). The Sales, Customer Support and Logistics cards in `src/pages/index.astro:135-198`, the About description in `src/pages/about.astro:10` and the LocalBusiness and Service nodes in `src/layouts/Layout.astro:160-211` stay as they are.
- Case studies, the INR pricing page and the DPDP explainer (need verified facts).
- HSTS (a Cloudflare setting) and Clutch and GoodFirms profiles (outside the codebase).

## Changes

### 1. NextSurge disclaimer

`/projects/nextsurge/` shows trading-signal models with no "not investment advice" line. Google indexed it that way.

- `src/types.ts`: add `disclaimer?: string` to `Project`.
- `src/data/projects.json`: on `nextsurge`, add `"disclaimer": "Research project. Not investment advice, and not offered as a signal service."`
- `src/pages/projects/[id].astro`: when `project.disclaimer` is set, render it as `<p class="project-disclaimer" role="note">` right after the tagline, so it's above the fold on mobile. Other projects render nothing.

A data field keeps the line next to the project it belongs to, and the next research project gets one without a template change.

### 2. Titles

All titles stay at 60 chars or under and keep `72° AI LABS` (pinned by `tests/e2e/brand-titles.spec.ts`).

| Page | File | Now | New | Chars |
|---|---|---|---|---|
| `/` | `src/pages/index.astro:9` | 72° AI LABS \| Bespoke AI Systems for Growing Businesses | 72° AI LABS \| Custom AI Built on Your Business Data | 51 |
| `/solutions/` | `src/pages/solutions/index.astro:14` | Solutions \| 72° AI LABS | AI for Tally, Call Analytics and Document OCR \| 72° AI LABS | 59 |
| `/projects/` | `src/pages/projects/index.astro:13` | Projects \| 72° AI LABS | AI Projects Built on Real Business Data \| 72° AI LABS | 53 |
| `/about/` | `src/pages/about.astro:9` | About \| 72° AI LABS | About the Founder-Led AI Studio \| 72° AI LABS | 45 |
| `/blog/` | `src/pages/blog/index.astro:16` | Blog \| 72° AI LABS | Blog: Practical AI, RAG and Small Models \| 72° AI LABS | 54 |
| `/voice-dna/` | `src/pages/voice-dna.astro:8` | Voice DNA — Make Claude Sound Like You \| 72° AI LABS | Voice DNA: Make Claude Sound Like You \| 72° AI LABS | 51 |

The audit suggested "AI Case Studies on Real Business Data" for `/projects/`. The pages hold 105-242 words each, so "case studies" overclaims until they're expanded. "AI Projects" is the honest version; swap it when the case studies ship.

The homepage title swaps "Bespoke" for "Custom", the term buyers search, and keeps the site's main claim (AI built on the client's own data). It doesn't touch the cards that decision 1 covers.

### 3. Descriptions

| Page | File | Now (chars) | New | Chars |
|---|---|---|---|---|
| `/solutions/` | `src/pages/solutions/index.astro:15` | 164 | AI built on your own data in 4 practice areas: Finance Automation, Operational Intelligence, Document & OCR Systems, and Data Engineering & Integration. | 152 |
| `/blog/autoresearch_2026-04-14/` | `src/content/blog/autoresearch_2026-04-14.md:4` | 162, em dash | 57 autonomous experiments, 7 hours, 1 RTX 3060. Why smaller models win on consumer hardware, and what the agent found that flips the usual scaling playbook. | 156 |
| `/blog/blog1_martech_technical/` | `src/content/blog/blog1_martech_technical.md:3` | 165, "A deep dive" | How to build production-ready multi-agent RAG systems: architecture, quality loops, graceful degradation, and lessons from real implementations. | 144 |

`/about/` (166 chars) also runs long, but its fix rewrites the 6 areas it lists, so it waits for decision 1.

### 4. Self-hosted, preloaded Plus Jakarta Sans

Lighthouse mobile on 21 Oct: the Google Fonts stylesheet blocks render for about 870 ms, and the LCP element is a text paragraph waiting on the font. CallMind LCP is 4.5 s.

- Add the Plus Jakarta Sans variable font (latin subset, weights 400-800 in 1 woff2) as `public/fonts/plus-jakarta-sans-latin.woff2`. Fetch it once from Google Fonts; no npm dependency.
- `src/styles/global.css`: add an `@font-face` with `font-weight: 400 800`, `font-display: swap` and the latin `unicode-range`.
- `src/layouts/Layout.astro:83-85`: delete the 2 preconnects and the Google Fonts stylesheet; add `<link rel="preload" href="/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>`.
- Check the license (SIL OFL 1.1) and commit `public/fonts/OFL.txt` beside the font.

### 5. Underlined breadcrumb links

`src/pages/projects/[id].astro:125` sets `.breadcrumb a { text-decoration: none; }`, so the link is told apart by colour alone (Lighthouse accessibility 96 on CallMind). Change it to `underline` with `text-underline-offset: 2px`. Blog posts have breadcrumb schema but no visible breadcrumb, so nothing changes there.

## Tests

New file `tests/e2e/seo-quick-wins.spec.ts`, written first and failing before each change:

1. `/projects/nextsurge/` contains the exact disclaimer in a `role="note"` element; `/projects/callmind/` has no `.project-disclaimer`.
2. Each of the 6 pages in the titles table has the exact new title.
3. Every built route (from `tests/e2e/routes.ts`) has a title of 60 chars or under and a meta description of 160 chars or under, except `/about/` (out of scope, listed in the test).
4. No title or meta description on any route contains `—` or "deep dive".
5. No page links to `fonts.googleapis.com` or `fonts.gstatic.com`; every page preloads `/fonts/plus-jakarta-sans-latin.woff2`, and that file returns 200 with a woff2 content type.
6. On `/projects/callmind/`, the breadcrumb link's computed `text-decoration-line` is `underline`.

Then run the full suite with `npm run test:e2e`; `a11y-contrast.spec.ts` and `brand-titles.spec.ts` must still pass.

Before writing test 3, run it against the current build to list any route beyond the audit's 4 that breaks it. Fix those or add them to the exception list with a reason.

## Verification after deploy

1. Rerun the live crawl and Lighthouse mobile on `/`, `/projects/callmind/` and the AutoResearch post. Target: CallMind LCP under 4 s, accessibility 100.
2. Check in a browser that the headings render in Plus Jakarta Sans and that weight 800 still looks bold.
3. Ask Mandar, then request indexing for `/projects/nextsurge/` in Search Console (URL Inspection box, as in the 21 Oct handoff).
4. Record the results in `72ai-marketing/research/` as a follow-up to the audit.

## Risks

- The variable woff2 is about 40-60 KB. If it's much larger, fall back to static 400, 600 and 800 files and preload only 400.
- Dropping the Google Fonts CSS also drops its other subsets (latin-ext, vietnamese). Site copy is English with `°` and `₹`; check that both are in the latin range or add them to `unicode-range`.
- New titles change search snippets for pages that already earn clicks (the homepage has 19 of 23). Watch the homepage CTR in Search Console for 4 weeks after deploy.
