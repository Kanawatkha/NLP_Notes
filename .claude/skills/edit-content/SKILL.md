---
name: edit-content
description: Add or change study content in content/midterm/exam_practice.md for the NLP Notes site. Use whenever you write, edit, move or review questions, definitions, worked solutions, tables or the SVG figure in that file, or when the content-to-data pipeline reports a parse error.
---

# edit-content

Content is the only thing authors edit. The site is generated from it. Read `CONTENT-SCHEMA.md` for the full parser contract; this file is the working checklist.

## Where things live

- `content/midterm/exam_practice.md`: the only rendered content file. It feeds the Midterm page.
- `content/midterm/` also holds the study notes (`01..04_*.md`, `exam_guidelines.md`). They are references for authoring, are not rendered, and are never read by the build (pages are declared in `src/config/site.ts`). Lecture slides and labs never go into the repo.
- There is one copy of each file; nothing is mirrored elsewhere.

## Workflow

1. Decide where the change belongs: a new problem goes under the matching group (`###`) as a `####`, or directly under a question (`##`) as a `###` item if the question has no groups (as ข้อ 2 does).
2. Write it using the shapes below.
3. Verify every number with the `verify-math` skill before saving.
4. Run `npm run content` (once the pipeline exists). Fix any parse error by correcting the Markdown, or extend the parser only if the construct is legitimate (ask the user first).
5. Do not renumber headings without updating every cross reference ("ข้อ 2.2").

## Shapes

### Structure

```
# <file title>                                   one per file
## ข้อ N <title> (P คะแนน)                       question
<definition paragraph>                            short, no worked example inside
<statement shared by the sub-questions>           optional, e.g. the given string of ข้อ 2
### N.M  <title>                                 group (has #### children) or item (leaf)
<definition paragraph>                            groups only
#### N.M.K  <title>                              item inside a group
<problem statement>
$\mathbf{Sol}^{n}$
<steps: tables, display math, short sentences>
$\mathbf{Ans}\quad ...$
---                                               between items
```

- Two spaces after the number in `###` and `####` headings, as in the current file.
- One example (one Sol) per item. Split an item that needs two.
- Heading levels 1 to 4 only. A `####` must sit under a `###`. No `#####`.
- The question's points are written in the heading as `(P คะแนน)`.

### Definitions

- Short, plain, one paragraph (two or three sentences), no examples inside, no "เช่น". Bold the term being defined (`**Word Segmentation** คือ ...`).

### Solutions

- Say what the method does in one line (`วิธีทำ ...`), then show the steps as a table or aligned equations, one line per step. Name the rule or formula used in a short note.
- Final line `$\mathbf{Ans}\quad ...$` with the key results in `\mathbf{...}`.
- Use `\text{...}` / `\textbf{...}` for Thai inside math. Pipes inside table-cell formulas are written `\mid`.

### Figures (SVG)

- The parse tree and any diagram are inline `<svg>` inside `<div align="center">`.
- Use `currentColor` for strokes and text.
- **No blank lines anywhere inside `<svg>` or the wrapping HTML.** A blank line breaks Markdown rendering.
- Never create separate image files or an `images/` folder.

### Language

- Content is Thai with English technical terms (use the slide's English wording where it exists, e.g. "Word-based Tokenization"). Write concisely, no emoji.

## Pitfalls

- A `Sol` without an `Ans` is valid but unusual here; every current item has both.
- Do not use a lone `$` for anything but math.
- A problem without `Sol` is a plain block and triggers a warning.
- Keep the same numbering style in the file; do not mix `2.1` and `ข้อ 2.1`.
- Lecture slides sometimes contain inconsistent numbers. Use the computed value and note the difference for the user instead of copying the slide.
