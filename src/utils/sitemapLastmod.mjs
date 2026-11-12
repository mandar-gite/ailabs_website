import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// A shallow clone gives every page the same date, so stop the build instead of shipping it.
if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() === 'true') {
  throw new Error('sitemap lastmod needs full git history: set fetch-depth: 0 on the checkout');
}

// Data a page renders besides its own .astro file. Keep in step with the page's imports.
const DATA = {
  '': ['src/utils/engagement.ts'],
  about: ['src/utils/engagement.ts'],
  blog: ['src/content/blog'], // the index lists every post
  projects: ['src/data/projects.json'],
  solutions: ['src/data/solutions.json', 'src/data/projects.json'],
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
  // shortcut: any projects.json edit dates every project page; per-entry dates need git log -L, upgrade if recrawls get noisy
  if (section === 'projects' && slug) {
    return ['src/pages/projects/[id].astro', 'src/data/projects.json', 'src/data/solutions.json'];
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
