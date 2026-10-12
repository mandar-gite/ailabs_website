import { test, expect } from './fixtures';

test('only one element has id="contact"', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[id="contact"]')).toHaveCount(1);
});

test('homepage copy has no em dashes and no unconfirmed proof', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('main').innerText();
  expect(text).not.toContain('—');
  expect(text).not.toMatch(/Deployed across/i);
  expect(text).not.toMatch(/Industries served/i);
  expect(text).not.toMatch(/Not a demo/i);
  await expect(page.locator('.trust-label')).toHaveText(/Built for/i);
});

test('contact fields stack on narrow screens so email is not cut off', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#contact');
  const email = await page.locator('#email').boundingBox();
  const name = await page.locator('#name').boundingBox();
  expect(email!.width).toBeGreaterThan(260);
  expect(email!.y).toBeGreaterThan(name!.y);
});

test('need and timing dropdowns are optional and sent with the lead', async ({ page }) => {
  let body: Record<string, string> | null = null;
  await page.route('https://72ai.in/api/lead', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.route('https://formspree.io/f/**', (route) => route.fulfill({ status: 200, json: { ok: true } }));

  await page.goto('/#contact');
  const form = page.locator('#contact-form');
  await expect(form.getByLabel('What do you need?')).not.toHaveAttribute('required', /.*/);
  await form.getByLabel('Name').fill('Asha Rao');
  await form.getByLabel('Company').fill('Rao Textiles');
  await form.getByLabel('Email').fill('asha@example.com');
  await form.getByLabel('Phone').fill('+91 98200 41736');
  await form.getByLabel('Your Brief').fill('Forecasting demand.');
  await form.getByLabel('What do you need?').selectOption({ label: 'Finance or accounting automation' });
  await form.getByLabel('When?').selectOption({ label: 'Within a month' });
  await form.getByLabel(/I consent/).check();
  await form.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/thanks\/?$/);
  expect(body).toMatchObject({ Need: 'Finance or accounting automation', Timing: 'Within a month' });
});
