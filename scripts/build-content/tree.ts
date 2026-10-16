import type { Block, ContentFile, ContentNode, Inline } from '../../src/content/types.ts';
import type { Token } from './parse.ts';

/* ---------- helpers ---------- */

export function inlineText(c: Inline[]): string {
  return c
    .map((i) => {
      if (i.t === 'text' || i.t === 'code') return i.v;
      if (i.t === 'strong') return inlineText(i.c);
      return `$${i.tex}$`;
    })
    .join('');
}

/** All visible text of a block, used by the reference check. */
export function blockText(b: Block): string {
  switch (b.t) {
    case 'p':
      return inlineText(b.c);
    case 'math':
      return '';
    case 'list':
      return b.items
        .map((it) => `${inlineText(it.c)} ${it.children.map(blockText).join(' ')}`)
        .join(' ');
    case 'table':
      return [b.head, ...b.rows].map((row) => row.map(inlineText).join(' ')).join(' ');
    case 'figure':
      return '';
    case 'note':
      return b.c.map(blockText).join(' ');
    case 'example':
      return [...b.problem, ...b.sol, ...b.ans].map(blockText).join(' ');
  }
}

const SOL_TEX = '\\mathbf{Sol}^{n}';

export function isSol(b: Block): boolean {
  return b.t === 'p' && b.c.length === 1 && b.c[0].t === 'math' && b.c[0].tex.trim() === SOL_TEX;
}

export function isAns(b: Block): boolean {
  return b.t === 'p' && b.c[0]?.t === 'math' && b.c[0].tex.trim().startsWith('\\mathbf{Ans}');
}

export function walkBlocks(blocks: Block[], fn: (b: Block) => void): void {
  for (const b of blocks) {
    fn(b);
    if (b.t === 'list') for (const it of b.items) walkBlocks(it.children, fn);
    if (b.t === 'note') walkBlocks(b.c, fn);
    if (b.t === 'example') {
      walkBlocks(b.problem, fn);
      walkBlocks(b.sol, fn);
      walkBlocks(b.ans, fn);
    }
  }
}

export function walkNodes(node: ContentNode, fn: (n: ContentNode) => void): void {
  fn(node);
  for (const c of node.children) walkNodes(c, fn);
}

/* ---------- raw heading tree ---------- */

export type Raw = {
  level: number;
  title: Inline[];
  line: number;
  blocks: Block[];
  children: Raw[];
};

/**
 * Builds the heading tree. Exactly one level-1 heading, levels 1 to 4, and a child is always one
 * level below its parent (a `####` directly under a `##` is an error).
 */
export function buildRaw(tokens: Token[], file: string): Raw {
  const root: Raw = { level: 0, title: [], line: 0, blocks: [], children: [] };
  const stack: Raw[] = [root];
  for (const t of tokens) {
    if (t.k === 'heading') {
      const node: Raw = { level: t.level, title: t.title, line: t.line, blocks: [], children: [] };
      while (stack[stack.length - 1].level >= t.level) stack.pop();
      const parent = stack[stack.length - 1];
      if (t.level !== parent.level + 1) {
        throw new Error(
          `${file}:${t.line}: heading level ${t.level} must sit directly under a level ${t.level - 1} heading`,
        );
      }
      parent.children.push(node);
      stack.push(node);
    } else {
      stack[stack.length - 1].blocks.push(t.block);
    }
  }
  if (root.blocks.length > 0) throw new Error(`${file}: content before the first heading`);
  if (root.children.length !== 1 || root.children[0].level !== 1) {
    throw new Error(`${file}: expected exactly one level-1 heading`);
  }
  return root.children[0];
}

/* ---------- node construction (CONTENT-SCHEMA.md section 5) ---------- */

type Ctx = { file: string; warn: (m: string) => void };

const QUESTION_RE = /^ข้อ\s*(\d+)(?!\.\d)/;
const NUMBER_RE = /^(\d+(?:\.\d+)+)\.?(?:\s|$)/;
const POINTS_RE = /\s*\(\s*(\d+)\s*คะแนน\s*\)\s*$/;

function questionNumber(title: Inline[]): string | undefined {
  return QUESTION_RE.exec(inlineText(title).trim())?.[1];
}

function dottedNumber(title: Inline[]): string | undefined {
  return NUMBER_RE.exec(inlineText(title).trim())?.[1];
}

/** Splits a trailing "(P คะแนน)" off the heading. */
export function splitPoints(title: Inline[]): { displayTitle: Inline[]; points?: number } {
  const last = title[title.length - 1];
  if (!last || last.t !== 'text') return { displayTitle: title };
  const m = POINTS_RE.exec(last.v);
  if (!m) return { displayTitle: title };
  const rest = last.v.slice(0, m.index);
  const head = title.slice(0, -1);
  return {
    displayTitle: rest ? [...head, { t: 'text', v: rest }] : head,
    points: Number(m[1]),
  };
}

/** Splits an item's blocks into the worked example (problem, Sol marker, steps, Ans). */
function splitItem(
  blocks: Block[],
  id: string,
  where: string,
  warn: (m: string) => void,
  inheritsStatement: boolean,
): { explain: Block[]; examples: Block[] } {
  const marks = blocks.flatMap((b, i) => (isSol(b) ? [i] : []));
  if (marks.length === 0) {
    warn(`${where}: item has no Sol marker; it is shown as plain content`);
    return { explain: blocks, examples: [] };
  }
  if (marks.length > 1) {
    throw new Error(
      `${where}: item has ${marks.length} Sol markers; split it into separate headings`,
    );
  }
  const problem = blocks.slice(0, marks[0]);
  const rest = blocks.slice(marks[0] + 1);
  const ansAt = rest.findIndex(isAns);
  const sol = ansAt < 0 ? rest : rest.slice(0, ansAt);
  const ans = ansAt < 0 ? [] : rest.slice(ansAt);
  // an item may rely on a statement shared by its question or group (the given string of ข้อ 2)
  if (problem.length === 0 && !inheritsStatement) {
    warn(`${where}: item has no problem text before Sol`);
  }
  return { explain: [], examples: [{ t: 'example', id: `${id}/e1`, problem, sol, ans }] };
}

function checkNoSol(blocks: Block[], where: string): void {
  if (blocks.some(isSol)) {
    throw new Error(`${where}: a Sol marker is only allowed inside an item (### or #### heading)`);
  }
}

function mustStartWith(number: string, parent: string, where: string): void {
  if (parent && !number.startsWith(`${parent}.`)) {
    throw new Error(`${where}: number ${number} does not belong under ${parent}`);
  }
}

function buildItem(
  raw: Raw,
  ctx: Ctx,
  key: string,
  level: 3 | 4,
  inheritsStatement: boolean,
  number?: string,
): ContentNode {
  const id = number ? `i${number}` : `i${key}`;
  const where = `${ctx.file}:${raw.line}`;
  const { explain, examples } = splitItem(raw.blocks, id, where, ctx.warn, inheritsStatement);
  return {
    id,
    kind: 'item',
    level,
    ...(number ? { number } : {}),
    title: raw.title,
    displayTitle: raw.title,
    explain,
    examples,
    children: [],
    source: { file: ctx.file, line: raw.line },
  };
}

function buildGroup(
  raw: Raw,
  ctx: Ctx,
  qi: number,
  gi: number,
  parent: string,
  questionHasText: boolean,
): ContentNode {
  const where = `${ctx.file}:${raw.line}`;
  const number = dottedNumber(raw.title);
  if (number) mustStartWith(number, parent, where);
  else ctx.warn(`${where}: group heading has no number; using a positional id`);
  checkNoSol(raw.blocks, where);
  const key = `h3-${qi}-${gi}`;
  return {
    id: number ? `g${number}` : key,
    kind: 'group',
    level: 3,
    ...(number ? { number } : {}),
    title: raw.title,
    displayTitle: raw.title,
    explain: raw.blocks,
    examples: [],
    children: raw.children.map((c, ii) => {
      const cw = `${ctx.file}:${c.line}`;
      const n = dottedNumber(c.title);
      if (n) mustStartWith(n, number ?? parent, cw);
      else ctx.warn(`${cw}: item heading has no number; using a positional id`);
      return buildItem(
        c,
        ctx,
        `h4-${qi}-${gi}-${ii + 1}`,
        4,
        questionHasText || raw.blocks.length > 0,
        n,
      );
    }),
    source: { file: ctx.file, line: raw.line },
  };
}

const NO_SOL_WARNING = 'item has no Sol marker';

function hasExample(node: ContentNode): boolean {
  return node.examples.length > 0 || node.children.some(hasExample);
}

function buildQuestion(outer: Ctx, raw: Raw, qi: number): ContentNode {
  // An item without Sol is a definition card. That is normal when the whole question is made of
  // them (a question of definitions), and a mistake when its sibling items do have a Sol, so the
  // warning is only passed on in the second case.
  const held: string[] = [];
  const ctx: Ctx = {
    file: outer.file,
    warn: (m) => (m.includes(NO_SOL_WARNING) ? held.push(m) : outer.warn(m)),
  };
  const where = `${ctx.file}:${raw.line}`;
  const number = questionNumber(raw.title);
  if (!number)
    ctx.warn(`${where}: question heading does not start with "ข้อ N"; using a positional id`);
  if (raw.children.length === 0) throw new Error(`${where}: question has no sub-headings`);
  checkNoSol(raw.blocks, where);
  const { displayTitle, points } = splitPoints(raw.title);
  const parent = number ?? '';
  const children = raw.children.map((c, ci) => {
    const cw = `${ctx.file}:${c.line}`;
    if (c.children.length > 0) return buildGroup(c, ctx, qi, ci + 1, parent, raw.blocks.length > 0);
    const n = dottedNumber(c.title);
    if (n) mustStartWith(n, parent, cw);
    else ctx.warn(`${cw}: item heading has no number; using a positional id`);
    return buildItem(c, ctx, `h3-${qi}-${ci + 1}`, 3, raw.blocks.length > 0, n);
  });
  if (children.some(hasExample)) held.forEach((m) => outer.warn(m));
  return {
    id: number ? `q${number}` : `h2-${qi}`,
    kind: 'question',
    level: 2,
    ...(number ? { number } : {}),
    title: raw.title,
    displayTitle,
    ...(points !== undefined ? { points } : {}),
    explain: raw.blocks,
    examples: [],
    children,
    source: { file: ctx.file, line: raw.line },
  };
}

export function buildContentFile(
  raw: Raw,
  meta: { id: string; file: string },
  warn: (m: string) => void,
): ContentFile {
  const ctx: Ctx = { file: meta.file, warn };
  checkNoSol(raw.blocks, `${meta.file}:${raw.line}`);
  const root: ContentNode = {
    id: 'root',
    kind: 'root',
    level: 1,
    title: raw.title,
    displayTitle: raw.title,
    explain: raw.blocks,
    examples: [],
    children: raw.children.map((c, qi) => buildQuestion(ctx, c, qi + 1)),
    source: { file: meta.file, line: raw.line },
  };
  return { id: meta.id, title: raw.title, root };
}
