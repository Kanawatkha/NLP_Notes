import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { INCLUDE_ASSETS, MANIFEST } from './src/config/pwa.ts';
import { REPO_NAME } from './src/config/site.ts';

/** KaTeX ships woff2, woff and ttf for every font. Browsers we support all take woff2, so drop the rest. */
function katexWoff2Only(): Plugin {
  const legacy = /,url\([^)]*\.woff\) format\("woff"\),url\([^)]*\.ttf\) format\("truetype"\)/g;
  return {
    name: 'katex-woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!/katex[\\/]dist[\\/]katex(-swap)?\.min\.css/.test(id)) return null;
      return { code: code.replace(legacy, ''), map: null };
    },
  };
}

/** Preloads the fonts the page needs at first paint, so text is not held back by font discovery. */
function preloadFonts(): Plugin {
  const wanted =
    /(noto-sans-thai-thai-(400|600)|inter-latin-wght|titillium-web-latin-700)-normal.*\.woff2$/;
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .filter((name) => wanted.test(name))
          .map((name) => ({
            tag: 'link',
            injectTo: 'head' as const,
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
              href: `/${REPO_NAME}/${name}`,
            },
          }));
      },
    },
  };
}

/**
 * The Midterm page and its content are loaded with dynamic imports, which the browser only finds
 * after the entry script has run (page, entry script, page chunk, content chunk, one after the
 * other). Preloading the page chunk, the small meta chunk (the hero) and the content chunk from the start makes
 * them download in parallel with it.
 */
function preloadPageChunks(): Plugin {
  const wanted = /assets\/(MidtermPage|midterm|midterm\.meta)-[\w-]+\.js$/;
  return {
    name: 'preload-page-chunks',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .filter((name) => wanted.test(name))
          .map((name) => ({
            tag: 'link',
            injectTo: 'head' as const,
            attrs: { rel: 'modulepreload', crossorigin: '', href: `/${REPO_NAME}/${name}` },
          }));
      },
    },
  };
}

/** One id per build; the page carries it and `version.json` publishes it (see src/app/pwa/versionCheck.ts). */
const BUILD_ID = String(Date.now());

/** Publishes `version.json`, which pages compare with their own build id to find out they are old. */
function versionFile(): Plugin {
  return {
    name: 'version-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ id: BUILD_ID }),
      });
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  // GitHub Pages serves the site under /<repo name>/. The dev server uses the root;
  // preview mirrors production so the real base path can be tested locally.
  base: command === 'build' || isPreview ? `/${REPO_NAME}/` : '/',
  plugins: [
    katexWoff2Only(),
    preloadFonts(),
    preloadPageChunks(),
    versionFile(),
    react(),
    tailwindcss(),
    // Precaches the whole build so the site works offline. A new version is applied by the toast
    // host (src/app/pwa/ToastHost.tsx) and by the version check.
    VitePWA({
      registerType: 'prompt',
      includeAssets: INCLUDE_ASSETS,
      manifest: MANIFEST,
      workbox: {
        // json is left out on purpose: version.json must always come from the network
        globPatterns: ['**/*.{html,js,css,woff2,svg,png,webmanifest}'],
        // the page content is one chunk; a file over the limit would silently stay out of the cache
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // The page content is one pre-rendered JSON chunk: about 1.1 MB raw but 67 KB gzip, which is
  // what the budget in TESTING.md measures. The default 500 KB warning would always fire.
  build: { chunkSizeWarningLimit: 1500 },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // vite-plugin-pwa makes this module at build time; tests get a stand-in
      ...(process.env.VITEST
        ? {
            'virtual:pwa-register/react': fileURLToPath(
              new URL('./src/test/pwaRegisterStub.ts', import.meta.url),
            ),
          }
        : {}),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    // rendering all 35 cards with their 532 formulas takes a few seconds on a loaded machine
    testTimeout: 20000,
  },
}));
