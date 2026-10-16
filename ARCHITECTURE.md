# ARCHITECTURE

How the repository, the build pipeline and the app are organized. Target state; nothing here is built yet. Rules marked **MUST** are enforced by lint, tests or review.

This project is a trimmed derivative of the 1322201 Digital Logic Notes site (same pipeline idea, one page instead of nine routes, plus a richer animation layer).

## 1. Principles

1. **One source of truth.** The Markdown files declared in `PAGES` (today `content/midterm/exam_practice.md`). Everything shown to students is generated from them.
2. **Data-driven UI.** Components render typed data. No course text is hard-coded in components.
3. **Feature-first.** Code that changes together lives together. Shared primitives are small and generic.
4. **Static and cheap.** Heavy work (parsing, KaTeX) happens at build time. The browser only renders.
5. **Boundaries are explicit.** Layers import downward only (section 5).
6. **One page now, room for more.** Pages are declared in one config list and the router has one real route. Adding a page is an "ask first" change.
7. **Cheap motion.** Animations are CSS first (no animation library), use transform and opacity, share one IntersectionObserver, play once, and have a reduced-motion variant.

## 2. System overview

```
content/midterm/exam_practice.md --(scripts/build-content)--> src/content/generated/midterm.json + midterm.meta.json (+ report.txt)
                                                                    |
                          React app (Vite) <------------------------+  one lazy chunk per page
                                    |
                             dist/  (static files + service worker)
                                    |
                             GitHub Pages  (deployed by GitHub Actions)
```

Build order is always: `content` then `typecheck` then `vite build`.

## 3. Target folder structure and reuse from 1322201

```
NLP_Notes/
├─ AGENTS.md  CLAUDE.md  PRD.md  PLAN.md  ARCHITECTURE.md  CONTENT-SCHEMA.md
├─ UI-SPEC.md  TESTING.md  DEPLOY.md  DESIGN-jobright.md  README.md
├─ package.json  package-lock.json  tsconfig*.json  vite.config.ts
├─ eslint.config.js  .prettierrc  .gitignore  .nvmrc
├─ .github/workflows/        ci.yml, deploy.yml
├─ .claude/skills/           edit-content/, verify-math/, add-component/
├─ content/                  SOURCE OF TRUTH (Markdown only)
│  └─ midterm/               exam_practice.md (rendered); 01..04_*.md, exam_guidelines.md (study notes, never rendered)
├─ scripts/
│  └─ build-content/         run.ts (CLI), index.ts, parse.ts, tree.ts, math.ts, svg.ts, project.ts, report.ts
├─ public/                   favicon, manifest icons, robots.txt
├─ src/
│  ├─ main.tsx               entry
│  ├─ app/                   App.tsx (HashRouter), layout/AppLayout.tsx, pwa/ (ToastHost, versionCheck)
│  ├─ pages/                 MidtermPage.tsx (the only page), NotFoundPage.tsx
│  ├─ features/
│  │  └─ midterm/            MidtermOutline, Hero, QuestionHeader, GroupHeading, ProblemCard,
│  │                         rail/ (RailLayout, RailTree, RailDrawer, RailToggle, ProgressRing, treeModel),
│  │                         AnimatedTitle, TokenChips, NumberedHeading, useActiveAnchor
│  ├─ components/
│  │  ├─ ui/                 Button, Badge, Card, Skeleton, Icon, Prose, Toast, Switch
│  │  ├─ content/            BlockRenderer, ExampleBlock, Fold, InlineContent, TableBlock, FigureBlock, ScrollArea, SolutionsProvider
│  │  ├─ layout/             Navbar, Logo, PageContainer, SolutionsSwitch, ReadingProgress, BackToTop
│  │  └─ motion/             CountUp (reveals live in lib/reveal.ts and hooks/useReveal.ts, keyframes in styles/motion.css)
│  ├─ content/
│  │  ├─ types.ts            ContentNode, Block, Inline (shared with scripts)
│  │  ├─ stats.ts            computeStats, metaOf (also used by the content build)
│  │  ├─ loaders.ts          PAGES id -> lazy import of generated/<id>.json and <id>.meta.json
│  │  └─ generated/          BUILD OUTPUT, git-ignored
│  ├─ hooks/                 usePageContent, usePageTitle, useMediaQuery, useReveal, useScrollProgress, useFocusTrap, useLockBodyScroll
│  ├─ lib/                   cn, text (plainText, splitNumber, texLabel), stats, jumpTo, motion, reveal, dragScroll
│  ├─ styles/                index.css (Tailwind, @theme tokens, fonts, KaTeX CSS import)
│  ├─ assets/                fonts/, logo/
│  └─ config/                site.ts (name, base path, PAGES list, UI strings)
└─ tests/                    fixtures/, content/ (round-trip, tree)
```

### Reuse map (source: the 1322201 project, `midterm/` folder)

The names below come from its `ARCHITECTURE.md` and source tree. Verify each file exists when copying in Phase 1.

| Reference file or folder | Action | Notes |
|---|---|---|
| `scripts/build-content/*` | **Adapt** | Read only the files declared in `PAGES`; allow level 4; new tree rules (`CONTENT-SCHEMA.md`); keep KaTeX strict, SVG checks, round-trip oracle, report |
| `src/content/types.ts` | **Adapt** | New `kind` values and `points`, `number` fields |
| `src/content/loaders.ts` | **Adapt** | Map `PAGES` ids to lazy imports of `generated/<id>.json` and `<id>.meta.json`; no manifest |
| `src/components/content/*` (BlockRenderer, InlineContent, TableBlock, FigureBlock, ScrollArea, SolutionsProvider) | **Copy**, restyle | Restyle with jobright tokens; storage key renamed to `nlp:show-solutions` |
| `src/components/layout/SolutionsSwitch.tsx` | **Adapt** | Navbar placement; pill switch with spring |
| `src/components/layout/{Navbar,Logo,PageContainer}.tsx` | **Adapt** | New logo, tab row with one tab ("Midterm"), no hamburger |
| `src/components/layout/{MobileMenu,ExamSetTabs}.tsx` | **Drop** | Not needed |
| `src/features/content-page/{ContentPage,FormulaOutline,ExerciseOutline,useActiveAnchor,jumpTo}` | **Adapt** into `features/midterm` | Merge the rail of `FormulaOutline` with the cards of `ExerciseOutline`; add level 4, the phone drawer, progress rings and the animations. `JumpNav` chips are dropped (replaced by the drawer) |
| `src/features/home-diagram/*` | **Drop** | |
| `src/pages/{HomePage,ChapterPage,ExamPage,ExamSetPage,FormulaSheetPage}.tsx` | **Drop**, new `MidtermPage.tsx` | `NotFoundPage` is kept and adapted |
| `src/app/App.tsx` (HashRouter, routes) | **Adapt** | Routes: `/` redirects to `/midterm`, `/midterm`, `*`; routes are built from `PAGES` |
| `src/app/pwa/*`, `vite-plugin-pwa` config | **Copy** | Rename app, base path, manifest |
| `src/lib/{cn,ids,text,dragScroll}.ts`, `src/hooks/*` | **Copy** | |
| `src/styles/index.css` | **Rewrite** | Tokens from `DESIGN-jobright.md`, not the cream/coral set |
| `.github/workflows/*`, `vite.config.ts`, ESLint, Prettier, tsconfig | **Copy**, rename | |
| `.claude/skills/*` | **Rewritten here** | NLP-specific versions already in this folder |
| `content/*`, `DESIGN-claude.md`, `dist/`, `node_modules/`, `.git/` | **Do not copy** | |

## 4. Data flow in detail

1. `scripts/build-content` reads the files declared in `PAGES` (`src/config/site.ts`). It never globs, so the study notes beside `exam_practice.md` are ignored.
2. It parses Markdown into blocks, builds the node tree (`CONTENT-SCHEMA.md`), pre-renders every formula with KaTeX in strict mode (HTML plus MathML), keeps the SVG verbatim, validates everything, and writes `generated/<page id>.json` and `generated/report.txt`.
3. `MidtermPage` loads in two steps. `usePageMeta('midterm')` fetches the small meta file and the hero is painted from it; two frames later (`useAfterPaint`) `usePageContent('midterm')` fetches the big content file (a lazy `import` of `generated/<id>.json`, already preloaded). It shows a skeleton while loading and an error with retry for each step.
4. Typed data goes to `MidtermOutline`. `BlockRenderer` maps `block.type` to a component. An unknown type fails the type-check, not at runtime.
5. Computed values (question count, group count, item count, total points, per-question item counts for the rail) are derived from the tree in `lib/`, never typed by hand.

The browser never ships a Markdown parser and never ships KaTeX JavaScript. It receives KaTeX HTML plus `katex.min.css` and KaTeX fonts.

## 5. Layering and import rules (MUST)

```
pages  ->  features  ->  components  ->  hooks / lib / content(types) / config
app    ->  pages, components, config
```

- `features/*` MUST NOT import from other `features/*`. There is one feature today; the rule stays for later (a future final-exam page would reuse shared pieces through `components/`).
- `components/ui/*` and `components/motion/*` MUST NOT import from `features/` or `pages/`.
- `scripts/*` MAY import `src/content/types.ts` and `src/content/stats.ts` (pure functions on the data) only. It MUST NOT import React code.
- `src/content/generated/*` is imported only by `src/content/loaders.ts`.
- Enforce with ESLint `no-restricted-imports` and path patterns.

## 6. State management

- Local component state, plus one context: `SolutionsProvider` (`showSolutions: boolean`, `toggle()`), persisted in `localStorage` under `nlp:show-solutions` with every access wrapped in try/catch (private windows and blocked storage must not break the page); and, in `RailLayout`, the reading position from `useActiveAnchor` (passed down as props, not a context, because only the rail and the Phase 6 progress parts need it).
- Per-card reveal is local state in `ProblemCard`; the global switch resets it.
- Rail state (open or folded on desktop, drawer open on phone) is local and not persisted.
- No global store library.

## 7. Routing

- `HashRouter`, because GitHub Pages cannot rewrite deep links.
- Routes: `/` redirects to `/midterm`, `/midterm`, `*` (not found). Route definitions and tab labels come from `PAGES`, so a future page is one config entry plus its Markdown folder.
- The hash belongs to the router, so in-page navigation does not touch the URL. `jumpTo(id)` calls `scrollIntoView` (smooth, instant under reduced motion) on the element with that id and then focuses its heading (`tabIndex=-1`, `scroll-margin-top` for the sticky navbar).
- Each route is code-split with `React.lazy`.

## 8. Styling and tokens

- Tailwind v4 CSS-first config. All colors, radii, spacing and type scales are defined once in `src/styles/index.css` under `@theme`, copied from `DESIGN-jobright.md` (single source: that file, which is not edited).
- Token names used in code: colors `primary`, `on-primary`, `ink`, `on-dark`, `canvas`, `canvas-mint`, `muted`, `hairline`, `surface-soft`; radii `sm`(12) `md`(16) `lg`(24) `xl`(28) `pill-nav`(18) `pill`(36) `card`(40) `full`; spacing `xxs..section`.
- Components use utility classes that reference those tokens. No raw hex in TSX.
- `Prose` wraps rendered content with typography rules (headings, tables, lists, math overflow).
- Addenda that `DESIGN-jobright.md` does not cover (Thai font stack, mobile type scale, contrast pairings) live in `UI-SPEC.md` section 1.

## 9. Page engine and animation (summary; details in `UI-SPEC.md`)

- One flow layout: on `lg` and up a two-column grid (rail, content); below, a single column with a floating button that opens the rail as a drawer.
- `useActiveAnchor` (one scroll handler throttled with `requestAnimationFrame`, no per-element observers) publishes the deepest heading reached, how far through each question the reading line is, and the page progress. `RailLayout` owns it and hands the values to the tree, the rings and, in Phase 6, the progress line and back-to-top.
- Loading is staged for the first load (Phase 8): the hero from the meta file, then the content, then the questions one at a time (`useShownQuestions`), the first two cards at once, further cards when their placeholder comes within 1600 px of the window, and the rest two at a time in idle moments from five seconds after opening. Placeholders keep the id and an estimated height (`lib/estimate.ts`), cards use `content-visibility: auto` with that estimate, a jump from the contents mounts every card first (`flushSync`) and `jumpTo` corrects its position once the scroll has ended.
- **Animation layer:** CSS first. `src/styles/motion.css` holds the keyframes, the `data-reveal` / `data-shown` rules and the spring curve (`--ease-spring`, a `linear()` list computed from stiffness 380 and damping 30). `lib/reveal.ts` is the one shared IntersectionObserver that sets `data-shown` once per block (`useReveal` hands the callback ref and attribute to a component). Scroll-driven values (`ReadingProgress`, `BackToTop`, the navbar shadow) come from `useScrollProgress`, one frame-throttled scroll handler that writes a CSS transform or sets a boolean. The two measured movements, the solution fold (`Fold`) and the rail fold, use the Web Animations API. `prefers-reduced-motion` is handled in `index.css` (durations and delays go to zero, so every animation ends in its final state) and in the JS paths (`reveal`, `CountUp`, `Fold`, `jumpTo`).
- No animation may cause layout shift of content the reader is looking at: reveals use transforms only, folds happen on the card the user pressed.

## 10. Offline and PWA

- `vite-plugin-pwa` in `generateSW` mode precaches all build output including fonts and the generated JSON chunk.
- `registerType: 'prompt'`; `ToastHost` shows "มีเวอร์ชันใหม่ พร้อมใช้งาน" with "โหลดใหม่". `version.json` plus a version check handle phones that are slow to update a service worker (same mechanism as 1322201, see `DEPLOY.md`).
- Scope and `start_url` use the repository base path.

## 11. Naming and conventions

| Thing | Convention |
|---|---|
| Components | `PascalCase.tsx`, named export, default export only for lazy pages |
| Hooks | `useThing.ts` |
| Utilities | `camelCase.ts` |
| Types | `PascalCase`, no `I` prefix |
| Constants | `SCREAMING_SNAKE_CASE` only for true constants |
| Node ids | `q<N>`, `g<N.M>`, `i<N.M(.K)>` (`CONTENT-SCHEMA.md` section 5) |
| Test files | `thing.test.ts(x)` next to the code, plus `tests/` for cross-cutting |
| Commits | Conventional Commits |

## 12. Extension points

| Want to add | Do this |
|---|---|
| More problems | Edit `content/midterm/exam_practice.md`; no code change |
| A final-exam page | Add `content/final/<file>.md`, an entry in `PAGES`, regenerate; the route and the tab appear from config. Ask first |
| A new Markdown construct | Extend `parse.ts` and `types.ts`, add a block component, add tests, document in `CONTENT-SCHEMA.md` |
| A new design token | Ask the user first; `DESIGN-jobright.md` stays unmodified, so record the change as an addendum in `UI-SPEC.md` |
