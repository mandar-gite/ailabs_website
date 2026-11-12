import { execFileSync } from 'node:child_process';
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

// lastmod comes from the git history of each page's source files, so Google
// recrawls pages after a release instead of waiting for a manual request.
test('every sitemap URL has a git-based lastmod', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text();
  const urls = [...xml.matchAll(/<url>(.*?)<\/url>/g)].map((m) => m[1]);
  expect(urls.length).toBeGreaterThan(15);

  const dates = urls.map((u) => {
    const loc = u.match(/<loc>([^<]*)<\/loc>/)![1];
    const lastmod = u.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1];
    expect(lastmod, `${loc} has no lastmod`).toBeTruthy();
    const t = Date.parse(lastmod!);
    expect(t, `${loc} lastmod ${lastmod}`).not.toBeNaN();
    expect(t, `${loc} lastmod in the future`).toBeLessThanOrEqual(Date.now());
    return lastmod;
  });
  // All equal means build-time stamping or a shallow clone in CI (fetch-depth: 0)
  expect(new Set(dates).size, 'every lastmod is the same').toBeGreaterThan(1);

  // Independent check against git for 1 page
  const voice = urls.find((u) => u.includes('<loc>https://72ai.in/voice-dna/</loc>'))!;
  const gitDate = execFileSync('git', ['log', '-1', '--format=%cI', '--', 'src/pages/voice-dna.astro'], { encoding: 'utf8' }).trim();
  expect(Date.parse(voice.match(/<lastmod>([^<]*)<\/lastmod>/)![1])).toBe(Date.parse(gitDate));
});
