import { test, expect } from './fixtures';

// llms.txt is what AI assistants quote about 72ai, so it must match the site:
// no dropped projects, no em dashes (voice rules) and no dead internal links.
test('llms.txt is current and every internal link resolves', async ({ page, request }) => {
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  const text = await res.text();

  expect(text).not.toContain('—');
  for (const dropped of ['MarTech', 'Cascade', 'InsightBridge', 'Used Car', 'On-Prem', 'Hospitality', 'Tire-Life']) {
    expect(text, `mentions dropped "${dropped}"`).not.toContain(dropped);
  }

  const paths = [...text.matchAll(/https:\/\/72ai\.in(\/[^\s)#]*)/g)].map((m) => m[1]);
  expect(paths.length).toBeGreaterThan(5);
  for (const path of new Set(paths)) {
    const r = await page.request.get(path);
    expect(r.status(), path).toBe(200);
  }
});
