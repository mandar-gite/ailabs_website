import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Collects every same-site link from every built page and checks none 404.
// Desktop only: the link set is the same on mobile.
test('no internal link is broken', async ({ page, request, isMobile, baseURL }) => {
  test.skip(isMobile, 'same links on both layouts');
  test.setTimeout(120_000);

  const links = new Map<string, string>(); // target path -> first page linking to it
  for (const route of builtRoutes()) {
    await page.goto(route);
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== new URL(baseURL!).origin) continue;
      if (!links.has(url.pathname)) links.set(url.pathname, route);
    }
  }

  const broken: string[] = [];
  for (const [target, from] of links) {
    const res = await request.get(target);
    if (res.status() >= 400) broken.push(`${target} (${res.status()}) linked from ${from}`);
  }
  expect(broken).toEqual([]);
});
