# SEO on-site fixes from the 21 Nov audit

Date: 2026-11-21. Source: `72ai-marketing/research/2026-11-21-seo-audit-on-site.md` (72ai-marketing PR #49), section 6, "No decision needed". Built on `develop` at `1e7537c`.

## Goal

Pass the homepage's search weight to the pages that sell, and tidy the last weak metadata. The homepage earns 10 of 12 search clicks (22 Oct to 19 Nov) and links to 0 project pages and 0 posts. DocIntel is indexed and got 0 impressions in 58 days.

## Status (21 Nov)

| Item | Status |
|---|---|
| 1. Homepage "Recent work" and "Latest writing" | Deferred. Structure changes wait until the case studies are final and Mandar has discussed them with Ajay |
| 2. Project H1 descriptor | Built in PR #82 |
| 3. `WebSite` schema node | Built in PR #82 |
| 4. `/careers/` footer link and title | Deferred with item 1 (it changes the footer) |
| 5. `/blog/` description | Built in PR #82 |

## Out of scope

- **Waits on decision 1:** the 3 legacy `Service` nodes (`src/layouts/Layout.astro:179-210`), the Organization and About descriptions, the homepage capability cards (`src/pages/index.astro:141-204`) and the `/solutions/` H1.
- **Needs verified facts:** longer project pages (DocIntel, CallMind and FastAccounting first).
- **Mandar's call:** the "95.9%" in the FastAccounting tagline and description (brand voice, 13 Nov, keeps ML accuracy out of impact copy).
- **Outside the codebase:** HSTS at Cloudflare.
- Per-project OG images, `/privacy/` metadata, the welcome post.

## Changes

### 1. Homepage: "Recent work" and "Latest writing"

`src/pages/index.astro`: add 2 sections between `section.process` (ends line 257) and `section.proof` (line 260).

**Recent work.** `<section class="recent-work">` with an H2 "Recent work", 1 line of copy and 4 project cards, using the existing `ProjectCard` component (`src/components/ProjectCard.astro`) so the cards match `/projects/`. Then a "See all projects" link to `/projects/`.

- Projects, in this order: `docintel`, `contract-risk-radar`, `callmind`, `report-copilot`. These are ranks 1-4 in `72ai-marketing/positioning/2026-11-21-proof-inventory.md`, and each one is real delivered work.
- Hold the ids in a const in the frontmatter (`const recentWork = [...]`) and look them up in `projects.json`. Throw at build time if an id is missing or `hidden`, the same pattern as `relatedPost` in `src/pages/projects/[id].astro:28`.
- Leave `featured` in `projects.json` as it is. Setting it would add a "Featured" badge on `/projects/`.
- Copy: "Systems we've built on real business data: documents, contracts, call recordings and reports."

**Latest writing.** `<section class="latest-writing">` with an H2 "Latest writing" and the 3 newest published posts (`getCollection('blog', ({ data }) => data.draft !== true)`, sorted by `pubDate` descending, first 3). Each item shows the title, the date in the `/blog/` format and the description, and links to `/blog/<slug>/`. Then an "All posts" link to `/blog/`.

- Today that's the DPDP post (14 Nov), AutoResearch (14 Apr) and the Martech post (24 Dec 2025). The self-hosted LLM post is `draft: true`, so it stays out until it's published.
- Styles: reuse `.section-header` and the container from the homepage; cards follow the `/blog/` card look. No new colours or fonts (`DESIGN.md`).

This also fixes the 3 posts that had 1 internal link in (the blog index only).

### 2. Project H1 carries the descriptor

`src/pages/projects/[id].astro:55`. Today the H1 is the product name and the buyer term sits only in the `<title>`:

```astro
<h1 class='project-title'>{project.name}</h1>
```

Change it to the name plus the descriptor from `seoTitle` (the text after the first `: `):

```astro
const descriptor = project.seoTitle?.split(': ').slice(1).join(': ');
...
<h1 class='project-title'>
  {project.name}{descriptor && <span class='project-title-sub'>{descriptor}</span>}
</h1>
```

- `.project-title-sub`: `display: block`, about 1.5rem (1.125rem under 768px), weight 600, the tagline colour (`rgba(12, 26, 63, 0.75)`, line 121), 0.5rem above. `a11y-contrast.spec.ts` checks the contrast.
- NextSurge's `seoTitle` is "NextSurge: ML Market-Signal Models" while its name is "NextSurge Momentum Alpha". The split still gives "ML Market-Signal Models". Accepted.
- The H1 reads "DocIntel" then "Document AI for PDFs and Scans": the same words as the title, now on the page.

### 3. `WebSite` schema node

`src/layouts/Layout.astro`, in the `@graph` after the Organization node (ends line 157):

```json
{
    "@type": "WebSite",
    "@id": "https://72ai.in/#website",
    "name": "72° AI LABS",
    "alternateName": ["72ai", "72 AI Labs", "AI 72", "AI72"],
    "url": "https://72ai.in/",
    "publisher": { "@id": "https://72ai.in/#organization" }
}
```

Google picks the site name in results from the `WebSite` node on the homepage. Brand searches arrive as "ai 72", "72ai" and "ai72", and the Organization node already lists those names. Keep both lists identical; the test checks that.

### 4. `/careers/`: a link in and a title

- `src/components/Footer.astro:27`: add `<a href="/careers/" class="footer-privacy">Careers</a>` before the Privacy policy link in `.footer-bottom`. The footer nav (line 13) stays with the 6 buyer and tool links.
- `src/pages/careers.astro:13`: title "Careers: Build Practical AI with Us | 72° AI LABS" (49 chars).

### 5. `/blog/` description

`src/pages/blog/index.astro:17`. Now (118 chars): "Practical insights on AI implementation, real-world case studies, and operational intelligence for growing businesses."

New (133 chars): "Notes from building AI on real business data: DPDP-safe reporting, small models on a consumer GPU, and multi-agent RAG that holds up."

Every topic in it maps to a published post. Rewrite it when the self-hosted LLM post ships.

## Tests

New file `tests/e2e/seo-on-site.spec.ts`, written first; each test must fail before its change. Tests 3, 4 and 6 shipped in PR #82. Tests 1, 2 and 5 are deferred with items 1 and 4; write them when those items are built.

1. `/` has `section.recent-work` with exactly 4 links to `/projects/docintel/`, `/projects/contract-risk-radar/`, `/projects/callmind/` and `/projects/report-copilot/`, plus a link to `/projects/`.
2. `/` has `section.latest-writing` linking to the 3 newest non-draft posts. Compute the expected slugs from `src/content/blog/*.md` front matter in the test (`pubDate`, `draft`). Don't hard-code them, so the test survives the next post.
3. For every project in `projects.json` that isn't `hidden`, the page has 1 H1 that contains the name and, when `seoTitle` has a `: `, the descriptor.
4. On `/`, the JSON-LD `@graph` holds a `WebSite` node whose `name` is "72° AI LABS" and whose `alternateName` equals the Organization node's `alternateName`.
5. Every built route (from `tests/e2e/routes.ts`) has a footer link to `/careers/`. `/careers/` has the exact new title.
6. `/blog/` has the exact new meta description.

Update `tests/e2e/projects-data.spec.ts:12`: `toHaveText(p.name)` becomes `toContainText(p.name)`, since the H1 now holds the descriptor too.

Then run `npm run test:e2e`. `smoke.spec.ts` (1 H1 per page), `seo-quick-wins.spec.ts` (titles 60 chars or under, descriptions 160 or under), `brand-titles.spec.ts` and `a11y-contrast.spec.ts` (heading order, contrast) must still pass. The 2 new H2s sit under the homepage H1, so the heading order holds.

## Verification after deploy

1. Rerun the crawl from the 21 Nov audit. Expected: the homepage links to 4 projects and 3 posts, `/careers/` has 22+ pages linking in, and every blog post has 2+.
2. Check the homepage in Google's Rich Results Test: a `WebSite` item with no errors.
3. Look at a project page and the homepage at 375 px and 1280 px, with the browser zoom at 200%.
4. Request indexing for `/` and `/projects/docintel/` in Search Console (ask Mandar first).
5. In 4 weeks, compare impressions for DocIntel, Contract Risk Radar, CallMind and Report Copilot in the weekly GSC review.

## Risks

- **A longer homepage.** 2 sections push the contact form further down. The floating "Book a call" button (`index.astro:302`) still shows between the hero and the contact section, so the path to contact stays 1 tap.
- **The H1 change shifts how Google reads project pages.** The descriptor already sits in the title, so the risk is low. Watch project impressions in the weekly review.
- **Site name in results.** Google may take weeks to pick up `WebSite`, and it may still choose another name. No downside if it doesn't.
- **Homepage card picks go stale.** When the proof inventory changes, update the `recentWork` const. The build fails if an id disappears.
