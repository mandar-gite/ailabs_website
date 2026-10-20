import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Slashless internal URLs 301 on GitHub Pages; Search Console was reporting
// /about, /blog, /projects and /solutions in their redirecting form.
test('internal links, canonicals and JSON-LD URLs use the trailing-slash form', async ({ page }) => {
  const bad: string[] = [];
  for (const route of builtRoutes()) {
    await page.goto(route === '/' ? '/' : route + '/');
    bad.push(...(await page.evaluate(() => {
      const slashless = (p: string) => p !== '/' && !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p);
      const out: string[] = [];
      for (const a of document.querySelectorAll('a[href^="/"]')) {
        const p = a.getAttribute('href')!.split(/[?#]/)[0];
        if (p && slashless(p)) out.push(`href ${p}`);
      }
      const canon = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
      if (slashless(new URL(canon).pathname)) out.push(`canonical ${canon}`);
      for (const s of document.querySelectorAll('script[type="application/ld+json"]'))
        for (const m of s.textContent!.matchAll(/"https:\/\/72ai\.in(\/[^"#]*)?"/g))
          if (m[1] && slashless(m[1])) out.push(`json-ld ${m[0]}`);
      return out;
    })).map((f) => `${route}: ${f}`));
  }
  expect([...new Set(bad)]).toEqual([]);
});

test('/en/careers redirect stub points at /careers/', async ({ request }) => {
  const html = await (await request.get('/en/careers/')).text();
  expect(html).toContain('<link rel="canonical" href="https://72ai.in/careers/"');
  expect(html).toContain('url=/careers/');
});

test('file links still resolve without a trailing slash', async ({ request }) => {
  for (const path of ['/rss.xml', '/voice-dna.md', '/discovery-brief-prompt.txt', '/llms.txt'])
    expect((await request.get(path)).status(), path).toBe(200);
});
