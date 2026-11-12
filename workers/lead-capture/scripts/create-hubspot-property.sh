#!/usr/bin/env bash
# Creates the contact properties the lead Worker writes to: website_lead_source plus
# the 6 first-touch attribution fields. Create them before deploying a Worker that
# sets them; if one is missing, the Worker retries without attribution and keeps the lead.
# Idempotent. Needs a private app token with crm.schemas.contacts.write:
#   HUBSPOT_TOKEN=... ./create-hubspot-property.sh
set -euo pipefail
: "${HUBSPOT_TOKEN:?set HUBSPOT_TOKEN}"
API=https://api.hubapi.com/crm/v3/properties/contacts
AUTH="Authorization: Bearer $HUBSPOT_TOKEN"

# create <name> <json body>: skip if it exists, create if it doesn't, stop on anything else.
create() {
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "$AUTH" "$API/$1")
  if [ "$code" = 200 ]; then echo "$1 already exists"; return; fi
  [ "$code" = 404 ] || { echo "unexpected status $code checking $1" >&2; exit 1; }
  curl -sf -X POST "$API" -H "$AUTH" -H 'Content-Type: application/json' -d "$2" >/dev/null && echo "created $1"
}

create website_lead_source '{
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
}'

# First-touch attribution: single-line text, set by the Worker from the form submit.
for pair in \
  "website_utm_source|Website UTM Source" \
  "website_utm_medium|Website UTM Medium" \
  "website_utm_campaign|Website UTM Campaign" \
  "website_utm_content|Website UTM Content" \
  "website_landing_page|Website Landing Page" \
  "website_referrer|Website Referrer"; do
  name=${pair%%|*}; label=${pair#*|}
  create "$name" "{
    \"name\": \"$name\",
    \"label\": \"$label\",
    \"type\": \"string\",
    \"fieldType\": \"text\",
    \"groupName\": \"contactinformation\",
    \"description\": \"First-touch attribution from 72ai.in, sent with the contact form. Set by the lead-capture Worker.\"
  }"
done
