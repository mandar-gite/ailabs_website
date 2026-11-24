import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

// NextSurge is parked, so the homepage and nav leave it out.
const projects: { id: string }[] = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));
const active = projects.map((p) => `/projects/${p.id}/`).filter((href) => href !== '/projects/nextsurge/');

const hrefs = (locator: import('@playwright/test').Locator) =>
  locator.evaluateAll((els) => [...new Set(els.map((a) => a.getAttribute('href')))].sort());

test('homepage body links every active project page', async ({ page }) => {
  await page.goto('/');
  const linked = await hrefs(page.locator('main a[href^="/projects/"][href$="/"]:not([href="/projects/"])'));
  expect(linked).toEqual([...active].sort());
});

test('desktop Projects menu lists every active project', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout only');
  await page.goto('/');
  await page.locator('#nav-links .nav-dropdown > a').hover();
  const panel = page.locator('#nav-links .nav-dropdown-panel');
  await expect(panel).toBeVisible();
  expect(await hrefs(panel.locator('a:not(.nav-dropdown-all)'))).toEqual([...active].sort());
});

test('phone menu lists every active project under Projects', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout only');
  await page.goto('/');
  await page.locator('#mobile-menu-button').click();
  const sub = page.locator('#mobile-menu .nav-mobile-sub');
  await expect(sub).toBeVisible();
  expect(await hrefs(sub.locator('a'))).toEqual([...active].sort());
});
