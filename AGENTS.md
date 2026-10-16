# AGENTS.md

Instructions for any AI coding agent working in this repository. Humans can read it too.

## Overview

NLP Notes is a static, frontend-only site for course 1323404 Natural Language Processing. It currently has one page, Midterm, that presents the practice problems. Content lives in Markdown under `content/midterm/`; only `exam_practice.md` is rendered. A Node build script turns it into typed data. A React app renders the data and ships as a PWA on GitHub Pages.

This project is derived from the 1322201 "Digital Logic Notes" site. Reuse its pipeline and components where `ARCHITECTURE.md` section 3 says so, and drop everything else (home diagram, chapter pages, exam sets).

## Tech stack (pin exact versions in `package.json` at scaffold time)

- Node.js 24 (see `.nvmrc`), npm with a committed `package-lock.json`
- Vite, React, TypeScript (strict), React Router (`HashRouter`) with one real route, `/midterm` (`/` redirects to it)
- Tailwind CSS v4 with tokens in a CSS `@theme` block derived from `DESIGN-jobright.md`
- No animation library: CSS keyframes and transitions (springs as `linear()` curves) and the Web Animations API, see `UI-SPEC.md` section 9 and `src/styles/motion.css`
- KaTeX, used at build time only. The browser receives pre-rendered HTML plus KaTeX CSS and fonts
- Vitest + Testing Library for unit and component tests, axe-core for accessibility checks in the tests, ESLint + Prettier for lint and format
- `@axe-core/playwright` (or axe-core in Vitest/jsdom) and Lighthouse for accessibility and performance checks (dev only)
- `vite-plugin-pwa` for offline support
- Self-hosted open fonts via `@fontsource` packages (Titillium Web, Inter, Noto Sans Thai; all SIL OFL)
- No backend, database, analytics or external API

## Commands (planned, created in Phase 1)

```
npm ci                 # install exactly from the lockfile
npm run content        # Markdown -> generated data (scripts/build-content)
npm run dev            # content + Vite dev server
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run format:check   # Prettier
npm run test           # Vitest (includes content round-trip)
npm run build          # content + typecheck + Vite build into dist/
npm run preview        # serve dist/ locally with the real base path
```

Before reporting any task as done: `typecheck`, `lint`, `test` and `build` must pass.

## Repository layout (target, see ARCHITECTURE.md)

```
content/            Markdown source of truth (midterm/ today, final/ later)
scripts/            build-content pipeline (Node, TypeScript)
src/                React app (app, pages, features, components, lib, styles)
public/             static files (icons, manifest assets)
tests/              cross-cutting tests and fixtures
.github/workflows/  CI and Pages deploy
.claude/skills/     agent skills
```

## Code style

- TypeScript strict. No `any`; use `unknown` and narrow. Prefer `type` for data shapes, `interface` for component props only when extending.
- Function components and hooks only. One component per file, file name equals component name (`PascalCase.tsx`). Hooks `useX.ts`. Utilities `camelCase.ts`.
- Feature-first folders: code that changes together lives together (`src/features/<feature>/`). Shared UI primitives live in `src/components/ui/`.
- Import with the `@/` alias (maps to `src/`). No deep relative imports across features.
- Styling with Tailwind utility classes that reference design tokens. No inline hex or pixel literals that duplicate a token.
- Keep components small and presentational. Put data shaping in `lib/` or in the content pipeline, not inside JSX.
- No dead code, no commented-out code, no `console.log` in committed code.
- Accessibility is part of done: semantic elements, labels, focus order, `aria-expanded` on disclosure controls, visible focus ring, `prefers-reduced-motion` respected.

## Content rules

- Edit content only under `content/`. Never edit generated files (`src/content/generated/**`). They are rebuilt by `npm run content` and are git-ignored.
- `content/midterm/` also holds the study notes (`01..04_*.md`, `exam_guidelines.md`). They are references for authoring and are **not rendered**. The pipeline reads only the files listed in `src/config/site.ts` (`PAGES`), never a glob, so adding a note file cannot break the build.
- There is one copy of every file. Nothing is mirrored outside the repo.
- Follow `CONTENT-SCHEMA.md` for the Markdown shapes the pipeline understands. Load the `edit-content` skill before editing content and the `verify-math` skill before changing any number.
- Do not renumber headings (`2.1`, `3.2.4`, ...) without updating the cross references ("ข้อ 2.2").

## Testing

- `tests/` and `*.test.ts` next to code. See `TESTING.md` for the required checks: content round-trip, KaTeX strict compile, SVG rules, heading and anchor integrity, accessibility smoke, build size budget.
- A bug fix includes a regression test when practical.

## Git and PR rules

- Small, focused commits. Conventional Commits (`feat:`, `fix:`, `docs:`, `content:`, `chore:`, `test:`, `refactor:`).
- Never commit `node_modules/`, `dist/`, generated data, lecturer slide or lab PDFs, or font files whose license forbids redistribution.
- Do not commit or push unless the user asks.

## Security and licensing

- No secrets in the repo. There is nothing to authenticate against.
- Fonts are open licensed (SIL Open Font License) and self-hosted through `@fontsource` packages, so they may be bundled and redistributed in the public repo.
- `DESIGN-jobright.md` is an analysis of another company's design language. Use its tokens only. Do not copy the company's name, logo, copy, illustrations or screenshots.
- Third-party packages: prefer well-maintained, MIT/Apache/BSD licensed packages. Ask before adding a dependency that is not listed above.

## Boundaries for agents

- Always: verify numbers programmatically, keep changes within the current phase of `PLAN.md`, update the relevant doc when behavior changes.
- Ask first: new dependencies, moving or deleting content, changing design tokens or `DESIGN-jobright.md`, changing the Markdown-to-data rules, adding a second page, enabling anything that needs a paid or external service.
- Never: edit generated data by hand, hard-code course text inside components, add Jobright, Anthropic or Claude branding, push to `main` without being asked, commit lecturer slides or lab PDFs.
