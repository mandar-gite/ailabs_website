import { test, expect } from './fixtures';

const posts = ['/blog/autoresearch_2026-04-14/', '/blog/blog1_martech_technical/', '/blog/welcome-to-72ai-blog/'];

for (const post of posts) {
  test(`${post} links into projects or solutions at least twice`, async ({ page, request }) => {
    await page.goto(post);
    const hrefs = await page.locator('.post-content a[href^="/"]').evaluateAll((as) =>
      as.map((a) => a.getAttribute('href')!).filter((h) => !h.startsWith('/#')));
    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const h of hrefs) expect((await request.get(h.split('#')[0])).status(), h).toBe(200);
  });
}

test('Voice DNA and About get in-content links', async ({ page }) => {
  await page.goto('/blog/blog1_martech_technical/');
  await expect(page.locator('.post-content a[href="/voice-dna/"]')).toHaveCount(1);
  await page.goto('/');
  await expect(page.locator('section.process a[href="/about/"]')).toHaveCount(1);
});

test('Valent names "cap table" in its first 100 words', async ({ page }) => {
  await page.goto('/projects/valent/');
  const words = (await page.locator('main').innerText()).split(/\s+/).slice(0, 100).join(' ');
  expect(words.toLowerCase()).toContain('cap table');
});

// The DPDP post had 1 internal link (from /blog/); Report Copilot is the system it describes.
test('Report Copilot and Solutions link to the DPDP post', async ({ page }) => {
  for (const route of ['/projects/report-copilot/', '/solutions/']) {
    await page.goto(route);
    await expect(page.locator('main a[href="/blog/dpdp-compliance-masked-reports/"]'), route).toHaveCount(1);
  }
});
