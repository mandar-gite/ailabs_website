# SEO Internal Linking and Project Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop every internal link from costing a 301, connect project pages to their siblings, solution area and schema, and link blog posts into the work.

**Architecture:** Static Astro 5 site. Data comes from `src/data/projects.json` and `src/data/solutions.json`; project pages render from `src/pages/projects/[id].astro`; blog posts are markdown in `src/content/blog/`. Every task adds or extends a Playwright spec in `tests/e2e/` that reads the built site, then changes source until it passes.

**Tech Stack:** Astro 5, Tailwind 3, Playwright (`npm run test:e2e` builds then tests), GitHub Pages behind Cloudflare.

**Spec:** `docs/superpowers/specs/2026-10-20-seo-audit.md`

## Global Constraints

- Branch: `feature/seo-internal-linking` from `develop`. One commit per task, Conventional Commits, no Claude attribution, PR to `develop`.
- Every internal page URL ends in `/` (`/projects/`, `/projects/callmind/`, `/solutions/#document-ocr`). Paths with a file extension (`/rss.xml`, `/voice-dna.md`, `/discovery-brief-prompt.txt`, images) and the root `/` stay as they are.
- Absolute URLs use `https://72ai.in` (the origin with no path is fine as is).
- Copy follows `public/voice-dna.md`: contractions, no em dashes, no "this isn't X, it's Y". Brand is `72° AI LABS`.
- New CSS uses the `--wp-*` tokens in `src/styles/global.css`. Text must pass `tests/e2e/a11y-contrast.spec.ts` (4.5:1, or 3:1 at 24px+).
- Headings never skip a level inside `<main>`.
- Tests live in `tests/e2e/`. Run the full suite with `npm run test:e2e` (expect 237 passing before Task 1, plus the new ones after each task).

## Review Focus

1. A project whose `category` matches no `solutions.json` entry: no `/solutions/#undefined` link anywhere. Pinned in Task 2.
2. A project alone in its category: no empty "Related projects" heading. Pinned in Task 2 (every related section has at least 1 link).
3. A project marked `hidden: true`: never linked from a related block, since it has no page. Pinned in Task 2 (every related link returns 200).
4. Hash links (`/#contact`, `/solutions/#finance-automation`): the slash rule checks only the path part, so `/#contact` stays valid. Pinned in Task 1.
5. File links (`/voice-dna.md` download, `/rss.xml`, `/discovery-brief-prompt.txt`): must keep working with no slash added. Pinned in Task 1.

---

### Task 1: Trailing-slash URLs everywhere

**Files:**
- Create: `tests/e2e/internal-urls.spec.ts`
- Modify: `src/components/Nav.astro:15-18,33-36`, `src/components/Footer.astro:16-19,26`, `src/components/ProjectCard.astro:16`, `src/components/ProjectTable.astro:26`, `src/components/ContactForm.astro:65`, `src/components/ConsentBanner.astro` (the `/privacy` link), `src/pages/404.astro:23-24`, `src/pages/index.astro:38,225`, `src/pages/blog/index.astro:47`, `src/pages/blog/[slug].astro:39,95,143`, `src/pages/projects/[id].astro:26,70`, `src/pages/en/careers.astro` (canonical, refresh target, link, `location.replace`)
- Modify (tests that assert old hrefs): `tests/e2e/discovery-brief.spec.ts:33-34`, `tests/e2e/privacy.spec.ts:17,25`

**Interfaces:**
- Produces: the rule "internal hrefs end in `/`" that Tasks 2 and 4 follow, and `internal-urls.spec.ts`, which checks their output too.

- [ ] **Step 1: Write the failing spec** `tests/e2e/internal-urls.spec.ts`

```ts
import { test, expect } from './fixtures';
import { builtRoutes } from './routes';

// Slashless internal URLs 301 on GitHub Pages; Search Console was reporting
// /about, /blog, /projects and /solutions in their redirecting form.
test('internal links, canonicals and JSON-LD URLs use the trailing-slash form', async ({ page }) => {
  const bad: string[] = [];
  for (const route of builtRoutes()) {
    await page.goto(route === '/' ? '/' : route + '/');
    bad.push(...(await page.evaluate(() => {
      const slashless = (p: string) => p !== '/' && !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p);
      const out: string[] = [];
      for (const a of document.querySelectorAll('a[href^="/"]')) {
        const p = a.getAttribute('href')!.split(/[?#]/)[0];
        if (p && slashless(p)) out.push(`href ${p}`);
      }
      const canon = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
      if (slashless(new URL(canon).pathname)) out.push(`canonical ${canon}`);
      for (const s of document.querySelectorAll('script[type="application/ld+json"]'))
        for (const m of s.textContent!.matchAll(/"https:\/\/72ai\.in(\/[^"#]*)?"/g))
          if (m[1] && slashless(m[1])) out.push(`json-ld ${m[0]}`);
      return out;
    })).map((f) => `${route}: ${f}`));
  }
  expect([...new Set(bad)]).toEqual([]);
});

test('/en/careers redirect stub points at /careers/', async ({ request }) => {
  const html = await (await request.get('/en/careers/')).text();
  expect(html).toContain('<link rel="canonical" href="https://72ai.in/careers/"');
  expect(html).toContain('url=/careers/');
});

test('file links still resolve without a trailing slash', async ({ request }) => {
  for (const path of ['/rss.xml', '/voice-dna.md', '/discovery-brief-prompt.txt', '/llms.txt'])
    expect((await request.get(path)).status(), path).toBe(200);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- internal-urls.spec.ts --project=desktop`
Expected: the first test FAILS listing `href /projects`, `href /blog`, `json-ld "https://72ai.in/blog"` and more. The second test FAILS. The third test PASSES.

- [ ] **Step 3: Add the trailing slash to every path the spec lists**

Edit each file listed above: `"/projects"` becomes `"/projects/"`, `` `/projects/${project.id}` `` becomes `` `/projects/${project.id}/` ``, `` `/blog/${post.slug}` `` becomes `` `/blog/${post.slug}/` ``. In `[slug].astro:39`, build `canonicalURL` from `` `/blog/${post.slug}/` ``. At `:95`, `"item"` becomes `"https://72ai.in/blog/"`. In `en/careers.astro`, every `/careers` becomes `/careers/` and the canonical becomes `https://72ai.in/careers/`. If the spec lists a path this plan doesn't name, fix it the same way: the spec is the oracle.

- [ ] **Step 4: Update the 2 specs that assert old hrefs**

`discovery-brief.spec.ts:33-34`: `a[href="/discovery-brief"]` becomes `a[href="/discovery-brief/"]`. `privacy.spec.ts:17,25`: `a[href="/privacy"]` becomes `a[href="/privacy/"]`.

- [ ] **Step 5: Run the full suite**

Run: `npm run test:e2e`
Expected: all pass (237 + 6 new).

- [ ] **Step 6: Commit**

```bash
git add src tests/e2e
git commit -m "fix(seo): end every internal URL in a slash to skip the 301"
```

---

### Task 2: Related projects and solution link on project pages

**Files:**
- Create: `tests/e2e/related-projects.spec.ts`
- Modify: `src/pages/projects/[id].astro` (frontmatter, a new section between `tech-section` and `cta-section`, styles)

**Interfaces:**
- Consumes: `Project` from `src/types.ts` (`id`, `name`, `shortBlurb`, `category`, optional `hidden`), `solutions.json` entries (`id`, `name`; `name` equals a project `category`).
- Produces: `<section class="related-section" data-related>` that Task 3's breadcrumb leaves untouched.

- [ ] **Step 1: Write the failing spec** `tests/e2e/related-projects.spec.ts`

```ts
import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

type P = { id: string; category: string; hidden?: boolean };
const read = (f: string) => JSON.parse(readFileSync(new URL(`../../src/data/${f}`, import.meta.url), 'utf8'));
const visible = (read('projects.json') as P[]).filter((p) => !p.hidden);
const solutions = read('solutions.json') as { id: string; name: string }[];

for (const p of visible) {
  test(`${p.id} links its category siblings and solution area`, async ({ page, request }) => {
    await page.goto(`/projects/${p.id}/`);
    const section = page.locator('[data-related]');
    const siblings = visible.filter((q) => q.category === p.category && q.id !== p.id).map((q) => `/projects/${q.id}/`);
    const links = await section.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));

    expect(links.filter((h) => h.startsWith('/projects/')).sort()).toEqual(siblings.sort());
    expect(links).not.toContain(`/projects/${p.id}/`);
    const sol = solutions.find((s) => s.name === p.category);
    if (sol) expect(links).toContain(`/solutions/#${sol.id}`);
    for (const h of links) expect((await request.get(h.split('#')[0])).status(), h).toBe(200);
  });
}

test('no page links to an undefined solution anchor', async ({ page }) => {
  for (const p of visible) {
    await page.goto(`/projects/${p.id}/`);
    expect(await page.locator('a[href*="undefined"]').count(), p.id).toBe(0);
  }
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- related-projects.spec.ts --project=desktop`
Expected: 10 FAIL (no `[data-related]` section). The undefined-anchor test PASSES.

- [ ] **Step 3: Render the related section in `[id].astro`**

In the frontmatter: `related` = visible projects with the same `category` and a different `id`; `solution` = the `solutions.json` entry whose `name` equals `project.category` (may be undefined). Render `<section class="related-section" data-related>` only when `related.length > 0 || solution`. Inside it:
- `<h2 class="section-heading">Related projects</h2>`;
- one card per related project: an `<a href={`/projects/${p.id}/`}>` holding an `<h3>` with `p.name` and a `<p>` with `p.shortBlurb`;
- when `solution` exists, `<a href={`/solutions/#${solution.id}`}>More {project.category} work</a>`.

Reuse the look of `.tech-card`. Any new rule uses `--wp-*` tokens.

- [ ] **Step 4: Run the full suite**

Run: `npm run test:e2e`
Expected: all pass, including `a11y-contrast.spec.ts` and `internal-urls.spec.ts` on the new links.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/projects/[id].astro" tests/e2e/related-projects.spec.ts
git commit -m "feat(seo): link each project to its siblings and solution area"
```

---

### Task 3: BreadcrumbList and CreativeWork schema on project pages

**Files:**
- Modify: `src/pages/projects/[id].astro` (frontmatter and a `<Fragment slot="head">`, following `src/pages/blog/[slug].astro:101-104`)
- Modify: `tests/e2e/project-seo.spec.ts` (add 1 test)

**Interfaces:**
- Consumes: `seoDescription` already computed in `[id].astro`; the Organization `@id` `https://72ai.in/#organization` from `src/layouts/Layout.astro`.

- [ ] **Step 1: Add the failing test to `tests/e2e/project-seo.spec.ts`**

```ts
test('project pages carry BreadcrumbList and CreativeWork schema', async ({ request }) => {
  for (const route of builtRoutes().filter((r) => r.startsWith('/projects/'))) {
    const html = await (await request.get(route + '/')).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    const work = blocks.find((b) => b['@type'] === 'CreativeWork');
    const url = `https://72ai.in${route}/`;
    expect(crumbs?.itemListElement.map((i: { item: string }) => i.item), route)
      .toEqual(['https://72ai.in/', 'https://72ai.in/projects/', url]);
    expect(work?.url, route).toBe(url);
    expect(work?.creator?.['@id'], route).toBe('https://72ai.in/#organization');
    expect(work?.description, route).toBe(html.match(/<meta name="description" content="([^"]*)"/)![1].replace(/&#39;/g, "'"));
  }
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- project-seo.spec.ts --project=desktop`
Expected: the new test FAILS (`crumbs` undefined).

- [ ] **Step 3: Add the 2 JSON-LD blocks**

Add `breadcrumbLD` and `creativeWorkLD` objects in the frontmatter:
- BreadcrumbList positions 1 to 3: `Home` (`https://72ai.in/`), `Projects` (`https://72ai.in/projects/`), and `project.name` (the page URL with a trailing slash).
- CreativeWork: `name`, `description: seoDescription`, `url`, `about: project.category`, `keywords: project.tags.join(', ')` and `creator: { "@id": "https://72ai.in/#organization" }`.

Emit both with `<script type="application/ld+json" set:html={JSON.stringify(...)} />` inside `<Fragment slot="head">`.

- [ ] **Step 4: Run the full suite**

Run: `npm run test:e2e`
Expected: all pass (`internal-urls.spec.ts` also checks the new JSON-LD URLs).

- [ ] **Step 5: Commit**

```bash
git add "src/pages/projects/[id].astro" tests/e2e/project-seo.spec.ts
git commit -m "feat(seo): add breadcrumb and CreativeWork schema to project pages"
```

---

### Task 4: Contextual links from blog posts and the homepage, Valent lead

**Files:**
- Create: `tests/e2e/content-links.spec.ts`
- Modify: `src/content/blog/autoresearch_2026-04-14.md:257`, `src/content/blog/blog1_martech_technical.md:252-263`, `src/content/blog/welcome-to-72ai-blog.md:28`, `src/pages/index.astro:211`, `src/data/projects.json` (`valent.description`)

- [ ] **Step 1: Write the failing spec** `tests/e2e/content-links.spec.ts`

```ts
import { test, expect } from './fixtures';

const posts = ['/blog/autoresearch_2026-04-14/', '/blog/blog1_martech_technical/', '/blog/welcome-to-72ai-blog/'];

for (const post of posts) {
  test(`${post} links into projects or solutions at least twice`, async ({ page, request }) => {
    await page.goto(post);
    const hrefs = await page.locator('.post-content a[href^="/"]').evaluateAll((as) =>
      as.map((a) => a.getAttribute('href')!).filter((h) => !h.startsWith('/#')));
    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const h of hrefs) expect((await request.get(h.split('#')[0])).status(), h).toBe(200);
  });
}

test('Voice DNA and About get in-content links', async ({ page }) => {
  await page.goto('/blog/blog1_martech_technical/');
  await expect(page.locator('.post-content a[href="/voice-dna/"]')).toHaveCount(1);
  await page.goto('/');
  await expect(page.locator('section.process a[href="/about/"]')).toHaveCount(1);
});

test('Valent names "cap table" in its first 100 words', async ({ page }) => {
  await page.goto('/projects/valent/');
  const words = (await page.locator('main').innerText()).split(/\s+/).slice(0, 100).join(' ');
  expect(words.toLowerCase()).toContain('cap table');
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- content-links.spec.ts --project=desktop`
Expected: all 5 FAIL.

- [ ] **Step 3: Make these exact copy edits**

- `autoresearch_2026-04-14.md:257`: `Expense classification accuracy. Call quality scoring.` becomes `[Expense classification accuracy](/projects/fastaccounting/). [Call quality scoring](/projects/callmind/).`
- `blog1_martech_technical.md`, "What's Next" list:
  - `for image and document analysis` becomes `for image and [document analysis](/solutions/#document-ocr)`;
  - `for common Indian business platforms` becomes `for common [Indian business platforms](/solutions/#data-engineering)`.
  - After the line `That's what 72° AI Labs does. Practical AI for real business systems.`, add a new paragraph: `If you write with Claude, our free [Voice DNA template](/voice-dna/) strips the AI tells out of its drafts.`
- `welcome-to-72ai-blog.md:28`: `Practical guides on RAG pipelines, OCR systems, and forecasting models` becomes `Practical guides on RAG pipelines, [OCR systems](/solutions/#document-ocr), and [forecasting models](/projects/fastaccounting/)`.
- `index.astro:211`: the `<p>` becomes `A bespoke engagement, from first conversation to a system you own. <a href="/about/">See who's behind it</a>.`
- `projects.json`, `valent.description`: `Valent extracts preference terms` becomes `For cap table and liquidation waterfall work, Valent extracts preference terms`. The rest is unchanged.

- [ ] **Step 4: Run the full suite**

Run: `npm run test:e2e`
Expected: all pass. `project-seo.spec.ts` keeps passing because the meta description is a separate field.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog src/pages/index.astro src/data/projects.json tests/e2e/content-links.spec.ts
git commit -m "feat(seo): link blog posts and homepage into projects, solutions and tools"
```

---

## After the last task

- `npm run test:e2e` and `node --test tests/lead-worker.test.mjs` both green, then PR `feature/seo-internal-linking` to `develop`.
- Release 0.9.0 (#42) ships independently. This work goes out in the next release.

## Not in this plan (needs founder input or happens outside code)

- Expand the 10 project pages to 400+ words. This needs verified facts per project; draft with `/create_websitebrief`.
- An INR pricing page and a "what a PoC looks like" page. These need price ranges.
- New posts: private LLM and DPDP, self-hosted LLM vs ChatGPT, RAG vs fine-tuning, the Tally/GST cluster, a Mumbai page.
- After the deploy: submit the sitemap, request indexing, remove the unused TXT record, and rerun Lighthouse live.
