#!/usr/bin/env bash
# Creates the website_lead_source contact property the lead Worker writes to.
# Must exist before deploying a Worker that sets it, or HubSpot rejects new leads.
# Idempotent. Needs a private app token with crm.schemas.contacts.write:
#   HUBSPOT_TOKEN=... ./create-hubspot-property.sh
set -euo pipefail
: "${HUBSPOT_TOKEN:?set HUBSPOT_TOKEN}"
API=https://api.hubapi.com/crm/v3/properties/contacts
AUTH="Authorization: Bearer $HUBSPOT_TOKEN"

code=$(curl -s -o /dev/null -w '%{http_code}' -H "$AUTH" "$API/website_lead_source")
if [ "$code" = 200 ]; then echo "website_lead_source already exists"; exit 0; fi
[ "$code" = 404 ] || { echo "unexpected status $code checking property" >&2; exit 1; }

curl -sf -X POST "$API" -H "$AUTH" -H 'Content-Type: application/json' -d '{
  "name": "website_lead_source",
  "label": "Website Lead Source",
  "type": "enumeration",
  "fieldType": "select",
  "groupName": "contactinformation",
  "description": "How the lead reached 72ai.in on its latest submission. Set by the lead-capture Worker.",
  "options": [
    { "label": "Discovery brief prompt", "value": "discovery_prompt", "displayOrder": 0, "hidden": false },
    { "label": "Contact form", "value": "contact_form", "displayOrder": 1, "hidden": false }
  ]
}' >/dev/null && echo "created website_lead_source"
