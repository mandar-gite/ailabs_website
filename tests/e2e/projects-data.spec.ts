import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'))
  .filter((p: { hidden?: boolean }) => !p.hidden);

// Pages come from one dynamic route, so every entry in projects.json must render.
test('every project in projects.json has its own page', async ({ page }) => {
  for (const p of projects) {
    const res = await page.goto(`/projects/${p.id}`);
    expect(res?.status(), p.id).toBe(200);
    await expect(page.locator('h1'), p.id).toHaveText(p.name);
  }
});

test('the projects index lists every project', async ({ page }) => {
  await page.goto('/projects');
  const text = await page.locator('main').innerText();
  for (const p of projects) expect(text, p.name).toContain(p.name);
});
