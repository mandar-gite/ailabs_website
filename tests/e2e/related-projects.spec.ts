import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

type P = { id: string; category: string; hidden?: boolean };
const read = (f: string) => JSON.parse(readFileSync(new URL(`../../src/data/${f}`, import.meta.url), 'utf8'));
const visible = (read('projects.json') as P[]).filter((p) => !p.hidden);
const solutions = read('solutions.json') as { id: string; name: string }[];

for (const p of visible) {
  test(`${p.id} links its category siblings and solution area`, async ({ page, request }) => {
    await page.goto(`/projects/${p.id}/`);
    const section = page.locator('[data-related]');
    const siblings = visible.filter((q) => q.category === p.category && q.id !== p.id).map((q) => `/projects/${q.id}/`);
    const links = await section.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));

    expect(links.filter((h) => h.startsWith('/projects/')).sort()).toEqual(siblings.sort());
    expect(links).not.toContain(`/projects/${p.id}/`);
    const sol = solutions.find((s) => s.name === p.category);
    if (sol) expect(links).toContain(`/solutions/#${sol.id}`);
    for (const h of links) expect((await request.get(h.split('#')[0])).status(), h).toBe(200);
  });
}

test('no page links to an undefined solution anchor', async ({ page }) => {
  for (const p of visible) {
    await page.goto(`/projects/${p.id}/`);
    expect(await page.locator('a[href*="undefined"]').count(), p.id).toBe(0);
  }
});
