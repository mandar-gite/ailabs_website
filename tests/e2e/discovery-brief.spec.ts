import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

const PROMPT = readFileSync(new URL('../../public/discovery-brief-prompt.txt', import.meta.url), 'utf8').trim();

test('prompt asks for the HubSpot marker line and fits the form', () => {
  expect(PROMPT).toContain('Discovery brief (72ai prompt)');
  expect(PROMPT).toContain('under 300 words');
  expect(PROMPT).not.toContain('—');
});

test('page shows the exact prompt and the 3 steps', async ({ page }) => {
  await page.goto('/discovery-brief');
  await expect(page.locator('h1')).toHaveCount(1);
  expect((await page.locator('#brief-prompt').innerText()).trim()).toBe(PROMPT);
  await expect(page.locator('main ol li')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /download/i })).toHaveAttribute('href', '/discovery-brief-prompt.txt');
});

test('copy button puts the exact prompt on the clipboard', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only here');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/discovery-brief');
  // By id: the button's accessible name changes to "Copied" after the click.
  const btn = page.locator('#copy-prompt');
  await btn.click();
  await expect(btn).toHaveText(/copied/i);
  expect((await page.evaluate(() => navigator.clipboard.readText())).trim()).toBe(PROMPT);
});

test('contact form and Discovery step both link to the page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#contact-form a[href="/discovery-brief"]')).toBeVisible();
  await expect(page.locator('section.process a[href="/discovery-brief"]')).toBeVisible();
});

test('downloadable prompt file is served', async ({ request }) => {
  const res = await request.get('/discovery-brief-prompt.txt');
  expect(res.status()).toBe(200);
  expect((await res.text()).trim()).toBe(PROMPT);
});

// The interview must work for vision and prediction projects, not only text data.
test('prompt covers non-text data, outcome history, error cost and where it runs', () => {
  for (const s of ['camera footage', 'sensor or machine logs', 'past outcomes are recorded', 'wrong answer', 'real time']) {
    expect(PROMPT).toContain(s);
  }
});

test('copying the prompt sends a GA4 event when gtag is present', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only here');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  // Stands in for gtag after consent; the fixture declines consent, so nothing else defines it.
  await page.addInitScript(() => {
    (window as any).__events = [];
    (window as any).gtag = (...args: unknown[]) => (window as any).__events.push(args);
  });
  await page.goto('/discovery-brief');
  await page.locator('#copy-prompt').click();
  await expect.poll(() => page.evaluate(() => (window as any).__events)).toContainEqual(['event', 'discovery_prompt_copy', { method: 'copy' }]);
});
