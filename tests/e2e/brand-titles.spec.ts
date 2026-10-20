import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// The brand is "72° AI LABS" (PRODUCT.md). Titles had drifted to "72° AI Labs",
// and the AutoResearch post title ran to 130 chars in search results.
const titleOf = (html: string) =>
  (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').replace(/&#39;/g, "'");

test('every page title uses the 72° AI LABS brand', async ({ request }) => {
  // Project detail titles are owned by project-seo.spec.ts.
  for (const route of builtRoutes().filter((r) => !r.startsWith('/projects/'))) {
    const html = await (await request.get(route === '/' ? '/' : route + '/')).text();
    const title = titleOf(html);
    expect(title, route).toContain('72° AI LABS');
    expect(title, route).not.toContain('72° AI Labs');
  }
});

test('the AutoResearch post keeps its H1 but fits its title in 60 chars', async ({ request }) => {
  const html = await (await request.get('/blog/autoresearch_2026-04-14/')).text();
  const title = titleOf(html);
  expect(title).toBe("Karpathy's AutoResearch on a $300 RTX 3060 | 72° AI LABS");
  expect(title.length).toBeLessThanOrEqual(60);
  expect(html).toMatch(/<h1[^>]*>I Ran Karpathy/);
});

test('Organization schema links the company and founder LinkedIn pages', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)![1]);
  const org = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Organization');
  expect(org.sameAs).toEqual(['https://www.linkedin.com/company/108617337/']);
  expect(org.founder.sameAs).toEqual(['https://www.linkedin.com/in/mandar-gite/']);
});
