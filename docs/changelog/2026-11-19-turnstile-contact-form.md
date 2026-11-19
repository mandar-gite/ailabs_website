# 2026-11-19: Turnstile on the contact form, shipped as 0.14.0

2 HubSpot "new contact" alerts this morning turned out to be bots. Robertrab (06:55 IST) and Bradleyriz (08:24 IST) both picked "Documents or OCR" and "Just exploring", typed "google" as the company, and left every attribution field empty. That last part means the site's script never ran: they posted straight to `72ai.in/api/lead`, and the honeypot never saw them.

By 10:18 IST the Worker was rejecting tokenless posts and a real test lead still landed in HubSpot.

## What shipped

| Commit / PR | What |
|---|---|
| `a0bb38a` | `feat(contact)`: Turnstile widget on the form, siteverify check in the Worker |
| PR #75 | feature to develop |
| `f2131eb`, PR #76 | `chore(release): 0.14.0`, release to main; tag `v0.14.0` |
| PR #77 | back-merge main to develop |

## How the check works

- The form renders the widget (managed, `interaction-only`) only when `PUBLIC_TURNSTILE_SITE_KEY` is set at build time. Implicit render drops a `cf-turnstile-response` input into the form, so the existing `FormData` code picks it up with no change.
- The Worker runs the check only when `TURNSTILE_SECRET_KEY` is set. That gate made the rollout safe: site first, then the code, then the secret.
- No token, an over-long token (over 2048) or `success: false` gets 403 `captcha_failed`. A siteverify outage gets 502, so an unverified post never reaches HubSpot.
- Tokens work once, so the client calls `turnstile.reset()` after a failed send.
- The check sits after the honeypot and email validation, so junk gets turned away before it costs a siteverify call.

## Things that came up

- **Headless Chrome got no token.** Playwright on the live page left the field empty after 10 s. Turnstile treats automation as a bot, which is the point. Mandar's own browser got a 730-char token.
- **Wrangler's old login couldn't see the account.** "Failed to automatically retrieve account IDs", then "No access to the specified resource" once the account ID was set. A new API token from the "Edit Cloudflare Workers" template, narrowed to the `72ai.in` zone and the 1 account, fixed it. The token isn't stored anywhere yet.
- **The dashboard shortens the account ID** with `...`, and wrangler rejects that. Copy it from the URL instead.
- **No-JS posts now get 403.** The form shows a `<noscript>` line with the email address.

## Tests

- `tests/lead-worker.test.mjs`: 7 new cases (pass, missing, failed, outage, non-JSON answer, over-long token, honeypot first). 44 pass.
- `tests/e2e/contact-form.spec.ts`: 2 new (widget has the build-time key; a failed send with no Turnstile script raises no page error). The e2e build uses Cloudflare's always-pass test key. 313 pass, 9 skipped.
- siteverify called with Cloudflare's test secrets: the pass and fail shapes match the mocks.

## Live checks

```bash
curl -sS -X POST https://72ai.in/api/lead -H 'Origin: https://72ai.in' \
  -H 'Content-Type: application/json' -d '{"Name":"x","Email":"check@example.com",...}'
# {"ok":false,"error":"captcha_failed"}  HTTP 403   (no token, and again with a fake token)
```

HubSpot had no `check@example.com` afterwards. The real test lead (`test2@example.com`) arrived at 10:18 IST with the check on. Both test contacts and both bot contacts were deleted by hand (the HubSpot connector has no delete).

## Open

- Store the Cloudflare API token somewhere durable (gitignored `.env`, or a password manager) before the next Worker deploy.
- The careers form posts to Formspree and has no Turnstile.
- Cloudflare's request logs for the zone may still name where the 2 bots came from (POSTs to `/api/lead` at 01:25 and 02:54 UTC).
