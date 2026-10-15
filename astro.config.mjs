// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Replace with the real domain once one is set up.
  site: 'https://votersrise.workers.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
