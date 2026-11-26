// entryDates: per-entry lastmod from a JSON file's git history.
// Run: node --test tests/sitemap-lastmod.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { entryDates } from '../src/utils/sitemapLastmod.mjs';

// Hand-worked history of data.json, 1 commit a month:
//   Jan: a{x:1}, b{x:1}                      -> a Jan, b Jan
//   Feb: a{x:2}, b{x:1}                      -> a Feb (changed), b unchanged
//   Mar: b{x:1, keys reordered}, a, c{x:1}   -> c Mar (added); reordering is no change
//   Apr: not valid JSON                      -> skipped
//   May: b{x:1}, c{x:1} (a removed)          -> nobody changes; a keeps Feb
// Expected: a Feb, b Jan, c Mar.
function fixtureRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'lastmod-'));
  const git = (args, date) =>
    execFileSync('git', args, {
      cwd: dir,
      env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' },
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  git(['init', '-q']);
  const commit = (content, date) => {
    writeFileSync(join(dir, 'data.json'), content);
    git(['add', 'data.json'], date);
    git(['commit', '-q', '-m', date], date);
  };
  commit(JSON.stringify([{ id: 'a', x: 1 }, { id: 'b', x: 1 }]), '2026-01-01T00:00:00+00:00');
  commit(JSON.stringify([{ id: 'a', x: 2 }, { id: 'b', x: 1 }]), '2026-02-01T00:00:00+00:00');
  commit(JSON.stringify([{ x: 1, id: 'b' }, { id: 'a', x: 2 }, { id: 'c', x: 1 }]), '2026-03-01T00:00:00+00:00');
  commit('[{ "id": "a", ', '2026-04-01T00:00:00+00:00');
  commit(JSON.stringify([{ id: 'b', x: 1 }, { id: 'c', x: 1 }]), '2026-05-01T00:00:00+00:00');
  return dir;
}

test('entryDates dates each entry by its own last change', () => {
  const dir = fixtureRepo();
  try {
    const d = entryDates('data.json', 'id', dir);
    assert.equal(Date.parse(d.a), Date.parse('2026-02-01T00:00:00Z'), 'a changed in Feb, removed in May');
    assert.equal(Date.parse(d.b), Date.parse('2026-01-01T00:00:00Z'), 'b only had its keys reordered');
    assert.equal(Date.parse(d.c), Date.parse('2026-03-01T00:00:00Z'), 'c was added in Mar');
    assert.deepEqual(Object.keys(d).sort(), ['a', 'b', 'c']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('entryDates returns nothing for a file with no history', () => {
  const dir = fixtureRepo();
  try {
    assert.deepEqual(entryDates('missing.json', 'id', dir), {});
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
