import type { ManifestOptions } from 'vite-plugin-pwa';
import { SITE_NAME } from './site.ts';

/**
 * Web app manifest (vite.config.ts hands it to vite-plugin-pwa). `start_url` and `scope` are not
 * set: the plugin fills them with the base path, so they follow the repository name.
 * The colors are the design tokens `canvas` (theme) and `canvas-mint` (background), see
 * DESIGN-jobright.md; tests/pwa.test.ts compares them with the design file.
 */
export const MANIFEST = {
  name: SITE_NAME,
  short_name: SITE_NAME,
  description: 'Study notes and practice problems for 1323404 Natural Language Processing.',
  lang: 'th',
  display: 'standalone',
  theme_color: '#ffffff',
  background_color: '#ecffe0',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    {
      src: 'icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
} satisfies Partial<ManifestOptions>;

/** Files outside the build output that the manifest and the page refer to. */
export const INCLUDE_ASSETS = ['favicon.svg', 'icons/apple-touch-icon.png'];
