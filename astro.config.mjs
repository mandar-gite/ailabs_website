```
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// The brief specifies a static export for GitHub Pages, which is handled
// by setting the output to 'static'.
export default defineConfig({
  site: 'https://72ai.in',
  base: '/',
  output: 'static',
  integrations: [tailwind()],
});

```
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mandar-gite.github.io',
  base: '/ailabs_website',
  build: {
    assets: 'assets'
  }
});
