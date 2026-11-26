import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

// A shallow clone gives every page the same date, so stop the build instead of shipping it.
if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() === 'true') {
  throw new Error('sitemap lastmod needs full git history: set fetch-depth: 0 on the checkout');
}

// Data a page renders besides its own .astro file. Keep in step with the page's imports.
const DATA = {
  '': ['src/utils/engagement.ts', 'src/data/projects.json', 'src/data/solutions.json', 'src/content/blog'], // What we build, Recent work, Latest writing
  about: ['src/utils/engagement.ts', 'src/data/solutions.json'],
  blog: ['src/content/blog'], // the index lists every post
  projects: ['src/data/projects.json', 'src/content/case-studies'], // links to /case-studies/ once 1 is published
  'case-studies': ['src/data/projects.json', 'src/content/case-studies'],
  // shortcut: relatedPost shows 1 post title, but any blog edit dates the page; map the single post file if recrawls get noisy
  solutions: ['src/data/solutions.json', 'src/data/projects.json', 'src/content/blog'],
};

// Source files whose content defines a page. Layout and footer files are left out
// on purpose: Google wants lastmod to move only when the page's own content does.
export function sourceFiles(pathname) {
  const p = pathname.replace(/^\/|\/$/g, '');
  const [section, slug] = p.split('/');
  if (!p) return ['src/pages/index.astro', ...DATA['']];
  if (section === 'blog' && slug) {
    return [`src/content/blog/${slug}.md`, `src/content/blog/${slug}.mdx`].filter((f) => existsSync(f));
  }
  // Every data source a project page reads. pageLastmod() narrows each to the entry the page shows.
  if (section === 'projects' && slug) {
    return ['src/pages/projects/[id].astro', 'src/data/projects.json', 'src/data/solutions.json', 'src/content/blog', 'src/content/case-studies'];
  }
  if (section === 'case-studies' && slug) {
    return [`src/content/case-studies/${slug}.md`].filter((f) => existsSync(f));
  }
  const own = [`src/pages/${p}.astro`, `src/pages/${p}/index.astro`].filter((f) => existsSync(f));
  return own.length ? [...own, ...(DATA[p] ?? [])] : [];
}

// Newest commit date (ISO 8601) that touched any of the files, or undefined.
// Needs full git history: a shallow clone gives every page the same date.
export function lastCommitDate(files) {
  if (!files.length) return undefined;
  const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { encoding: 'utf8' }).trim();
  return out || undefined;
}

// JSON with object keys sorted, so reordering keys doesn't count as a change.
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}

const entryCache = new Map();

// For a JSON file holding an array of objects: each entry's newest commit date
// (ISO 8601), keyed by entry[key]. Walks the file's history once per build.
// A commit where the file is missing or doesn't parse is skipped.
export function entryDates(file, key, cwd = process.cwd()) {
  const id = `${cwd}\0${file}\0${key}`;
  if (entryCache.has(id)) return entryCache.get(id);
  const git = (args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  const commits = git(['log', '--format=%H %cI', '--', file]).trim().split('\n').filter(Boolean).reverse();
  const dates = {};
  let prev = new Map();
  for (const line of commits) {
    const [hash, date] = line.split(' ');
    let entries;
    try {
      entries = JSON.parse(git(['show', `${hash}:${file}`]));
    } catch {
      continue;
    }
    if (!Array.isArray(entries)) continue;
    const cur = new Map(entries.filter((e) => e && e[key] != null).map((e) => [e[key], stable(e)]));
    for (const [k, v] of cur) if (prev.get(k) !== v) dates[k] = date;
    prev = cur;
  }
  entryCache.set(id, dates);
  return dates;
}

const newest = (dates) => dates.filter(Boolean).sort((a, b) => Date.parse(b) - Date.parse(a))[0];

// lastmod for any sitemap path. A project page moves only when something it
// shows changes: its own projects.json entry, its solution entry, its related
// post, its case study or the template. Other pages date from sourceFiles().
export function pageLastmod(pathname) {
  const [section, slug] = pathname.replace(/^\/|\/$/g, '').split('/');
  if (section === 'projects' && slug) {
    const project = JSON.parse(readFileSync('src/data/projects.json', 'utf8')).find((p) => p.id === slug);
    if (project) {
      const dir = 'src/content/case-studies';
      const caseStudy = readdirSync(dir)
        .map((f) => `${dir}/${f}`)
        .find((f) => new RegExp(`^project:\\s*["']?${slug}["']?\\s*$`, 'm').test(readFileSync(f, 'utf8')));
      return newest([
        entryDates('src/data/projects.json', 'id')[slug],
        entryDates('src/data/solutions.json', 'name')[project.category],
        project.relatedPost ? lastCommitDate(sourceFiles(`/blog/${project.relatedPost}/`)) : undefined,
        caseStudy ? lastCommitDate([caseStudy]) : undefined,
        lastCommitDate(['src/pages/projects/[id].astro']),
      ]);
    }
  }
  return lastCommitDate(sourceFiles(pathname));
}
