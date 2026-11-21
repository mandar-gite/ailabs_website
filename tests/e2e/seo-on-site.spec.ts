import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

// Fixes from the 21 Nov on-site SEO audit (items 2, 3 and 5).
// Spec: docs/superpowers/specs/2026-11-21-seo-on-site-fixes.md
const projects: { id: string; name: string; seoTitle?: string; hidden?: boolean }[] = JSON.parse(
  readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'),
).filter((p: { hidden?: boolean }) => !p.hidden);

const decode = (s: string) =>
  s.replace(/&amp;|&#38;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

test('every project H1 holds the name and the seoTitle descriptor', async ({ page }) => {
  for (const p of projects) {
    await page.goto(`/projects/${p.id}/`);
    const h1 = page.locator('h1');
    await expect(h1, p.id).toHaveCount(1);
    await expect(h1, p.id).toContainText(p.name);
    const descriptor = p.seoTitle?.split(': ').slice(1).join(': ');
    if (descriptor) await expect(h1.locator('.project-title-sub'), p.id).toHaveText(descriptor);
    // A space keeps the name and descriptor apart in the raw text crawlers read.
    if (descriptor) expect(await h1.textContent(), p.id).toBe(`${p.name} ${descriptor}`);
  }
});

test('the homepage graph has a WebSite node named like the Organization', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .flatMap((j) => j['@graph'] ?? [j]);
  const org = graphs.find((n) => n['@type'] === 'Organization');
  const site = graphs.find((n) => n['@type'] === 'WebSite');
  expect(site, 'WebSite node').toBeTruthy();
  expect(site.name).toBe('72° AI LABS');
  expect(site.url).toBe('https://72ai.in/');
  expect(site.publisher['@id']).toBe(org['@id']);
  expect(site.alternateName).toEqual(org.alternateName);
});

test('/blog/ has the topic-led meta description', async ({ request }) => {
  const html = await (await request.get('/blog/')).text();
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  expect(desc).toBe(
    'Notes from building AI on real business data: DPDP-safe reporting, small models on a consumer GPU, and multi-agent RAG that holds up.',
  );
});

// Site-wide Service nodes mirror the 4 practice areas on /solutions/ (src/data/solutions.json).
test('the JSON-LD Service nodes match the practice areas in solutions.json', async ({ request }) => {
  const areas: { id: string; name: string; description: string }[] = JSON.parse(
    readFileSync(new URL('../../src/data/solutions.json', import.meta.url), 'utf8'),
  );
  const html = await (await request.get('/')).text();
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .flatMap((j) => j['@graph'] ?? [j]);
  const services = nodes.filter((n) => n['@type'] === 'Service');
  expect(services.map((s) => [s['@id'], s.name, s.serviceType, s.description, s.url, s.provider['@id']])).toEqual(
    areas.map((a) => [
      `https://72ai.in/#service-${a.id}`, a.name, a.name, a.description,
      `https://72ai.in/solutions/#${a.id}`, 'https://72ai.in/#organization',
    ]),
  );
  for (const s of services) expect(s, s['@id']).not.toHaveProperty('industry');
});

test('the Organization description names the 4 practice areas and no others', async ({ request }) => {
  const areas: { name: string }[] = JSON.parse(
    readFileSync(new URL('../../src/data/solutions.json', import.meta.url), 'utf8'),
  );
  const html = await (await request.get('/')).text();
  const org = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .flatMap((j) => j['@graph'] ?? [j])
    .find((n) => n['@type'] === 'Organization');
  const desc = org.description.toLowerCase();
  for (const a of areas) expect(desc, a.name).toContain(a.name.toLowerCase().replace('&', 'and'));
  for (const old of ['sales', 'support', 'marketing', 'logistics']) expect(desc, old).not.toContain(old);
});
