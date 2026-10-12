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
    for (const [field, max] of Object.entries(MAX_LENGTH)) {
      if (String(data[field] ?? "").length > max) {
        return json({ ok: false, error: "field_too_long", field }, 422, origin);
      }
    }

    // Honeypot bot trap — silently accept so bots don't retry
    if (data._gotcha) return json({ ok: true, skipped: "honeypot" }, 200, origin);

    const email = String(data.Email || data.email || "").trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: "invalid_email" }, 422, origin);
    }

    // Map form fields -> HubSpot contact properties
    const name = String(data.Name || data.name || "").trim();
    const parts = name.split(/\s+/).filter(Boolean);
    const firstname = parts.shift() || "";
    const lastname = parts.join(" ");

    const properties = {
      email,
      firstname,
      lastname,
      company: String(data.Company || data.company || "").trim(),
      phone: String(data.Phone || data.phone || "").trim(),
      message: [
        String(data.Brief || data.message || "").trim(),
        data.Need ? `Need: ${String(data.Need).trim()}` : "",
        data.Timing ? `Timing: ${String(data.Timing).trim()}` : "",
      ].filter(Boolean).join("\n"),
    };
    for (const k of Object.keys(properties)) if (!properties[k]) delete properties[k];

    const HS = "https://api.hubapi.com/crm/v3/objects/contacts";
    const auth = {
      Authorization: `Bearer ${env.HUBSPOT_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Create; if the contact already exists HubSpot returns 409 with the existing id,
    // then update that contact instead (create-or-update by email).
    let res;
    try {
      res = await fetch(HS, {
        method: "POST",
        headers: auth,
        body: JSON.stringify({ properties }),
      });

      if (res.status === 409) {
        const err = await res.json().catch(() => ({}));
        const m = String(err.message || "").match(/Existing ID:\s*(\d+)/);
        if (m) {
          res = await fetch(`${HS}/${m[1]}`, {
            method: "PATCH",
            headers: auth,
            body: JSON.stringify({ properties }),
          });
        }
      }
    } catch (e) {
      console.error("hubspot_unreachable", String(e));
      return json({ ok: false, error: "hubspot_unreachable" }, 502, origin);
    }

    // HubSpot's error detail goes to Workers Logs only, never to the browser.
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("hubspot_error", res.status, detail.slice(0, 500));
      return json({ ok: false, error: "hubspot_error" }, 502, origin);
    }

    const result = await res.json().catch(() => ({}));
    return json({ ok: true, id: result.id || null }, 200, origin);
  },
};
