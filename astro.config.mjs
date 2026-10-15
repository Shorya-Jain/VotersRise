// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // The production URL for canonical links, the sitemap and production translation links.
  site: 'https://votersrise.pages.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
