import type { Page, Route } from '@playwright/test';
import { test, expect } from './fixtures';

const HUBSPOT = 'https://72ai.in/api/lead';
const FORMSPREE = 'https://formspree.io/f/**';

async function fillForm(page: Page) {
  const form = page.locator('#contact-form');
  await form.getByLabel('Name').fill('Asha Rao');
  await form.getByLabel('Company').fill('Rao Textiles');
  await form.getByLabel('Email').fill('asha@example.com');
  await form.getByLabel('Phone').fill('+91 98200 41736');
  await form.getByLabel('Your Brief').fill('Forecasting demand across 3 warehouses.');
  await form.getByLabel(/I consent/).check();
}

test('empty form is blocked by required fields', async ({ page, blocked }) => {
  await page.goto('/#contact');
  const button = page.locator('#contact-form button[type="submit"]');
  await button.click();

  // The submit handler disables the button and swaps its label synchronously,
  // so an untouched button proves the handler never ran. The short settle lets
  // any submit that did slip through reach the network guard or redirect.
  await expect(button).toBeEnabled();
  await expect(button).toHaveText('Send Message');
  await page.waitForTimeout(500);
  await expect(page).not.toHaveURL(/\/thanks/);
  expect(await page.locator('#name').evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  expect(blocked.filter((u) => u.includes('formspree') || u.includes('/api/lead'))).toEqual([]);
});

test('valid submit posts to HubSpot and Formspree, then redirects', async ({ page }) => {
  let hubspotBody: Record<string, string> | null = null;
  let formspreeCalled = false;
  await page.route(HUBSPOT, async (route) => {
    hubspotBody = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.route(FORMSPREE, async (route) => {
    formspreeCalled = route.request().method() === 'POST';
    await route.fulfill({ status: 200, json: { ok: true } });
  });

  await page.goto('/#contact');
  await fillForm(page);
  await page.locator('#contact-form').getByRole('button', { name: 'Send Message' }).click();

  await expect(page).toHaveURL(/\/thanks\/?$/);
  expect(formspreeCalled).toBe(true);
  expect(hubspotBody).toMatchObject({
    Name: 'Asha Rao',
    Company: 'Rao Textiles',
    Email: 'asha@example.com',
    Phone: '+91 98200 41736',
    Brief: 'Forecasting demand across 3 warehouses.',
    Consent: 'on',
    _gotcha: '',
  });
});

// The lead is captured if either endpoint accepts it, so one failure still
// counts as success.
for (const failing of ['HubSpot', 'Formspree'] as const) {
  test(`redirects when only ${failing} fails`, async ({ page }) => {
    await page.route(HUBSPOT, (route) =>
      route.fulfill(failing === 'HubSpot' ? { status: 500, body: 'down' } : { status: 200, json: { ok: true } }),
    );
    await page.route(FORMSPREE, (route) =>
      route.fulfill(failing === 'Formspree' ? { status: 500, body: 'down' } : { status: 200, json: { ok: true } }),
    );

    await page.goto('/#contact');
    await fillForm(page);
    await page.locator('#contact-form').getByRole('button', { name: 'Send Message' }).click();
    await expect(page).toHaveURL(/\/thanks\/?$/);
  });
}

// When neither endpoint has the lead, the visitor must not see /thanks: they
// stay on the form with their input intact and a visible error.
const bothFail = {
  'HTTP 500': (route: Route) => route.fulfill({ status: 500, body: 'down' }),
  'network error': (route: Route) => route.abort('failed'),
};
for (const [label, handler] of Object.entries(bothFail)) {
  test(`shows an error and keeps input when both endpoints fail (${label})`, async ({ page }) => {
    await page.route(HUBSPOT, handler);
    await page.route(FORMSPREE, handler);

    await page.goto('/#contact');
    await fillForm(page);
    const button = page.locator('#contact-form button[type="submit"]');
    await button.click();

    const alert = page.locator('#contact-form [role="alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/couldn't send/i);
    await expect(button).toBeEnabled();
    await expect(button).toHaveText('Send Message');
    await expect(page).not.toHaveURL(/\/thanks/);
    await expect(page.locator('#contact-form').getByLabel('Your Brief')).toHaveValue(
      'Forecasting demand across 3 warehouses.',
    );
  });
}

test('retry after a failed submit succeeds and clears the error', async ({ page }) => {
  let down = true;
  const respond = (route: Route) =>
    down ? route.fulfill({ status: 500, body: 'down' }) : route.fulfill({ status: 200, json: { ok: true } });
  await page.route(HUBSPOT, respond);
  await page.route(FORMSPREE, respond);

  await page.goto('/#contact');
  await fillForm(page);
  const button = page.locator('#contact-form button[type="submit"]');

  await button.click();
  await expect(page.locator('#contact-form [role="alert"]')).toBeVisible();

  down = false;
  await button.click();
  await expect(page).toHaveURL(/\/thanks\/?$/);
});

// Independent check that the network guard works: with no per-test mocks, the
// submit must be caught by the fixture rather than reach the real services.
test('unmocked submit never leaves the machine', async ({ page, blocked }) => {
  await page.goto('/#contact');
  await fillForm(page);
  await page.locator('#contact-form').getByRole('button', { name: 'Send Message' }).click();
  await expect(page).toHaveURL(/\/thanks\/?$/);

  expect(blocked).toContain(HUBSPOT);
  expect(blocked.some((u) => u.startsWith('https://formspree.io/f/'))).toBe(true);
});
