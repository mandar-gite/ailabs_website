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
`mouseleave` does not fire on touch devices. Trigger after **40 seconds** of page time if the user has not scrolled more than one viewport height (low-engagement proxy). This avoids interrupting engaged users who are reading.

### Suppression
Use `sessionStorage` key `exit_popup_shown = "1"`. Set on:
- Dismiss via ✕ button
- Dismiss via overlay click
- Dismiss via Escape key
- CTA button click ("Book a Free Call")

`sessionStorage` is automatically cleared when the browser tab closes, so "once per session" requires no manual expiry.

---

## Component: `ExitIntentPopup.astro`

### Markup Structure

```
<div id="exit-overlay">        ← full-screen dimmed backdrop
  <div id="exit-card">         ← centered dark card (#0C1A3F)
    <button id="exit-close">✕</button>
    <p class="exit-eyebrow">Before you go</p>
    <h2>Get a free AI readiness assessment for your business</h2>
    <p class="exit-sub">15 minutes. No pitch. Just clarity.</p>
    <a href="/#contact">Book a Free Call →</a>
    <button id="exit-dismiss">continue browsing</button>
  </div>
</div>
```

### Visual Design

- Overlay: `background: rgba(0,0,0,0.6)`, `z-index: 9999`
- Card: `background: #0C1A3F`, `border-radius: 12px`, `max-width: 400px`, centered via flexbox
- Eyebrow: gold (`#DDA744`), uppercase, small
- Headline: white, bold, `font-size: ~1.25rem`
- Subtext: `rgba(255,255,255,0.6)`
- CTA button: `background: #2563EB` (brand accent), white text, rounded
- Dismiss link: `rgba(255,255,255,0.35)`, underline on hover
- ✕ close: top-right of card, `rgba(255,255,255,0.4)`

### Animation

- **Enter:** card fades in + slides up (`translateY(16px)` → `translateY(0)`) over 280ms ease-out
- **Exit:** reverse — slides down + fades out, then overlay removed from DOM

### Accessibility

- `role="dialog"` and `aria-modal="true"` on overlay
- `aria-label="Exit intent popup"` on card
- Focus trapped inside card while open (focus ✕ on open)
- `Escape` key closes

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

## Out of Scope

- A/B testing copy variants
- Calendly embed inside the popup (deferred — adds complexity)
- localStorage-based "never show again" (not requested)
- Analytics event tracking (deferred — GA4 not yet wired)
