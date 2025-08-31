import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Optional: set BASE_PATH in CI only when deploying to a subpath
const basePath = process.env.BASE_PATH;

export default defineConfig({
  // Set to your live domain for correct canonical URLs
  site: 'https://72ai.in',
  ...(basePath ? { base: basePath } : {}),
  integrations: [tailwind()],
  build: {
    assets: 'assets'
  }
});
