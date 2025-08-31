import { defineConfig } from 'astro/config';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://mandar-gite.github.io',
  ...(isProduction && { base: '/ailabs_website' }),
  build: {
    assets: 'assets'
  }
});
