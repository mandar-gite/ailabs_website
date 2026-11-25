import { test, expect } from './fixtures';

// Mandar, 25 Nov 2026: Case studies joins the nav with a hover menu like Projects,
// Voice DNA moves to a Resources group in the footer next to the discovery brief
// prompt, and the projects page says what we're building.

test('desktop nav: Case studies opens a hover menu of case studies', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout only');
  await page.goto('/');
  const item = page.locator('#nav-links').getByRole('link', { name: 'Case studies', exact: true });
  await expect(item).toHaveAttribute('href', '/case-studies/');
  await item.hover();
  const panel = page.locator('#nav-links [data-menu="case-studies"] .nav-dropdown-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('a[href^="/case-studies/"]')).not.toHaveCount(0);
});

test('nav links are bold and in the main ink colour', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout only');
  await page.goto('/');
  const weight = await page.locator('#nav-links > a').first().evaluate((a) => getComputedStyle(a).fontWeight);
  expect(Number(weight)).toBeGreaterThanOrEqual(700);
});

test('footer lists Voice DNA and the discovery brief prompt under Resources', async ({ page }) => {
  await page.goto('/');
  const resources = page.locator('footer [data-footer-resources]');
  await expect(resources).toContainText('Resources');
  await expect(resources.locator('a[href="/voice-dna/"]')).toHaveCount(1);
  await expect(resources.locator('a[href="/discovery-brief/"]')).toHaveCount(1);
  await expect(page.locator('footer .footer-nav a[href="/voice-dna/"]')).toHaveCount(0);
  await expect(page.locator('footer a[href="/case-studies/"]')).toHaveCount(1);
});

test('projects page says what we are building, under a Projects label', async ({ page }) => {
  await page.goto('/projects/');
  await expect(page.locator('h1')).toHaveText("What we're building");
  await expect(page.locator('.page-header-eyebrow')).toHaveText('Projects');
});

test('Voice DNA form note no longer mentions Google Form', async ({ page }) => {
  await page.goto('/voice-dna/');
  await expect(page.locator('main')).not.toContainText('Google Form');
});
