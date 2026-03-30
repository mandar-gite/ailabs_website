# Exit-Intent Popup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centered modal overlay popup that fires on exit-intent (desktop: cursor leaves top of viewport; mobile: 40s low-engagement timer), offers a free AI readiness call, suppresses for the rest of the session, and appears on all pages sitewide.

**Architecture:** A single `ExitIntentPopup.astro` component encapsulates all markup, scoped CSS, and a standard Astro `<script>` (module-scoped, client-side). It is imported once in `Layout.astro` and rendered after `<slot />`. The overlay is hidden by default via `display:none` in markup; JS reveals it at trigger time.

**Tech Stack:** Astro 5, Tailwind CSS (scoped component styles only), vanilla JS (`sessionStorage`, `mouseleave`, `setTimeout`), Playwright for e2e tests.

**Spec:** `docs/superpowers/specs/2026-03-30-exit-intent-popup-design.md`

---

## Chunk 1: Playwright Setup + Failing Tests

### Task 1: Install Playwright

**Files:**
- Create: `playwright.config.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install Playwright**

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

Expected: Chromium browser installed, `@playwright/test` in `devDependencies`.

- [ ] **Step 2: Create `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0 --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
```

- [ ] **Step 3: Add test script to `package.json`**

Add to the `"scripts"` block:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts package.json package-lock.json
git commit -m "chore: add Playwright e2e test infrastructure"
```

---

### Task 2: Write Failing E2E Tests

**Files:**
- Create: `tests/e2e/exit-intent-popup.spec.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/e2e/exit-intent-popup.spec.ts
import { test, expect } from '@playwright/test';

// Helper: trigger exit-intent by moving mouse to top of viewport
async function triggerExitIntent(page: import('@playwright/test').Page) {
  await page.mouse.move(400, 300); // start mid-page
  await page.mouse.move(400, 0);   // move to top edge (clientY ≈ 0)
  // Dispatch a mouseleave event with clientY=0 directly on document
  await page.evaluate(() => {
    const e = new MouseEvent('mouseleave', {
      bubbles: true,
      cancelable: true,
      clientY: 0,
    });
    document.dispatchEvent(e);
  });
}

test.describe('Exit-Intent Popup', () => {

  test('popup is hidden on page load', async ({ page }) => {
    await page.goto('/');
    const overlay = page.locator('#exit-overlay');
    await expect(overlay).toBeHidden();
  });

  test('popup appears on desktop exit-intent trigger', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    const overlay = page.locator('#exit-overlay');
    await expect(overlay).toBeVisible({ timeout: 2000 });
  });

  test('popup has correct content', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    await expect(page.locator('#exit-heading')).toContainText('free AI readiness assessment');
    await expect(page.locator('#exit-sub')).toContainText('15 minutes');
    await expect(page.locator('#exit-cta')).toContainText('Book a Free Call');
  });

  test('CTA links to /#contact', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    const cta = page.locator('#exit-cta');
    await expect(cta).toHaveAttribute('href', '/#contact');
  });

  test('dismiss via close button hides popup', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    await page.locator('#exit-overlay').waitFor({ state: 'visible' });
    await page.locator('#exit-close').click();
    await expect(page.locator('#exit-overlay')).toBeHidden({ timeout: 1000 });
  });

  test('dismiss via overlay click hides popup', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    await page.locator('#exit-overlay').waitFor({ state: 'visible' });
    // Click the backdrop (overlay itself, not the card)
    await page.locator('#exit-overlay').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#exit-overlay')).toBeHidden({ timeout: 1000 });
  });

  test('dismiss via Escape key hides popup', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    await page.locator('#exit-overlay').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await expect(page.locator('#exit-overlay')).toBeHidden({ timeout: 1000 });
  });

  test('popup does not show again after dismiss in same session', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    await page.locator('#exit-overlay').waitFor({ state: 'visible' });
    await page.locator('#exit-close').click();
    await expect(page.locator('#exit-overlay')).toBeHidden();

    // Trigger again in the same session
    await triggerExitIntent(page);
    // Wait a short time to confirm it does not appear
    await page.waitForTimeout(500);
    await expect(page.locator('#exit-overlay')).toBeHidden();
  });

  test('popup shows on non-homepage pages (sitewide)', async ({ page }) => {
    await page.goto('/solutions');
    await triggerExitIntent(page);
    await expect(page.locator('#exit-overlay')).toBeVisible({ timeout: 2000 });
  });

  test('popup has correct ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await triggerExitIntent(page);
    await page.locator('#exit-overlay').waitFor({ state: 'visible' });
    const card = page.locator('#exit-card');
    await expect(card).toHaveAttribute('role', 'dialog');
    await expect(card).toHaveAttribute('aria-modal', 'true');
    await expect(card).toHaveAttribute('aria-labelledby', 'exit-heading');
    await expect(card).toHaveAttribute('aria-describedby', 'exit-sub');
  });

});
```

- [ ] **Step 2: Run tests — verify ALL fail (component does not exist yet)**

```bash
npm run test:e2e
```

Expected: All tests FAIL with errors like "waiting for locator '#exit-overlay'" — confirms tests are exercising real behavior.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/e2e/exit-intent-popup.spec.ts
git commit -m "test(e2e): add failing exit-intent popup tests"
```

---

## Chunk 2: Component Implementation

### Task 3: Create `ExitIntentPopup.astro` — Markup and Styles

**Files:**
- Create: `src/components/ExitIntentPopup.astro`

- [ ] **Step 1: Create the component with markup and styles only (no JS yet)**

```astro
---
// ExitIntentPopup.astro
// Exit-intent popup — centered modal overlay
// Triggered by: desktop mouseleave (clientY<5) or mobile 40s low-engagement timer
// Suppression: sessionStorage key 'exit_popup_shown' (cleared on tab close)
---

<div id="exit-overlay" style="display:none" aria-hidden="true">
  <div
    id="exit-card"
    role="dialog"
    aria-modal="true"
    aria-labelledby="exit-heading"
    aria-describedby="exit-sub"
  >
    <button id="exit-close" aria-label="Close popup">✕</button>
    <p class="exit-eyebrow">Before you go</p>
    <h2 id="exit-heading">Get a free AI readiness assessment for your business</h2>
    <p id="exit-sub" class="exit-sub">15 minutes. No pitch. Just clarity.</p>
    <a href="/#contact" id="exit-cta">Book a Free Call →</a>
    <button id="exit-dismiss">continue browsing</button>
  </div>
</div>

<style>
  /* Overlay: hidden by default via inline style="display:none" on the element.
     JS sets overlay.style.display = 'flex' to show it.
     This block defines the flex layout used when visible. */
  #exit-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  #exit-card {
    background: #0C1A3F;
    border-radius: 12px;
    padding: 2rem 2.25rem;
    max-width: 400px;
    width: 100%;
    position: relative;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    animation: popup-enter 280ms ease-out both;
  }

  #exit-card.is-exiting {
    animation: popup-exit 220ms ease-in both;
  }

  @keyframes popup-enter {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes popup-exit {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(16px); }
  }

  @media (prefers-reduced-motion: reduce) {
    #exit-card,
    #exit-card.is-exiting {
      animation: none;
    }
  }

  #exit-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 1.1rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem;
    transition: color 0.15s;
  }

  #exit-close:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  .exit-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #DDA744;
    margin: 0 0 0.75rem;
  }

  #exit-heading {
    font-size: 1.125rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.4;
    margin: 0 0 0.75rem;
  }

  .exit-sub {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.5rem;
  }

  #exit-cta {
    display: inline-block;
    background: #2563EB;
    color: #ffffff;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 0.75rem 1.75rem;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.15s;
    margin-bottom: 1rem;
  }

  #exit-cta:hover {
    background: #1d4ed8;
  }

  #exit-dismiss {
    display: block;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.8rem;
    cursor: pointer;
    margin: 0 auto;
    text-decoration: underline;
    padding: 0;
    transition: color 0.15s;
  }

  #exit-dismiss:hover {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
```

- [ ] **Step 2: Wire component into `Layout.astro`**

Two edits to `src/layouts/Layout.astro`:

**Edit 1** — add import to the frontmatter block (after the existing `import '../styles/home.css';` line, around line 4):
```astro
import ExitIntentPopup from '../components/ExitIntentPopup.astro';
```

**Edit 2** — add `<ExitIntentPopup />` on a new line immediately after `<slot />` (currently line 183). Do NOT remove or replace the existing `<style>` block that follows it (lines 184–200 contain the `.skip-to-main` CSS — leave it intact).

The result should be:
```astro
    <slot />
    <ExitIntentPopup />
    <style>
        .skip-to-main { ... }   {/* existing styles — do not remove */}
    </style>
```

- [ ] **Step 3: Run the "hidden on page load" test only — verify it passes**

```bash
npm run test:e2e -- --grep "hidden on page load"
```

Expected: 1 test PASS. The overlay renders hidden. All other tests still fail (no JS trigger yet).

- [ ] **Step 4: Commit**

```bash
git add src/components/ExitIntentPopup.astro src/layouts/Layout.astro
git commit -m "feat(popup): add exit-intent popup component markup and styles"
```

---

### Task 4: Add Trigger JS to `ExitIntentPopup.astro`

**Files:**
- Modify: `src/components/ExitIntentPopup.astro` (add `<script>` block)

- [ ] **Step 1: Add the `<script>` block to the component**

Append this after the `<style>` block in `ExitIntentPopup.astro`:

```astro
<script>
  const STORAGE_KEY = 'exit_popup_shown';
  const overlay = document.getElementById('exit-overlay') as HTMLElement;
  const card = document.getElementById('exit-card') as HTMLElement;
  const closeBtn = document.getElementById('exit-close') as HTMLButtonElement;
  const dismissBtn = document.getElementById('exit-dismiss') as HTMLButtonElement;
  const ctaLink = document.getElementById('exit-cta') as HTMLAnchorElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let previouslyFocused: HTMLElement | null = null;

  // --- Show / Hide ---

  function showPopup() {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    previouslyFocused = document.activeElement as HTMLElement;
    overlay.style.display = 'flex';
    overlay.removeAttribute('aria-hidden');
    card.classList.remove('is-exiting');
    closeBtn.focus();
    document.addEventListener('keydown', handleKeydown);
  }

  function hidePopup() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    document.removeEventListener('keydown', handleKeydown);

    if (prefersReducedMotion) {
      // Skip animation — hide immediately (animationend would never fire when animation: none)
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      if (previouslyFocused) previouslyFocused.focus();
      return;
    }

    card.classList.add('is-exiting');
    card.addEventListener('animationend', () => {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      card.classList.remove('is-exiting');
      if (previouslyFocused) previouslyFocused.focus();
    }, { once: true });
  }

  // --- Focus Trap ---

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      hidePopup();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      card.querySelectorAll<HTMLElement>('button, a[href]')
    ).filter(el => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // --- Dismiss Handlers ---

  closeBtn.addEventListener('click', hidePopup);
  dismissBtn.addEventListener('click', hidePopup);

  // Overlay backdrop click (but not the card itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });

  // CTA: set sessionStorage synchronously before navigation
  ctaLink.addEventListener('click', () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    // href navigation proceeds naturally
  });

  // --- Triggers ---

  // Desktop: mouseleave toward top of viewport
  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

  document.addEventListener('mouseleave', (e) => {
    if (isTouchDevice()) return;
    if ((e as MouseEvent).clientY < 5) {
      showPopup();
    }
  });

  // Mobile: 40s timer, scroll check evaluated at fire time
  if (isTouchDevice()) {
    setTimeout(() => {
      if (window.scrollY < window.innerHeight) {
        showPopup();
      }
    }, 40000);
  }
</script>
```

- [ ] **Step 2: Run the full test suite**

```bash
npm run test:e2e
```

Expected: All 9 tests PASS.

If any test fails, check:
- "hidden on page load" fails → inline `style="display:none"` missing from overlay markup
- "popup appears on trigger" fails → `mouseleave` event not dispatching correctly in test helper; confirm `clientY: 0` is below the `< 5` threshold
- "dismiss" tests fail → verify `animationend` fires in test environment; if not, check if the CSS animation is being skipped (add `animation-duration: 0s` in a test-only media query, or set `prefers-reduced-motion` in Playwright)
- "not shown again" fails → `sessionStorage` check in `showPopup()` may not be running before `style.display = 'flex'`

- [ ] **Step 3: Commit**

```bash
git add src/components/ExitIntentPopup.astro
git commit -m "feat(popup): add exit-intent trigger logic, focus trap, and session suppression"
```

---

### Task 5: Build Verification

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. Astro bundles the `<script>` tag from `ExitIntentPopup.astro` into the client JS bundle.

- [ ] **Step 2: Preview the production build and smoke-test manually**

```bash
npm run preview
```

Open `http://localhost:4321` in a browser. Move the cursor rapidly toward the browser tab bar. The popup should appear. Dismiss it. Move cursor again — popup should not reappear. Close the tab and reopen — popup should appear again on next exit-intent.

- [ ] **Step 3: Final commit**

```bash
git add src/components/ExitIntentPopup.astro src/layouts/Layout.astro playwright.config.ts package.json package-lock.json tests/e2e/exit-intent-popup.spec.ts
git commit -m "feat(popup): exit-intent popup complete — sitewide, session-suppressed, accessible"
```
