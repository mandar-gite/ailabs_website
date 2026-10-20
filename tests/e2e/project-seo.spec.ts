import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Project titles were bare product names and descriptions were 46-108 chars,
// so search snippets carried no buyer term. Each page needs its own fitted pair.
test('project pages have unique, search-sized titles and descriptions', async ({ request }) => {
  const projects = builtRoutes().filter((r) => r.startsWith('/projects/'));
  expect(projects.length).toBeGreaterThan(5);

  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of projects) {
    const html = await (await request.get(route + '/')).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';

    expect(title, route).toMatch(/^[^|]+: [^|]+ \| 72° AI LABS$/);
    expect(title.length, `${route} title: ${title}`).toBeLessThanOrEqual(60);
    expect(description.length, `${route} description: ${description}`).toBeGreaterThanOrEqual(120);
    expect(description.length, `${route} description: ${description}`).toBeLessThanOrEqual(160);
    expect(description, route).not.toContain('—');

    titles.add(title);
    descriptions.add(description);
  }
  expect(titles.size).toBe(projects.length);
  expect(descriptions.size).toBe(projects.length);
});

test('project pages carry BreadcrumbList and CreativeWork schema', async ({ request }) => {
  for (const route of builtRoutes().filter((r) => r.startsWith('/projects/'))) {
    const html = await (await request.get(route + '/')).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    const work = blocks.find((b) => b['@type'] === 'CreativeWork');
    const url = `https://72ai.in${route}/`;
    expect(crumbs?.itemListElement.map((i: { item: string }) => i.item), route)
      .toEqual(['https://72ai.in/', 'https://72ai.in/projects/', url]);
    expect(work?.url, route).toBe(url);
    expect(work?.creator?.['@id'], route).toBe('https://72ai.in/#organization');
    expect(work?.description, route).toBe(html.match(/<meta name="description" content="([^"]*)"/)![1].replace(/&#39;/g, "'"));
  }
});
