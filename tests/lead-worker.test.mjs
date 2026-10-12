// Unit tests for the lead-capture Worker (workers/lead-capture/src/index.js).
// HubSpot is mocked by replacing global fetch, so nothing leaves the machine.
// Run with: node --test tests/lead-worker.test.mjs
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/lead-capture/src/index.js';

const ORIGIN = 'https://72ai.in';
const VALID = { Name: 'Asha Rao', Company: 'Rao Textiles', Email: 'asha@example.com', Phone: '+91 98200 41736', Brief: 'Forecasting demand.' };

let calls;
let hubspot; // (url, init) => Response, or throws
beforeEach(() => {
  calls = [];
  hubspot = () => Response.json({ id: '101' }, { status: 201 });
  globalThis.fetch = async (url, init) => { calls.push({ url: String(url), init }); return hubspot(String(url), init); };
});

const env = (limiterOk = true) => ({ HUBSPOT_TOKEN: 'test-token', LEAD_LIMITER: { limit: async () => ({ success: limiterOk }) } });
const post = (body, headers = {}) =>
  new Request('https://72ai.in/api/lead', {
    method: 'POST',
    headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

test('OPTIONS answers CORS preflight for the site origin', async () => {
  const res = await worker.fetch(new Request('https://72ai.in/api/lead', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), env());
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('unknown origins get the site origin back, never a wildcard', async () => {
  const res = await worker.fetch(new Request('https://72ai.in/api/lead', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }), env());
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('GET is rejected', async () => {
  const res = await worker.fetch(new Request('https://72ai.in/api/lead', { headers: { Origin: ORIGIN } }), env());
  assert.equal(res.status, 405);
});

test('valid lead creates a HubSpot contact', async () => {
  const res = await worker.fetch(post(VALID), env());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, id: '101' });
  const sent = JSON.parse(calls[0].init.body).properties;
  assert.equal(sent.firstname, 'Asha');
  assert.equal(sent.lastname, 'Rao');
  assert.equal(sent.email, 'asha@example.com');
});

test('existing contact is updated instead (409 then PATCH)', async () => {
  hubspot = (url, init) =>
    init.method === 'POST'
      ? Response.json({ message: 'Contact already exists. Existing ID: 555' }, { status: 409 })
      : Response.json({ id: '555' }, { status: 200 });
  const res = await worker.fetch(post(VALID), env());
  assert.equal(res.status, 200);
  assert.equal(calls[1].init.method, 'PATCH');
  assert.match(calls[1].url, /\/555$/);
});

test('honeypot submissions are accepted silently without calling HubSpot', async () => {
  const res = await worker.fetch(post({ ...VALID, _gotcha: 'bot' }), env());
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('invalid email is rejected with 422', async () => {
  const res = await worker.fetch(post({ ...VALID, Email: 'nope' }), env());
  assert.equal(res.status, 422);
});

for (const [label, body] of [['null', 'null'], ['array', '[1,2]'], ['number', '42'], ['broken JSON', '{"Name":']]) {
  test(`a ${label} body is rejected with 400, not a crash`, async () => {
    const res = await worker.fetch(post(body), env());
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0);
  });
}

test('an over-long field is rejected with 422', async () => {
  const res = await worker.fetch(post({ ...VALID, Brief: 'x'.repeat(5001) }), env());
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error, 'field_too_long');
  assert.equal(calls.length, 0);
});

test('a field at exactly the cap is accepted', async () => {
  const res = await worker.fetch(post({ ...VALID, Brief: 'x'.repeat(5000) }), env());
  assert.equal(res.status, 200);
});

test('HubSpot being unreachable returns 502 instead of throwing', async () => {
  hubspot = () => { throw new TypeError('network down'); };
  const res = await worker.fetch(post(VALID), env());
  assert.equal(res.status, 502);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('HubSpot errors are not echoed back to the browser', async () => {
  hubspot = () => new Response('{"message":"Property values were not valid: internal detail"}', { status: 400 });
  const res = await worker.fetch(post(VALID), env());
  assert.equal(res.status, 502);
  const body = await res.json();
  assert.deepEqual(Object.keys(body).sort(), ['error', 'ok']);
  assert.doesNotMatch(JSON.stringify(body), /internal detail/);
});

test('rate-limited callers get 429 and HubSpot is not called', async () => {
  const res = await worker.fetch(post(VALID), env(false));
  assert.equal(res.status, 429);
  assert.equal(calls.length, 0);
});

test('works without a rate limiter binding (local dev)', async () => {
  const res = await worker.fetch(post(VALID), { HUBSPOT_TOKEN: 'test-token' });
  assert.equal(res.status, 200);
});

test('need and timing are added to the HubSpot message', async () => {
  await worker.fetch(post({ ...VALID, Need: 'Documents or OCR', Timing: 'Within a month' }), env());
  const { message } = JSON.parse(calls[0].init.body).properties;
  assert.match(message, /^Forecasting demand\./);
  assert.match(message, /Need: Documents or OCR/);
  assert.match(message, /Timing: Within a month/);
});

// Security review 2026-10-12: caps must cover the lowercase fallback fields the
// Worker also reads, and logs must not carry submitted personal data.
for (const [field, size] of [['message', 5001], ['email', 255], ['name', 201], ['company', 201], ['phone', 41]]) {
  test(`over-long lowercase "${field}" fallback is rejected too`, async () => {
    const body = { ...VALID };
    delete body[field === 'message' ? 'Brief' : field[0].toUpperCase() + field.slice(1)];
    body[field] = field === 'email' ? 'a'.repeat(size - 12) + '@example.com' : 'x'.repeat(size);
    const res = await worker.fetch(post(body), env());
    assert.equal(res.status, 422);
    assert.equal(calls.length, 0);
  });
}

test('HubSpot error logs carry no submitted personal data', async () => {
  hubspot = () => new Response(JSON.stringify({ status: 'error', category: 'VALIDATION_ERROR', message: 'Email address asha@example.com is invalid' }), { status: 400 });
  const logged = [];
  const orig = console.error;
  console.error = (...a) => logged.push(a.map(String).join(' '));
  try { await worker.fetch(post(VALID), env()); } finally { console.error = orig; }
  const all = logged.join('\n');
  assert.match(all, /VALIDATION_ERROR/);
  assert.doesNotMatch(all, /asha@example\.com|Asha|Rao Textiles|98200/);
});
