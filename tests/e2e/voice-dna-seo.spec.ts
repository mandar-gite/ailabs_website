import { test, expect } from './fixtures';

// Search Console (12 Nov 2026): /voice-dna/ shows for "voice dna system" at 19.5,
// "voice dna claude" at 7.4 and 2 "Claude skills" queries at 1 to 2, yet the page
// never said "Voice DNA system" or "skill" and its H1 had no "Voice DNA".
test('Voice DNA page carries the queries it ranks for', async ({ page }) => {
  await page.goto('/voice-dna/');
  await expect(page.locator('h1')).toContainText('Voice DNA');
  await expect(page.locator('h2', { hasText: 'Voice DNA system' })).toHaveCount(1);
  await expect(page.locator('h3', { hasText: 'Claude Skill' })).toHaveCount(1);
  await expect(page.locator('main')).toContainText('SKILL.md');
});

// "ai 72" ranked 2.1 and "ai72" 3.0 for the brand; alternateName tells Google
// these spellings are 72° AI LABS.
test('Organization schema lists brand spellings people search for', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const json = JSON.parse(m[1]);
    return json['@graph'] ?? [json];
  });
  const org = graphs.find((n) => n['@type'] === 'Organization');
  expect(org.alternateName).toEqual(expect.arrayContaining(['72ai', '72 AI Labs', 'AI 72', 'AI72']));
});
