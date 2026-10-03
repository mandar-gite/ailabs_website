// Checks the Apollo visitor tracker is driven by PUBLIC_APOLLO_APP_ID.
// Runs two real Astro builds, so it takes a while. Run with:
//   node --test tests/apollo-tracker.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_ID = 'testappid0000000000000000';
const OLD_ID = '69f1fbdff07d34000d8893cb';

function build(env) {
  // Strip any real value from the shell, then apply the case's env on top.
  // Astro's Vite env loading still reads .env, so set the var explicitly (empty to disable).
  const { PUBLIC_APOLLO_APP_ID, ...base } = process.env;
  execFileSync('npx', ['astro', 'build'], { cwd: root, env: { ...base, ...env }, stdio: 'ignore' });
  return readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
}

test('tracker renders with the app id from the env var', () => {
  const html = build({ PUBLIC_APOLLO_APP_ID: TEST_ID });
  assert.match(html, /assets\.apollo\.io\/micro\/website-tracker\/tracker\.iife\.js/);
  assert.ok(html.includes(TEST_ID), 'app id from env should be in the page');
  assert.ok(!html.includes(OLD_ID), 'stale hardcoded app id must be gone');
});

test('tracker is omitted when the env var is empty', () => {
  const html = build({ PUBLIC_APOLLO_APP_ID: '' });
  assert.ok(!html.includes('tracker.iife.js'), 'no Apollo script without an app id');
  assert.ok(!html.includes(OLD_ID));
});
