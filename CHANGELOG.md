# Changelog

All notable changes to the 72° AI Labs website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Shared `Footer` component — pentagon mark, tagline, nav links, copyright — deployed across all pages
- Pipeline hero graphic — animated SVG showing Spreadsheet/Documents/Live Data → 72° AI → Forecasts/Insights/Decisions
- Four capability badges: Your Data. Your Rules. / Open Source Models / Host in Your Cloud / No Subscription Fees
- Floating "100% Custom-built for your stack" metric card in hero
- Six capability cards with plain-English outcome headlines (Finance, Ops, Sales, Support, Marketing, Logistics)
- Trust bar listing 5 industries on homepage
- Inter font loaded via Google Fonts
- Real 72° pentagon brand mark — transparent mark-only PNG plus full lockup, rendered via the shared `LogoMark` component in nav, footer, contact form, and About
- 3-phase engagement section: Discovery → Proof of Concept → Implementation (replaces the 4-step "How It Works")

### Changed
- Full visual identity update: white/slate/blue palette replaces cream/navy/cyan
- Nav: frosted glass sticky header with the pentagon mark, bold dark links
- Homepage: complete rewrite — pipeline hero, capabilities grid, engagement process, proof stats, CTA section
- Global audience framing — all India-specific copy neutralised site-wide; JSON-LD `areaServed` broadened to Worldwide (registered address kept as IN)
- Nav and footer enlarged and aligned — logo 46px, larger heading/tagline/link sizes
- Primary hero button "See What We Build" restyled to white with a navy outline (matching "Talk to Us")
- Pipeline hero graphic: enlarged box labels and widened boxes for legibility
- Mobile hero: headline now precedes the pipeline animation
- Hero headline simplified to "Your data. / Your AI system." with the gold accent on the second line
- Project detail CTA card and About "Why 72°" card resized to tighter proportions
- Taglines now read "Bespoke AI Systems"; About founder tagline "Building AI that lasts."
- Stats: "5+ Industries served" (dropped India qualifier and the inaccurate "three continents" claim)
- CSS design tokens consolidated in `global.css`

### Fixed
- Logo mark transparency — removed opaque black top/bottom bands introduced during asset generation
- Removed all "72 hours delivery" promises from copy
- Removed India-specific tool references (Tally/Zoho) — now uses "ERP, CRM, spreadsheets"
- Removed "RAG Pipeline" badge (too technical for target audience)
- Removed "ai-pipeline · running" terminal label from hero graphic

### Removed
- "Featured" badge from blog index cards
- "Built for Bharat-scale realities" section from the About page
- "Built to Last" copy from the hero eyebrow, footer tagline, and hero headline

---

## [1.0.0] - Initial Release

### Added
- Initial website structure with Astro + Tailwind CSS
- Navigation with Projects, Solutions, About, Contact sections
- 13 technical AI project showcases with detailed specifications
- 6 solution categories (Finance, Operations, Documents, LLM, Data, Marketing)
- Dual-view projects page (table + grid)
- Individual project detail pages
- About page with company information and founder bio
- Contact form with Formspree integration
- Responsive design for mobile and desktop

### Features
- Project filtering by category
- View toggle (table/grid) for projects
- Technical specifications display (data types, ML methods, challenges)
- SEO optimization with meta tags
- Fast static site generation
