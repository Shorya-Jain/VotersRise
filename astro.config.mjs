// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // The production URL. Translation links (src/lib/languages.ts) depend on it.
  site: 'https://votersrise.pages.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
