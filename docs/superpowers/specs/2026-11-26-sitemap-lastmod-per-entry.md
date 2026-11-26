# Sitemap lastmod per project entry

Date: 2026-11-26. Built on `develop` at `origin/develop` of that day. Source: URL Inspection run of 26 Nov 2026 (31 sitemap URLs) from `72ai-analytics/weekly_metrics.py`.

## Goal

Make each page's `<lastmod>` move only when that page's own content changes, so Google can trust the date and the weekly report's "stale" list shows only pages that really need a recrawl.

## Problem

`src/utils/sitemapLastmod.mjs` already dates each page from the git history of its source files. 2 shortcuts, both marked in the code, tie unrelated pages together:

1. A project page depends on all of `src/data/projects.json`, all of `src/data/solutions.json`, every blog post and every case study (`sourceFiles`, the `projects` + slug branch).
2. The same whole-file dependencies sit in `DATA` for `''` (home), `projects`, `case-studies` and `solutions`.

So one commit to any project, post or case study dates every project page. On 26 Nov, 16 project pages, `/`, `/projects/` and `/solutions/` all carried `2026-11-25`, because the CPU-ARC posts and a Contract Risk Radar fix landed that day. The weekly report then listed 21 of 31 URLs as stale, and the 10 project pages it asked Mandar to resubmit hadn't changed at all.

## What a project page renders

From `src/pages/projects/[id].astro`:

| Source | What the page uses |
|---|---|
| `src/data/projects.json` | its own entry, matched by `id` |
| `src/data/solutions.json` | 1 entry, where `name` equals the project's `category` |
| `src/content/blog/<relatedPost>.md` | 1 post, when `relatedPost` is set |
| `src/content/case-studies/*.md` | 1 case study, whose frontmatter `project` equals the project `id` |
| `src/pages/projects/[id].astro` | the template |

## Change

### 1. Per-entry dates for the 2 JSON files

Add `entryDates(file, key)` to `src/utils/sitemapLastmod.mjs`:

- Walk the file's history once: `git log --format=%H %cI -- <file>`, oldest first.
- For each commit, read the file at that commit (`git show <hash>:<file>`), parse it, and index entries by `key` (`id` for projects, `name` for solutions).
- An entry's date is the newest commit where its serialised JSON differs from the previous commit's, or where it first appears.
- Cache the result per file, so a build runs the walk once (22 commits touch `projects.json` today).
- A commit where the file doesn't parse is skipped, so a bad historical commit can't break the build.

Compare `JSON.stringify` of each entry with keys sorted, so reordering keys doesn't count as a change.

### 2. Narrow the project page dependencies

For `/projects/<id>/`, `lastmod` is the newest of:

- `entryDates(projects.json, 'id')[id]`
- `entryDates(solutions.json, 'name')[project.category]`
- the commit date of `src/content/blog/<relatedPost>.md`, when set
- the commit date of the case study file whose frontmatter `project` is `id`, when one exists
- the commit date of `src/pages/projects/[id].astro`

`sourceFiles` becomes a function that returns dates, or a sibling `pageLastmod(pathname)` replaces the `lastCommitDate(sourceFiles(...))` call in `astro.config.mjs`. Keep the layout and footer out, as today.

### 3. Index pages keep their collection dependency

`/`, `/projects/`, `/case-studies/`, `/solutions/` and `/blog/` list many entries, so they should move when any listed entry changes. Replace their whole-file JSON dependency with the newest per-entry date of the entries they show, which is the same date in practice but stops a formatting-only edit from moving them. Their blog and case study dependencies stay as they are.

## Tests

The repo has e2e tests only (`tests/e2e/sitemap.spec.ts`), and the build runs before them.

- **Unit tests for `entryDates`** (new, `node:test`, no new dependency): a fixture git repo built in a temp folder with 4 commits. It covers an entry added, an entry changed, an entry unchanged while another changes, an entry removed, and a key reorder that must not count as a change. Each case has an exact expected date.
- **e2e, kept:** every URL has a valid, past `lastmod`, and they aren't all equal.
- **e2e, new:** 2 project pages whose entries changed on different days get different `lastmod` values. Pick them from `git log` at test time, so the test doesn't pin dates that drift.
- **Hand check, once:** after the build, compare 3 project pages' `lastmod` with `git log -L` (or the walk by hand) on their entries.

## Acceptance

- A commit that edits 1 project entry moves only that project's page, `/`, `/projects/` and any index that lists it.
- A new blog post moves `/blog/`, `/`, `/solutions/` and only the project page that names it in `relatedPost`.
- The next weekly report's stale list drops the project pages that didn't change.

## Out of scope

- Blog post pages and case study pages: they already date from their own file.
- `changefreq` and `priority`: Google ignores both.
- Requesting indexing: Mandar does that in Search Console, starting with the 5 case study URLs Google doesn't know yet.
