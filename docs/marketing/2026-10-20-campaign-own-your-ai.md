# Campaign brief: Own Your AI

Date: 2026-10-20. Runs 27 Oct 2026 to 18 Jan 2027 (12 weeks). Goal type: awareness (blog and SEO cluster). Paid budget: zero. Capacity: founder, about 5 hrs a week.

Baseline source: `docs/superpowers/specs/2026-10-20-seo-audit.md` and `docs/seo/2026-10-20-seo-and-brand-review.md`. Google knows 8 to 12 pages and has indexed 4, all 23 clicks are brand searches, and there's 1 backlink (linkedin.com). Ahrefs refused every call on the current plan.

## 1. Overview

**Name:** Own Your AI (Oct 2026 to Jan 2027)

**Summary:** 6 blog posts on private and self-hosted AI, each promoted on LinkedIn and linked to the others, to get 72ai.in found for searches other than its own name.

**Primary objective:** get from 0 to 20 non-brand organic clicks a month in Search Console by 18 Jan 2027.

**Secondary objectives:**

- Get 20 of the 22 sitemap URLs indexed.
- Grow from 1 referring domain to 8.
- Have 2 LinkedIn posts reach at least 1,000 impressions each.

## 2. Audience

**Primary:** the owner or founder of an Indian SMB or mid-size firm. Their operations run on Tally, spreadsheets, PDFs and call recordings, and their staff already use ChatGPT on personal logins. They worry about where customer data goes, but can't name the risk yet. They're at the awareness stage and searching questions, not vendors.

**Secondary:** the CTO or trusted advisor the owner asks to vet the studio. This reader looks for engineering depth in the technical posts.

**Where they spend time:** LinkedIn (founders, CA networks), Google search, WhatsApp forwards from peers, BITS and industry alumni groups.

## 3. Key messages

**Core:** your business data can power AI without ever leaving your control.

| Supporting message | Proof point on hand |
|---|---|
| The DPDP core duties start in May 2027, and pasted chatbot data is a gap you can't audit | DPDP post, legal sources cited |
| A self-hosted model costs a server, while ChatGPT costs a seat per person | Self-hosted vs ChatGPT post |
| Open models on 1 GPU handle most back-office work | AutoResearch post (RTX 3060, measured) |
| You own the model, the data and the code, with no subscription | PRODUCT.md positioning, DocIntel, FastAccounting |

**By channel:** the blog uses the full Voice DNA voice. LinkedIn runs in the first person, with 1 specific number per post. Directories use short factual listings.

## 4. Channel strategy

| Channel | Why it fits | Format | Effort |
|---|---|---|---|
| Blog (owned) | The core of the cluster; each post targets 1 question owners search | 1 post every 2 weeks, about 1,200 words, FAQ schema | Medium (Claude drafts, founder edits for about 90 min) |
| LinkedIn, founder profile (owned) | The 1 working backlink, and where Indian owners read | 2 posts a week: 1 post summary, 1 standalone insight | Low (about 45 min a week) |
| Directory listings (earned) | Fast referring domains with no budget | Clutch, GoodFirms, DesignRush, Google Business Profile (Mumbai) | Low, 1 time |
| Alumni and peer networks (earned) | Trusted reach to owners | BITS alumni portal listing, 1 group post a month | Low |
| Guest posts (earned) | Authority links from Indian business or tech sites | 2 pitches; reuse the DPDP angle | Medium |
| dev.to or Hacker News (earned) | Reaches the technical vetter, with canonical links back to the site | Cross-post the AutoResearch and cost posts | Low |

There is no paid spend. Email isn't a channel yet because there's no subscriber list.

## 5. Content calendar

Weeks start on Tuesdays. Diwali (8 Nov) and the year-end weeks are kept light.

**How posts go live:** each post merges early with `draft: true` and its campaign date as `pubDate`. The filename carries the same date, since it becomes the URL. On the release date, flip `draft` to `false` and ship a release to `main` (deploy runs on every push to `main`). Before you publish a post, check that its cross-links point only to posts already live; the e2e link test catches any that don't.

| Week | Content piece | Channel | Notes | Status |
|---|---|---|---|---|
| 1 (27 Oct) | Publish DPDP post; submit sitemap; request indexing for 8 pages | Blog, GSC | Flip `draft` in `private-llm-dpdp_2026-10-27.md` | Drafted |
| 1 | LinkedIn: "Your team is pasting customer data into ChatGPT" | LinkedIn | Link to the DPDP post | To do |
| 1 | Clutch and GoodFirms listings | Directories | 1 time, about 1 hr | To do |
| 2 (3 Nov) | Publish self-hosted vs ChatGPT post | Blog | Flip `draft` in `self-hosted-llm-vs-chatgpt_2026-11-03.md` | Drafted |
| 2 | LinkedIn: "$6,000 a year for 25 ChatGPT seats" | LinkedIn | | To do |
| 3 (10 Nov) | LinkedIn: DPDP 5-step plan as a text list | LinkedIn | Diwali week, 1 post only | To do |
| 3 | Google Business Profile (Mumbai) and BITS alumni listing | Directories | | To do |
| 4 (17 Nov) | Blog 3: "Should we train our own AI model?" (RAG vs fine-tuning, owner framing) | Blog | Links to posts 1 and 2 | To do |
| 4 | LinkedIn x2 | LinkedIn | | To do |
| 5 (24 Nov) | 2 guest-post pitches on the DPDP angle | Email | Founder picks the sites | To do |
| 5 | LinkedIn x2 | LinkedIn | | To do |
| 6 (1 Dec) | Blog 4: "What a private LLM costs to run" | Blog | Needs real hardware and power numbers from the founder | To do |
| 6 | Midpoint review: GSC indexing and impressions | GSC | 15 min | To do |
| 7 (8 Dec) | Cross-post the AutoResearch and cost posts | dev.to, HN | Canonical links back to 72ai.in | To do |
| 7 | LinkedIn x2 | LinkedIn | | To do |
| 8 (15 Dec) | Blog 5: "AI on your Tally exports without the data leaving your office" | Blog | Starts the Tally/GST cluster; uses FastAccounting | To do |
| 9 (22 Dec) | LinkedIn x1; add internal links between all 5 posts | LinkedIn, Blog | Holiday, light | To do |
| 10 (29 Dec) | LinkedIn: "DPDP: 4.5 months left. What to do in January" | LinkedIn | Light | To do |
| 11 (5 Jan) | Blog 6: "Ask questions of your own PDFs, privately" | Blog | Uses DocIntel; verify the DocIntel hosting claim first | To do |
| 11 | LinkedIn x2 | LinkedIn | | To do |
| 12 (12 Jan) | Wrap-up: GSC report, pick the next cluster | GSC | | To do |

About 20% of the slots are light on purpose, to leave room for reactive posts (for example, a DPDP news update).

## 6. Content pieces needed

| Asset | Contents | Priority | Due |
|---|---|---|---|
| Blog 1: DPDP | Done, `draft: true` until 27 Oct | Must | Week 1 |
| Blog 2: Self-hosted vs ChatGPT | Done, `draft: true` until 3 Nov | Must | Week 2 |
| Blog 3: RAG vs fine-tuning | Owner decision guide; "train our own" is a common owner question | Must | Week 4 |
| Blog 4: Private LLM running cost | Real numbers from the founder's hardware | Must | Week 6 |
| Blog 5: Tally exports and AI | Starts the Tally/GST cluster from the SEO audit | Must | Week 8 |
| Blog 6: Private document Q&A | Uses DocIntel | Nice | Week 11 |
| 18 to 20 LinkedIn posts | Each with 1 number and 1 link | Must | Weekly |
| 5 directory profiles | Short factual copy, the same everywhere | Must | Weeks 1 to 3 |
| 2 guest-post pitches | 150 words each | Nice | Week 5 |
| 1 cover image per post | Simple chart or diagram; also fills the `image` frontmatter | Nice | With each post |

## 7. Success metrics

| KPI | Baseline (20 Oct) | Target (18 Jan) | Source |
|---|---|---|---|
| Non-brand organic clicks a month (primary) | 0 | 20 | GSC, queries filtered to exclude "72" |
| Indexed pages | 4 | 20 | GSC Pages report |
| Non-brand impressions a month | about 3 | 1,000 | GSC |
| Referring domains | 1 | 8 | GSC Links report |
| LinkedIn referral sessions a month | Unknown | Set in week 1 | GA4 |
| Blog posts live | 3 | 9 | Repo |

**Check-ins:** a 15-minute GSC check every 2 weeks, a midpoint review in week 6 and a full report in week 12.

These targets are estimates. There's no historical benchmark, and Ahrefs is blocked. Reset them at the week 6 review.

## 8. Budget

There is no paid spend, so the cost is founder time: about 5 hours a week.

| Activity | Hours a week |
|---|---|
| Editing blog drafts (every 2 weeks, about 3 hrs) | 1.5 |
| LinkedIn posts and replies | 1.5 |
| Directories, pitches, alumni | 1 |
| Measurement and fixes | 0.5 |
| Buffer | 0.5 |

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Google indexes a young site slowly, so clicks lag behind the posts | Request indexing on each publish, cross-link every post, and treat indexing as the leading KPI |
| Founder time slips below 5 hrs | Claude drafts every post and every LinkedIn batch; the founder only edits and approves |
| A wrong claim on law or cost damages trust | Cite sources, verify the DocIntel and cost claims before publishing, and date-stamp the DPDP post |
| Ahrefs stays blocked, so there's no keyword data | Pick topics from the questions in GSC queries and LinkedIn comments |

## 10. Next steps

1. Merge `feature/blog-private-llm-dpdp` to `develop` now. Both posts stay hidden as drafts.
2. On 27 Oct and 3 Nov, flip `draft` and release to `main`.
3. Record the LinkedIn follower count and GA4 LinkedIn sessions as the missing baselines.
4. Decide whether to add a `/private-llm/` hub page. `PRODUCT.md` says there is no on-prem LLM practice area, so this is the founder's call. Without a hub page, the cluster works through the cross-links.
5. Choose the 2 guest-post targets.
