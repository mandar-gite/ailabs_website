import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

const data = (f: string) => JSON.parse(readFileSync(new URL(`../../src/data/${f}`, import.meta.url), 'utf8'));

test('every page has the skip-link target', async ({ page }) => {
  for (const route of builtRoutes()) {
    await page.goto(route);
    await expect(page.locator('#main-content'), route).toHaveCount(1);
  }
});

test('/thanks is noindex', async ({ page }) => {
  await page.goto('/thanks');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

for (const route of ['/thanks', '/careers/thanks', '/this-page-does-not-exist']) {
  test(`no exit popup on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('#exit-overlay')).toHaveCount(0);
  });
}

test('careers applications land on their own thank-you page', async ({ page }) => {
  await page.goto('/careers');
  await expect(page.locator('form input[name="_redirect"]')).toHaveAttribute('value', 'https://72ai.in/careers/thanks/');
  await page.goto('/careers/thanks');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('solutions only reference visible projects that exist', () => {
  const projects = new Map(data('projects.json').map((p: any) => [p.id, p]));
  for (const s of data('solutions.json')) {
    for (const id of s.projects) {
      expect(projects.has(id), `${s.id} -> ${id} missing`).toBe(true);
      expect((projects.get(id) as any).hidden, `${s.id} -> ${id} hidden`).not.toBe(true);
    }
  }
});

test('hidden TL;DR copy makes no unconfirmed claims', async ({ page }) => {
  for (const route of ['/', '/about', '/projects', '/solutions']) {
    await page.goto(route);
    const tldr = (await page.locator('p.sr-only').allInnerTexts()).join(' ');
    expect(tldr, route).not.toMatch(/client data|\b\d+ live projects|—/i);
  }
});
