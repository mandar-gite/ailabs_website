import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Optional: set BASE_PATH in CI only when deploying to a subpath
const basePath = process.env.BASE_PATH;

export default defineConfig({
  // Set to your live domain for correct canonical URLs
  site: 'https://72ai.in',
  ...(basePath ? { base: basePath } : {}),
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://72ai.in/',
        'https://72ai.in/about',
        'https://72ai.in/solutions',
        'https://72ai.in/projects'
      ],
      serialize(item) {
        // Set custom priority and changefreq based on URL
        if (item.url === 'https://72ai.in/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/about') || item.url.includes('/solutions')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/projects')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      }
    })
  ],
  devToolbar: {
    enabled: false
  },
  build: {
    assets: 'assets'
  }
});
