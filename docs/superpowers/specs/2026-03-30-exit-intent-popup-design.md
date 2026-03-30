# Exit-Intent Popup — Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Feature:** Conversion Optimization — Exit-Intent Popup

---

## Overview

A centered modal overlay popup that triggers when a visitor is about to leave the site. It offers a free AI readiness call, linking to the existing contact section. Designed to reduce bounce-to-exit rate across all pages sitewide.

---

## Requirements

- **Pattern:** Centered modal with dimmed backdrop
- **Offer:** "Book a free call" → links to `/#contact`
- **Frequency:** Once per session (suppressed after first dismiss or CTA click)
- **Scope:** All pages sitewide
- **Mobile:** Fallback time-based trigger (40 seconds on page, low engagement)

---

## Files

| Action | File |
|--------|------|
| Create | `src/components/ExitIntentPopup.astro` |
| Modify | `src/layouts/Layout.astro` |

---

## Trigger Logic

### Desktop
Listen for `document` `mouseleave` event. Fire when `e.clientY < 5` — cursor exiting through the top of the viewport (toward browser tab bar or address bar). This is the standard exit-intent signal.

### Mobile
`mouseleave` does not fire on touch devices. Trigger after **40 seconds** of page time if the user has not scrolled more than one viewport height. The scroll check must be evaluated at the moment the timer fires (not at timer setup time): `window.scrollY < window.innerHeight`. If the user has scrolled past that threshold by the time the timer fires, suppress the popup. Do not show the popup to engaged readers.

### Suppression
Use `sessionStorage` key `exit_popup_shown = "1"`. Set on:
- Dismiss via ✕ button
- Dismiss via overlay click
- Dismiss via Escape key
- CTA button click ("Book a Free Call") — must be set **synchronously before navigation**, since `href` navigation is immediate. This ensures the flag is written even for same-origin link navigations.

`sessionStorage` is automatically cleared when the browser tab closes, so "once per session" requires no manual expiry.

---

## Component: `ExitIntentPopup.astro`

### Markup Structure

`role="dialog"`, `aria-modal="true"`, and `aria-labelledby` belong on `#exit-card` (the bounded dialog region), not on the backdrop overlay.

`#exit-overlay` must render with `display: none` (via inline style or CSS class) so it is hidden at parse time. JavaScript removes that hidden state at trigger time to show it. Never rely on JS to hide a visible overlay after load — on slow connections this causes a full-screen dark flash before the script runs.

```
<div id="exit-overlay" style="display:none">  ← full-screen dimmed backdrop, hidden by default
  <div id="exit-card"
       role="dialog"
       aria-modal="true"
       aria-labelledby="exit-heading"
       aria-describedby="exit-sub">           ← centered dark card (#0C1A3F)
    <button id="exit-close">✕</button>
    <p class="exit-eyebrow">Before you go</p>
    <h2 id="exit-heading">Get a free AI readiness assessment for your business</h2>
    <p id="exit-sub" class="exit-sub">15 minutes. No pitch. Just clarity.</p>
    <a href="/#contact" id="exit-cta">Book a Free Call →</a>
    <button id="exit-dismiss">continue browsing</button>
  </div>
</div>
```

### Visual Design

- Overlay: `background: rgba(0,0,0,0.6)`, `z-index: 9999`
- Card: `background: #0C1A3F`, `border-radius: 12px`, `max-width: 400px`, centered via flexbox
- Eyebrow: gold (`#DDA744`), uppercase, small
- Headline (`#exit-heading`): white, bold, `font-size: ~1.25rem`
- Subtext (`#exit-sub`): `rgba(255,255,255,0.6)`
- CTA button: `background: #2563EB` (brand accent), white text, rounded
- Dismiss link: `rgba(255,255,255,0.35)`, underline on hover
- ✕ close: top-right of card, `rgba(255,255,255,0.4)`

### Animation

- **Enter:** card fades in + slides up (`translateY(16px)` → `translateY(0)`) over 280ms ease-out
- **Exit:** reverse — slides down + fades out, then overlay removed from DOM

### Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="exit-heading"`, `aria-describedby="exit-sub"` on `#exit-card`
- On open: move focus to `#exit-close` (first focusable element)
- **Focus trap:** While the popup is open, Tab and Shift+Tab must cycle only within the card. Collect all focusable children (`button`, `a[href]`). On Tab from the last element, wrap to the first. On Shift+Tab from the first element, wrap to the last. Implement inline (no external library — static site).
- `Escape` key closes (same dismiss path as ✕ button)
- On close: restore focus to the element that was focused before the popup opened (`document.activeElement` captured at trigger time)

### Script Tag

Use a standard Astro `<script>` tag (not `<script is:inline>`). Astro bundles and deduplicates standard script tags and runs them client-side as ES modules, ensuring `sessionStorage` and DOM APIs are available. `is:inline` bypasses bundling and module scoping — do not use it.

---

## Layout Integration

In `src/layouts/Layout.astro`, import and render `<ExitIntentPopup />` as the last child of `<body>`, after `<slot />` and before `</body>`.

```astro
import ExitIntentPopup from '../components/ExitIntentPopup.astro';
...
<ExitIntentPopup />
</body>
```

---

## CTA Navigation Note

The CTA (`/#contact`) navigates to the homepage and scrolls to `#contact`. On non-homepage pages this causes a full page navigation. This is intentional — the contact form lives at `index.astro#contact`. `sessionStorage` must be written synchronously in the click handler before the browser follows the `href`, so the suppression flag is set even if the current page unloads.

---

## Out of Scope

- A/B testing copy variants
- Calendly embed inside the popup (deferred — adds complexity)
- localStorage-based "never show again" (not requested)
- Analytics event tracking (deferred — GA4 not yet wired)
