import { test, expect } from './fixtures';

const LINKS = ['Solutions', 'Projects', 'Blog', 'About', 'Contact Us'];

test('desktop nav shows every link on one line', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout only');
  await page.goto('/');
  const nav = page.locator('#nav-links');
  await expect(page.locator('#mobile-menu-button')).toBeHidden();

  const tops = new Set<number>();
  for (const name of LINKS) {
    const link = nav.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();
    tops.add(Math.round((await link.boundingBox())!.y));
  }
  expect(tops.size).toBe(1);
});

test('desktop nav link navigates', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout only');
  await page.goto('/');
  await page.locator('#nav-links').getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/?$/);
});

test('mobile menu toggles open and closed', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout only');
  await page.goto('/');
  const button = page.locator('#mobile-menu-button');
  const menu = page.locator('#mobile-menu');

  await expect(page.locator('#nav-links')).toBeHidden();
  await expect(menu).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');

  await button.click();
  await expect(menu).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  for (const name of LINKS) {
    await expect(menu.getByRole('link', { name, exact: true })).toBeVisible();
  }

  await button.click();
  await expect(menu).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});
