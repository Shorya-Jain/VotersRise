// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  vite: {
    /* reticle-vite-owning */
    // assetsInlineLimit 0: keep scripts as files so the CSP can stay script-src 'self'.
    build: { target: 'es2022', assetsInlineLimit: 0 },
    optimizeDeps: { include: ['@reticlehq/react'] },
    server: { watch: { ignored: [/(^|[\\/])\.reticle([\\/]|$)/] } },
  },

  // Replace with the real domain once one is set up.
  site: 'https://votersrise.workers.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
