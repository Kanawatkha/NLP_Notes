# NLP Notes

Study site for course 1323404 Natural Language Processing. A static, frontend-only site with one page
so far, **Midterm**: exam-style problems with worked solutions (Tokenization, Word Segmentation / POS
Tagging / Sequence Labeling, Syntax and Parsing, Word Embedding), a collapsible contents rail, scroll
animations (the content grows into the room when the rail is folded), and every solution always shown. It works offline
once opened. A final-exam page can be added later.

Status: the Midterm page is complete with contents rail, animations and offline mode; launch is prepared: the push to GitHub and the Pages setting are the user's step (see `PLAN.md`).

Repository: https://github.com/Kanawatkha/NLP_Notes (remote set, nothing pushed yet)
Planned live site: https://kanawatkha.github.io/NLP_Notes/ (opens at `#/midterm`)

## What is in it

| Part | Source Markdown | Content |
|---|---|---|
| Midterm (`#/midterm`) | `content/midterm/exam_practice.md` | Question headers (ข้อ 2 to 5), groups, and 35 problem cards with Sol and Ans, tables, one parse-tree figure |

`content/midterm/` also keeps the study notes (`01..04_*.md`, `exam_guidelines.md`). They are not rendered by the site.

## Editing content

All text lives in Markdown under `content/`. Never edit generated files.

1. Edit `content/midterm/exam_practice.md`. Follow `CONTENT-SCHEMA.md`.
2. Check the result locally:

```bash
npm run content
```

   The build script converts Markdown to typed data and fails on bad KaTeX, bad SVG, a broken
   heading structure or anything that does not round-trip back to the Markdown.
3. Preview with `npm run dev`.
4. Commit and push to `main`. GitHub Actions lints, tests, builds and publishes the site.

Every number, table value, probability, tag sequence and parse in the content must be verified by a
program before it is written (see `.claude/skills/verify-math/SKILL.md`).

## Commands

```bash
npm ci                 # install exactly from the lockfile (Node 24, see .nvmrc)
npm run dev            # content + dev server
npm run content        # Markdown -> generated data
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm run format:check   # Prettier
npm run test           # Vitest, including the content round-trip
npm run build          # content + typecheck + production build into dist/
npm run preview        # serve dist/ with the real base path
npm run icons          # redraw public/icons/*.png from the logo (needs PyMuPDF)
```

## How it is built

Markdown -> `scripts/build-content` -> one JSON file per page (formulas pre-rendered with KaTeX) ->
lazy chunk -> React renders typed blocks. The browser never parses Markdown and ships no KaTeX code,
only its CSS and fonts. Stack: Vite, React, TypeScript (strict), Tailwind CSS v4, React Router
(`HashRouter`), Vitest, axe-core, vite-plugin-pwa. See `ARCHITECTURE.md`.

## Deploy

GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, set
Pages > Source to "GitHub Actions" once. Details in `DEPLOY.md`.

## Offline

A service worker precaches the whole build. After the first visit the site works without a network.
A new version is offered through a "โหลดใหม่" toast.

## Documents

`PRD.md` (goals), `PLAN.md` (phases and open decisions), `ARCHITECTURE.md`, `CONTENT-SCHEMA.md`,
`UI-SPEC.md`, `DESIGN-jobright.md` (design standard, unmodified), `TESTING.md`, `DEPLOY.md`,
`AGENTS.md` (rules for AI agents), `CLAUDE.md`.

## Fonts and licenses

Titillium Web, Inter and Noto Sans Thai are open licensed (SIL Open Font License) and self-hosted
through `@fontsource` packages. KaTeX is MIT. The logo is original. The design tokens come from an
analysis document of another company's site; none of its branding is used.
