import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Fixes from the 21 Oct SEO audit and the 11 Nov Search Console export.
// Spec: docs/superpowers/specs/2026-11-03-seo-quick-wins.md
const decode = (s: string) =>
  s.replace(/&amp;|&#38;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const titleOf = (html: string) => decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
const descriptionOf = (html: string) =>
  decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
const get = async (request: { get: (u: string) => Promise<{ text: () => Promise<string> }> }, route: string) =>
  (await request.get(route === '/' ? '/' : route + '/')).text();

const TITLES: Record<string, string> = {
  '/': '72° AI LABS | Custom AI Built on Your Business Data',
  '/solutions': 'AI for Tally, Call Analytics and Document OCR | 72° AI LABS',
  '/projects': 'AI Projects Built on Real Business Data | 72° AI LABS',
  '/about': 'About Us: Custom AI Studio | 72° AI LABS',
  '/blog': 'Blog: Practical AI, RAG and Small Models | 72° AI LABS',
  '/voice-dna': 'Voice DNA for Claude: Write Like a Human | 72° AI LABS',
  '/blog/blog1_martech_technical': 'Multi-Agent AI Systems That Actually Work | 72° AI LABS',
};

const DESCRIPTIONS: Record<string, string> = {
  '/solutions':
    'AI built on your own data in 4 practice areas: Finance Automation, Operational Intelligence, Document & OCR Systems, and Data Engineering & Integration.',
  '/blog/autoresearch_2026-04-14':
    '57 autonomous experiments, 7 hours, 1 RTX 3060. Why smaller models win on consumer hardware, and what the agent found that flips the usual scaling playbook.',
  '/blog/blog1_martech_technical':
    'How to build production-ready multi-agent RAG systems: architecture, quality loops, graceful degradation, and lessons from real implementations.',
  '/voice-dna':
    'Free Voice DNA template that makes Claude write like a human and sound like you. Removes AI-isms in 10 minutes. Set it once and it works in every chat.',
};

// /about/ lists the 6 old practice areas; its rewrite waits for positioning decision 1.
const LONG_DESCRIPTION_ALLOWED = ['/about'];

test('NextSurge shows the not-investment-advice note; other projects do not', async ({ page }) => {
  await page.goto('/projects/nextsurge/');
  await expect(page.getByRole('note')).toHaveText(
    'Research project. Not investment advice, and not offered as a signal service.',
  );
  await page.goto('/projects/callmind/');
  await expect(page.locator('.project-disclaimer')).toHaveCount(0);
});

test('pages carry the new titles and descriptions', async ({ request }) => {
  for (const [route, title] of Object.entries(TITLES)) {
    expect(titleOf(await get(request, route)), route).toBe(title);
  }
  for (const [route, description] of Object.entries(DESCRIPTIONS)) {
    expect(descriptionOf(await get(request, route)), route).toBe(description);
  }
});

test('every route fits search snippets and has no em dash or "deep dive"', async ({ request }) => {
  for (const route of builtRoutes()) {
    const html = await get(request, route);
    const title = titleOf(html);
    const description = descriptionOf(html);
    expect(title.length, `${route} title: ${title}`).toBeLessThanOrEqual(60);
    expect(description, `${route} has no meta description`).not.toBe('');
    if (!LONG_DESCRIPTION_ALLOWED.includes(route)) {
      expect(description.length, `${route} description: ${description}`).toBeLessThanOrEqual(160);
    }
    for (const text of [title, description]) {
      expect(text, route).not.toContain('—');
      expect(text.toLowerCase(), route).not.toContain('deep dive');
    }
  }
});

test('Plus Jakarta Sans is self-hosted and preloaded', async ({ request }) => {
  for (const route of builtRoutes()) {
    const html = await get(request, route);
    expect(html, route).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
    expect(html, route).toMatch(/<link rel="preload" href="\/fonts\/plus-jakarta-sans-latin\.woff2" as="font" type="font\/woff2" crossorigin/);
  }
  const font = await request.get('/fonts/plus-jakarta-sans-latin.woff2');
  expect(font.status()).toBe(200);
  expect(font.headers()['content-type']).toContain('font/woff2');
});

test('the browser loads the self-hosted font once, as the variable face', async ({ page, blocked }) => {
  await page.goto('/');
  const font = await page.evaluate(async () => {
    await document.fonts.ready;
    const face = [...document.fonts].find((f) => f.family.includes('Plus Jakarta Sans') && f.status === 'loaded');
    return {
      weight: face?.weight ?? null,
      // An unused preload (CSS src at another URL) would show up as a second download.
      woff2Downloads: performance.getEntriesByType('resource').filter((e) => e.name.endsWith('.woff2')).length,
    };
  });
  // A static single-weight file would make the 800 headings faux bold.
  expect(font.weight).toBe('400 800');
  expect(font.woff2Downloads).toBe(1);
  // Catches a Google Fonts @import in the CSS bundle, which the HTML check can't see.
  expect(blocked.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u))).toEqual([]);
});

test('breadcrumb links are underlined', async ({ page }) => {
  await page.goto('/projects/callmind/');
  const decoration = await page
    .locator('.breadcrumb a')
    .first()
    .evaluate((a) => getComputedStyle(a).textDecorationLine);
  expect(decoration).toBe('underline');
});

test('Voice DNA gets internal links from the footer and the AutoResearch post', async ({ request }) => {
  for (const route of builtRoutes()) {
    const footer = (await get(request, route)).match(/<footer class="site-footer"[\s\S]*?<\/footer>/)?.[0] ?? '';
    expect(footer, route).toContain('href="/voice-dna/"');
  }
  const post = (await get(request, '/blog/autoresearch_2026-04-14')).replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, '');
  expect(post).toContain('href="/voice-dna/"');
});
