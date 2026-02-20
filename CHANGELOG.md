# Changelog

All notable changes to the 72° AI Labs website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Shared `Footer` component — pentagon mark, tagline, nav links, copyright — deployed across all 16 pages
- Pipeline hero graphic — animated SVG showing Spreadsheet/Documents/Live Data → 72° AI → Forecasts/Insights/Decisions
- Four capability badges: Your Data. Your Rules. / Open Source Models / Host in Your Cloud / No Subscription Fees
- Floating "100% Custom-built for your stack" metric card in hero
- Six capability cards with plain-English outcome headlines (Finance, Ops, Sales, Support, Marketing, Logistics)
- Trust bar listing 5 industries on homepage
- Inter font loaded via Google Fonts

### Changed
- Full visual identity update: white/slate/blue palette replaces cream/navy/cyan
- Nav: frosted glass sticky header with inline SVG pentagon mark, bold dark links
- Homepage: complete rewrite — pipeline hero, capabilities grid, How It Works, proof stats, CTA section
- Positioning updated to "Building in India for the World" (global audience)
- Step 4 of How It Works: "Your system keeps getting smarter" (removed "we grow with you" framing)
- Stats: "5+ Industries served across India" (removed inaccurate "three continents" claim)
- About: founder tagline updated to "Building in India for the World"
- CSS design tokens consolidated in `global.css`

### Fixed
- Removed all "72 hours delivery" promises from copy
- Removed India-specific tool references (Tally/Zoho) — now uses "ERP, CRM, spreadsheets"
- Removed "RAG Pipeline" badge (too technical for target audience)
- Removed "ai-pipeline · running" terminal label from hero graphic

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
