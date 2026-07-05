// Cloudflare Worker: lead capture -> HubSpot CRM contact (create-or-update by email).
// The static site's contact form POSTs here; the Worker holds the HubSpot token as a
// secret (env.HUBSPOT_TOKEN) and writes directly to the free CRM contacts API — so no
// paid HubSpot Forms feature is needed. Formspree remains a client-side fallback.

const ALLOWED_ORIGINS = [
  "https://72ai.in",
  "https://www.72ai.in",
  "http://localhost:4321",
  "http://127.0.0.1:4399",
  "http://100.94.66.37:4399",
];

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

    let data;
    try {
      data = await parseBody(request);
    } catch {
      return json({ ok: false, error: "bad_request" }, 400, origin);
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
      message: String(data.Brief || data.message || "").trim(),
    };
    for (const k of Object.keys(properties)) if (!properties[k]) delete properties[k];

    const HS = "https://api.hubapi.com/crm/v3/objects/contacts";
    const auth = {
      Authorization: `Bearer ${env.HUBSPOT_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Create; if the contact already exists HubSpot returns 409 with the existing id,
    // then update that contact instead (create-or-update by email).
    let res = await fetch(HS, {
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

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return json(
        { ok: false, error: "hubspot_error", status: res.status, detail: detail.slice(0, 300) },
        502,
        origin,
      );
    }

    const result = await res.json().catch(() => ({}));
    return json({ ok: true, id: result.id || null }, 200, origin);
  },
};
