import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Routes come from the build output, so new projects and blog posts are covered
// without editing this file. 404.html is left out; it is checked separately.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist');

export function builtRoutes(): string[] {
  if (!existsSync(dist)) {
    throw new Error('dist/ not found. Run `npm run test:e2e`, which builds the site first.');
  }
  const routes: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === 'index.html') {
        const rel = path.relative(dist, dir).split(path.sep).join('/');
        routes.push(rel ? `/${rel}` : '/');
      }
    }
  };
  walk(dist);
  return routes.sort();
}
