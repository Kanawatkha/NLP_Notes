# UI-SPEC

The site shell, the Midterm page, its components, interactions, animation and responsive behavior. Visual tokens (colors, type, radius, spacing) come from `DESIGN-jobright.md`, which is used as-is and never edited; this file says where and how they are used and records the addenda the design file does not cover. Light theme only.

## 1. Global rules and addenda

### Rules

- Canvas is `canvas` (#ffffff). Text is `ink` (#000000). The page rhythm borrows the design's bands: a mint hero, white body, mint question headers, white problem cards.
- **Mint (`primary` #00f0a0) is an accent, never text on white.** Its contrast on white is about 1.5:1. Use it as a fill (badge, rail bar, the signature pill, progress effects) next to `ink`, or on black. Any state shown with mint also changes something else (weight, border, text, `aria-*`).
- **`canvas-mint` (#ecffe0) is a surface**, always carrying `ink` text (about 20:1).
- **`muted` (#86909c) is not used for text** (about 3.2:1 on white, lower on mint). It is allowed for decorative strokes only. Anything a student must read is `ink`; secondary text is `ink` at a lighter weight or size, not a lighter color.
- Links are `ink` with an underline (a `primary` underline of 2 px is allowed as decoration). No mint link text.
- Everything on a black surface (`ink` fill) uses `on-dark` text; mint on black is allowed for text (about 14:1).
- Elevation is a hairline or a whisper-soft shadow (`0 4px 16px rgba(0,0,0,0.06)`), never heavy blur. No static gradients.
- Focus is always visible: 2 px `ink` outline with 2 px offset, plus a `primary` outer ring (3 px) on light surfaces. The ink outline carries the contrast.
- Max content width 1200 px. The content column takes the room the rail leaves (no 880 px cap on desktop; 880 px stays the cap on tablet and phone).
- Every sideways-scrolling area (tables, display math, the figure) can be panned with the right mouse button held down (`src/lib/dragScroll.ts`, carried over from 1322201); touch keeps native scrolling.
- UI labels shown to students are Thai. Code, comments and docs are English.

### Addendum A: Thai font (design file untouched)

Titillium Web and Inter contain no Thai glyphs. Stacks:

| Role | Stack |
|---|---|
| Display / headings | `"Titillium Web", "Noto Sans Thai", system-ui, sans-serif` |
| Body / UI | `Inter, "Noto Sans Thai", system-ui, sans-serif` |

Thai characters fall through to Noto Sans Thai (SIL OFL, static `@fontsource/noto-sans-thai` files, Thai subset only, 9 KB per weight). The static files let the weight map be exact: where a token says Inter 500 (body-md, body-sm, caption), the Thai face serves its 400 file; 300, 600 and 700 use their own files (`src/styles/fonts.css`). Checked in the browser at phone width: tone marks (น้ำ ปู่ ผู้ ปี่ ป้า) render clean at heading and body sizes. To be confirmed on a real phone. Decision D9 in `PLAN.md` (Prompt for Thai headings is the alternative). Numbers use the `tabular` utility (`font-variant-numeric: tabular-nums`) where they animate.

### Addendum B: responsive type scale

The tokens (80/60/48/38/32 px) are desktop values. Thai titles are long, so below the breakpoint the same tokens scale down; the tokens themselves are unchanged.

| Token | >= 1024 | 768-1023 | < 768 |
|---|---|---|---|
| `display` | not used on this site | | |
| `heading-1` (hero title) | 60 px | 48 px | 32 px |
| `heading-2` (question title) | 48 px | 40 px | 28 px |
| `heading-3` (stat numbers, group title) | 38 px | 32 px | 24 px |
| `heading-4` (card title) | 32 px | 28 px | 22 px |
| `body-lg` (definition lead) | 18 px | 18 px | 17 px |
| `body-md`, `body-sm`, `button`, `nav-link`, `caption` | as tokens | as tokens | as tokens |

Heading line height is 1.25 for every heading token (the tokens say 1.05 to 1.25; Thai tone marks need at least 1.25). The negative letter spacing of the display tokens is not applied to mixed Thai text; the `tracking-display` utility exists for Latin-only text. Implemented as the `type-h1` to `type-h4`, `type-body-*`, `type-button`, `type-nav`, `type-caption` utilities in `src/styles/index.css`; `display` (80 px) exists but is not used on this site.

### Addendum C: what is borrowed and what is not

From the design file: colors, type roles, radii, spacing, pill buttons, mint band rhythm, the 40 px asymmetric card, hairline cards, data-table chrome, app-shell row (rail) styling, toast chrome, the score-ring idea (as the rail progress ring). Not used: the job ticker, testimonials, FAQ, pricing, the company's logo, name, copy and illustrations.

### UI strings (Thai)

| Key | Text |
|---|---|
| site name | NLP Notes |
| tab | Midterm |
| stat labels | ข้อใหญ่ / คะแนนรวม |
| rail toggle (aria-label only, no visible text) | เปิดสารบัญ / ปิดสารบัญ |
| rail landmark (aria-label) | สารบัญ |
| back to top | กลับขึ้นบน |
| reading progress (aria-label) | ความคืบหน้าการอ่าน |
| solution / answer labels | Sol / Ans |
| loading | กำลังโหลด... |
| load error / retry | โหลดเนื้อหาไม่สำเร็จ ลองอีกครั้ง / ลองอีกครั้ง |
| not found / back | ไม่พบหน้านี้ / กลับไปหน้า Midterm |
| update toast / action | มีเวอร์ชันใหม่ พร้อมใช้งาน / โหลดใหม่ |
| offline ready toast | ใช้งานออฟไลน์ได้แล้ว |

The word "สารบัญ" appears only as an accessible name, never on screen. Course text (titles, definitions, problems) is never in this table: it comes from the Markdown.

## 2. Shell and routes

| Route | Page |
|---|---|
| `#/` | redirects (replace) to `#/midterm` |
| `#/midterm` | Midterm |
| `*` | Not found: centered message, `button-dark-square` back to Midterm |

Every page sets `document.title` to `<page> | NLP Notes` (for example `Midterm | NLP Notes`) and moves focus to the main heading on navigation.

### Navbar (`nav-bar`)

- Sticky, 64 px, white, padding `md`. A hairline bottom border and a whisper shadow fade in after the page has scrolled 8 px.
- Left: logo mark and wordmark "NLP Notes", linking to Midterm.
- Center-left: the tab row. One tab, "Midterm", `nav-link` style, active state `aria-current="page"` with a black pill (`on-dark` label, radius `pill-nav`). A future "Final" tab drops into the same row.
- No hamburger. No footer.
- Phones: the tab shares the row with the logo. Below 420 px wide the wordmark text is hidden and only the mark stays, so everything fits at 360 px (checked: no overflow).

## 3. The Midterm page

```
<Navbar />                          sticky
<ReadingProgress />                 3 px line under the navbar
<main>
  <Hero />                          mint band
  <div grid>                        lg: [ rail column 288 px | content ]
    <Rail />                        lg: sticky column; below lg: drawer
    <article>
      <Question /> x 4              header panel, then groups and cards
    </article>
  </div>
</main>
<RailToggle />                      desktop: sticky in the left margin; phone: floating round button bottom-left
<BackToTop />                       floating, bottom-right
```

### Hero (`hero`, mint band)

- Background `canvas-mint`, padding 48 px desktop and 32 px phone (compact since Phase 9), content in the 1200 px container.
- H1: the fixed title "Midterm Practice Exam" (`HERO.title`), `heading-1` (Addendum B), `ink`.
- Stat row (`stat-item`, two items): big number in `heading-3`, caption in `caption` weight 500, all `ink`, with a small line icon: ข้อใหญ่ 5 and คะแนนรวม 20. The values are the `HERO` constant in `src/config/site.ts`, set by hand until the exam has all its questions; they are not computed from the content.
- Under the title, a `body-md` list, one question per line ("ข้อ N name (P คะแนน)"), gives the five questions with their points (`HERO.parts`, which must add up to `HERO.points`).
- No button.
- Graphic (decorative, `aria-hidden`): a row of rounded "token chips" (abstract rounded rectangles of different widths, no text) that merge pairwise, echoing the logo and the idea of BPE merging. Animation A3. Sits to the right of the title on desktop, below the stats on phone.

### Content structure

| Markdown | Component | Look |
|---|---|---|
| `##` question | `QuestionHeader` | Mint panel (`canvas-mint`), radius `card` 40 with one square corner (top-left 0), padding `lg` (`xl` desktop). Number badge (black pill, white text, "ข้อ N"), title in `heading-2`, points pill (white fill, ink border, "N คะแนน"), then the question's `explain` (definition in `body-lg` weight 300, shared statement in `body-md`) |
| `###` group | `GroupHeading` | No panel. Number badge (`3.1`, black square-pill, radius `sm`) next to the title in `heading-3`; the definition under it in `body-md`. A 4 px `primary` bar at the left of the heading with a 1 px `ink` outline (not mint alone) |
| `###` item (ข้อ 2) and `####` item | `ProblemCard` | White card, 1 px `hairline` border, radius `lg` (24), padding `lg` (16 px phone) |

Vertical rhythm: 48 px between questions (`xxl`), 32 px between groups (`xl`), 24 px between cards (`lg`), 16 px inside cards.

### ProblemCard anatomy

```
[ number chip ] Title                                  heading-4
problem blocks                                          body-md
-- Sol label (caption, surface-soft pill) --
solution blocks (paragraphs, tables, display math, figures)
Ans strip: canvas-mint fill, 3 px ink bar on the left, the answer paragraph from the Markdown (it already starts with a bold "Ans" written as $\mathbf{Ans}$, so there is no separate label)
```

- Number chip: `surface-soft` pill with `ink` text (`caption`).
- Sol label: `caption`, `ink`, on `surface-soft`, radius `full`.
- Sol, steps and Ans are always shown. There is no switch and no reveal button.

### Block rendering

| Block | Rendering |
|---|---|
| `p`, `list` | `body-md`, line height 1.6; Thai wrapping with `overflow-wrap: anywhere` only inside table cells |
| inline `math` | KaTeX HTML, font size 1.05em |
| inline `code` | `surface-soft` chip, radius 6 px, 0.95em, system monospace stack with Thai fallback; no new font file |
| display `math` | Centered; wrapper `overflow-x: auto` (`ScrollArea`); never wraps lines |
| `table` | `ex-data-table-cell` chrome: wrapper `overflow-x: auto`, header row `caption` weight 600 on `surface-soft`, body `body-sm`, row borders `hairline`, alignment from the alignment row, cell padding `sm md`; table text never below 13 px |
| `figure` | SVG inline, `max-width: 100%`, `height: auto`, centered, inside a `surface-soft` frame (radius `md`); strokes follow `currentColor`; `role="img"` with `aria-label` from the heading |
| `note` | `surface-soft` panel, radius `sm`, padding `md` |
| `example` | The ProblemCard structure above |

## 4. Contents rail

The rail is a navigation tree with **no visible text label**. It is opened and closed with an icon button.

### Toggle (`RailToggle`)

- Icon-only, 44 px target, `ink` fill with `on-dark` icon (a black circle), with `aria-label` "เปิดสารบัญ" / "ปิดสารบัญ", `aria-expanded`, `aria-controls`.
- The icon is a three-line list that **morphs** into a cross (the lines rotate and fade) in 240 ms; with reduced motion it swaps instantly.
- Desktop (>= 1024): a sticky button in its own 48 px gutter column at the left of the rail, level with the first rail entry. The gutter stays when the rail is folded, so the button never moves. Phone and tablet: a 48 px floating round button at bottom-left, 16 px from the edges plus the safe-area inset; it stays visible above the drawer and shows the cross.

### Desktop rail (>= 1024)

- Grid under the hero: `48 px toggle gutter | 264 px rail | content` (the rail itself is 248 px wide). At a 1200 px container the text column is 840 px with the rail open and 1104 px with it folded (no cap). The rail is sticky at `top: 80px`, scrolls inside itself (max height `100dvh - 8rem`, scrollbar hidden) and is open by default.
- Folding: the rail column of the grid shrinks from 264 px to 0 with a CSS transition on `grid-template-columns` (380 ms, ease-out), so the content column grows into the room and shrinks back when the rail opens; the rail inside slides out with a fade, and the folded rail is `inert` and `aria-hidden`. This replaces the earlier transform-only slide (FLIP): the text now reflows on every frame, which is accepted because cards far from the window are skipped by `content-visibility: auto`. Under reduced motion the change is instant.
- Only one layout is rendered: the rail on a wide screen, the floating button and drawer below it (`useMediaQuery`), so there is never a second, hidden tree.

### Tree

Three levels, expanding as you read:

| Level | Entry | Style |
|---|---|---|
| 1 question | `ข้อ N <displayTitle>` (truncated at 40 characters), a small progress ring on the left | `nav-link` weight 600, `ink` |
| 2 group | `N.M <title>` | `body-sm` weight 500, indented 12 px with a `hairline` guide line |
| 3 item | `N.M.K <title>` | `caption`, indented 24 px |

- The question that contains the reading position is expanded to show its groups (ข้อ 2 shows its 5 items directly); the group that contains it is expanded to show its items. Everything else is collapsed. Expansion follows scrolling automatically (height animation 220 ms, chevron rotation) and is not manually collapsible, which keeps the tree predictable.
- Active entry (`aria-current="location"`): `surface-soft` fill, `ink` text weight 600, a 4 px `primary` bar on the left with a 1 px `ink` outline. A single highlight element slides between entries (A8). The rail follows along when its own list is longer than the window.
- Entries are buttons; selecting one calls `jumpTo(id)`.
- Row style follows `ex-app-shell-row`: radius `sm`, padding `sm md`.

### Progress ring (per question)

- 20 px ring, 2.5 px stroke: track `surface-soft`, fill `ink`, sweeping clockwise as the reader moves through the question (computed from scroll position inside the question's box). When the question is fully read the ring becomes a solid `primary` disc with an `ink` check mark. Decorative (`aria-hidden`); the same information is not needed to navigate.

### Phone and tablet drawer (< 1024)

- Opens from the left: width `min(86vw, 340px)`, white, radius `lg` on the right corners, hairline border, over a scrim (`ink` at 40% opacity with `backdrop-filter: blur(6px)`; solid fallback without support).
- Phase 5 slides it in with a CSS animation (280 ms) and fades the scrim; the spring and the staggered entries (30 ms apart, first 8 only) arrive in Phase 6 (A10).
- Focus is trapped while open (entries inside folded, `inert` parts are skipped), `Esc` closes, background scroll is locked, tapping the scrim closes. The page is unlocked the moment the drawer starts to close, so choosing an entry closes the drawer and jumps (after 50 ms). Focus returns to the toggle on `Esc` or the scrim, and goes to the target heading after a jump. Swiping the drawer left to close is not built.
- The tree is the same component as on desktop (with the same auto-expansion).

### `jumpTo(id)`

Scrolls to the element (smooth, instant under reduced motion) with `scroll-margin-top` for the navbar and focuses its heading (`tabIndex=-1`); the arrival underline (A13) arrives in Phase 6. The URL hash is not changed. Cards are mounted in stages for the first paint and may still be placeholders, so a jump from the contents first mounts every card (`flushSync`) and then scrolls. Cards far from the window are laid out from a height estimate (`content-visibility: auto` with `contain-intrinsic-size`, estimate from `lib/estimate.ts`), so after a long smooth scroll the target can end up a little off while the cards around it take their real size. Once the scroll has ended (the `scrollend` event, or 1.2 s as a fallback) `jumpTo` looks at where the target is and, if it is more than 4 px away from where its scroll margin puts it, scrolls it into place again (up to three corrections).

The reading position (the highlighted entry, the expanded question and group, the ring values and the page progress) comes from one scroll handler, throttled to a frame (`useActiveAnchor`). A click sets the position at once and pauses the handler until `scrollend` (or 1 s), so the highlight goes straight to its target.

## 5. Reading progress and back-to-top

- `ReadingProgress`: a 3 px line directly under the navbar; a track in `hairline` and a fill in `primary` that grows with scroll (`transform: scaleX`, origin left, updated in `requestAnimationFrame`). Decorative and `aria-hidden` (it duplicates the scrollbar).
- `BackToTop`: a 48 px round button bottom-right (16 px inset plus safe area), `ink` fill, `on-dark` arrow, a thin ring around it that fills `primary` with the page progress. It appears (fade and scale) once the hero has scrolled out of view, scrolls to the top on press, has `aria-label` "กลับขึ้นบน".

## 6. Solutions

Removed after launch (`PLAN.md` D15). Sol and Ans are always shown; there is no switch, no reveal button and no stored preference. The section number is kept so the references to sections 7 and later stay valid.

## 7. Buttons and controls (from the design)

| Use | Component | Notes |
|---|---|---|
| Toast action | `button-primary-sm` | Black compact pill, radius `pill-nav` (18) |
| Signature accent | `button-green` | Mint pill with black border, radius `pill` (36). **Not used by default**; reserved so the accent stays rare |
| Per-card reveal, retry, not-found back | `button-dark-square` | Black, radius `sm` |
| Rail toggle, back-to-top | icon button | Black circle, `on-dark` icon |

Min touch target 44 px for pills and icon buttons; 40 px for rail rows.

## 8. Responsive behavior

| Size class | Width | Layout |
|---|---|---|
| Phone portrait | 360-767 | One column, 16 px gutters, hero padding 32 px, cards padding 16 px, floating rail button (bottom-left) and drawer, back-to-top (bottom-right) |
| Phone landscape | up to 932 x 430 | As phone; navbar stays 56 px; the floating buttons shrink to 44 px |
| Tablet | 768-1023 | One column, reading width 880 px, floating rail button and drawer |
| Desktop | 1024-1440 | Rail 288 px (foldable) plus content column; question header spans the column |
| Wide | > 1440 | Content capped at 1200 px, centered; the mint hero band is full-bleed |

Rules:
- No horizontal page scroll anywhere except inside tables, display math and the figure.
- `100dvh` for anything full height; floating buttons respect `env(safe-area-inset-*)`.
- Orientation change recomputes the rail highlight and the drawer width.
- Wide tables keep their header and scroll inside the card.

## 9. Animation

### Timing tokens

| Token | Value | Use |
|---|---|---|
| `fast` | 160 ms | color, small state changes, exits |
| `base` | 240 ms | most transitions |
| `slow` | 480 ms | entrances |
| ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | all entrances and slides |
| spring | stiffness 380, damping 30 (about 2 percent overshoot), written as a CSS `linear()` curve with a cubic-bezier fallback (`--ease-spring`), played over 450 to 520 ms | drawer, number badge pop, back-to-top |

### Catalogue

| Id | Element | Trigger | Effect |
|---|---|---|---|
| A1 | Hero title | page load | Title split at spaces; each part rises 24 px and fades in from 30 percent opacity (not from 0: a browser does not count invisible text as painted, which would delay the largest-contentful-paint time by the length of the stagger), staggered 60 ms (max 12 parts), `slow` |
| A2 | Hero stats | hero enters view | Numbers count up from 0 over 900 ms (`tabular-nums`); the final value is the DOM text, so screen readers read it at once |
| A3 | Token-chip graphic | page load, once | Eight chips start spread out. In three rounds (at 0.5 s, 1.4 s and 2.3 s, each 800 ms) the chips of a pair slide together by half their gap and cross-fade into one wider chip; the last round leaves one wide mint chip with an ink outline. 15 shapes in all, no text |
| A4 | Reading-progress line | scroll | `scaleX` follows scroll, updated in `requestAnimationFrame` |
| A5 | Question header | enters view, once | Panel rises 24 px and fades (`slow`); number badge pops (scale 0.6 to 1, spring) 120 ms later; points pill slides in from the right |
| A6 | Group heading | enters view, once | Left bar grows (`scaleY`, 480 ms), text and badge fade in (the whole heading fades, `slow`) |
| A7 | Problem card | enters view, once | Rises 20 px and fades (`slow`), staggered 40 ms for cards that enter together (max 4). Hover (hover-capable devices only): lifts 2 px with the whisper shadow (`base`) |
| A8 | Rail highlight and tree | scroll position changes | The highlight slides to the active entry (300 ms); the active question and group expand with a height animation (`base`) and the chevron rotates; the ring sweep updates smoothly |
| A9 | Rail fold (desktop) | toggle | The rail column shrinks and the content column grows with it (`grid-template-columns`, 380 ms), the rail slides out with a fade, the toggle icon morphs |
| A10 | Drawer (< 1024) | toggle | Drawer springs in from the left (520 ms; the panel reaches 24 px past the left edge so the overshoot never shows a gap), scrim fades in, the first 8 entries rise in 30 ms apart after 120 ms |
| A11 | (removed) | | The switch knob; removed with the switch in Phase 9 |
| A12 | (removed) | | The solution fold and the Ans sheen; removed with the switch in Phase 9 |
| A13 | Jump arrival | after `jumpTo` | The target heading gets `data-arrive` for 1.8 s: a 3 px mint underline (with a 1 px ink outline) draws left to right and fades out; the heading itself takes focus |
| A14 | Back-to-top | after the first screen (scrollY over 75 percent of the window height) | Button fades and scales in (spring); its mint ring tracks the page progress; out of the tab order while hidden |
| A15 | Navbar | scroll over 8 px | The whisper shadow fades in (`fast`); the hairline track of the reading-progress line is always there |
| A16 | Skeleton and toast | loading, update | Skeleton bars pulse in opacity; toast slides up 16 px and fades (`base`) |

### Rules

- Only `transform` and `opacity` animate, with two exceptions: the rail tree expansion (height) and the rail column width on desktop (A9). Never width, top or left; never anything that shifts the content the reader is looking at.
- Reveals (A5 to A7) share one IntersectionObserver (`rootMargin` of 10% at the bottom), play once, then stop observing. A block that is already above the window when it is first reported renders in its final state. An observer only reports a crossing, so a block that is jumped over without ever being on screen waits (hidden) until it is scrolled into view, and then plays its entrance.
- Scroll-driven values (A4, rings, A14) are computed in one `requestAnimationFrame`-throttled scroll handler and applied through CSS custom properties or `transform`.
- `will-change` is set only while a reveal is waiting to play, never permanently.
- **`prefers-reduced-motion: reduce`:** A1 to A7 and A13, A14, A16 render their final state with no movement; counts show the final number; A3 shows the settled row; A8 highlight jumps without sliding and the tree expands instantly; A9 and A10 appear and disappear instantly (the scrim fades only); `jumpTo` scrolls instantly. A4 and the rings still update (they are state, not motion).
- **No animation library.** Everything is CSS (keyframes, transitions, the `linear()` spring) plus the Web Animations API for the one measured movement (the rail tree fold). The `motion` package that the plan first listed is not installed. All keyframes and curves are in `src/styles/motion.css`; reveal state is set by `src/lib/reveal.ts`.

## 10. Loading, empty and error states

- First paint: navbar, hero shell and a `Skeleton` (three `surface-soft` bars, radius `lg`) in place of the content; `aria-busy` on the article.
- Long content mounts its cards in small batches after first paint; unmounted cards are placeholders with the right id, so anchors and the rail never point at nothing.
- A failed content chunk shows the load-error message with the retry button. The service worker normally prevents this offline.

## 11. Brand mark and icons

- **Mark:** three rounded token chips in a row, the last one filled `primary`. Geometry on a 32 x 32 grid: `rect x=2 y=11 width=8 height=10 rx=3`, `rect x=12 y=11 width=6 height=10 rx=3`, `rect x=20 y=11 width=10 height=10 rx=3`. Strokes 2 px `ink` with no fill for the first two; the third has `primary` fill and the same `ink` stroke.
- Wordmark: "NLP" in Titillium Web 700, "Notes" in Titillium Web 600, both `ink` (not `muted`).
- Favicon: the mark on a `canvas-mint` rounded tile (SVG favicon plus PNG fallback).
- PWA icons: 192 and 512 px with `canvas-mint` background, plus a maskable variant with the mark inside the safe zone (80%).
- Theme color: `canvas`. Background color in manifest: `canvas-mint`.
- Never use the design source's company name, logo or imagery, the Anthropic mark, or the word "Claude" in the wordmark.

## 12. Accessibility pairings (checked in Phase 6)

| Foreground / background | Contrast | Allowed for |
|---|---|---|
| `ink` / `canvas` | 21:1 | everything |
| `ink` / `canvas-mint` | about 20:1 | question headers, Ans strip, hero |
| `ink` / `primary` | about 14:1 | text on mint pills, badges, the complete-ring check |
| `on-dark` / `ink` | 21:1 | black pills, toggle, back-to-top, toast |
| `primary` / `ink` | about 14:1 | switch knob, accents on black |
| `primary` / `canvas` | about 1.5:1 | **decoration only, always beside an `ink` outline or other cue** (progress line, rail bar, underline) |
| `muted` / `canvas` | about 3.2:1 | **no text**; decorative strokes only |

Other rules: every icon-only control has an accessible name; the rail is a `nav` landmark with a tree of buttons; the drawer is a modal dialog while open; the progress line, rings and chip graphic are `aria-hidden`.

## 13. Definition of done for any component

1. Matches this spec and the tokens in `DESIGN-jobright.md`.
2. Works at 360, 390, 768, 1024, 1440 widths and phone landscape.
3. Keyboard operable, correct focus order, visible focus.
4. Respects `prefers-reduced-motion` (section 9 rules).
5. No overlap, no horizontal page scroll, no clipped math, Thai tone marks not clipped.
6. Passes the pairings in section 12.
7. Covered by the checks in `TESTING.md`.
