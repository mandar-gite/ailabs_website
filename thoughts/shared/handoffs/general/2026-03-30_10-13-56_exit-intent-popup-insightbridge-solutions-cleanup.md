---
date: 2026-03-30T15:43:56+0530
researcher: claude-sonnet-4-6
git_commit: 066d26f21135c4618c2a59f79698a8e6ddcef5d9
branch: main
repository: ailabs_website (mandar-gite/ailabs_website)
topic: "Exit-Intent Popup + InsightBridge Hide + Solutions Cleanup"
tags: [conversion-optimization, exit-intent, popup, insightbridge, solutions, projects]
status: complete
last_updated: 2026-03-30
last_updated_by: claude-sonnet-4-6
type: implementation_strategy
---

# Handoff: general — Exit-Intent Popup + InsightBridge + Solutions Cleanup

## Task(s)

1. **Exit-Intent Popup** — COMPLETED & LIVE (deployed to 72ai.in)
   - Centered modal overlay, dark navy card, gold eyebrow, blue CTA
   - Desktop trigger: `mouseleave` with `clientY < 5`
   - Mobile trigger: 40s timer, scroll check (`scrollY < innerHeight`) evaluated at fire time
   - Suppression: `sessionStorage` key `exit_popup_shown` — once per tab session
   - Sitewide via `Layout.astro`
   - CTA "Book a Free Call →" links to `/#contact`, immediately hides overlay on click (no animation)
   - Dismiss: ✕ button, backdrop click, Escape key, "continue browsing" link
   - Full ARIA: `role="dialog"`, `aria-modal`, `aria-labelledby="exit-heading"`, `aria-describedby="exit-sub"`, focus trap, focus restore
   - `prefers-reduced-motion` handled in CSS (`animation: none`) and JS (skip `animationend` path, hide immediately)

2. **Hide InsightBridge from website** — COMPLETED & LIVE
   - Added `"hidden": true` to insightbridge in `src/data/projects.json:166`
   - Filter applied in `src/pages/projects/index.astro:9`
   - Removed insightbridge from `src/data/solutions.json` onprem-llm entry
   - Page files kept intact (`src/pages/projects/insightbridge.astro`, `src/pages/Downloads/insightbridge.astro`) — accessible by direct URL

3. **Remove empty On-Prem LLM Systems section** — COMPLETED & LIVE
   - `src/data/solutions.json` — entire `onprem-llm` entry removed (it had `"projects": []` after InsightBridge was hidden)
   - Solutions page now shows 5 categories, all with projects

## Critical References

- `docs/superpowers/specs/2026-03-30-exit-intent-popup-design.md` — popup spec (ARIA, triggers, suppression details)
- `docs/superpowers/plans/2026-03-30-exit-intent-popup.md` — Playwright TDD plan (written but not executed — user chose manual testing)

## Recent changes

- `src/components/ExitIntentPopup.astro` — new file (entire popup component)
- `src/layouts/Layout.astro:4` — added import for ExitIntentPopup
- `src/layouts/Layout.astro:185` — added `<ExitIntentPopup />` after `<slot />`
- `src/data/projects.json:166` — added `"hidden": true` to insightbridge entry
- `src/pages/projects/index.astro:9` — filter `(p: any) => !p.hidden` on projects array
- `src/data/solutions.json` — removed entire onprem-llm section (was lines 27–31)

## Learnings

- **CTA link + same-page anchor**: Setting `sessionStorage` in the click handler is not enough when CTA href is a same-page anchor (`/#contact`). The overlay must also be explicitly hidden (`overlay.style.display = 'none'`) — otherwise it stays visible while the page scrolls underneath. No animation needed on CTA click — the scroll is the visual transition.
- **`animationend` + reduced motion**: When CSS `animation: none` is applied via `prefers-reduced-motion`, `animationend` never fires. JS `hidePopup()` must check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at call time and bypass the animation listener entirely.
- **Astro scoped styles + dynamic classes**: Classes added at runtime (`.is-exiting`) still match Astro-scoped rules because the element carries the `data-astro-cid-*` attribute in the static HTML output — no special handling needed.
- **Hidden projects pattern**: `"hidden": true` in `src/data/projects.json` + `.filter((p: any) => !p.hidden)` in page-level frontmatter is the reusable pattern. Apply to any future project that should be hidden without deleting files.
- **Empty solution sections**: Removing a project's ID from `solutions.json` leaves the solution section rendering with an empty grid. Must also remove the solution entry if no projects remain.
- **sessionStorage scope**: Per-tab, survives page refresh, cleared on tab close. To test popup repeatedly: `sessionStorage.removeItem('exit_popup_shown')` in console.
- **`src/Documents/` warning**: Contains archived copies of data files (`src/Documents/data/projects.json`, `src/Documents/pages/`). These are NOT imported by active pages — active data is in `src/data/`. The insightbridge `hidden` flag was only applied to `src/data/projects.json`.

## Artifacts

- `src/components/ExitIntentPopup.astro` — popup component (markup, styles, JS)
- `src/layouts/Layout.astro` — modified (import + render popup sitewide)
- `src/data/projects.json` — insightbridge marked `"hidden": true`
- `src/pages/projects/index.astro` — hidden filter applied
- `src/data/solutions.json` — onprem-llm entry removed
- `docs/superpowers/specs/2026-03-30-exit-intent-popup-design.md` — approved popup spec
- `docs/superpowers/plans/2026-03-30-exit-intent-popup.md` — Playwright TDD plan (not executed)

## Action Items & Next Steps

1. **CHANGELOG** — not updated this session. Add entries for: exit-intent popup, InsightBridge hidden, On-Prem LLM section removed.
2. **Remaining conversion optimization** (from roadmap `ROADMAP_SUMMARY.md`):
   - WhatsApp floating button — simplest, highest immediate impact
   - ROI calculator — client-side JS, most complex
   - Multi-step contact form — replace `src/components/ContactForm.astro`
   - Calendly booking integration
3. **Footer logo fix** — `src/components/Footer.astro` still has the old inline SVG pentagon mark. Nav was fixed (`src/components/Nav.astro`) using `public/logos/logo.jpg` with overflow crop — footer needs the same treatment.
4. **Playwright e2e tests** — plan at `docs/superpowers/plans/2026-03-30-exit-intent-popup.md` is written and reviewed but not executed. If test infrastructure is needed, the plan is ready to execute.
5. **GIT Strategy** — user has not set up branch strategy. Remind if multi-person collaboration is planned.

## Other Notes

- **Deploy**: push to `main` → `.github/workflows/deploy.yml` → GitHub Pages at `72ai.in` (~45s build time)
- **Local dev**: `npm run dev -- --host 0.0.0.0 --port 4321`, accessible from Mac via Tailscale at `100.94.66.37:4321`
- **Brand colors**: `#0C1A3F` (navy), `#DDA744` (gold), `#2563EB` (accent blue)
- **Contact form**: `src/components/ContactForm.astro` — Formspree endpoint `xdkdvzvl`, redirects to `/thanks`
- **Active data files**: `src/data/` (projects.json, solutions.json) — NOT `src/Documents/data/`
- **All commits this session**: `99d788e` (insightbridge hide), `f5a7815` (popup), `21c207d` (plan doc), `bfee5ae` (spec fix), `37b8e34` (spec initial), `066d26f` (solutions cleanup) — all on `main`, pushed and deployed
