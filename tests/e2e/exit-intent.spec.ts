import { test, expect } from './fixtures';

test.use({ suppressExitPopup: false });

const overlay = '#exit-overlay';

test('desktop: leaving through the top opens the popup once', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mouseleave trigger is desktop only');
  await page.emulateMedia({ reducedMotion: 'reduce' }); // hide instantly, no animationend wait
  await page.goto('/');
  await expect(page.locator(overlay)).toBeHidden();

  const leave = () =>
    page.evaluate(() => document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 0 })));

  await leave();
  await expect(page.locator(overlay)).toBeVisible();
  await expect(page.locator('#exit-close')).toBeFocused();

  await page.locator('#exit-dismiss').click();
  await expect(page.locator(overlay)).toBeHidden();
  expect(await page.evaluate(() => sessionStorage.getItem('exit_popup_shown'))).toBe('1');

  await leave();
  await expect(page.locator(overlay)).toBeHidden();
});

test('desktop: leaving lower on the page does not trigger it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mouseleave trigger is desktop only');
  await page.goto('/');
  await page.evaluate(() => document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 300 })));
  await expect(page.locator(overlay)).toBeHidden();
});

test('desktop: Escape closes the popup', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mouseleave trigger is desktop only');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 0 })));
  await expect(page.locator(overlay)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(overlay)).toBeHidden();
});

test('mobile: popup appears after 40s above the fold', async ({ page, isMobile }) => {
  test.skip(!isMobile, '40s timer trigger is touch only');
  await page.clock.install();
  await page.goto('/');

  await page.clock.runFor(39_000);
  await expect(page.locator(overlay)).toBeHidden();
  await page.clock.runFor(2_000);
  await expect(page.locator(overlay)).toBeVisible();
});

test('mobile: no popup after scrolling past the fold', async ({ page, isMobile }) => {
  test.skip(!isMobile, '40s timer trigger is touch only');
  await page.clock.install();
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));

  await page.clock.runFor(41_000);
  await expect(page.locator(overlay)).toBeHidden();
});
