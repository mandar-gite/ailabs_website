import { test, expect } from './fixtures';

// MarTech was dropped from the site (PRODUCT.md, 2026-10-07). Old links to its
// page must land somewhere useful, and nothing may still list it.
for (const slug of ['martech', 'insightbridge']) {
  test(`old ${slug} URL redirects to /projects`, async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    await expect(page).toHaveURL(/\/projects\/?$/);
  });
}

for (const path of ['/projects', '/solutions']) {
  test(`${path} no longer lists MarTech or its practice area`, async ({ page }) => {
    await page.goto(path);
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/MarTech/i);
    expect(text).not.toMatch(/Content & Marketing Intelligence/);
  });
}

// FastAccounting is expense classification, forecasting and anomaly detection
// (verified from its repo, 2026-10-12); the old reconciliation claim must not return.
test('FastAccounting page describes the verified work, not reconciliation', async ({ page }) => {
  await page.goto('/projects/fastaccounting');
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/reconcil/i);
  expect(text).toContain('Tally');
});
