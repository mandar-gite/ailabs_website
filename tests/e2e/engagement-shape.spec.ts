import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

const phases = JSON.parse(readFileSync(new URL('../../src/data/engagement.json', import.meta.url), 'utf8'));

// Hand-worked, independent of the code: 1 + 2 + 6 = 9 and 1 + 3 + 12 = 16 weeks.
test('engagement data matches the confirmed durations and totals', () => {
  expect(phases.map((p: any) => [p.minWeeks, p.maxWeeks])).toEqual([[1, 1], [2, 3], [6, 12]]);
  expect(phases.reduce((s: number, p: any) => s + p.minWeeks, 0)).toBe(9);
  expect(phases.reduce((s: number, p: any) => s + p.maxWeeks, 0)).toBe(16);
});

for (const path of ['/', '/about']) {
  test(`${path} shows each phase's duration and that Discovery is free`, async ({ page }) => {
    await page.goto(path);
    const main = page.locator('main');
    for (const label of ['1 week', '2 to 3 weeks', '6 to 12 weeks']) {
      await expect(main.getByText(label, { exact: true }).first()).toBeVisible();
    }
    await expect(main.getByText('Free', { exact: true }).first()).toBeVisible();
  });
}

test('homepage states the end-to-end range', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section.process')).toContainText('usually 9 to 16 weeks');
  await expect(page.locator('section.process')).toContainText('You get');
});

test('llms.txt carries the same durations', async ({ request }) => {
  const text = await (await request.get('/llms.txt')).text();
  for (const s of ['1 week, free', '2 to 3 weeks', '6 to 12 weeks', '9 to 16 weeks']) expect(text).toContain(s);
});
