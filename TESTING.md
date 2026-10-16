# TESTING

What is checked, how, and when. The goal is that wrong content or a broken layout can never reach GitHub Pages.

## 1. Test layers

| Layer | Tool | Runs | Fails the build |
|---|---|---|---|
| Content pipeline | Vitest + build-time checks | `npm run test`, `npm run build` | yes |
| Content correctness (authoring) | Scripts in the `verify-math` skill | when content changes | no (author gate, required before commit) |
| Types and lint | `tsc`, ESLint, Prettier | CI | yes |
| Components | Vitest + Testing Library | `npm run test` | yes |
| Accessibility | axe-core (Vitest/jsdom for structure; Browser pane or Playwright + `@axe-core/playwright` for rendered contrast) | Phase 6 and before release | yes for serious/critical |
| Performance and PWA | Lighthouse (mobile preset), by hand; a frame-rate check on a real phone | Phase 6 and before release | budget warnings |
| Offline | A real browser, by hand | Phase 7 and before release | no |

Decision D9 in `PLAN.md`: no Playwright e2e suite by default (there is one page). Add it only if the user asks.

## 2. Content pipeline checks (Phase 2)

1. **Parse coverage.** Every file declared in `PAGES` (`content/midterm/exam_practice.md`) parses. A study-note file placed in the same folder is not read (test: a deliberately broken note file does not fail the build). Unknown constructs fail with file and line. Heading level 5, a second `#`, and a `####` outside a `###` fail.
2. **Round trip.** Convert generated data back to normalized text and compare with the normalized Markdown. Normalization: collapse whitespace, drop `---` rules and the `<div align="center">` wrappers, decode entities, keep math source verbatim. Zero diff is required. This guarantees "the same words as the Markdown", including level-4 headings and the points parenthesis.
3. **KaTeX strict.** Every inline and display formula compiles with `throwOnError: true, strict: 'error'` and produces no warning.
4. **SVG rules.** No blank line inside `<svg>`, well-formed XML, `viewBox` present, no scripts or event handlers, no external references.
5. **Tree rules.** Node ids are unique; every question has children; every group has at least one item; every item has at most one example; numbers are consistent with the parent (`3.2.x` under `3.2`). Fixture-based tests on small sample files cover each rule, including the error cases.
6. **Counts snapshot.** `report.txt` counts are committed as a snapshot and a change must be reviewed. Expected today: 4 questions, 12 groups, 35 items, 35 examples, 39 tables, 1 figure, 1 ordered list, total points 19 (ข้อ 2 to 5), 532 formulas (567 counting the 35 Sol markers).
7. **Reference integrity.** References like "ข้อ 2.2" resolve to an existing node number.
8. **Points.** Each `##` with "(P คะแนน)" yields `points`; `displayTitle` equals the title without that parenthesis.

Fixtures live in `tests/fixtures/` and cover each construct in `CONTENT-SCHEMA.md` section 2: item without Ans, group with definition, item directly under a question, table with entities, blockquote, figure, ordered list, level-4 under level-3, level-4 without a parent (error), two examples in one item (error).

## 3. Verifying the content itself (authoring)

Before any number, probability, table value, tag sequence or parse is written into the Markdown it is verified by program. See `.claude/skills/verify-math/SKILL.md`. Minimum bar:

- Counting and statistics (tokens, types, BPE merges, bigram counts): recompute with a script from the given string.
- Matching and segmentation (FMM, BMM): re-run the algorithm on the given dictionary.
- HMM, Viterbi, CRF features: recompute every cell, the backpointers, and the best path.
- Parsing: CYK table, CNF conversion, PCFG probabilities (product of the used rules, sums per LHS equal to 1), transition sequences (stack and buffer states), PARSEVAL and UAS/LAS.
- Embeddings: cosine, PMI/PPMI, TF-IDF, softmax-style values, analogy vectors, rank correlation.
- State the rounding rule (decimals shown) and keep it the same as the surrounding items.
- Where the lecture slide disagrees with the computed value, the computed value is used and the difference is noted in the study copy, never silently adjusted.

## 4. Component tests

- Block renderer: one test per block type with a minimal data fixture; an unknown block type is a TypeScript error.
- `ExampleBlock`: always shows problem, Sol and Ans, and has no button.
- `Rail` tree: levels match the data (4 questions, 12 groups, 35 items); only the question and group that contain the active anchor are expanded; selecting an entry calls `jumpTo`; `aria-current="location"` follows the active anchor.
- `RailToggle`: icon-only, has an accessible name that changes with state, `aria-expanded` and `aria-controls`; no visible text label.
- `RailDrawer`: opens and closes, traps focus, `Esc` closes and returns focus to the toggle, locks background scroll, closes on selection.
- `ProgressRing`: 0 percent, partial and complete states render (complete shows the check).
- Routing: `#/` redirects to `#/midterm`; an unknown hash shows Not found with a link back; document title is `Midterm | NLP Notes`.
- Animation helpers: `Reveal` renders its final state immediately under reduced motion; `CountUp` puts the final number in the DOM text from the start; the shared observer reveals once and then disconnects.
- `PAGES` config: the build reads exactly the declared sources.
- Outline: every heading title from the Markdown appears in the DOM once mounted (questions, groups, items), and every formula and the figure appear (a test renders all blocks).
- Navbar: logo link, one "Midterm" tab with `aria-current="page"`, no switch.

## 5. Accessibility and layout checks

Run at 360x640, 390x844, 768x1024, 1024x768, 1440x900 and phone landscape 844x390 (the Browser pane or a real browser).

1. The page loads without console errors.
2. No horizontal page scroll (`document.scrollingElement.scrollWidth <= innerWidth`); wide tables, display math and the figure scroll inside their own wrapper.
3. Keyboard: Tab reaches the tab, the rail toggle and the rail entries; Enter or Space operates them; the focus ring is visible (2 px ink outline). On phone widths the drawer traps focus and `Esc` closes it.
4. axe: zero serious or critical violations, including color contrast with the pairings in `UI-SPEC.md` section 12.
5. `prefers-reduced-motion` emulation: every item in the `UI-SPEC.md` section 9 rules behaves as specified (no slide, no count-up, no sheen, instant scroll).
6. Heading order is `h1` (title), `h2` (question), `h3` (group or item), `h4` (item in a group); no skipped levels.
7. Thai text: tone marks not clipped at heading sizes; no mid-word wrapping inside table cells that breaks reading.
8. Animation: scroll the whole page at phone width with the Performance panel recording: no long tasks caused by reveals, no layout shift from animations (CLS under 0.1), scroll stays near 60 fps; folding and unfolding the rail on desktop with the whole page loaded does not freeze the page.

## 6. Offline test (Phase 7)

1. `npm run build` then `npm run preview`, open `http://localhost:4173/NLP_Notes/` in a real browser (DevTools, Application, Service Workers: `sw.js` is activated for scope `/NLP_Notes/`).
2. Wait for the "ใช้งานออฟไลน์ได้แล้ว" toast (it can take a few seconds: 1.8 MiB are cached).
3. Set the network offline (DevTools, Network, Offline) and reload, also on `#/midterm`. Formulas, the parse-tree figure, tables, fonts and the icons must render; the contents and the animations must still work.
4. Online again: rebuild (`npm run build`), keep the preview running, wait up to a minute or switch tabs: the page reloads by itself, or shows "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่".
5. On a phone: open the live site, add it to the home screen, switch to airplane mode, open it from the icon.

What is checked without a browser (`tests/pwa.test.ts`, `src/app/pwa/*.test.*`): the manifest, the icon files, the toast host, and the version check (same id keeps the page, a newer id unregisters, clears the caches and reloads, at most three reloads in a row, offline keeps the page). After a build, the precache list can be compared with `dist/` and every listed URL fetched from the preview server (done in Phase 7: 41 URLs, all 200, none of the files of `dist/` missing).

The preview pane of the desktop app refuses to register any service worker (even a one-line test worker fails with an unknown error when fetching the script), so steps 1 to 5 are the user to run.

## 7. Performance budgets

| Metric | Budget |
|---|---|
| App shell JS + CSS, gzip | under 150 KB |
| Content chunk (generated JSON), gzip | under 200 KB (measure in Phase 2; if exceeded, trim MathML or split by question) |
| LCP (mobile, 4G profile) | under 2.5 s |
| Cumulative Layout Shift | under 0.1 |
| Lighthouse mobile | Performance 90+, Accessibility 95+, Best Practices 95+ |

Measured with Lighthouse 13 (mobile preset: simulated slow 4G and 4x slower CPU) on the production preview, three runs of the final build: Performance 92 to 93, Accessibility 100, Best Practices 100, SEO 100; FCP 2.1 s, LCP 2.8 to 2.9 s (budget 2.5 s: **not met**, score 0.81 to 0.84), TBT 100 to 120 ms, CLS 0. Desktop preset: 100 in all four. Without throttling the mobile run scores 99. Lighthouse 13 has no PWA category; installability is covered by `tests/pwa.test.ts` and the manual steps in section 6.

KaTeX fonts and the font files (Titillium Web, Inter, Noto Sans Thai) are excluded from the JS+CSS budget but must be preloaded sensibly (`font-display: swap`, only the subsets and weights in use; the Thai subset is the largest font).

## 8. CI gates

`ci.yml` runs on every push and pull request: install with `npm ci`, `lint`, `typecheck`, `test`, `build`. `deploy.yml` runs only on `main` after the same steps pass. See `DEPLOY.md`.

## 9. Manual checks before each release

- Open the page on a real phone, portrait and landscape; read a table-heavy card (Viterbi, CYK) and the parse-tree figure.
- Compare three random cards with the Markdown preview in VS Code.
- Install as PWA, go offline, scroll the whole page.
- Read the build report for warnings.
