import { test, expect } from './fixtures';

test('privacy page names every data processor and the contact address', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('h1')).toHaveText('Privacy policy');
  const text = await page.locator('main').innerText();
  for (const name of ['HubSpot', 'Formspree', 'Google Analytics', 'Microsoft Clarity', 'Apollo', 'Cloudflare', 'GitHub Pages']) {
    expect(text, name).toContain(name);
  }
  await expect(page.locator('main a[href="mailto:mandar.gite@72ai.in"]').first()).toBeVisible();
  expect(text).not.toContain('—');
});

test('footer links to the privacy policy on every page type', async ({ page }) => {
  for (const path of ['/', '/projects', '/blog']) {
    await page.goto(path);
    await expect(page.locator('footer a[href="/privacy/"]'), path).toBeVisible();
  }
});

test.describe('consent banner', () => {
  test.use({ consent: null });
  test('links to the privacy policy', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#consent-banner a[href="/privacy/"]')).toBeVisible();
  });
});
