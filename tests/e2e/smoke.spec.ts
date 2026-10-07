import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Pages that currently ship without an <h1> (found 2026-10-07). test.fail()
// keeps the suite green while flagging them; once a page gets its <h1> the test
// "unexpectedly passes" and fails the run, so remove it from this list then.
const KNOWN_MISSING_H1 = new Set(['/about', '/projects', '/solutions']);

for (const route of builtRoutes()) {
  test(`${route} loads cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(/72° AI Labs/i);
    expect(errors).toEqual([]);
  });

  test(`${route} has exactly one h1`, async ({ page }) => {
    test.fail(KNOWN_MISSING_H1.has(route), 'page has no <h1> yet');
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('unknown routes return the 404 page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page Not Found/);
});
