import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://mandar-gite.github.io',
  ...(isProduction ? { base: '/ailabs_website' } : {}),
  integrations: [tailwind()],
  build: {
    assets: 'assets'
  }
});
