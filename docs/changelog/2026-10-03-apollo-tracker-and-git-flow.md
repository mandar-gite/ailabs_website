# 2026-10-03: Apollo tracker fix and Git Flow setup

Apollo emailed a visitor-tracking script to mandar.gite@72ai.in. The site already had an Apollo tracker, but with a different app id, so we tracked down which one was real, swapped it, and got the domain showing Active. Then we cleaned up the repo and moved it onto Git Flow.

## What shipped

| Commit | Branch | What |
|---|---|---|
| `b28ca21` | main (deployed) | `feat(analytics)`: Apollo app id now comes from `PUBLIC_APOLLO_APP_ID` |
| `5c140ac` | develop | `chore`: gitignore `scratch/`, tool working dirs and `thoughts/` |

## Apollo tracker

**The problem.** `src/layouts/Layout.astro` hardcoded `appId:"69f1fbdff07d34000d8893cb"`, added 2026-05-12. Apollo's settings page shows `6a9919d522ad49001cf3616c`, the same id as the email.

There's only 1 Apollo workspace (users marketing@72ai.in and mandar.gite@72ai.in). The id timestamps tell the story: the old id was created 2026-04-29, 1 minute after the team itself, and the current one on 2026-09-03. So Apollo reissued the id and the site kept sending to the old one.

**The fix.** The id moved to an env var, the same pattern GA4 and Clarity use:

- `Layout.astro` reads `PUBLIC_APOLLO_APP_ID` and renders the script only when it's set
- `.github/workflows/deploy.yml` passes it into the Pages build
- GitHub repo variable `PUBLIC_APOLLO_APP_ID` set before the merge, so the first deploy already had it
- `.env.example` documents it; local `.env` has the real value

**The second problem.** After deploy, Apollo still said "Failed to connect: check your script". The site was fine: `72ai.in` just hadn't been added under Website domains in Apollo (it showed 0 / 3 used). Until it was, the tracker's `page_visit` POST got a 400. Once Mandar added the domain, the same POST returned 204 and the domain flipped to **Active**.

Things that look broken but aren't:

- `can_track_visitor` returns `{"can_track":false}`. Per `tracker.iife.js` that flag only gates LiveIntent person-level matching, and the domain is on Company-only tracking.
- In Mandar's Chrome the tracker script itself returns 503. A clean headless browser and curl both get 200, so it's probably the installed Apollo extension. Test in a clean browser.

To check it's live without opening Apollo:

```bash
curl -s https://72ai.in/ | grep -o 'APOLLO_APP_ID = "[a-f0-9]*"'
```

Then load any page in a clean browser and look for `aplo-evnt.com/api/v1/intent_pixel/track_request` returning 204.

## Repo housekeeping

Git Flow is now in place: `develop` was created from `main`. Work goes `feature/*` or `chore/*` into `develop`, and `develop` reaches `main` through `release/*` plus a tag. `main` stays the deploy source.

8 branches deleted, all merged except one. The SHAs, in case any need restoring with `git branch <name> <sha>`:

| Branch | SHA | Note |
|---|---|---|
| `ayush-test` | `e7fdbba` | local, merged |
| `feature/apollo-tracker-appid` | `b28ca21` | merged today |
| `feature/lead-capture-worker` | `3c39b75` | local, merged |
| `feature/site-polish-batch` | `01fa89f` | merged |
| `feature/warm-premium-redesign` | `7abb532` | merged |
| `codex/add-tailwind-integration-to-config` | `e9290df` | remote, merged |
| `codex/improve-website-ux` | `ff5770d` | remote, merged |
| `claude/find-small-todo-w4TsR` | `79a6713` | unmerged; added a `link` to the 3rd case study, but no page renders `CaseCard` and no `/case-studies/` pages exist |

Untracked clutter moved, nothing deleted:

- 42 July redesign screenshots and prototypes went to `scratch/design-2026-07/`
- `src/Documents/` (an old copy of pages and data, referenced nowhere) went to `scratch/stale/src-Documents/`

`thoughts/` is now gitignored and mirrored to `~/smriti/website_72ai/thoughts` by the nightly smriti sync (smriti commit `6501c67`). That matters because the G drive isn't in the restic S3 backup.

## Verification

- `node --test tests/apollo-tracker.test.mjs`: 2 / 2 pass. One build with the env var (script present, old id absent), one without (no script at all).
- `npx astro build` passes after `src/Documents/` moved out.
- Live sitemap check: 23 of 24 URLs carry the new id after redirects. The odd one out is `/en/careers/`, which is a redirect stub to `/careers` and never had a tracker.
- Clean browser on `/projects/`: tracker loads, `track_request` returns 204.

## Loose ends

- The workspace has 3 synthetic `page_visit` events from testing at about 17:26 IST, all from 1 made-up visitor id. They'll show as a single fake visit.
- `architecture.html`, `website_brief/` and `logo_ver3.3_1x1.jpg` are still untracked at the repo root, waiting on a keep, move or ignore decision.
- The site has GA4, Clarity and now Apollo running with no cookie consent banner and no privacy-policy wording for any of them. Turning on Apollo's person-level tracking (U.S. visitors only) would make that more pressing.
- `develop` is ahead of `main` by repo-hygiene commits only. Promoting them through a release is Mandar's call.
- Branch protection on `main` would enforce the new flow. It isn't set.
