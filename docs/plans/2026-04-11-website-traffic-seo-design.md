# 72ai.in Website Traffic & SEO Design

**Date**: 2026-04-11
**Website**: https://72ai.in (Astro static site, GitHub Pages via Cloudflare)
**Repo**: `mandar-gite/ailabs_website`
**Current traffic**: ~40-65 human visits/day, no inbound leads from search
**Goal**: Grow organic search traffic and generate inbound leads from SMEs and enterprises globally

---

## Context

72ai.in is the primary business website for 72 AI Labs. All client acquisition is currently referral-based. The website has 23 pages (homepage, about, solutions, 9 project pages, 2 blog posts, careers, voice-dna) but no SEO strategy — no keyword targeting, minimal blog content, no structured data. Existing content in Obsidian, Google Drive, and LinkedIn can be repurposed.

## Competitive Analysis (as of 2026-04-11)

| | **72 AI Labs** | **Fractal.ai** | **Cere Labs** | **Datachamps.ai** | **Fractl.io** |
|---|---|---|---|---|---|
| **Positioning** | AI/ML consulting | Enterprise AI decisions | Enterprise GenAI / Document AI | No-code analytics platform | AI employee platform |
| **Target** | SMEs + Enterprises globally | Large global enterprises | Enterprises (banking, pharma) | SMEs (manufacturing, trading) | Enterprises |
| **Pages** | 23 | 20+ (industry pages, careers, IR) | 9+ dedicated vertical pages | 10+ (industry pages, case studies) | ~4 (home, blog, docs) |
| **Blog** | 2 posts | Not prominent | Not visible | Active blog | Has blog section |
| **Case Studies** | 0 published (9 potential) | 3+ | Client logos (Standard Chartered, HDFC, Toyota) | 3 documented | None visible |
| **Structured Data** | None | No | Not visible | JSON-LD (WebPage, BreadcrumbList) | Minimal |
| **Industry Pages** | 1 (solutions) | 7 dedicated vertical pages | 8 dedicated vertical pages | 9 verticals | Generic |
| **Social Proof** | None (deferred) | News/PR, investor relations | Forbes Select 200 award | 6 client testimonials | None |

### Competitive Gaps to Close
1. **Case studies** — Cere Labs and Datachamps both publish them; 72ai has 9 real projects but none published
2. **Structured data** — Datachamps has JSON-LD; 72ai has none
3. **Dedicated industry vertical pages** — Cere Labs has 8, Fractal has 7; 72ai has a single solutions page
4. **Blog volume** — Datachamps has an active blog; 72ai has only 2 posts

### Competitive Advantages
- 9 real projects ready for case study conversion — more than any competitor has published
- Deep content sources (Obsidian notes, research docs, project briefs, LinkedIn drafts)
- Astro + Cloudflare stack is technically superior (faster than Squarespace/Webflow)
- Weekly publishing cadence will quickly surpass competitors' content volume

## Target Audience

SMEs and enterprises globally looking for AI/ML consulting, across verticals:
- Manufacturing / FMCG (Nobel Hygiene, Bridgestone)
- Food & Beverage (Doolally/BrewNexus)
- Financial Services (NextSurge, portfolio analytics)
- Document Intelligence (DocIntel, FastAccounting)
- Education (JNV Essays, LFW Voice)

---

## Task 1: Technical SEO Audit & Fixes (Week 1)

### 1.1 Structured Data (JSON-LD)
- **Homepage**: Organization schema (name, logo, URL, contact)
- **Solutions page**: Service schema
- **Blog posts**: Article schema (headline, author, datePublished, image)
- Validate with Google Rich Results Test after adding

### 1.2 Meta Tags Audit
- Verify every page has unique `<title>` and `<meta description>`
- Ensure Open Graph tags (og:title, og:description, og:image) are present for social sharing
- Title format: `Page Title | 72 AI Labs`

### 1.3 Internal Linking
- Project pages link to solutions page
- Blog posts link to related project pages
- Homepage links to top 3 projects and latest blog post
- Solutions page links to all relevant project pages

### 1.4 Page Speed
- Run Lighthouse audit on homepage, solutions, one project page
- Verify images are optimized (WebP, lazy loading)
- Check no render-blocking resources
- Target: Lighthouse performance score > 90

### 1.5 Submit Sitemap to Search Console
- Go to Search Console > Sitemaps > submit `https://72ai.in/sitemap-index.xml`
- Verify all 23 pages are indexed

### 1.6 Fix Canonical URL Duplication
- Sitemap shows duplicate entries with and without trailing slashes (e.g., `/about` and `/about/`)
- Configure Astro `trailingSlash` setting to pick one format
- Ensure sitemap only lists canonical URLs

---

## Task 2: Keyword Research (Week 1-2)

### 2.1 Mine Existing Data
- Export Google Search Console queries (impressions, clicks, position) for 72ai.in
- Identify queries with high impressions but low clicks (quick wins — improve title/description)

### 2.2 Vertical Keyword Research
For each target vertical, find keywords in three categories:

| Category | Example | Intent |
|----------|---------|--------|
| Problem-aware | "how to reduce manual accounting errors" | Early stage, drives blog traffic |
| Solution-aware | "document intelligence platform", "ML for manufacturing" | Mid stage, drives solutions/project pages |
| Comparison/evaluation | "AI consulting firms", "ML consulting services" | Late stage, drives homepage/about |

Tools: Google Keyword Planner, Ubersuggest, AlsoAsked, Google autocomplete

### 2.3 Keyword Map
Output: spreadsheet mapping each keyword to a target page (existing or new blog post).

| Keyword | Volume | Difficulty | Target Page | Status |
|---------|--------|------------|-------------|--------|
| (to be filled) | | | | |

Refresh keyword map quarterly.

---

## Task 3: Content Engine (Ongoing — 1/week)

### 3.1 Content Sources (already exist)
- Project briefs and case study notes in `staging/gdrive-copy/`
- LinkedIn posts in `72AI_Marketing/Linkedin/`
- Technical docs and architecture notes per project
- Research notes per vertical (Nobel, BrewNexus, FastAccounting, etc.)

### 3.2 Content Types (priority order)

**1. Case Studies** (highest conversion)
- "How we built X for Y" using real project data
- Structure: Problem → Approach → Outcome → Tech Stack
- ~9 potential posts from existing portfolio:
  - BrewNexus (revenue forecasting for F&B)
  - FastAccounting (document intelligence for accounting)
  - DocIntel (document parsing/extraction)
  - Nobel Hygiene (AI blueprint for FMCG)
  - NextSurge (ML for quantitative equity)
  - Tire Analytics / Bridgestone (quality analytics)
  - JNV Essays (AI for education assessment)
  - CallMind (call analytics)
  - MarTech (LinkedIn content automation)

**2. Problem-Solution Posts** (SEO traffic drivers)
- Target specific keywords from keyword map
- Link to relevant project page as proof of capability
- Example: "Why manufacturers struggle with quality data" → links to tire-analytics

**3. Industry Insight Posts** (authority building)
- Repurpose research notes
- Example: FMCG AI trends from Nobel research, fitness industry data

### 3.3 Publishing Workflow
1. Pick keyword from keyword map
2. Find matching existing content in Obsidian/gdrive
3. Draft blog post (AI-assisted, reviewed by Mandar)
4. Optimize: keyword in title, H1, first paragraph, meta description
5. Add internal links to related project pages
6. Publish via PR to `ailabs_website` repo
7. Share on LinkedIn for initial distribution

### 3.4 Target Cadence
- 4 posts/month
- Alternating: case study, problem-solution, case study, industry insight

---

## Task 4: On-Page Optimization (Week 2)

### 4.1 Project Pages (9 pages)
For each project page:
- Add keyword-targeted `<title>` and `<meta description>`
- Structure content as: Problem → Approach → Outcome
- Add internal links to related blog posts (once published)
- Add CTA at bottom — contact form or consultation link

### 4.2 Solutions Page
- Target primary keyword (e.g., "AI consulting services" or "ML solutions for business")
- List verticals with links to relevant project pages
- Clear value proposition above the fold

### 4.3 Homepage
- H1 contains primary keyword (not just "72 AI Labs")
- Brief value proposition visible above the fold
- Link to top 3 project pages and latest blog post

---

## Task 5: Tracking & Measurement (Monthly)

### 5.1 Metrics
- **Google Search Console**: Impressions, clicks, average position, top queries
- **72ai Analytics pipeline** (`/home/mandar/media/G/analytics_72ai/`): Human visits/day trend, top pages
- **Blog performance**: Which posts drive traffic

### 5.2 Milestones
- **Month 1**: Technical SEO fixes live, keyword map done, first 4 blog posts published
- **Month 3**: Search impressions trending up, at least 2-3 keywords on page 1-2
- **Month 6**: Organic traffic doubles from ~50/day baseline, first inbound lead from search

### 5.3 Monthly Review Checklist
- [ ] Check Search Console for new queries, impressions, click trends
- [ ] Review analytics pipeline for human traffic trends
- [ ] Identify top-performing content, plan similar topics
- [ ] Update keyword map with new opportunities
- [ ] Ensure 4 posts were published, plan next month's topics

---

## Out of Scope (deferred)

- Social proof / client logos
- Paid ads / Google Ads
- Dedicated landing pages per vertical
- Backlink outreach
- Lead capture optimization (forms, gating)

---

## First Month Execution Order

| Week | Tasks |
|------|-------|
| 1 | Technical SEO fixes (structured data, meta tags, canonical URLs, sitemap submission, Lighthouse audit) |
| 1-2 | Keyword research (mine Search Console, vertical keyword research, build keyword map) |
| 2 | On-page optimization of existing project pages, solutions page, homepage |
| 2-4 | Publish first 4 blog posts (1 case study, 1 problem-solution, 1 case study, 1 industry insight) |
