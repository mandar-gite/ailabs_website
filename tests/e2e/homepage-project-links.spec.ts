import { readdirSync, readFileSync } from 'node:fs';
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
  await page.locator('#nav-links [data-menu="projects"] > a').hover();
  const panel = page.locator('#nav-links [data-menu="projects"] .nav-dropdown-panel');
  await expect(panel).toBeVisible();
  expect(await hrefs(panel.locator('a:not(.nav-dropdown-all)'))).toEqual([...active].sort());
});

test('phone menu lists every active project under Projects', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout only');
  await page.goto('/');
  await page.locator('#mobile-menu-button').click();
  const sub = page.locator('#mobile-menu .nav-mobile-sub[data-menu="projects"]');
  await expect(sub).toBeVisible();
  expect(await hrefs(sub.locator('a'))).toEqual([...active].sort());
});

test('keyboard focus on Projects opens the menu and Tab moves into it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout only');
  await page.goto('/');
  const trigger = page.locator('#nav-links [data-menu="projects"] > a');
  await trigger.focus();
  await expect(page.locator('#nav-links [data-menu="projects"] .nav-dropdown-panel')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#nav-links [data-menu="projects"] .nav-dropdown-panel a').first()).toBeFocused();
});

// Drafts get no page (src/pages/blog/[slug].astro), so a draft card would 404.
const draftSlugs = readdirSync('src/content/blog')
  .filter((f) => /^draft:\s*true\s*$/m.test(readFileSync(`src/content/blog/${f}`, 'utf8')))
  .map((f) => f.replace(/\.mdx?$/, ''));

test('Latest writing shows the 3 newest published posts, and each link works', async ({ page, request }) => {
  await page.goto('/');
  const cards = page.locator('.latest-writing .post-card');
  await expect(cards).toHaveCount(3);
  const dates = await cards.locator('time').evaluateAll((els) => els.map((e) => Date.parse(e.getAttribute('datetime')!)));
  expect(dates).toEqual([...dates].sort((a, b) => b - a));
  const links = await cards.evaluateAll((els) => els.map((a) => a.getAttribute('href')!));
  for (const href of links) {
    expect(draftSlugs.some((slug) => href.includes(slug)), `${href} is a draft`).toBe(false);
    expect((await request.get(href)).ok(), href).toBe(true);
  }
});
