# 2026-11-11: SEO quick wins shipped as 0.10.0

Started with "why does Ahrefs show 0 keywords?" and ended with the 21 Oct audit's quick wins live on 72ai.in. Ahrefs counts only keywords in its own database with volume, and almost all of our real queries are brand searches it drops. Search Console is the source that matters now.

## What shipped

| Commit / PR | What |
|---|---|
| `faca2ff` | `docs(seo)`: spec retargets `/voice-dna/` and adds internal links |
| `0cf49c8` | `perf(fonts)`: self-host and preload Plus Jakarta Sans |
| `e643566` | `feat(projects)`: NextSurge disclaimer, underlined breadcrumbs |
| `73b9be7` | `feat(seo)`: 7 titles, 4 descriptions, Voice DNA links |
| `d9de882` | `test(seo)`: 4 assertions from the PR review |
| `9b82a88` | `chore`: gitignore `.impeccable/config.json` |
| PR #46, #47, #48 | merged to develop, released to main, back-merged; tag `v0.10.0` |

## Why Voice DNA got its own row

The Search Console export (last 90 days, grouped by query and page) has 90 rows. About 350 impressions are `ai7xxxx` code queries with 0 clicks, so roughly 40% of what GSC shows is noise.

The only real non-brand cluster is Voice DNA: "voice dna claude", "voice dna system", "voice dna", "claude voice dna" and "skills for claude to write like a human". That's 54 impressions, positions 1 to 20, and 0 clicks. So the title became "Voice DNA for Claude: Write Like a Human" and the footer now links to it from every page.

## Things that came up during the build

- **Martech post title was 64 chars.** The scan of `dist/` caught it; it now uses `seoTitle` (55 chars).
- **₹ falls back.** It's in latin-ext, and the site uses it once (welcome post). Shipping latin-ext for 1 glyph would cost about 30 KB on every page, so it renders in the system font.
- **The font file is 27 KB**, below the 40 to 60 KB the spec guessed.
- **A first negative test lied.** Removing the font from `public/` didn't fail the test, because `astro preview` serves `dist/`. Removing it from `dist/` did.
- **Astro writes `&` as `&#38;`** and blog posts have 2 `<footer>` elements. Both broke the first draft of the test and neither was a site bug.

## Tests

- `tests/e2e/seo-quick-wins.spec.ts`, 7 tests, written first; each failed before its change.
- Each of the 4 review assertions (empty description, Google Fonts `@import`, static weight, preload mismatch) was checked by breaking `dist/` and watching it fail.
- `npm run test:e2e`: 295 passed, 9 skipped, 0 failed. CI green on #46, #47 and #48.

## Live check after deploy

```bash
curl -s https://72ai.in/ | grep -o '<title>[^<]*</title>'
curl -sI https://72ai.in/fonts/plus-jakarta-sans-latin.woff2 | grep -i content-type
```

Homepage and Voice DNA titles are the new ones, the font returns `font/woff2`, the NextSurge note renders with `role="note"`, and the footer links to `/voice-dna/`.

## Still to do

1. Look at the live pages in a browser: heading weight 800, the 6-link footer on mobile.
2. Lighthouse mobile on `/`, `/projects/callmind/` and the AutoResearch post (target: CallMind LCP under 4 s, accessibility 100).
3. Request indexing for `/projects/nextsurge/` in Search Console.
4. In about 4 weeks, compare homepage CTR and the Voice DNA queries. The weekly GSC routine tracks both.
5. Out of scope and still blocked on positioning decision 1: homepage cards, About copy and description, site schema.
