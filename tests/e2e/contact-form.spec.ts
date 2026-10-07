import type { Page } from '@playwright/test';
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
  await page.locator('#contact-form').getByRole('button', { name: 'Send Message' }).click();

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

test('still redirects when both lead endpoints fail', async ({ page }) => {
  await page.route(HUBSPOT, (route) => route.fulfill({ status: 500, body: 'down' }));
  await page.route(FORMSPREE, (route) => route.fulfill({ status: 500, body: 'down' }));

  await page.goto('/#contact');
  await fillForm(page);
  await page.locator('#contact-form').getByRole('button', { name: 'Send Message' }).click();
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
