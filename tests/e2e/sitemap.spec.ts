import { test, expect } from './fixtures';

// Search Console had no sitemap and only knew 12 of ~22 pages, so the sitemap
// must list only real, indexable pages: each one canonical to itself, no
// noindex, no meta-refresh redirect, and no URL listed twice.
test('sitemap lists only indexable, self-canonical pages', async ({ request }) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const sitemaps = [...index.matchAll(/<loc>https:\/\/72ai\.in(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  expect(sitemaps.length).toBeGreaterThan(0);

  const locs: string[] = [];
  for (const path of sitemaps) {
    const xml = await (await request.get(path)).text();
    locs.push(...[...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]));
  }
  expect(new Set(locs).size, 'duplicate <loc>').toBe(locs.length);
  expect(locs.length).toBeGreaterThan(15);

  for (const loc of locs) {
    expect(loc, 'missing trailing slash').toMatch(/\/$/);
    const res = await request.get(new URL(loc).pathname, { maxRedirects: 0 });
    expect(res.status(), loc).toBe(200);
    const html = await res.text();
    expect(html, `${loc} is noindex`).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
    expect(html, `${loc} is a redirect page`).not.toMatch(/http-equiv="refresh"/);
    expect(html, `${loc} canonical`).toContain(`<link rel="canonical" href="${loc}"`);
  }
});

test('sitemap lastmod is not stamped with the build time', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text();
  expect(xml).not.toContain('<lastmod>');
});
