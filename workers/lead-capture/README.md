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
