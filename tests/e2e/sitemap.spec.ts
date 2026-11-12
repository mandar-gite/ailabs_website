import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';
import { sourceFiles } from '../../src/utils/sitemapLastmod.mjs';

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

  // Independent checks against git: a plain page, a blog post, and 2 listing pages
  // whose content comes from data files
  const cases: [string, string[]][] = [
    ['/voice-dna/', ['src/pages/voice-dna.astro']],
    ['/blog/welcome-to-72ai-blog/', ['src/content/blog/welcome-to-72ai-blog.md']],
    ['/projects/', ['src/pages/projects/index.astro', 'src/data/projects.json']],
    ['/blog/', ['src/pages/blog/index.astro', 'src/content/blog']],
  ];
  for (const [path, files] of cases) {
    const entry = urls.find((u) => u.includes(`<loc>https://72ai.in${path}</loc>`))!;
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { encoding: 'utf8' }).trim();
    expect(Date.parse(entry.match(/<lastmod>([^<]*)<\/lastmod>/)![1]), path).toBe(Date.parse(gitDate));
  }
});

// Today every data file is older than its page, so the date checks above can't
// tell a dropped data file from a mapped one. This guards the mapping itself:
// every data file a page imports must count towards its lastmod.
test('sitemap lastmod sources include every data file a page imports', () => {
  const pages: [string, string][] = [
    ['/', 'src/pages/index.astro'],
    ['/about/', 'src/pages/about.astro'],
    ['/blog/', 'src/pages/blog/index.astro'],
    ['/projects/', 'src/pages/projects/index.astro'],
    ['/projects/callmind/', 'src/pages/projects/[id].astro'],
    ['/solutions/', 'src/pages/solutions/index.astro'],
  ];
  for (const [path, file] of pages) {
    const src = readFileSync(file, 'utf8');
    const imported = [...src.matchAll(/from ["'](?:\.\.\/)+(data\/[\w-]+\.json|utils\/engagement)["']/g)].map((m) =>
      m[1].startsWith('utils/') ? `src/${m[1]}.ts` : `src/${m[1]}`,
    );
    if (/getCollection\(["']blog["']/.test(src)) imported.push('src/content/blog');
    const mapped = sourceFiles(path);
    for (const dep of imported) expect(mapped, `${path} imports ${dep}`).toContain(dep);
  }
});
