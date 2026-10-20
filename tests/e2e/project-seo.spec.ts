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
