---
date: 2026-03-30T14:35:45+0530
researcher: claude-sonnet-4-6
git_commit: f5a78152aea4655f76c87dbefce36ad91671f3da
branch: main
repository: ailabs_website (mandar-gite/ailabs_website)
topic: "Exit-Intent Popup + InsightBridge Hide"
tags: [conversion-optimization, exit-intent, popup, astro, insightbridge, projects]
status: complete
last_updated: 2026-03-30
last_updated_by: claude-sonnet-4-6
type: implementation_strategy
---

# Handoff: general — Exit-Intent Popup + InsightBridge Hide

## Task(s)

1. **Exit-Intent Popup (Conversion Optimization)** — COMPLETED & LIVE
   - Brainstormed, specced, planned, and implemented a centered modal exit-intent popup
   - Triggers on desktop (`mouseleave` with `clientY < 5`) and mobile (40s timer, `scrollY < innerHeight` check at fire time)
   - Suppressed once per session via `sessionStorage` key `exit_popup_shown`
   - Sitewide — added to `Layout.astro` so it appears on every page
   - CTA: "Book a Free Call →" links to `/#contact`, immediately hides overlay on click
   - Dismiss paths: ✕ button, overlay backdrop click, Escape key, "continue browsing" link
   - ARIA-compliant: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`, focus trap, focus restore
   - `prefers-reduced-motion` handled in both CSS and JS
   - Committed `f5a7815`

2. **Hide InsightBridge from website listings** — COMPLETED
   - Added `"hidden": true` to insightbridge entry in `src/data/projects.json`
   - Filtered hidden projects in `src/pages/projects/index.astro`
   - Removed `"insightbridge"` from the onprem-llm solution's projects array in `src/data/solutions.json`
   - Page files (`src/pages/projects/insightbridge.astro`, `src/pages/Downloads/insightbridge.astro`) left intact — accessible by direct URL
   - Committed `99d788e`

## Critical References

- `docs/superpowers/specs/2026-03-30-exit-intent-popup-design.md` — approved spec (ARIA details, trigger logic, suppression)
- `docs/superpowers/plans/2026-03-30-exit-intent-popup.md` — implementation plan (Playwright TDD plan, not yet executed — user chose manual testing instead)

## Recent changes

- `src/components/ExitIntentPopup.astro` — new file (entire component: markup, scoped styles, trigger JS)
- `src/layouts/Layout.astro:4` — added `import ExitIntentPopup` to frontmatter
- `src/layouts/Layout.astro:184` — added `<ExitIntentPopup />` after `<slot />`
- `src/data/projects.json:165` — added `"hidden": true` to insightbridge entry
- `src/pages/projects/index.astro:9` — filter `.filter((p: any) => !p.hidden)` on projects list
- `src/data/solutions.json:30` — changed `"projects": ["insightbridge"]` to `"projects": []`

## Learnings

- **Astro scoped styles + dynamic classes**: Astro scopes `<style>` block selectors with `data-astro-cid-*` at build time. Dynamically added classes (e.g. `.is-exiting`) still match scoped rules because the element already carries the CID attribute in the HTML — no special handling needed.
- **`animationend` + `prefers-reduced-motion`**: When `animation: none` is applied via a `@media (prefers-reduced-motion)` rule, `animationend` never fires. The `hidePopup()` JS must check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip the animation path entirely — hide immediately instead.
- **CTA link click**: Setting `sessionStorage` in the click handler is enough for navigation away from the page, but for same-page anchor navigation (`/#contact` on homepage) the overlay must also be explicitly hidden (`overlay.style.display = 'none'`) — otherwise it stays on top while the page scrolls underneath.
- **Hidden projects pattern**: Adding `"hidden": true` to `src/data/projects.json` + filtering in page-level JS is the reusable pattern to hide future projects without deleting files.
- **`sessionStorage` scope**: Per-tab, persists through refreshes, cleared on tab close. `localStorage` would persist across tabs and browser restarts — use that only if "once per day" or "once ever" suppression is desired.

## Artifacts

- `src/components/ExitIntentPopup.astro` — complete popup component
- `src/layouts/Layout.astro` — modified to include popup sitewide
- `src/data/projects.json` — insightbridge marked hidden
- `src/data/solutions.json` — insightbridge removed from onprem-llm solution
- `src/pages/projects/index.astro` — projects filtered by hidden flag
- `docs/superpowers/specs/2026-03-30-exit-intent-popup-design.md` — approved spec
- `docs/superpowers/plans/2026-03-30-exit-intent-popup.md` — implementation plan (Playwright TDD, not executed)

## Action Items & Next Steps

1. **CHANGELOG** — session changes not logged yet. Update `CHANGELOG.md` with the popup and InsightBridge hide.
2. **Remaining conversion optimization** from roadmap:
   - WhatsApp direct contact button (floating, sitewide — simplest next item)
   - ROI calculator (client-side JS — most complex)
   - Multi-step form (replace existing `ContactForm.astro` single-step form)
   - Calendly booking integration
3. **Footer logo fix** — `src/components/Footer.astro` still has the old inline SVG pentagon mark (`.footer-mark`). The nav logo was fixed (`src/components/Nav.astro`) to use `public/logos/logo.jpg` with crop; the footer needs the same treatment.
4. **Playwright e2e tests** — plan exists at `docs/superpowers/plans/2026-03-30-exit-intent-popup.md` but was not executed. The user chose manual testing. If test infrastructure is needed later, the plan is ready.
5. **GIT Strategy** — remind user to set up branch strategy if multi-person collaboration is planned.

## Other Notes

- **Local dev**: `npm run dev -- --host 0.0.0.0 --port 4321` (accessible from Mac via Tailscale at `100.94.66.37:4321`)
- **Deploy**: push to `main` triggers `.github/workflows/deploy.yml` → GitHub Pages at `72ai.in`
- **To test popup repeatedly without closing tab**: `sessionStorage.removeItem('exit_popup_shown')` then `document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 0 }))` in browser console
- **Brand colors**: `--logo-blue: #0C1A3F`, `--logo-gold: #DDA744`, `--accent: #2563EB`
- **Contact form**: `src/components/ContactForm.astro` uses Formspree endpoint `xdkdvzvl`, redirects to `/thanks` on submit
- **Duplicate data files**: `src/Documents/` and `src/Documents/data/` appear to be archived copies. Active data files are in `src/data/`. The insightbridge hide was applied only to `src/data/` (the live files).
- **`src/Documents/` warning**: If `src/Documents/projects.json` and `src/Documents/data/projects.json` are ever used by any page, they still have insightbridge without the `hidden` flag. Currently only `src/data/projects.json` is imported by active pages.
