# ailabs_website

The 72ai.in site (Astro).

## SEO and marketing: what lives here

Technical SEO lives here, because the code that implements it does: titles, meta descriptions, canonical URLs, OG tags and schema (`src/layouts/Layout.astro`, `src/pages/blog/[slug].astro`), the sitemap (`astro.config.mjs`), `public/robots.txt`, internal links and page copy. Specs and plans that change the site go in `docs/superpowers/`.

SEO audits, keyword research, competitor research, performance reports and all other marketing work live in `mandar-gite/72ai-marketing`. When an audit there finds something that needs a code change, the fix and its plan come here.

## Site structure changes

Decided by Mandar on 21 Nov 2026: changes to the site's structure (new homepage sections, nav or footer links, new page layouts) wait until the case studies are final and Mandar has discussed them with Ajay. Metadata, schema and fixes inside an existing page can ship before that. The deferred items are listed in `docs/superpowers/specs/2026-11-21-seo-on-site-fixes.md`.

## Search Console data: where it lives

Set up on 11 Nov 2026. Everything sits in 1 Google Drive folder on the 72ai shared drive.

| What | Where | ID |
|---|---|---|
| Folder | `72AI_Marketing/SEO` | `1qbRHT2hQimtIjCz0ZR1NzOy1XrXJYDfF` |
| GSC data sheet, "google search data" | in that folder | `1CH4DcLV-Br4OEToXcLNRj73A8dsdf3xubPCl4K1RTes` |
| Weekly reports, "YYYY-MM-DD GSC weekly review 72ai.in" | Google Docs in that folder | 1 per week |
| Routine "72ai GSC weekly review" | https://claude.ai/code/routines/trig_017HLvcGYKQW6zDu3uGsmpg1 | `trig_017HLvcGYKQW6zDu3uGsmpg1` |

- The Search Analytics for Sheets add-on fills the sheet. Its automated backups run only daily or monthly, so a daily backup for `sc-domain:72ai.in` writes 1 tab per day named `YYYY-MM-DD`, grouped by Date, Query and Page, and logs each run in the `Backup Log` tab. Manual runs write `SAS_<date>_<time>` tabs. Leave Compare off and Country out of Group By.
- The routine adds up the newest 7 dates into "this week", takes each date from 1 tab only (the daily tab first, else the newest `SAS_*` tab), and lists the source tab of each date in the report's Data notes.
- The 11 Nov 90-day baseline tab is gone from the sheet. Its Voice DNA figure (54 impressions, 0 clicks) lives in the routine prompt.
- URL Inspection: `Sheet1` holds the URL list (sitemap URLs plus 5 known duplicates, columns URL and Source). The add-on can't schedule URL Inspection, so run it by hand about once a week (select `Sheet1` A2:A28, URL Inspections, Inspect); each run writes a `SAS_*` tab with Coverage, Last Crawled and canonical columns. The routine's Indexing section reads the newest one and flags pages not indexed, canonical mismatches and pages whose sitemap `lastmod` is newer than Last Crawled, with their Request indexing links.
- The routine runs every Monday at 9:00 IST (cron `30 3 * * 1` UTC) on `claude-sonnet-5-5`. It uses the Google Drive connector for the sheet and curl for the live sitemap, reads this repo, and its only write is the report Doc. Run it by hand from the link above whenever needed.
- Read the sheet with the Google Drive connector (`read_file_content`). The Chrome extension couldn't open Search Console on 11 Nov.
- The Search Console API works too (checked 21 Nov): the `gsc-reader` service account in `72ai-analytics` (key at `~/.config/gsc-credentials.json`) and the `gsc` MCP server in Claude Code. Take clicks and impressions totals from it, grouped by date or page. The sheet's tabs group by query, and Google leaves anonymous queries out of any query grouping: 22 Oct to 19 Nov that was 65% of impressions and 10 of 12 clicks. Keep the sheet; the routine reads it.
- About 40% of impressions are `ai7xxxx` code queries (regex `^ai\d{4,}$`) with 0 clicks. Drop them before any analysis.
- Ahrefs Webmaster Tools reports 0 organic keywords because it uses its own estimate. Use the GSC sheet for keyword data.

## Deploy Configuration (configured by /setup-deploy)

Set up 26 Nov 2026. `/ship` and `/land-and-deploy` read this section.

- Platform: GitHub Pages, behind Cloudflare
- Production URL: https://72ai.in
- Deploy workflow: `.github/workflows/deploy.yml`, on every push to `main`. It runs the Worker tests and the e2e suite first, so a red test blocks the deploy.
- Deploy status command: `gh run list --workflow deploy.yml --limit 1 --json status,conclusion`
- Merge method: merge commit, never squash (feature and fix PRs into `develop`, release PRs into `main`, back-merge PRs into `develop`)
- Project type: static web site (Astro)
- Post-deploy health check: `https://72ai.in/` and `https://72ai.in/sitemap-index.xml` return 200, and the page changed by the release shows the new copy
- Version: `package.json` `version`. There is no `VERSION` file; never create one.

### Branches and releases

- Feature, fix, docs and chore PRs go into `develop`, with `--base develop` passed explicitly.
- `main` is production. It moves only through a `release/x.y.z` branch cut from `develop`: bump `package.json`, date the CHANGELOG's `[Unreleased]` block, PR into `main`, merge after CI, tag `vX.Y.Z` on the merge commit, then PR `main` back into `develop`.
- Releases are batched; ask Mandar before cutting one.
- The Lead Worker (`workers/lead-capture/`) deploys separately with wrangler and isn't part of this flow (README, "Deploy the lead Worker").

### Custom deploy hooks
- Pre-merge: `ci.yml` on the PR (Worker tests and e2e) must be green
- Deploy trigger: automatic on push to `main`
- Deploy status: `gh run list --workflow deploy.yml --limit 1`
- Health check: the 2 URLs above return 200
