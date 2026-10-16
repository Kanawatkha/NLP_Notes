# CONTENT-SCHEMA

Rules for turning `content/midterm/exam_practice.md` into typed data. This is the contract between the content author and `scripts/build-content`. It is adapted from the 1322201 schema: same constructs and checks, but a declared list of page files (one today), heading levels 1 to 4, and different tree rules. Based on a scan of the current file (1,118 lines, about 68 KB).

## 1. Source file

| File | Used by |
|---|---|
| `content/midterm/exam_practice.md` | the Midterm page (`#/midterm`) |

`content/midterm/` also contains study notes (`01_Intro_and_Tokenization.md`, `02_...`, `03_...`, `04_...`, `exam_guidelines.md`). They use other heading shapes, are **not** pages, and are never read by the build.

Pages are declared in `src/config/site.ts`:

```ts
export const PAGES = [
  { id: 'midterm', route: '/midterm', tab: 'Midterm', source: 'content/midterm/exam_practice.md' },
] as const;
```

The pipeline reads exactly the `source` of each declared page. It never scans folders. A future page (for example `final`) is one more entry.

Current shape of the file (use these numbers as the Phase 2 snapshot):

| Item | Count |
|---|---|
| `#` title | 1 |
| `##` questions | 4 (ข้อ 2 to ข้อ 5) |
| `###` headings | 17 (5 leaf items in ข้อ 2, 12 groups in ข้อ 3 to 5) |
| `####` headings | 30 (all inside groups) |
| Sol markers / Ans markers | 35 / 35 |
| Tables | 39 |
| SVG figures | 1 (the parse tree in 4.1.1) |
| Ordered lists | 1 (BPE training steps, in 2.5) |
| Bullet lists, blockquotes, fenced code | 0 (still supported) |

## 2. Constructs the parser must support

| Construct | Markdown form | Notes |
|---|---|---|
| Title | `# Title` (one per file) | First line |
| Question | `## ข้อ N <title> (P คะแนน)` | Points in a trailing parenthesis |
| Group or item | `### ...` | Group when it has `####` children, otherwise an item |
| Item inside a group | `#### ...` | **New in this project**; only allowed under a `###` |
| Paragraph | plain lines | Thai text with inline math, bold and code |
| Inline math | `$...$` | KaTeX |
| Display math | `$$ ... $$` (multi-line) | `aligned`, `array`, etc. |
| Bold / emphasis | `**...**` | Definition lead-ins such as `**Word Segmentation**` |
| Inline code | `` `...` `` | Used for the given strings, e.g. `new renew new renew set reset` |
| Unordered / ordered list | `- item`, `1. item` | Items may contain indented child blocks |
| Pipe table | `\| a \| b \|` with alignment row | Cells may contain `$...$`; never a `\|` inside a formula in a cell (use `\mid`) |
| Blockquote | `> text` | Render as a note callout |
| Horizontal rule | `---` | Item separator; ignored for structure |
| Figure | `<div align="center">` + `<svg>...</svg>` + `</div>` | Kept verbatim, see section 6 |
| HTML entities | `&#35; &#36; &#92; &#96; &amp; &lt; &gt;` | Decoded in table cells |
| Line break | trailing double space or `<br>` | Preserve |
| Escapes | `\*`, `\_`, `\|` | Un-escape in output text |

Anything else is a **parse error**, not silently dropped. Extend the parser and this table instead of changing the content. Heading levels 5 and above, a second `#`, and a `####` that is not under a `###` are errors.

## 3. Output data model (TypeScript)

Defined in `src/content/types.ts` and shared with the scripts. `Inline` and `Block` are the same as in 1322201.

```ts
type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'em'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'math'; tex: string; html: string }          // inline, KaTeX pre-rendered
  | { t: 'br' };

type Block =
  | { t: 'p'; c: Inline[] }
  | { t: 'math'; tex: string; html: string }          // display
  | { t: 'list'; ordered: boolean; items: { c: Inline[]; children: Block[] }[] }
  | { t: 'table'; align: ('n' | 'l' | 'c' | 'r')[]; head: Inline[][]; rows: Inline[][][] }
  | { t: 'figure'; svg: string; title?: string }      // validated SVG markup
  | { t: 'note'; c: Block[] }                          // blockquote
  | { t: 'example'; id: string; problem: Block[]; sol: Block[]; ans: Block[] };

type ContentNode = {
  id: string;             // stable, e.g. "q3", "g3.2", "i3.2.2"
  kind: 'root' | 'question' | 'group' | 'item';
  level: 1 | 2 | 3 | 4;
  number?: string;        // "3", "3.2", "3.2.2" (question: the N of "ข้อ N"); absent on the root
  title: Inline[];        // the full heading, used for the round trip
  displayTitle: Inline[]; // title without a trailing "(P คะแนน)" (questions only; equals title otherwise)
  points?: number;        // questions only, parsed from the trailing parenthesis
  explain: Block[];       // definition and shared statement, never the worked example
  examples: Block[];      // items only: exactly one `example` block
  children: ContentNode[];
  source: { file: string; line: number };
};

type ContentFile = { id: string; title: Inline[]; root: ContentNode };   // id = page id from PAGES, root = the `#` node
```

The root (`#`) node holds the file title in `title`, no `number`, and the four questions as `children`.

Every `html` string is produced by `katex.renderToString(tex, { displayMode, throwOnError: true, strict: 'error', output: 'htmlAndMathml' })`. A failure fails the build.

## 4. Example detection

An **example** is a run of blocks that starts at a problem statement and contains the marker line `$\mathbf{Sol}^{n}$`. Same rule as 1322201:

- Marker: a paragraph whose entire text is `$\mathbf{Sol}^{n}$`.
- `problem` = blocks between the heading (or the group definition) and the marker.
- `sol` = blocks after the marker up to the answer line or the next heading.
- `ans` = the paragraph beginning with `$\mathbf{Ans}` plus following lines of the same paragraph. `ans` may be empty (the current file always has one).
- Each item holds **exactly one** example. Zero examples makes a definition card (the item is shown as plain content), which is fine when no item of the question has a Sol and gives a warning when its sibling items do; more than one is an error, so the card model stays valid. Split such an item into two headings.

## 5. Node tree rules

1. The file's `#` title is the root.
2. Each `##` is a **question** (`kind: 'question'`, id `q<N>`). The number comes from `ข้อ N`; points from the trailing `(P คะแนน)`; `displayTitle` drops that parenthesis. Paragraphs directly under it (before the first `###`) are `explain`: the definition and the statement shared by the sub-questions (for example the given string of ข้อ 2).
3. Each `###` is a **group** (`kind: 'group'`, id `g<number>`) if it has at least one `####` child, otherwise an **item** (`kind: 'item'`, id `i<number>`). Text under a group before its first `####` is the group's `explain` (the definition).
4. Each `####` is an **item** (id `i<number>`) and a child of its group. A `####` anywhere else is an error.
5. An item's content splits into `explain` (rare: text before the problem that is not part of it, normally empty) and `examples` (the single `example` block).
6. Numbers come from the heading text: `### 2.1  Token และ Type` gives `2.1`; `#### 3.2.2  Viterbi Algorithm` gives `3.2.2`. A numbered heading whose number does not start with its parent's number (a `####` `3.2.x` under `### 3.1`) is an error. A heading without a number gets a positional id (`h3-2.h4-1`) and a warning.
7. Order is source order. Ids are stable while the numbers are stable, so anchors and tests do not change when wording changes.

Resulting counts for the current file: 4 questions, 12 groups, 35 items (5 directly under ข้อ 2 plus 30 inside groups).

Cross references such as "ข้อ 2.2" in the text must resolve to an existing number (checked mechanically, section 9).

## 6. Figures (SVG)

- Source form: `<div align="center">` containing one `<svg ...>...</svg>`, no blank lines inside.
- The pipeline extracts the `<svg>` element as a string, validates it, and stores a `figure` block.
- At render time the SVG is inlined with `dangerouslySetInnerHTML`. It is trusted build output.
- Validation (build error on failure): no blank line inside the element, well-formed XML, root has `viewBox`, no `<script>`, no event-handler attributes, no external `href`, strokes and text use `currentColor`.
- The `<div align="center">` wrapper is dropped. Centering is done by CSS.
- The figure gets an accessible name from the heading it sits under (`aria-label`), unless a `title` is present.

## 7. Math

- Inline and display math are extracted before Markdown inline parsing so `_`, `*`, `|` inside formulas are not misread.
- Thai text inside math must use `\text{...}` or `\textbf{...}` (never `\mathbf{ไทย}`: KaTeX strict mode warns `unicodeTextInMathMode`).
- Currency-style `$` is not used. If a lone `$` is ever needed, escape it as `\$`.
- Table cells may contain `$...$`. The pipe `|` is never used inside formulas in cells; use `\mid`.
- KaTeX strict mode is on with no exceptions (`strict: 'error'`). The current file compiles with 0 errors (567 expressions including the 35 Sol markers, KaTeX 0.19).

## 8. Generated output

```
src/content/generated/
  midterm.json           # ContentFile, one file per page id (the big one)
  midterm.meta.json      # PageMeta: id, title, the numbers of the hero, first question id (about 300 bytes)
  report.txt             # counts and warnings
```

Git-ignored. Regenerate with `npm run content`. The report lists node counts per kind, example, figure and table counts, total points, formula count, and warnings. Counts are committed as a test snapshot (`TESTING.md` section 2).

## 9. Build-time checks (all fail the build)

1. Every declared file parses; unknown constructs are errors; heading levels 1 to 4 only; `####` only under `###`.
2. Every formula compiles in KaTeX strict mode.
3. Every SVG passes the rules in section 6.
4. Every node id is unique.
5. Round trip: converting data back to normalized text equals the normalized Markdown text (see `TESTING.md`). The Sol/Ans marker lines and the `---` rules are accounted for explicitly.
6. Every item has at most one example; every group has at least one item.
7. Every in-text reference such as "ข้อ 2.2" points to an existing node number.
8. Points: every `##` that has "(P คะแนน)" yields a number; the total is printed in the report.

## 10. Author rules (what to keep doing in the Markdown)

- Headings: `## ข้อ N <title> (P คะแนน)`, `### N.M  <title>`, `#### N.M.K  <title>` (two spaces after the number, as in the current file).
- One problem per heading: problem statement, then `$\mathbf{Sol}^{n}$`, the steps, then `$\mathbf{Ans}\quad ...$`.
- Definitions are short paragraphs directly under the `##` or `###` heading, before the first child heading.
- Separate items with `---`.
- Figures: SVG inside `<div align="center">`, no blank lines inside, `currentColor`.
- Never add separate image files or an `images/` folder.
- Do not renumber headings without updating references.

## 11. Implementation notes (Phase 2, done)

- Code: `scripts/build-content/` with `parse.ts` (blocks and inline), `tree.ts` (heading tree and the rules of section 5), `math.ts`, `svg.ts`, `project.ts` (round-trip oracle), `report.ts`, `index.ts` (`buildContent(root, pages)`, `writeOutput`) and `run.ts` (CLI used by `npm run content`). TypeScript runs directly on Node 24 (type stripping), so imports inside `scripts/` use `.ts` extensions.
- Changes versus the 1322201 pipeline: heading level 4 allowed in `parse.ts`, and `buildRaw` requires every heading to sit directly under the level above it; new tree rules; no collections or manifest (`PAGES` drives the build); `points` and `displayTitle`; checks for ids, groups, Sol placement and "ข้อ N.M" references in `index.ts`; the KaTeX exception for Thai inside `	ext` was dropped, so strict mode has no exceptions.
- An item may leave out its own problem text when its question or group holds a shared statement (the given string of ข้อ 2). Only when nothing above it has text does the build warn "no problem text before Sol".
- Math is pre-rendered with `output: 'htmlAndMathml'`. Measured for the current file: 1021.9 KB raw, 63.3 KB gzip, well inside the 200 KB budget in `TESTING.md` section 7.
- Warnings are printed in `generated/report.txt` and counted by `npm run content`. The current content produces none.
