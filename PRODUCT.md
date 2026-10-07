# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary reader is the owner or founder of a growing business: a non-technical decision-maker whose operations still run on spreadsheets, Tally exports, PDFs, call recordings and POS feeds. They're deciding whether a small outside team can turn that mess into something that changes decisions.

Secondary reader is the technical person the owner asks to vet the studio (CTO, tech lead, or a trusted advisor). They read project pages and the blog for evidence of real engineering depth.

The site serves the owner first. Technical proof sits one click deeper, never in the way of the owner's read.

## Product Purpose

72ai.in is the marketing site for 72° AI LABS, a founder-led studio that builds bespoke AI systems on a client's actual business data: custom models, RAG pipelines, workflow automation and decision tools across finance, operations and documents.

The site exists to turn a qualified visitor into a conversation. Success is a submitted contact form (`/#contact`, which posts to Formspree and the HubSpot Worker at `72ai.in/api/lead`) from a business with a real data problem. Secondary jobs: show breadth of work (`/projects`, `/solutions`), build credibility through writing (`/blog`, RSS), and offer a free tool (`/voice-dna`).

## Positioning

Built on the client's own data, owned by the client. Systems run on open-source models, can be hosted in the client's cloud or on-prem, and carry no subscription fee or vendor lock-in. Engagements start small (discovery, then a proof of concept on real data, then a production build the client owns) and are sized frugally.

Market position: India-based, selling globally. India is the origin and a source of hard-won context (Tally, GST, messy SME data), not a limit on who the studio serves.

## Operating Context

- Owners usually arrive from a referral, LinkedIn or search, skim the homepage, and decide within a minute whether the studio "gets" their kind of business.
- Engagement model as stated on `/about`: 01 Discovery, 02 Proof of Concept, 03 Implementation.
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
- Logo assets in `public/logos/` (`logo.jpg`, `logo-mark.png`) and `logo_ver3.3_1x1.jpg`. `Brand_Kit.md` forbids stretching, recolouring (beyond approved mono versions), filters or drop shadows on the logo.
- Voice: `public/voice-dna.md` governs all copy. Contractions, short paragraphs, numbers as digits, specific claims, no em dashes, no "This isn't X, it's Y" constructions, and none of the banned AI phrases listed there.

## Evidence on Hand

- Real: 9 project write-ups in `src/data/projects.json` and `src/pages/projects/*.astro`; 3 blog posts (AutoResearch on an RTX 3060 with measured results, multi-agent RAG architecture, welcome post); the Voice DNA tool; founder bio on `/about`; `website_brief/callmind.md`.
- Unconfirmed, do not reuse or expand until the founder verifies:
  - outcome figures in `src/data/caseStudies.json` (currently rendered nowhere);
  - whether each project in `projects.json` was client work or an internal build;
  - the homepage trust bar "Deployed across Manufacturing, Food & Beverage, Retail & Distribution, Professional Services, Logistics".
- Absent: no client testimonials, no named client logos, no press. Future work must not invent any of these.

### Project facts confirmed by the founder (2026-10-07)

- **CallMind:** `website_brief/callmind.md` is the truth (Hindi script-compliance audit). The live sentiment/topic-extraction copy is wrong.
- **MarTech Intelligence:** dropped from the site.
- **Hospitality & F&B Data Hub:** deployed across multiple restaurants.
- **Tire-Life Analytics:** is essentially supply-chain analytics; full details to come from its repo.
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
