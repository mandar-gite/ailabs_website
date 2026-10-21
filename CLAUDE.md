# ailabs_website

The 72ai.in site (Astro).

## SEO and marketing: what lives here

Technical SEO lives here, because the code that implements it does: titles, meta descriptions, canonical URLs, OG tags and schema (`src/layouts/Layout.astro`, `src/pages/blog/[slug].astro`), the sitemap (`astro.config.mjs`), `public/robots.txt`, internal links and page copy. Specs and plans that change the site go in `docs/superpowers/`.

SEO audits, keyword research, competitor research, performance reports and all other marketing work live in `mandar-gite/72ai-marketing`. When an audit there finds something that needs a code change, the fix and its plan come here.
