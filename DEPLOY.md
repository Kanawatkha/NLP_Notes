# DEPLOY

How the site is built, hosted and updated. Everything runs on GitHub: no external service, no secrets. Repository name, URL and visibility are open decisions D5 and D11 in `PLAN.md`; the values below are the defaults.

## 1. Target

- Host: GitHub Pages for repository `Kanawatkha/NLP_Notes`.
- URL: `https://kanawatkha.github.io/NLP_Notes/`
- Deployment: GitHub Actions workflow publishing the Vite `dist/` folder as the Pages artifact. The `dist/` folder is never committed.
- Pages on a free GitHub plan needs a public repository. The repo contains no lecturer slides, lab PDFs or other course files, the Markdown under `content/` (including the study notes in `content/midterm/`) and the code.

## 2. One-time repository setup (user action)

1. Create the repository on GitHub (empty, no README).
2. In `NLP_Notes/`: `git init`, add the remote, first commit and push (only when the user asks).
3. GitHub, repository **Settings, Pages**.
4. **Build and deployment, Source: GitHub Actions.**
5. Confirm the default branch is `main`.

## 3. Vite settings

| Setting | Value | Why |
|---|---|---|
| `base` | `'/NLP_Notes/'` for production, `'/'` for dev | Pages serves under the repository name |
| Router | none (single page) | Anchors are fragments, no rewrites needed |
| Asset URLs | always through Vite imports or `import.meta.env.BASE_URL` | No hard-coded absolute paths |
| `public/` files | referenced with `BASE_URL` | Same reason |

Keep the repository name in one place: `src/config/site.ts` and `vite.config.ts` read the same constant.

## 4. Workflows

### `ci.yml` (push to branches other than `main`, and pull requests)

Steps: checkout, `actions/setup-node` (Node version from `.nvmrc`, currently 24, npm cache), `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.

### `deploy.yml` (push to `main`, and manual dispatch)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Pin action versions to current stable majors at implementation time and update them periodically. `deploy.yml` runs lint, test and build (build includes the type check); the deploy job runs only if they pass.

## 5. Build pipeline

`npm run build` = content generation, type check, Vite build. A failure in any step stops the deploy: bad KaTeX, bad SVG, a disallowed heading level, a failed round-trip, a type error or a lint error means nothing is published. This is the main safety net for the "edit Markdown and push" workflow.

## 6. Offline and PWA

- `vite-plugin-pwa`, `generateSW`, `registerType: 'prompt'`: `ToastHost` polls for a new worker every minute and when the tab regains focus, and shows the update toast with a reload button.
- `version.json` (emitted by the build, never cached) carries the build id that is also compiled into the page. `src/app/pwa/versionCheck.ts` compares them when the page opens, comes back to the screen, goes online and every minute; on a mismatch it unregisters the service worker, clears all caches and reloads (at most 3 times in 5 minutes). This does not wait for the service worker, which phones can be slow to update. Carried over from 1322201.
- Precache (`globPatterns` html, js, css, woff2, svg, png, webmanifest): the whole build output, that is the page, JS, CSS, the content chunk, KaTeX fonts, Titillium Web, Inter and Noto Sans Thai fonts and the icons. Today that is 47 entries, 1818 KiB, downloaded once on the first visit. `version.json` is deliberately not in the list. `maximumFileSizeToCacheInBytes` is raised to 4 MiB so a growing content chunk is never silently left out (the default is 2 MiB; the chunk is 1.1 MB now).
- Manifest (`src/config/pwa.ts`): `name` and `short_name` "NLP Notes", `lang: th`, `display: standalone`, `start_url` and `scope` filled by the plugin with the base path (`/NLP_Notes/`), `theme_color` `canvas` (#ffffff), `background_color` `canvas-mint` (#ecffe0), icons 192, 512 and maskable 512, plus the Apple touch icon (180) and the SVG favicon. `tests/pwa.test.ts` checks the colors against `DESIGN-jobright.md` and the size of every icon file.
- Icons are drawn from the logo geometry by `scripts/make-icons.py` (`npm run icons`, needs PyMuPDF); the PNGs are committed, so CI needs no Python.
- Navigation fallback is `index.html` (HashRouter: every address is the same file).
- Update flow: a new deployment installs a new service worker in the background. The app shows "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่". The offline-ready toast "ใช้งานออฟไลน์ได้แล้ว" shows once, the first time everything is cached.
- Pages is HTTPS, which service workers require (`localhost` also counts as secure for `npm run preview`).
- Projects served from the same `localhost` port share one origin and one list of service workers. A service worker left behind by another project (for example another repo name on `localhost:4173`) is not ours and has a different scope, but it can confuse a manual test. Use Unregister in DevTools (Application, Service Workers), or another port.
- Cache hygiene: Workbox cleans outdated caches automatically. Bump nothing manually.

## 7. Editing workflow after launch

1. Edit `content/midterm/exam_practice.md`.
2. Run `npm run dev` locally if you want to see it (optional).
3. Commit and push to `main` (when asked).
4. CI builds, tests and deploys. The site updates within a few minutes. Returning visitors get the update toast.

## 8. Fonts and licensing at deploy time

- All fonts are open licensed (SIL Open Font License): Titillium Web and Inter (Latin), Noto Sans Thai (Thai and Latin). They are self-hosted through npm packages (`@fontsource/titillium-web`, `@fontsource-variable/inter`, `@fontsource/noto-sans-thai`), so no request leaves GitHub Pages and the files may live in the public build output.
- Only the weights and subsets actually used are imported (Titillium Web 600/700 Latin; Inter variable Latin; Noto Sans Thai static 300, 400, 600, 700, Thai subset only) to keep the precache small.
- `font-display: swap` everywhere.

## 9. Rollback and troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Blank page, 404 for JS/CSS | Wrong `base` | Check `vite.config.ts` and `site.ts` |
| Works locally, fails on Pages | Absolute asset paths | Use `BASE_URL` helpers |
| Old content after deploy | Service worker still serving the old version | Accept the update toast, or reload twice |
| Deploy not triggered | Pages source not set to GitHub Actions | Fix in repository settings |
| Build fails in CI only | Node version or lockfile drift | Use `.nvmrc`, `npm ci`, commit the lockfile |

Rollback: revert the commit on `main` (or re-run an earlier successful workflow run). The next deployment replaces the live site.
