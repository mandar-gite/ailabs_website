import { readdirSync, readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

// Case studies are the business story; project pages hold the technical detail.
// Ajay (25 Nov 2026): every case study points readers to its project page, and the
// project page points back. A draft case study must never be linked from a live page.
const dir = new URL('../../src/content/case-studies/', import.meta.url);
const cases = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const fm = readFileSync(new URL(f, dir), 'utf8').split('---')[1];
    return {
      slug: f.replace(/\.md$/, ''),
      project: fm.match(/^project:\s*"?([\w-]+)"?/m)![1],
      draft: /^draft:\s*true/m.test(fm),
    };
  });
const published = cases.filter((c) => !c.draft);
const drafts = cases.filter((c) => c.draft);
const projectIds = (JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8')) as { id: string; hidden?: boolean }[])
  .filter((p) => !p.hidden)
  .map((p) => p.id);

test('every case study names a live project', () => {
  expect(cases.length).toBeGreaterThan(0);
  for (const c of cases) expect(projectIds, c.slug).toContain(c.project);
});

for (const c of published) {
  test(`${c.slug} links to its project page, and the project page links back`, async ({ page, request }) => {
    const res = await request.get(`/case-studies/${c.slug}/`);
    expect(res.status()).toBe(200);
    await page.goto(`/case-studies/${c.slug}/`);
    expect(await page.locator('h1').count()).toBe(1);
    await expect(page.locator(`main a[href="/projects/${c.project}/"]`).first()).toBeVisible();

    await page.goto(`/projects/${c.project}/`);
    await expect(page.locator(`main a[href="/case-studies/${c.slug}/"]`)).toHaveCount(1);
  });
}

for (const c of drafts) {
  test(`draft ${c.slug} is not built and not linked`, async ({ page, request }) => {
    expect((await request.get(`/case-studies/${c.slug}/`)).status()).toBe(404);
    await page.goto(`/projects/${c.project}/`);
    await expect(page.locator(`a[href="/case-studies/${c.slug}/"]`)).toHaveCount(0);
  });
}

test('the case studies index lists every published case study and is linked from /projects/', async ({ page }) => {
  test.skip(published.length === 0, 'no published case studies yet');
  await page.goto('/case-studies/');
  for (const c of published) await expect(page.locator(`main a[href="/case-studies/${c.slug}/"]`).first()).toBeVisible();
  for (const c of drafts) await expect(page.locator(`a[href="/case-studies/${c.slug}/"]`)).toHaveCount(0);
  await page.goto('/projects/');
  await expect(page.locator('main a[href="/case-studies/"]')).toHaveCount(1);
});
