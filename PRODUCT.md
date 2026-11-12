# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary reader is an AI-curious decision-maker: an owner, founder, CXO or senior functional head who can approve spend, in any sector and at any company size. They're drawn to AI mainly for cost reasons (work that takes too many people, too long, or goes wrong too often), and they're unsure on 4 things: can AI do this on our data, what will it cost to build and to run, will it pay back, and will we keep control of our data. They have a specific job in mind and the data behind it (ledgers, call recordings, documents, reports, spreadsheets), and no in-house AI team. They want a small, safe experiment with a clear answer before any big commitment.

Second primary reader is a partner: the founder or CTO of an AI services firm whose engineers are strong but who's missing the senior layer between them and the founder. They're looking for a forward deployed engineer (Mandar) who knows the technology and the business, for design, specs and review on their own client work.

Secondary reader is the technical person either of them asks to vet the studio (CTO, tech lead, or a trusted advisor). They read project pages and the blog for evidence of real engineering depth.

Not for: leaders who want a vision workshop with no problem in mind, buyers who want a licence for a ready-made product, and anyone with no data or problem to experiment on yet. Full ICP: `72ailabs/72ai-marketing`, `positioning/2026-11-12-icp-v2.md`.

The site serves the owner first. Technical proof sits one click deeper, never in the way of the owner's read.

## Product Purpose

72ai.in is the marketing site for 72° AI LABS, a founder-led lab of senior people who understand both the business and the technology. It looks for interesting problems and solves them on a client's own business data, as an experiment the client runs with the lab: custom models, RAG pipelines, workflow automation and decision tools, built bespoke for each problem. A visitor should leave with 1 impression: these people are curious about my problem and will test it properly.

The site exists to turn a qualified visitor into a conversation. Success is a submitted contact form (`/#contact`, which posts to Formspree and the HubSpot Worker at `72ai.in/api/lead`) from a business with a real data problem. Secondary jobs: show breadth of work (`/projects`, `/solutions`), build credibility through writing (`/blog`, RSS), and offer a free tool (`/voice-dna`).

## Positioning

The 1 message (draft, 12 Nov 2026, wording open): "Bring us a problem you'd like AI to solve. We'll test it on your own data in a few weeks, show you what it costs and what it returns, and you decide what's next." For partners: "Your team builds; we add the senior layer."

Sector-agnostic: the lab picks problems, in any industry. Every project write-up, article and post follows the 3-point case-study structure: the benefit the client got (title and impact), how we approached it (the hard part and the choices we made), and how quickly it was done with little disruption and care for the client's data. Projects stay unnamed.

Built on the client's own data, owned by the client. Systems run on open-source models, can be hosted in the client's cloud or on-prem, and carry no subscription fee or vendor lock-in. Engagements start small (discovery, then a proof of concept on real data, then a production build the client owns) and are sized frugally.

Market position: India-based, selling globally. India is the origin and a source of hard-won context (Tally, GST, messy SME data), not a limit on who the studio serves.

## Operating Context

- Owners usually arrive from a referral, LinkedIn or search, skim the homepage, and decide within a minute whether the studio "gets" their kind of business.
- Engagement model as stated on `/about` and the homepage: 01 Discovery (1 week, free), 02 Proof of Concept (2 to 3 weeks), 03 Implementation (6 to 12 weeks); usually 9 to 16 weeks end to end. Confirmed by the founder 2026-10-12. Source of truth: `src/data/engagement.json`.
- Practice areas from `src/data/solutions.json`: Finance Automation, Operational Intelligence, Content & Marketing Intelligence, Document & OCR Systems, Data Engineering & Integration. `public/llms.txt` also lists On-Premises LLM Systems.
- New project entries are drafted with the `/create_websitebrief` skill into `website_brief/<id>.md` and hand-assembled into `src/data/projects.json` by the founder. Nothing writes `projects.json` automatically.

## Capabilities and Constraints

- Static Astro 5 site with Tailwind v3, deployed to 72ai.in. No CMS; content lives in `src/data/*.json`, `src/content/blog/*.md` and page files.
- Lead capture: `src/components/ContactForm.astro` (dual submit, progressive enhancement) and `src/components/ExitIntentPopup.astro`.
- Analytics IDs come from env vars (`PUBLIC_GA4_ID`, `PUBLIC_CLARITY_ID`, `PUBLIC_APOLLO_APP_ID`).
- Playwright e2e suite in `tests/e2e/` covers pages, nav, contact form and exit popup.
- AI-crawler support is deliberate: `public/llms.txt` and sr-only TL;DR paragraphs on key pages.
- Open: `/en/careers` duplicates `/careers`; whether both stay is undecided.

## Brand Commitments

- Name: **72° AI LABS** (with the degree sign). The 72° is a regular pentagon's external angle, which hints at the golden ratio inside; the studio reads a few observable signals to decode the structure underneath a business.
- Founder: Mandar Gite, BITS Pilani alumnus. Founded 2024. Founder tagline: "Building AI that adapts to your business."
- Hero line: "Your data. Your AI system." Eyebrow: "Bespoke AI Systems."
- Brand principles from `/about`: Balance, Proportion, Harmony, Discovery, Contextual Intelligence.
- Logo assets in `public/logos/` (`logo.jpg`, `logo-mark.png`, `logo_ver3.3_1x1.jpg`). `docs/Brand_Kit.md` forbids stretching, recolouring (beyond approved mono versions), filters or drop shadows on the logo.
- Voice: `public/voice-dna.md` governs all copy. Contractions, short paragraphs, numbers as digits, specific claims, no em dashes, no "This isn't X, it's Y" constructions, and none of the banned AI phrases listed there.

## Evidence on Hand

- Real: 9 project write-ups in `src/data/projects.json` and `src/pages/projects/*.astro`; 3 blog posts (AutoResearch on an RTX 3060 with measured results, multi-agent RAG architecture, welcome post); the Voice DNA tool; founder bio on `/about`; `website_brief/callmind.md`.
- Unconfirmed, do not reuse or expand until the founder verifies:
  - outcome figures in `src/data/caseStudies.json` (currently rendered nowhere);
  - whether each project in `projects.json` was client work or an internal build;
  - the homepage trust bar "Deployed across Manufacturing, Food & Beverage, Retail & Distribution, Professional Services, Logistics". It also conflicts with the sector-agnostic positioning (12 Nov 2026); review it in the next homepage pass.
- Absent: no client testimonials, no named client logos, no press. Future work must not invent any of these.

### Project facts confirmed by the founder (2026-10-07)

- **CallMind:** `website_brief/callmind.md` is the truth (Hindi script-compliance audit). The live sentiment/topic-extraction copy is wrong.
- **MarTech Intelligence:** dropped from the site.
- **Hospitality & F&B Data Hub** (repo BrewNexus) and **Tire-Life Analytics** (repo Bridgestone): proofs of concept that the clients never let go ahead. Corrected 2026-10-12: neither was deployed. Both removed from the site; don't present either as delivered work or name the clients.
- **JNVessays:** a quick proof of concept, not a production system.
- **NextSurge Momentum Alpha:** stays, but needs reframing.
- **InsightBridge:** hidden; there is no On-Prem LLM practice area. Cascade and Used Car are removed from Solutions.
- **Careers:** founder-led, no open roles. Don't claim a "small team".
- Every project needs a verified brief from its repo (`/create_websitebrief`) before its page copy is rewritten. Until then, don't add outcome claims.

## Product Principles

1. Speak to the owner's problem in their words (cash flow, wastage, missed calls) before naming any technology.
2. Every claim is specific and checkable; when proof doesn't exist yet, say less instead of implying more.
3. Ownership is the differentiator: their data, their models, their infrastructure, no lock-in. Keep it visible.
4. Small first step. The path from reading to a discovery conversation stays short and low-commitment.
5. Technical depth is available, not imposed: project pages and the blog carry the engineering detail for the person vetting the studio.
6. Show work as experiments: the problem, what we tried, what worked, what didn't, and what it cost, with no client names. Curiosity about the problem comes before any claim about the lab.
