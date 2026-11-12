# lead-capture-72ai — Cloudflare Worker

Receives contact-form submissions from `72ai.in` and creates/updates a **HubSpot
contact** (create-or-update by email) via the free CRM contacts API. No paid HubSpot
Forms feature required. The site also mirrors each submission to **Formspree** as a
fallback, so a lead is never lost.

## Endpoint

`POST /` with JSON or form-encoded body:
`Name, Company, Email (required), Phone, Brief, Consent, _gotcha` (honeypot).

Maps to HubSpot contact: `firstname`/`lastname` (from Name), `company`, `email`,
`phone`, `message` (from Brief).

First-touch attribution, sent by the site with each submit (all optional): `utm_source`,
`utm_medium`, `utm_campaign`, `utm_content` (cut to 100 characters), `landing_page` and
`referrer` (cut to 300). They map to the contact properties `website_utm_source`,
`website_utm_medium`, `website_utm_campaign`, `website_utm_content`,
`website_landing_page` and `website_referrer`. Create them once with
`scripts/create-hubspot-property.sh` before deploying. If HubSpot rejects any
`website_*` property, the Worker retries once without them, so the lead is kept.
Tag conventions: `72ailabs/72ai-marketing`, `outbound/2026-11-12-utm-convention.md`.

## Deploy

```bash
cd workers/lead-capture

# 1. Authenticate wrangler to Cloudflare (one of):
#    - export CLOUDFLARE_API_TOKEN=<token with "Edit Cloudflare Workers">
#    - or: npx wrangler login   (interactive browser OAuth)

# 2. Set the HubSpot token as a secret (reuses the existing private app token):
npx wrangler secret put HUBSPOT_TOKEN     # paste HUBSPOT_PRIVATE_APP_TOKEN value

# 3. Deploy
npx wrangler deploy
```

Deploy prints the Worker URL (e.g. `https://lead-capture-72ai.<subdomain>.workers.dev`).
Put that URL in the site's contact form as the primary POST target.

## Test

```bash
curl -sS -X POST https://lead-capture-72ai.<subdomain>.workers.dev/ \
  -H 'Content-Type: application/json' \
  -d '{"Name":"Test Lead","Company":"Acme","Email":"test@example.com","Phone":"+91...","Brief":"hello"}'
# -> {"ok":true,"id":"..."}   then verify the contact in HubSpot
```

## Notes
- CORS is restricted to the 72ai.in origins (+ localhost/tailnet for dev).
- Secret `HUBSPOT_TOKEN` is never committed; it lives only in the Worker.
- Later upgrades (same Worker): Apollo enrichment, Telegram ping on new lead.
