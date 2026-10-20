import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Lighthouse found 31 contrast failures (gold #DDA744 and grey #94A3B8 text) and
// a skipped heading level on /projects. These checks keep them from coming back.

// WCAG AA: 4.5:1, or 3:1 for large text (24px+, or 18.66px+ at weight 700+).
// Text over an image or gradient is skipped, since its backdrop can't be read here.
const contrastFailures = () => {
  const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
  const lum = ([r, g, b]: number[]) => {
    const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const blend = (top: number[], under: number[]) => {
    const a = top[3] ?? 1;
    return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a));
  };
  const backdrop = (el: Element | null): number[] | null => {
    if (!el) return [255, 255, 255];
    const s = getComputedStyle(el);
    if (s.backgroundImage !== 'none') return null;
    const bg = parse(s.backgroundColor);
    if ((bg[3] ?? 1) === 0) return backdrop(el.parentElement);
    const under = backdrop(el.parentElement);
    return under && blend(bg, under);
  };
  const fails: string[] = [];
  for (const el of document.querySelectorAll('body *')) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    if (el.closest('[aria-hidden="true"]')) continue;
    if (!own || r.width <= 1 || r.height <= 1 || s.visibility === 'hidden' || +s.opacity === 0) continue;
    const bg = backdrop(el);
    if (!bg) continue;
    const fg = blend(parse(s.color), bg);
    const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    const ratio = (hi + 0.05) / (lo + 0.05);
    const px = parseFloat(s.fontSize);
    const need = px >= 24 || (px >= 18.66 && +s.fontWeight >= 700) ? 3 : 4.5;
    if (ratio < need) fails.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent!.trim().slice(0, 30)}" ${ratio.toFixed(2)}:1 < ${need}`);
  }
  return fails;
};

test('text meets WCAG AA contrast on every page', async ({ page }) => {
  const fails: string[] = [];
  for (const route of builtRoutes()) {
    await page.goto(route === '/' ? '/' : route + '/');
    fails.push(...(await page.evaluate(contrastFailures)).map((f) => `${route} ${f}`));
  }
  expect(fails).toEqual([]);
});

test('/projects headings descend without skipping a level', async ({ page }) => {
  await page.goto('/projects/');
  const levels = await page.$$eval('main h1, main h2, main h3, main h4', (hs) => hs.map((h) => +h.tagName[1]));
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `h${levels[i - 1]} -> h${levels[i]}`).toBeLessThanOrEqual(1);
});

test('AutoResearch charts are sized WebP and lazy-loaded', async ({ page, request }) => {
  await page.goto('/blog/autoresearch_2026-04-14/');
  const imgs = await page.$$eval('.post-content img', (els) =>
    els.map((i) => ({ src: i.getAttribute('src')!, w: i.getAttribute('width'), lazy: i.loading })));
  expect(imgs).toHaveLength(3);
  for (const img of imgs) {
    expect(img.src).toMatch(/\.webp$/);
    expect(img.w).toBe('1600');
    expect(img.lazy).toBe('lazy');
    const body = await (await request.get(img.src)).body();
    expect(body.length, img.src).toBeLessThan(60_000);
  }
});
