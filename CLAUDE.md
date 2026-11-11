# ailabs_website

The 72ai.in site (Astro).

## SEO and marketing: what lives here

Technical SEO lives here, because the code that implements it does: titles, meta descriptions, canonical URLs, OG tags and schema (`src/layouts/Layout.astro`, `src/pages/blog/[slug].astro`), the sitemap (`astro.config.mjs`), `public/robots.txt`, internal links and page copy. Specs and plans that change the site go in `docs/superpowers/`.

SEO audits, keyword research, competitor research, performance reports and all other marketing work live in `mandar-gite/72ai-marketing`. When an audit there finds something that needs a code change, the fix and its plan come here.

## Search Console data: where it lives

Set up on 11 Nov 2026. Everything sits in 1 Google Drive folder on the 72ai shared drive.

| What | Where | ID |
|---|---|---|
| Folder | `72AI_Marketing/SEO` | `1qbRHT2hQimtIjCz0ZR1NzOy1XrXJYDfF` |
| GSC data sheet, "google search data" | in that folder | `1CH4DcLV-Br4OEToXcLNRj73A8dsdf3xubPCl4K1RTes` |
| Weekly reports, "YYYY-MM-DD GSC weekly review 72ai.in" | Google Docs in that folder | 1 per week |
| Routine "72ai GSC weekly review" | https://claude.ai/code/routines/trig_017HLvcGYKQW6zDu3uGsmpg1 | `trig_017HLvcGYKQW6zDu3uGsmpg1` |

- The Search Analytics for Sheets add-on fills the sheet. It runs a weekly backup for `sc-domain:72ai.in`, grouped by Query and Page. The 11 Nov tab `SAS_2026-11-11_last 90 days` is the baseline: 90 rows over 90 days.
- The routine runs every Monday at 9:00 IST (cron `30 3 * * 1` UTC) on `claude-sonnet-5-5` with the Google Drive connector only. It reads the sheet and this repo, and its only write is the report Doc. Run it by hand from the link above whenever needed.
- Read the sheet with the Google Drive connector (`read_file_content`). The Chrome extension couldn't open Search Console on 11 Nov, and the Search Console API needs a service account that isn't set up.
- About 40% of impressions are `ai7xxxx` code queries (regex `^ai\d{4,}$`) with 0 clicks. Drop them before any analysis.
- Ahrefs Webmaster Tools reports 0 organic keywords because it uses its own estimate. Use the GSC sheet for keyword data.
