import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

// The 5 solution groups (Mandar, 24 Nov 2026) must read the same in the data, the homepage, About and /solutions/.
const groups: { id: string; name: string; projects: string[] }[] = JSON.parse(readFileSync('src/data/solutions.json', 'utf8'));
const projects: { id: string; category: string }[] = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));

test('the 5 solution groups are the agreed ones, in order', () => {
  expect(groups.map((g) => g.name)).toEqual([
    'Document Intelligence',
    'Visual Intelligence',
    'Call & Voice Analytics',
    'AI Assistants',
    'ML, Data Engineering & Reporting',
  ]);
});

test('every project sits in exactly 1 group, and its category names that group', () => {
  for (const p of projects) {
    const owners = groups.filter((g) => g.projects.includes(p.id));
    expect(owners.map((g) => g.name), p.id).toEqual([p.category]);
  }
  const known = new Set(projects.map((p) => p.id));
  for (const g of groups) for (const id of g.projects) expect(known.has(id), `${g.id} lists ${id}`).toBe(true);
});

test('homepage and About link every group to its /solutions/ section', async ({ page }) => {
  const expected = groups.map((g) => `/solutions/#${g.id}`);
  await page.goto('/');
  const home = await page.locator('.capabilities .cap-card').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  expect(home).toEqual(expected);
  await page.goto('/about/');
  const about = await page.locator('.services-grid .service-item').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  expect(about).toEqual(expected);
});

test('/solutions/ has a section for every group, and LeapBuddy has a page', async ({ page, request }) => {
  await page.goto('/solutions/');
  for (const g of groups) await expect(page.locator(`section#${g.id} .solution-title`)).toHaveText(g.name);
  expect((await request.get('/projects/leapbuddy/')).ok()).toBe(true);
});

// The old 4-area names must not come back anywhere, hidden summaries included (HTML may encode & as &amp;).
test('no page carries the retired practice-area names', async ({ request }) => {
  const retired = [/Finance Automation/, /Operational Intelligence/, /Document (&amp;|&) OCR/, /Data Engineering (&amp;|&) Integration/, /\b4 practice areas\b/];
  for (const path of ['/', '/solutions/', '/about/', '/projects/', '/blog/welcome-to-72ai-blog/']) {
    const html = await (await request.get(path)).text();
    for (const re of retired) expect(html, `${path} ${re}`).not.toMatch(re);
  }
});
