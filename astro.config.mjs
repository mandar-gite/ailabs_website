import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mandar-gite.github.io',
  base: '/ailabs_website',
  integrations: [tailwind()],
  build: {
    assets: 'assets'
  }
});
