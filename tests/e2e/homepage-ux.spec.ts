import { test, expect } from './fixtures';

test('hero has one solid primary CTA that leads to contact', async ({ page }) => {
  await page.goto('/');
  const actions = page.locator('.hero-actions a');
  await expect(actions.first()).toHaveText('Talk to Us');
  await expect(actions.first()).toHaveAttribute('href', '/#contact');

  const [primaryBg, secondaryBg] = await actions.evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).backgroundColor),
  );
  expect(primaryBg).not.toBe(secondaryBg);
  expect(primaryBg).not.toBe('rgb(255, 255, 255)');
});

test('hero copy is left-aligned with the buttons and has no em dash', async ({ page }) => {
  await page.goto('/');
  const body = page.locator('.hero-body');
  expect(await body.evaluate((el) => getComputedStyle(el).textAlign)).toBe('left');
  await expect(body).not.toContainText('—');

  const textLeft = (await body.boundingBox())!.x;
  const buttonLeft = (await page.locator('.hero-actions a').first().boundingBox())!.x;
  expect(Math.abs(buttonLeft - textLeft)).toBeLessThanOrEqual(2);
});

// Follows the visitor once the hero is gone, and gets out of the way at the
// contact section, where the real form and calendar already are.
test('floating book-a-call button shows between hero and contact', async ({ page }) => {
  await page.goto('/');
  const fab = page.locator('#book-call-fab');
  await expect(fab).toBeHidden();

  await page.locator('section.process').scrollIntoViewIfNeeded();
  await expect(fab).toBeVisible();
  await expect(fab).toHaveAttribute('href', '#book-call');

  await page.locator('#book-call').scrollIntoViewIfNeeded();
  await expect(fab).toBeHidden();
});

test('calendar panel shows a placeholder until the embed loads', async ({ page }) => {
  // The fixture answers the embed script with an empty 204, so no iframe appears.
  await page.goto('/');
  await page.locator('#book-call').getByRole('button', { name: 'Show available times' }).click();
  await expect(page.locator('#book-call .meetings-placeholder')).toBeVisible();
});
