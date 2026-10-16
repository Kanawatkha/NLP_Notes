# PLAN: Delivery plan

Phases run in order. Each phase ends with exit criteria and a **gate**: the user reviews and says "go" before the next phase starts. Update checkboxes as work completes.

Legend: `[ ]` todo, `[x]` done. "Ask" means stop and ask the user first.

## Decisions

Decided by the user:

| # | Decision |
|---|---|
| D1 | Site name is **NLP Notes**. The site has one page now, named **Midterm**, at `#/midterm` (`#/` redirects to it). A final-exam page may be added later. HashRouter stays, with one real route |
| D2 | The page is one long scroll. A collapsible contents rail sits on the left, toggled by an icon only (no text label). Animation and polish are a first-class requirement |
| D3 | `DESIGN-jobright.md` is the design standard, used as-is and never edited |
| D4 | The page renders `content/midterm/exam_practice.md` only. All study-note Markdown files live in `content/midterm/` too (moved in from the outer `midterm/` folder) |
| D5 | Git covers only the `NLP_Notes/` folder, `origin` = `https://github.com/Kanawatkha/NLP_Notes.git`. Nothing is committed or pushed until the user asks |

Decided by the agent (the user said to decide; revisit at any gate):

| # | Decision | Alternative |
|---|---|---|
| D6 | Layout: formula-sheet style (rail plus content) with exam-style problem cards and a solutions switch | Pure formula sheet, or pure exam page |
| D7 | Level-4 headings (`####` in ข้อ 3 to 5): extend the parser, tree and renderer to level 4; content unchanged | Edit the content: promote groups to `##` and items to `###` |
| D8 | PWA offline: yes (prompt toast, version check) | Skip in the first release |
| D9 | Thai font: Noto Sans Thai (static files) for all Thai text (400 body, 600/700 headings), Titillium Web and Inter for Latin | Prompt for Thai headings |
| D10 | Content source: one copy only, in `content/midterm/`. Pages are declared in `src/config/site.ts` (`PAGES`), the build never globs | n/a |
| D11 | Tests: Vitest (round-trip, KaTeX, SVG, components), axe checks, Lighthouse by hand, no Playwright e2e | Add Playwright smoke |
| D12 | Solutions are shown by default; the switch hides them; remembered in the browser | Hidden by default |
| D13 | Animation: **CSS first with the Web Animations API, no library** (changed in Phase 6 from "Motion with LazyMotion"): springs as `linear()` curves, everything on transform and opacity (height only for the solution fold and the tree), reduced motion respected | Motion with `LazyMotion` |
| D14 | Repo visibility: public (Pages on a free plan needs it); no slides or PDFs in the repo | Private repo (needs a paid plan for Pages) |

## Phase 0 - Planning documents  (done, awaiting review)

- [x] Folder `NLP_Notes/` created; `DESIGN-jobright.md` moved in unchanged
- [x] `git init -b main` in `NLP_Notes/` only; `origin` set to the GitHub URL; nothing committed or pushed
- [x] Study notes moved from the outer `midterm/` folder into `content/midterm/` (`01..04_*.md`, `exam_guidelines.md`, `exam_practice.md`; the outer folder is gone); the temporary copy `content/exam-practice.md` removed
- [x] Plan documents written and updated for D1 to D14: `CLAUDE.md`, `AGENTS.md`, `README.md`, `PRD.md`, `PLAN.md`, `ARCHITECTURE.md`, `CONTENT-SCHEMA.md`, `UI-SPEC.md`, `TESTING.md`, `DEPLOY.md`, `.claude/skills/*`
- [ ] User reviews the documents
- Gate: user approves the documents or requests changes

## Phase 1 - Scaffold  (done, awaiting review)

Goal: a clean repo that builds a near-empty site and deploys it.

Scope note: the build pipeline, KaTeX, PWA and fonts are not part of this phase; they arrive in Phases 2, 3 and 7, so their packages are not installed yet.

- [x] `.gitignore` (keeps `CLAUDE.md` ignored; `node_modules`, `dist`, generated data), `.nvmrc` (24), `.prettierrc`, `.prettierignore`
- [x] Tooling copied from the 1322201 project and trimmed: `tsconfig*.json`, `eslint.config.js` (with the architecture import rules), `vite.config.ts` (React, Tailwind v4, `@` alias, Vitest), `package.json` (renamed `nlp-notes`, same pinned majors; `motion` was installed here and removed again in Phase 6; `katex`, `vite-plugin-pwa`, `workbox-window`, `axe-core` and the `@fontsource` packages are added in the phase that needs them)
- [x] Not copied: `dist/`, `node_modules/`, `.git/`, home diagram, chapter/exam/formula pages, `ExamSetTabs`, mobile menu, share/QR code, 1322201 content and DESIGN file
- [x] `HashRouter`: `/` redirects to `/midterm`, placeholder `MidtermPage`, `NotFoundPage`; routes built from `PAGES` in `src/config/site.ts`
- [x] Vite `base` is `/NLP_Notes/` for build and preview (one `REPO_NAME` constant shared by `vite.config.ts` and `site.ts`)
- [x] `npm run content` is a stub that checks every `PAGES` source exists; the other scripts from `AGENTS.md` work
- [x] `.github/workflows/ci.yml` and `deploy.yml` per `DEPLOY.md`
- [x] Favicon from the logo geometry (`public/favicon.svg`)
- [x] Checks: `typecheck`, `lint`, `format:check`, `test` (6 tests) and `build` are green; the production preview was opened at `http://localhost:4173/NLP_Notes/`: it lands on `#/midterm`, title is "Midterm | NLP Notes", `#/nowhere` shows the not-found page, no console errors, no horizontal scroll
- [ ] User: first commit and push when asked (`git push -u origin main`), then set Pages source to "GitHub Actions" in the repo settings
- Exit: `npm run build` is green locally (done) and in CI; the empty page is live at the Pages URL (needs the push)
- Gate

## Phase 2 - Content pipeline  (done, awaiting tree review)

Goal: `content/midterm/exam_practice.md` to typed, tested data.

- [x] `scripts/build-content` adapted from 1322201: reads only the files declared in `PAGES` (never a glob), writes one JSON per page plus `report.txt`; parser (`parse.ts`), KaTeX (`math.ts`, **strict mode with no exceptions**), SVG rules (`svg.ts`), round-trip oracle (`project.ts`) carried over; new `tree.ts`, `report.ts`, `index.ts`, `run.ts`
- [x] Heading levels 1 to 4 accepted, level 5 and above rejected; a heading must sit directly under the level above it (so a `####` only under a `###`)
- [x] Tree rules: question (`##`, number and points from "ข้อ N ... (P คะแนน)", `displayTitle` without the points), group (`###` with `####` children), item (leaf `###` or `####`, exactly one example); numbers checked against the parent; positional ids with a warning for unnumbered headings
- [x] Build checks: unique ids, a group has items, one Sol per item and none outside items, "ข้อ 2.2"-style references point at an existing heading, round trip (text, formulas, figures)
- [x] `src/content/types.ts` and `src/content/loaders.ts` (`loadPageContent(id)`, lazy chunk per page); output `src/content/generated/midterm.json` and `report.txt` (git-ignored)
- [x] Tests (37 total): block parser, heading levels, points, tree rules and error cases on fixtures; the real content (0 errors, 0 warnings, 4 / 12 / 35 / 35, points 2+10+4+3 = 19, stats snapshot, size budget); study notes in the same folder are never read; a missing source and a bad reference are reported
- [x] `exam_practice.md` converts unchanged: 4 questions, 12 groups, 35 items, 35 examples, 39 tables, 1 figure, 1 ordered list, 532 formulas, 0 warnings
- [x] Generated size: 1021.9 KB raw, **63.3 KB gzip** (budget 200 KB), so no trimming is needed. KaTeX HTML plus MathML makes up most of the raw size
- [x] `typecheck`, `lint`, `format:check`, `test` and `build` are green
- [ ] User reviews the tree report (`src/content/generated/report.txt`: questions, groups, items, ids, points) and the generated size
- Gate

## Phase 3 - Design system and app shell  (done, awaiting look-and-feel review)

- [x] Tailwind `@theme` tokens copied from `DESIGN-jobright.md` (colors, radii, `section` spacing); the default Tailwind palette and radius scale are switched off so only design tokens exist. `tests/design-tokens.test.ts` compares the CSS with the design file (colors, radii, section spacing) and checks the contrast pairings of `UI-SPEC.md` section 12
- [x] Type utilities `type-h1..h4`, `type-body-lg/md/sm`, `type-button`, `type-nav`, `type-caption` with the responsive scale-down of `UI-SPEC.md` Addendum B (heading line height 1.25)
- [x] Fonts self-hosted, only used files: Titillium Web 600/700 (Latin), Inter variable (Latin), Noto Sans Thai static 300/400/600/700 (Thai, 9 KB each). Weight 500 of the tokens is served by the Thai 400 file (exact map, `src/styles/fonts.css`). The four first-paint fonts are preloaded. Changed from the plan: static Noto Sans Thai instead of the variable package, because it makes the weight map exact
- [x] Logo (three token chips; wordmark hidden below 420 px) and `public/favicon.svg`
- [x] Navbar (sticky 64 px; logo, one tab per `PAGES` entry as a black pill, solutions switch), skip link, focus moved to `<main>` on navigation, page title, not-found page, `ToastHost` live-region stub
- [x] `SolutionsProvider` and `SolutionsSwitch` (`role="switch"`, `aria-checked`, always-visible label, short label on phones, key `nlp:show-solutions`, storage in try/catch). Moved here from Phase 4 because the switch lives in the navbar
- [x] UI primitives: `Button`/`ButtonLink` (black pill, small nav pill, mint pill, dark square), `Badge` (dark, square, outline, soft), `Card` (outlined, mint with a square corner, feature, soft), `Icon`, `Skeleton`, `Prose`, `Toast`, `PageContainer`
- [x] Temporary `features/midterm/DesignPreview.tsx` on the Midterm page: colors, type scale, buttons, badges, a question header, a problem card with table and Ans strip. It uses sample text and is removed in Phase 4
- [x] Tests (56 in total): switch (default on, toggle, persistence, blocked storage, short label), navbar (tabs from `PAGES`, `aria-current`), UI primitives, design tokens and contrast; `typecheck`, `lint`, `format:check`, `test` and `build` are green
- [x] Checked in the browser (production preview): all 7 font files load; heading 60 px at 1280 and 32 px at 360; no horizontal overflow at 360 or 1280; Thai tone marks render cleanly; navbar fits at 360 px
- [ ] User reviews the look at desktop, tablet and phone sizes (run `npm run preview` and open `/NLP_Notes/`), and the Thai weights on a real phone
- Not done on purpose (later phases): the scroll hairline on the navbar and all animation (Phase 6), the rail toggle (Phase 5)
- Gate

## Phase 4 - Midterm page content  (done, awaiting content review)

Static layout first, no animation, so the content can be checked against the Markdown preview.

- [x] Block renderer (`src/components/content/`): paragraph (bold, code, inline formulas), display math, lists, table, figure, note, example; exhaustive `switch`, so a new block type breaks the build. `ScrollArea` (one shared ResizeObserver; a region with a keyboard stop only while it overflows), `TableBlock`, `FigureBlock` (named after its card), `InlineContent`
- [x] KaTeX CSS (woff2 only through a small Vite plugin) and `content.css` (Thai fallback inside formulas and figure labels, slim scrollbar); `dragScroll` (right-button drag) carried over
- [x] `DesignPreview` removed. `MidtermPage` loads the content with `usePageContent` (skeleton, error with retry)
- [x] `Hero` (title from the file, four statistics computed from the tree, button to the first question), `QuestionHeader` (mint panel with the square corner, points pill, definition as light lead text, shared statement), `GroupHeading` (square badge, mint bar with ink outline, definition), `ProblemCard` (35), `NumberedHeading` (the leading number "ข้อ 3", "3.1", "3.1.1" becomes a badge inside the heading, so the heading text stays exactly as written)
- [x] `ExampleBlock`: Sol label, steps, Ans strip; with the switch off the solution is not rendered and a button under the problem reveals just that card; flipping the global switch clears the per-card choices
- [x] Cards mount in batches after the first paint with an anchor (`Pending`) for every card from the start, `content-visibility: auto` on cards
- [x] `jumpTo` (smooth or instant, focuses the target, leaves the URL alone), `computeStats`, `splitNumber`
- [x] Tests (96 in total): block renderer, show/hide/per-card reveal, outline (heading levels and ids, badge inside heading, points pill, hero statistics and jump, batching), page loading and retry, `jumpTo`, `splitNumber`, and a test that renders **the real content** (all 51 headings with their text and ids, 532 formulas, 39 tables, 1 figure, 35 solutions on and 0 plus 35 reveal buttons off)
- [x] `typecheck`, `lint`, `format:check`, `test`, `build` green. Production preview at 390 px: 4 questions, 35 cards, 532 formulas, 39 tables, 1 figure, no console errors, no horizontal page scroll, switch works (35 to 0, one card revealed, back to 35, remembered); Thai inside formulas and the parse-tree figure render correctly
- [x] Size: content chunk 1.1 MB raw, **66.6 KB gzip**; app shell 267 KB raw, 85.6 KB gzip (JS) plus 13 KB gzip (CSS), inside the budgets (the chunk size warning is raised to 1.5 MB because the budget is measured in gzip)
- Changed from the plan: the Ans strip has no separate "Ans" label (the Markdown answer paragraph already starts with a bold Ans); the reveal button sits under the problem; hero statistics are a list, not a definition list
- Known for Phase 5: a jump to a card that is still a placeholder must mount the cards before it (the rail will do that)
- [ ] User compares the page with the Markdown preview and spot checks formulas, tables, the parse tree
- Gate

## Phase 5 - Contents rail and navigation  (done, awaiting review)

- [x] `RailToggle`: icon only (a list icon that morphs into a cross), accessible name that follows the state ("เปิดสารบัญ" / "ปิดสารบัญ"), `aria-expanded`, `aria-controls`; no visible text anywhere
- [x] Desktop (>= 1024): grid `48 px toggle gutter | 264 px rail | content`; the rail is sticky and foldable; folding slides the text from its old place to the new one with a transform (FLIP, 320 ms) and slides the rail out with a fade; the folded rail is `inert` and `aria-hidden`
- [x] Phone and tablet: only one layout is rendered (`useMediaQuery`); a 48 px floating round button at bottom left opens a modal drawer (`role="dialog"`, `aria-modal`, blurred scrim, focus trap, `Esc`, scroll lock, closes by pressing the scrim or choosing an entry)
- [x] Three-level tree (question, group, item) built from the data (`treeModel.ts`); the question and the group that hold the reading position are expanded (height animation without measuring), the rest are folded and `inert`; `aria-current="location"` on the current entry; all 51 entries are reachable
- [x] One sliding highlight (mint bar with an ink outline) that follows resizes and expansion, and keeps the entry in view when the rail scrolls
- [x] Per-question progress rings (fill clockwise, solid mint disc with a check when finished), static look
- [x] `useActiveAnchor`: one scroll handler, throttled to a frame; reading position, per-question progress and page progress; a click sets the position at once and pauses the handler until `scrollend`
- [x] `jumpTo` from the contents first mounts every card, so the target does not move afterwards; the URL hash is not touched. Cards no longer use `content-visibility: auto` (its size estimates made long jumps land in the wrong place)
- [x] Hooks added: `useMediaQuery`, `useFocusTrap` (skips `inert` parts), `useLockBodyScroll` (the drawer unlocks the page as soon as it starts to close)
- [x] Tests (122 in total, 26 new): tree model and rendering (levels, expansion, `aria-current`, rings), toggle (icon only, state, ref), scroll spy (position, progress, bottom of the page, click pause), layout on a wide screen (landmark, fold, FLIP values, jump to a placeholder card) and on a narrow one (button, drawer, focus trap, scroll lock, `Esc`, scrim, choose and jump)
- [x] `typecheck`, `lint`, `format:check`, `test`, `build` green. Production preview checked in the browser: at 1280 px the rail (248 px), toggle and an 840 px text column sit as designed, 51 entries, the current entry follows scrolling (3.2.2 Viterbi highlighted, rings: ข้อ 2 done, ข้อ 3 at 40 percent), folding and unfolding set the rail `inert` and play the slide; at 390 px there is no rail, the floating button sits at the bottom left, the drawer opens with focus inside, blur, scroll lock and ข้อ 2 expanded, and choosing an entry closes it, unlocks the page and focuses the target; no console errors, no horizontal scroll
- Known (the test browser pane): the pane runs as a hidden page, so smooth scrolling and animation timelines do not advance there. The jump call and its arguments are covered by tests; the smooth scroll itself needs a check in a visible browser window
- Changed from the plan: the toggle gets its own gutter column instead of hanging in the margin (there is no margin at 1024 px); the drawer slide is a CSS animation for now (the spring comes in Phase 6)
- [ ] User checks navigation on desktop and phone
- Gate

## Phase 6 - Animation, polish and quality  (done, awaiting review)

- [x] Motion layer, CSS first (`src/styles/motion.css`, `lib/reveal.ts`, `hooks/useReveal.ts`, `hooks/useScrollProgress.ts`); no animation library (D13 changed; `motion` removed). Springs are `linear()` curves of stiffness 380 and damping 30 with a cubic-bezier fallback
- [x] A1 hero title word by word (`AnimatedTitle`, text unchanged), A2 count-up (`CountUp`, final number readable at once), A3 token-chip merge graphic (`TokenChips`, 8 chips, 3 rounds, ends in one mint chip, no text)
- [x] A4 reading-progress line and A15 navbar shadow (`ReadingProgress`, `Navbar`), A14 back-to-top with progress ring (`BackToTop`)
- [x] A5 question header (rise, badge pop, points pill slide), A6 group heading (bar grows), A7 card entrance and hover lift (hover-capable devices only); one shared IntersectionObserver, once per block, 40 ms stagger for blocks that arrive together
- [x] A10 drawer spring and staggered entries, A11 switch knob spring, A12 solution fold (`Fold`, height, near-window cards only) with the answer sheen, A13 jump-arrival underline (`jumpTo`), A16 toast entrance
- [x] Reduced motion: durations and delays go to zero in `index.css`, so every animation ends in its final state; `reveal`, `CountUp`, `Fold` and `jumpTo` have their own checks
- [x] Accessibility: formula-only table header cells get a readable name (`texLabel`: `aria-label` plus hidden text); scroll areas are a named region only when given a name; **axe in a real browser: 0 violations** on the page and with the drawer open (color contrast included, no `incomplete` items on the page); axe in the tests (`tests/a11y.test.tsx`): the whole app wide, narrow, narrow with the drawer, with solutions hidden, and all 35 real cards with solutions on and off
- [x] Responsive check by measurement at 360, 390, 768, 1024, 1440 and 844 x 390 landscape: no element sticks out of the layout width (outside the scroll areas and the fixed buttons), heading sizes follow the scale (32 / 48 / 60 px), the rail appears from 1024 px, the floating button and drawer below it, the navbar fits at 360 px, the hero graphic goes beside the title from 768 px
- [x] Performance budget: app shell JS 86.7 KB gzip plus CSS 14.9 KB gzip (budget 150 KB), content chunk 66.6 KB gzip (budget 200 KB); animations only touch transform and opacity (height for the fold and tree)
- [x] Copy pass: all UI labels re-read, no changes needed
- [x] Tests: 163 in total (41 new for this phase: reveal, count-up, title and chips, reading progress, back to top, navbar scroll state, fold, jump arrival, table header names, axe); `typecheck`, `lint`, `format:check`, `test`, `build` green. The vitest timeout is 20 s because the real-content render takes a few seconds
- Known: the test browser pane runs as a hidden page, so animation timelines and smooth scroll do not advance there. The states they lead to were checked (51 reveal blocks, all stats at their final values, progress line and back-to-top following the scroll), but how the motion looks and feels, and whether it holds 60 fps, has to be judged by the user in a visible window and on a real phone
- Known: a block that is jumped over without ever being on screen stays hidden until it is scrolled into view (an IntersectionObserver reports crossings only); it then plays its entrance
- Changed from the plan: the answer sheen is white, not mint (mint is invisible on the mint strip); the chip graphic has 8 chips and runs about 3 s
- [ ] User checks the animation feel on desktop and on a real phone (including frame rate) and the Thai weights
- Gate

## Phase 7 - Offline (PWA)  (done, awaiting an offline check in a real browser)

- [x] `vite-plugin-pwa` (generateSW, `registerType: 'prompt'`) precaches the whole build: 47 entries, 1818 KiB (page, JS, CSS, the content chunk, 26 woff2 fonts including 19 KaTeX, icons, favicon, manifest). `version.json` is not precached. Navigation fallback is `index.html`; `cleanupOutdatedCaches` is on; the size limit is 4 MiB so the content chunk can grow
- [x] Manifest from `src/config/pwa.ts`: "NLP Notes", standalone, Thai, scope and start URL `/NLP_Notes/`, theme `#ffffff` (canvas), background `#ecffe0` (canvas-mint), icons 192, 512, maskable 512; Apple touch icon (180) and the link in `index.html`
- [x] Icons drawn from the logo geometry by `scripts/make-icons.py` (`npm run icons`); true arcs for the chip corners, maskable mark kept inside the 80 percent safe zone; looked at, they match the logo
- [x] `ToastHost` (bottom left, above the floating contents button on narrow screens): "ใช้งานออฟไลน์ได้แล้ว" with "ปิด", and "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่"; a new service worker is applied by itself (checked every minute and when the tab returns), the button is the backup
- [x] `versionCheck`: `version.json` (build id, never cached) is compared with the id compiled into the page on open, on return to the screen, when the network comes back and every minute; a newer build unregisters the service worker, clears every cache and reloads, at most 3 times in 5 minutes; offline or a bad answer keeps the page; off in development
- [x] Tests: 180 in total (17 new): toast host (every state, priority, position), version check (same id, newer id, caches cleared, reload limit, offline and bad answers, timer and event triggers, stop), manifest (names, colors against the design file, icon files and sizes, page links); a Vitest alias gives tests a stand-in for the plugin virtual module
- [x] Checked after a production build: `sw.js` is valid, every file of `dist/` is in the precache (except `sw.js`, the Workbox runtime and `version.json`), all 41 precached URLs answer 200 from the preview server, every file the entry page refers to is precached; the page registers `/NLP_Notes/sw.js` with the base path as scope; no reload loop (build id matches `version.json`, no toast on a fresh load)
- [x] `typecheck`, `lint`, `format:check`, `test`, `build` green; sizes: app shell JS 88.0 KB gzip (was 86.7, the PWA register code), CSS 14.9 KB, content chunk 66.6 KB, all inside the budgets
- Known: the preview pane of the desktop app refuses to register any service worker (a one-line test worker fails too), so the real offline test, the update flow and the toast could not be run here; the steps are in `TESTING.md` section 6. A service worker of another project (`/Nihongo_Notes/`) was found on `localhost:4173` in that pane; it is not ours and was left alone
- [ ] User: offline test in a real browser and, after the first deploy, on a phone (`TESTING.md` section 6)
- Gate

## Phase 8 - Launch  (prepared, waiting for the user)

- [x] Lighthouse mobile, default throttling, on the production preview (Lighthouse 13 through npx, headless Chrome). First run: Performance **69** (LCP 3.8 s, TBT 840 ms), Accessibility 100, Best Practices 100, SEO 100. Final build, three runs: Performance **92, 93, 93**, LCP 2.8 to 2.9 s, TBT 100 to 120 ms, CLS 0, the other three at 100. Desktop preset: 100 / 100 / 100 / 100. Without throttling the mobile run scores 99
- [x] What was fixed to get there (in the order of effect): the top of the page (title, numbers, button) moved into a small `midterm.meta.json`, so the hero is painted before the 1.1 MB content file is requested, parsed and laid out (`useAfterPaint`); `content-visibility: auto` on the cards with height estimates (`lib/estimate.ts`), plus `jumpTo` correcting its landing after the scroll; questions mounted one at a time, the first two cards at once, further cards when near the window, the rest in idle moments from five seconds on; no forced layout when a scroll area mounts (it was 200 ms); `modulepreload` for the page chunk, the meta chunk and the content chunk; KaTeX and content CSS moved into the page chunk; the title words fade in from 30 percent opacity so the title counts as painted at once
- [x] What was tried and dropped: inlining the main stylesheet into the HTML (no gain)
- [x] Fixed on the way: a formula block that grows when its font arrives, or a card laid out late, was not re-measured, so a scrollable block could miss its keyboard stop; all scroll areas are measured again after fonts load, after areas were added and after scrolling stops. Real-browser axe after the changes: 0 violations in four measurements during loading (6 and 35 cards mounted), and after a jump from the contents the target lands exactly at its scroll margin (96 px), focused, with the right entry highlighted
- [x] Tests: 201 in total; `typecheck`, `lint`, `format:check`, `test`, `build` green
- [x] README checked against the project (commands, stack, editing workflow, documents)
- Not met: LCP 2.8 to 2.9 s against the 2.5 s goal (score 0.81 to 0.84). What is left on the critical path is the download and start-up of the 88 KB (gzip) app shell on a simulated slow connection; going lower would mean splitting the content file per question
- [x] Local git repository on `main` with `origin` set to `https://github.com/Kanawatkha/NLP_Notes.git`; the first commit is prepared locally
- [ ] User: say go for the push (`git push -u origin main`). It publishes the code and the Markdown, which are derived from the lecture slides and labs; Pages on a free plan needs a public repository (D14)
- [ ] User: Settings, Pages, Source "GitHub Actions"; open the live URL; offline check on a phone (`TESTING.md` section 6)
- [ ] Tag `v1.0.0` after the user approves
- [ ] Share the Pages URL

## Future (not planned)

- Final-exam page: add `content/final/`, a new entry in `PAGES`, a route `#/final`, and a tab. No code change to the renderer is expected.

## Working agreements

- One phase at a time. Report progress after each checklist group.
- If a decision is missing, ask. Do not guess on scope, dependencies, content changes, or anything that costs money.
- Keep the docs current. If behavior changes, update the matching document in the same change.
- Do not commit or push unless the user asks.
- Estimated effort is not tracked. The order matters more than dates.
