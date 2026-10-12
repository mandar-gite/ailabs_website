# 72° AI LABS Website

The marketing site for 72° AI LABS, live at [72ai.in](https://72ai.in). Static Astro 5 site with Tailwind v3, deployed to GitHub Pages behind Cloudflare.

What the site is for, who it serves and what it may claim: [PRODUCT.md](PRODUCT.md). Visual system: [DESIGN.md](DESIGN.md). Release history: [CHANGELOG.md](CHANGELOG.md). More guides: [docs/](docs/README.md).

## Run it

```bash
npm install
cp .env.example .env   # analytics IDs; all optional for local work
npm run dev            # http://localhost:4321
npm run build          # static output in dist/
npm run preview        # serve dist/ locally
```

## Test it

```bash
npm run test:e2e                          # builds with analytics off, then runs Playwright
npm run test:e2e:ui                       # same, in Playwright's UI mode
node --test tests/apollo-tracker.test.mjs # Apollo tracker env var check (2 full builds, slow)
node --test tests/lead-worker.test.mjs    # lead-capture Worker, HubSpot mocked
```

CI runs the Worker tests and the e2e suite on every pull request, and again before each deploy; a failure blocks the deploy. The e2e suite in `tests/e2e/` runs on desktop and mobile viewports. Every request leaving localhost is stubbed (`tests/e2e/fixtures.ts`), so tests never send real leads to HubSpot or Formspree.

## Where things live

| Path | What |
|---|---|
| `src/pages/` | One file per route |
| `src/components/` | Shared components: `ContactForm`, `BookCall` (HubSpot calendar), `Nav`, `Footer`, `ExitIntentPopup` |
| `src/data/*.json` | Projects and solutions content |
| `src/content/blog/` | Blog posts (Markdown) |
| `public/` | Static files served as-is, including `llms.txt` and logos |
| `workers/lead-capture/` | Cloudflare Worker at `72ai.in/api/lead` that writes leads to HubSpot |
| `docs/` | Setup, deployment, analytics and brand guides |

## Analytics

IDs come from build-time env vars: `PUBLIC_GA4_ID`, `PUBLIC_CLARITY_ID`, `PUBLIC_APOLLO_APP_ID`. In production they're GitHub repository variables read by `.github/workflows/deploy.yml`. Each tracker only renders when its ID is set. Setup details: [docs/deployment/ANALYTICS_SETUP.md](docs/deployment/ANALYTICS_SETUP.md).

## Deploy the lead Worker

The Worker at `72ai.in/api/lead` deploys separately from the site; merging to `main` doesn't touch it. Run its tests first, then deploy from `workers/lead-capture/`:

```bash
node --test tests/lead-worker.test.mjs
cd workers/lead-capture
env -u CLOUDFLARE_API_TOKEN npx wrangler deploy
```

`env -u` matters on coeus: `~/.env` sets a `CLOUDFLARE_API_TOKEN` that can't edit Workers, and Wrangler would use it instead of the OAuth login. If the login has expired, run `env -u CLOUDFLARE_API_TOKEN npx wrangler login`; on a machine without a browser, open an SSH tunnel first (`ssh -L 8976:localhost:8976 coeus`) so the login callback reaches it.

The HubSpot token is a Worker secret (`npx wrangler secret put HUBSPOT_TOKEN`) and survives deploys. Logs and rate-limit settings live in `wrangler.toml`.

## Git workflow and releases

The repo follows Git Flow with Conventional Commits.

- `main` is production. A push to `main` deploys 72ai.in through GitHub Actions.
- `develop` is the integration branch. Work branches (`feature/`, `fix/`, `chore/`) start from `develop` and come back through a PR, merged with a merge commit.
- Only the owner promotes `develop` to `main`, through a release branch and a tag.

To cut a release:

1. Branch `release/X.Y.Z` from `develop`.
2. Bump `version` in `package.json` (`npm install --package-lock-only` to sync the lockfile) and move the changes into a `## [X.Y.Z] - YYYY-MM-DD` section of `CHANGELOG.md`.
3. Commit as `chore(release): X.Y.Z`, open a PR to `main`, merge it.
4. Tag the merge commit: `git tag -a vX.Y.Z -m "Release X.Y.Z"` and push the tag.
5. Merge `main` back into `develop`.
6. Watch the "Deploy to GitHub Pages" run and check 72ai.in.

Patch releases for fixes, minor for new features. Run `npm run test:e2e` before opening the release PR.

## Content rules

- Copy follows `public/voice-dna.md`: contractions, short paragraphs, numbers as digits, no em dashes.
- Don't add client names, logos, testimonials or outcome figures until the founder confirms them (see "Evidence on Hand" in `PRODUCT.md`).
- New project pages start from a brief written with the `/create_websitebrief` skill. Briefs live in `website_brief/`, which is gitignored because some hold private customer details.
