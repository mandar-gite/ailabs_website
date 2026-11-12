// Cloudflare Worker: lead capture -> HubSpot CRM contact (create-or-update by email).
// The static site's contact form POSTs here; the Worker holds the HubSpot token as a
// secret (env.HUBSPOT_TOKEN) and writes directly to the free CRM contacts API — so no
// paid HubSpot Forms feature is needed. Formspree remains a client-side fallback.

const ALLOWED_ORIGINS = [
  "https://72ai.in",
  "https://www.72ai.in",
  "http://localhost:4321",
];

// Longest accepted value per form field; anything longer is rejected, not truncated.
const MAX_LENGTH = { Name: 200, Company: 200, Email: 254, Phone: 40, Brief: 5000, Need: 100, Timing: 100 };

// First-touch attribution sent by the site: form key -> [HubSpot property, cap].
// These are cut to length instead of rejected, so a bad UTM tag never costs a lead.
const ATTRIBUTION = {
  utm_source: ["website_utm_source", 100],
  utm_medium: ["website_utm_medium", 100],
  utm_campaign: ["website_utm_campaign", 100],
  utm_content: ["website_utm_content", 100],
  landing_page: ["website_landing_page", 300],
  referrer: ["website_referrer", 300],
};

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : "https://72ai.in";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function parseBody(request) {
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await request.json();
  const form = await request.formData();
  const obj = {};
  for (const [k, v] of form.entries()) obj[k] = v;
  return obj;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, origin);
    }

    // Rate limit per client IP. The binding is absent in local dev.
    if (env.LEAD_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.LEAD_LIMITER.limit({ key: ip });
      if (!success) return json({ ok: false, error: "rate_limited" }, 429, origin);
    }

    let data;
    try {
      data = await parseBody(request);
    } catch {
      return json({ ok: false, error: "bad_request" }, 400, origin);
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return json({ ok: false, error: "bad_request" }, 400, origin);
    }
    // Resolve each field once (form names, then lowercase fallbacks) and cap the
    // values that are actually used, so a fallback key can't bypass the limit.
    const pick = (...keys) => String(keys.map((k) => data[k]).find((v) => v) ?? "").trim();
    const fields = {
      Name: pick("Name", "name"),
      Company: pick("Company", "company"),
      Email: pick("Email", "email"),
      Phone: pick("Phone", "phone"),
      Brief: pick("Brief", "message"),
      Need: pick("Need"),
      Timing: pick("Timing"),
    };
    for (const [field, max] of Object.entries(MAX_LENGTH)) {
      if (fields[field].length > max) {
        return json({ ok: false, error: "field_too_long", field }, 422, origin);
      }
    }

    // Honeypot bot trap — silently accept so bots don't retry
    if (data._gotcha) return json({ ok: true, skipped: "honeypot" }, 200, origin);

    const email = fields.Email;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: "invalid_email" }, 422, origin);
    }

    // Map form fields -> HubSpot contact properties
    const name = fields.Name;
    const parts = name.split(/\s+/).filter(Boolean);
    const firstname = parts.shift() || "";
    const lastname = parts.join(" ");

    const properties = {
      email,
      firstname,
      lastname,
      company: fields.Company,
      phone: fields.Phone,
      message: [
        fields.Brief,
        fields.Need ? `Need: ${fields.Need}` : "",
        fields.Timing ? `Timing: ${fields.Timing}` : "",
      ].filter(Boolean).join("\n"),
    };
    for (const k of Object.keys(properties)) if (!properties[k]) delete properties[k];
    // Attribution: briefs written with the /discovery-brief prompt start with this line.
    properties.website_lead_source = fields.Brief.startsWith("Discovery brief (72ai prompt)")
      ? "discovery_prompt"
      : "contact_form";
    for (const [key, [prop, max]] of Object.entries(ATTRIBUTION)) {
      const v = typeof data[key] === "string" ? data[key].trim().slice(0, max) : "";
      if (v) properties[prop] = v;
    }

    const HS = "https://api.hubapi.com/crm/v3/objects/contacts";
    const auth = {
      Authorization: `Bearer ${env.HUBSPOT_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Create; if the contact already exists HubSpot returns 409 with the existing id,
    // then update that contact instead (create-or-update by email).
    const upsert = async (props) => {
      let r = await fetch(HS, {
        method: "POST",
        headers: auth,
        body: JSON.stringify({ properties: props }),
      });
      if (r.status === 409) {
        const err = await r.json().catch(() => ({}));
        const m = String(err.message || "").match(/Existing ID:\s*(\d+)/);
        if (m) {
          r = await fetch(`${HS}/${m[1]}`, {
            method: "PATCH",
            headers: auth,
            body: JSON.stringify({ properties: props }),
          });
        }
      }
      return r;
    };

    let res;
    try {
      res = await upsert(properties);
      // If HubSpot rejects an attribution property (missing in this portal),
      // keep the lead: retry once without any website_* property.
      if (res.status === 400) {
        console.error("hubspot_retry_without_attribution", 400);
        const rest = Object.fromEntries(Object.entries(properties).filter(([k]) => !k.startsWith("website_")));
        res = await upsert(rest);
      }
    } catch (e) {
      console.error("hubspot_unreachable", e?.name || "Error");
      return json({ ok: false, error: "hubspot_unreachable" }, 502, origin);
    }

    // HubSpot error messages can quote submitted values, so only the status and
    // category are logged, and nothing about the error reaches the browser.
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("hubspot_error", res.status, err.category || "unknown");
      return json({ ok: false, error: "hubspot_error" }, 502, origin);
    }

    const result = await res.json().catch(() => ({}));
    return json({ ok: true, id: result.id || null }, 200, origin);
  },
};
