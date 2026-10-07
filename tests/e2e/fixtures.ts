import { test as base, expect } from '@playwright/test';

// Every request that leaves localhost is answered with an empty 204 here, so no
// test can send a real lead to HubSpot/Formspree or ping GA4, Clarity or Apollo.
// Fulfilling (instead of aborting) keeps "Failed to load resource" noise out of
// the console checks. Specs that need a real-looking response register their
// own page.route(), which takes precedence over this context-level route.
type Fixtures = {
  blocked: string[];
  suppressExitPopup: boolean;
};

export const test = base.extend<Fixtures>({
  suppressExitPopup: [true, { option: true }],

  blocked: async ({ context }, use) => {
    const blocked: string[] = [];
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return route.continue();
      }
      blocked.push(url.href);
      return route.fulfill({ status: 204, body: '' });
    });
    await use(blocked);
  },

  // The exit-intent popup would cover the page in unrelated specs, so it is
  // marked as already shown unless a spec opts out.
  page: async ({ page, blocked, suppressExitPopup }, use) => {
    void blocked; // make sure the network guard is installed before any navigation
    if (suppressExitPopup) {
      await page.addInitScript(() => sessionStorage.setItem('exit_popup_shown', '1'));
    }
    await use(page);
  },
});

export { expect };
