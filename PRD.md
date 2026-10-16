# PRD: NLP Notes

Product requirements for the study website. Status: agreed in discussion, not yet built. Decisions (made by the user or delegated to the agent) are listed in `PLAN.md` "Decisions".

## 1. Purpose

Give one student a fast, clean, readable place to practice the calculation questions of the 1323404 Natural Language Processing midterm (exam on 17 Oct 2026): one long page with every practice problem and its worked solution, quick to scan on a phone, usable as a self-test by hiding the solutions, and built so a final-exam page can be added later.

## 2. Users and context

- **Primary user:** the author, a Thai student, studying on phone (portrait and landscape), tablet and laptop, often with poor connectivity before an exam.
- **Secondary:** classmates who receive the link.
- Language of study content: Thai with English technical terms. Language of project documents and code: English.

## 3. Goals

1. Find any question or sub-question in two taps or fewer (collapsible contents rail on desktop, drawer on phones).
2. Read comfortably on a 360 px wide phone and on a desktop, including tables, formulas and the parse-tree figure.
3. Work offline after the first visit.
4. Make content changes cheap: edit one Markdown file, push, site updates.
5. Look friendly and high-energy, following `DESIGN-jobright.md` (mint, black, white; Titillium Web headings; rounded pills and cards), with polished, purposeful animation.
6. Show the worked solution (Sol and Ans) of every problem all the time; there is no hide switch (changed after launch, D15).

## 4. Non-goals

- **One page for now.** The site is "NLP Notes"; its single page is **Midterm** at `#/midterm`. No chapter pages, formula sheet page or home diagram. A final-exam page is a future addition (new Markdown folder, new route, new tab) and is out of scope today.
- No backend, accounts, comments, analytics, or user data of any kind. Nothing is stored about the visitor.
- No dark theme (light only; `DESIGN-jobright.md` defines none).
- Only `content/midterm/exam_practice.md` is rendered. The study notes beside it (`01..04_*.md`, `exam_guidelines.md`) and the lecture slides or labs are not part of the site.
- No in-browser Markdown rendering. No editing UI. No search in the first release.
- No marketing sections (testimonials, FAQ, pricing, job ticker). Only the design language is borrowed.

## 5. Information architecture

| Route | Page | Source |
|---|---|---|
| `#/` | redirects to `#/midterm` | none |
| `#/midterm` | Midterm (the only page) | `content/midterm/exam_practice.md` |
| `*` | Not found (message and link to Midterm) | none |

Navbar: logo and wordmark "NLP Notes" on the left (links to Midterm), one tab "Midterm" (active). Nothing on the right. The tab row exists so a future "Final" tab drops in.

The Midterm page, top to bottom:

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | Navbar and progress line | UI strings | Sticky; a thin mint line under it shows reading progress |
| 2 | Hero band | `HERO` constants in `src/config/site.ts` | Mint band, fixed title "Midterm Practice Exam", two numbers (questions 5, total points 20, set by hand in `HERO`), decorative token-chip graphic; no button |
| 3 | Contents rail (left) | headings | Icon toggle, foldable; drawer on phones |
| 4 | Questions | `##` ข้อ 2 to ข้อ 5 | Question header panel, definition, shared statement, then groups and cards |
| 5 | Groups | `###` with `####` children (ข้อ 3, 4, 5) | Group heading with number badge and definition |
| 6 | Problem cards | `###` leaf (ข้อ 2) or `####` | Problem, Sol, steps, Ans |
| 7 | Back-to-top | none | Button with a progress ring, appears after the hero |

Navigation inside the page does not change the URL (HashRouter owns the hash); jumps scroll to the element and move focus.

## 6. Features

### F1 Contents rail
Left, sticky, no text label: an icon button opens and closes it (icon morphs between a list and a cross). Desktop: open by default, folding widens the content smoothly. Phones: a round black floating button opens a drawer from the left over a blurred scrim. Inside: the four questions; the question being read is expanded to its groups; the group being read is expanded to its problem items, so all 35 items are reachable without a very long list. A highlight slides to the current entry and each question shows a small progress ring.

### F2 Question and group headers
Each `##` opens with a mint header panel: number, title, points (parsed from "(N คะแนน)"), definition text, and the statement shared by its sub-questions. Each group heading carries a number badge and its definition.

### F3 Problem cards
Each item is a card: number and title, problem text, a `Sol` label, solution blocks (tables, display math, figures), and an `Ans` strip. 35 cards in the current content.

### F4 Solutions
The Sol and Ans of every card are always shown. The earlier switch (hide all, reveal one card, remembered in the browser) was removed at the user's request (D15 in `PLAN.md`).

### F5 Animation
Hero entrance with a BPE-merge chip graphic and count-up stats, reading-progress line, section reveals, card entrance and hover lift, rail highlight and rings, drawer, the content growing into the room of a folded rail, jump-arrival underline, back-to-top ring. Detailed in `UI-SPEC.md` section 9. Everything respects `prefers-reduced-motion`.

### F6 Responsive layout
Phone portrait, phone landscape, tablet, desktop. See `UI-SPEC.md` section 8.

### F7 Offline
After the first load the whole site (formulas, SVG figure, fonts) works with no network. A new version is offered through a toast.

### F8 Brand
Name "NLP Notes". Original logo: three token chips in a row, the last one filled mint. No Jobright, Anthropic or Claude marks.

## 7. Content requirements

- Markdown is the single source of truth. Thai text is preserved character for character. The pipeline never rewrites wording.
- Math is KaTeX. The figure is inline SVG using `currentColor`. See `CONTENT-SCHEMA.md`.
- The structure of the content is `#` title, `##` question, `###` group or item, `####` item inside a group. The 1322201 parser accepts levels 1 to 3 only; this project extends it to level 4 and leaves the content unchanged. See `CONTENT-SCHEMA.md` section 5.
- Pages are declared in `src/config/site.ts` (`PAGES`: route, tab label, source file). The build reads only declared files, so the study notes in the same folder never enter the build.

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | App shell under 150 KB gzip JS+CSS (no animation library); Midterm content chunk under 200 KB gzip (fonts and KaTeX CSS excluded); LCP under 2.5 s on a mid-range phone over 4G; math pre-rendered at build time; animations use transform and opacity only; long page mounts cards in small batches after first paint |
| Accessibility | WCAG 2.2 AA contrast with the token pairings in `UI-SPEC.md` section 12 (mint is never the only indicator on white), keyboard operation of the rail and drawer, `prefers-reduced-motion` honored, correct heading order, labels for icon-only controls and the figure |
| Compatibility | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+ |
| Reliability | Build fails if any formula fails KaTeX, any SVG contains a blank line, a heading level is not allowed, or the round-trip test fails |
| Maintainability | Feature-first structure, strict TypeScript, tested content pipeline, documents kept in sync |
| Hosting | GitHub Pages only, deployed by GitHub Actions |

## 9. Acceptance criteria

1. `content/midterm/exam_practice.md` converts without error and the round-trip test passes (including the level-4 headings).
2. `#/` lands on `#/midterm`. The page renders all 4 questions, 17 level-3 headings, 30 level-4 headings and 35 cards, every table, every formula and the figure.
3. The rail (desktop) and drawer (phone) reach every question, group and item; the icon toggle folds and unfolds with animation; the highlight follows scrolling.
4. Every card shows its Sol and Ans; there is no switch and no reveal button.
5. All animations in `UI-SPEC.md` section 9 work, hold 60 fps on a mid-range phone in a manual check, and are off under `prefers-reduced-motion`.
6. Layouts verified at 360x640, 390x844, 768x1024, 1024x768, 1440x900 and phone landscape 844x390 with no horizontal page scroll except inside wide math, tables and the figure.
7. Offline test: load once, switch the network off, reload and use the page.
8. `npm run build` is green in CI and the site is reachable at `https://kanawatkha.github.io/NLP_Notes/`.
9. Lighthouse (mobile, default throttling): Performance 90+, Accessibility 95+, Best Practices 95+. Result for the final build: 92 to 93, 100, 100 (LCP 2.8 to 2.9 s against the 2.5 s goal of section 8). PWA installability is checked by the tests and by hand (Lighthouse 13 no longer scores it).

## 10. Risks and open items

| Item | Handling |
|---|---|
| `DESIGN-jobright.md` fonts (Titillium Web, Inter) have no Thai glyphs | Thai falls through to Noto Sans Thai; the stack and weights are an addendum in `UI-SPEC.md`, the design file stays untouched (decided in Phase 3 on a real phone) |
| Spring-mint `#00f0a0` on white is about 1.5:1 and `muted` `#86909c` on white is about 3.2:1 | Mint is only a fill or an accent paired with ink; `muted` is never used for text. Rules in `UI-SPEC.md` section 1 |
| Heavy display sizes (80/60/48 px) do not fit Thai titles on phones | Responsive scale-down per `UI-SPEC.md` section 1; tokens unchanged |
| Level-4 headings are not supported by the reference parser | Extend parse/tree/render for this project; content unchanged |
| Study notes share the `content/midterm/` folder with the rendered file | The build reads only files declared in `PAGES`, never a glob |
| Content is derived from lecturer slides and labs | The repo contains no slides or PDFs. Whether the repo may be public (Pages on a free plan needs a public repo) is the user's decision |
| Many animations on a long page can hurt phones | Transform/opacity only, one shared IntersectionObserver, reveal once, batch mounting, CSS instead of a library; bundle measured in Phase 6, frame rate to be checked by the user on a real phone |
| Single content chunk is large (68 KB Markdown, about 570 formulas) | Pre-render at build, measure in Phase 2 and 4, mount cards in batches |
