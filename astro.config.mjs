// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // The production URL for canonical links, the sitemap and production translation links.
  site: 'https://votersrise.pages.dev',
  trailingSlash: 'always',
  // Inline the small CSS (~8 KB) into each page so nothing blocks the first paint.
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
