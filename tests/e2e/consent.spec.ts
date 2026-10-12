import { test, expect } from './fixtures';

// The e2e build sets fake tracker IDs (package.json test:e2e) so the banner
// renders; every outside request is stubbed by the fixture, so nothing real loads.
test.use({ consent: null });

const TRACKERS = [/googletagmanager\.com\/gtag\/js/, /clarity\.ms\/tag\//, /assets\.apollo\.io\/micro\/website-tracker/];
const trackerHits = (blocked: string[]) => TRACKERS.filter((re) => blocked.some((u) => re.test(u)));

test('banner shows on first visit and no tracker loads before a choice', async ({ page, blocked }) => {
  await page.goto('/');
  await expect(page.locator('#consent-banner')).toBeVisible();
  await page.waitForTimeout(500);
  expect(trackerHits(blocked)).toEqual([]);
});

test('Accept loads all 3 trackers and is remembered', async ({ page, blocked }) => {
  await page.goto('/');
  await page.locator('#consent-banner').getByRole('button', { name: 'Accept' }).click();
  await expect(page.locator('#consent-banner')).toBeHidden();
  await expect.poll(() => trackerHits(blocked).length).toBe(3);

  blocked.length = 0;
  await page.reload();
  await expect(page.locator('#consent-banner')).toBeHidden();
  await expect.poll(() => trackerHits(blocked).length).toBe(3);
});

test('Decline loads nothing and is remembered', async ({ page, blocked }) => {
  await page.goto('/');
  await page.locator('#consent-banner').getByRole('button', { name: 'Decline' }).click();
  await expect(page.locator('#consent-banner')).toBeHidden();
  await page.reload();
  await expect(page.locator('#consent-banner')).toBeHidden();
  await page.waitForTimeout(500);
  expect(trackerHits(blocked)).toEqual([]);
});

test('Cookie settings in the footer reopens the banner', async ({ page }) => {
  await page.goto('/');
  await page.locator('#consent-banner').getByRole('button', { name: 'Decline' }).click();
  await page.locator('footer').getByRole('button', { name: 'Cookie settings' }).click();
  await expect(page.locator('#consent-banner')).toBeVisible();
});
