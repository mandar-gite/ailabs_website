import { test, expect } from './fixtures';

const MEETINGS_URL = 'https://meetings-na2.hubspot.com/mandar-gite';
const EMBED_SCRIPT = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';

test('booking panel sits beside the form with a working fallback link', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('#book-call');
  await expect(panel.getByRole('heading', { name: 'Book a 30-min call' })).toBeVisible();

  await expect(panel.locator('.meetings-iframe-container')).toHaveAttribute(
    'data-src',
    `${MEETINGS_URL}?embed=true`,
  );

  // If the embed is blocked (ad blocker, strict privacy), booking still works.
  const fallback = panel.getByRole('link', { name: /open the booking page/i });
  await expect(fallback).toHaveAttribute('href', MEETINGS_URL);
  await expect(fallback).toHaveAttribute('target', '_blank');
  await expect(fallback).toHaveAttribute('rel', /noopener/);

  await expect(page.locator('#contact #contact-form')).toBeVisible();
});

// The embed pulls third-party JS, so it must only load once the visitor
// scrolls near the contact section, never on first paint.
test('HubSpot embed script loads only when the section is scrolled into view', async ({ page, blocked }) => {
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(300);
  expect(blocked).not.toContain(EMBED_SCRIPT);

  await page.locator('#book-call').scrollIntoViewIfNeeded();
  await expect.poll(() => blocked.includes(EMBED_SCRIPT)).toBe(true);
  expect(await page.locator(`script[src="${EMBED_SCRIPT}"]`).count()).toBe(1);
});

test('contact section has no horizontal overflow', async ({ page }) => {
  await page.goto('/#contact');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
