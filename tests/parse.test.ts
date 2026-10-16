import { describe, expect, it } from 'vitest';
import type { Block, ContentFile } from '../src/content/types';
import { parseDocument } from '../scripts/build-content/parse';
import { buildContentFile, buildRaw, inlineText, splitPoints } from '../scripts/build-content/tree';

const blocksOf = (md: string): Block[] =>
  parseDocument(md, 'fixture.md').flatMap((t) => (t.k === 'block' ? [t.block] : []));

const SOL = '$\\mathbf{Sol}^{n}$';
const ANS = '$\\mathbf{Ans}\\quad 1$';

describe('block parser', () => {
  it('parses inline math, bold, code, entities and escapes', () => {
    const [p] = blocksOf('**สูตร** ค่า $x<b$ และ `new set` กับ &#36; กับ \\* ดาว');
    expect(p.t).toBe('p');
    if (p.t !== 'p') return;
    expect(p.c[0]).toMatchObject({ t: 'strong' });
    expect(p.c.some((i) => i.t === 'math' && i.tex === 'x<b')).toBe(true);
    expect(p.c.some((i) => i.t === 'code' && i.v === 'new set')).toBe(true);
    expect(inlineText(p.c)).toContain('$ กับ * ดาว');
  });

  it('parses one-line and multi-line display math', () => {
    const blocks = blocksOf('$$a+b$$\n\n$$\n\\begin{aligned}\n1\n\\end{aligned}\n$$');
    expect(blocks.map((b) => b.t)).toEqual(['math', 'math']);
  });

  it('parses an ordered list', () => {
    const [list] = blocksOf('1. ก\n2. ข\n3. ค');
    expect(list).toMatchObject({ t: 'list', ordered: true });
    if (list.t === 'list') expect(list.items).toHaveLength(3);
  });

  it('parses tables with alignment, math, entities and escaped pipes', () => {
    const [table] = blocksOf('| a | b |\n|:---:|---|\n| $x_1$ &lt; | \\| |');
    expect(table).toMatchObject({ t: 'table', align: ['c', 'n'] });
    if (table.t !== 'table') return;
    expect(table.rows[0][0].some((i) => i.t === 'math')).toBe(true);
    expect(inlineText(table.rows[0][1])).toBe('|');
  });

  it('skips horizontal rules and parses blockquotes', () => {
    const blocks = blocksOf('---\n\n> หมายเหตุ **x**\n\n---');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].t).toBe('note');
  });

  it('parses a figure and rejects a blank line inside the svg', () => {
    const ok = '<div align="center">\n<svg viewBox="0 0 1 1"><g><line x1="0"/></g></svg>\n</div>';
    expect(blocksOf(ok)[0].t).toBe('figure');
    const bad = '<div align="center">\n<svg viewBox="0 0 1 1">\n\n</svg>\n</div>';
    expect(() => blocksOf(bad)).toThrow(/blank line/);
  });

  it('rejects an svg without viewBox, with a script, or not well formed', () => {
    const wrap = (svg: string) => `<div align="center">\n${svg}\n</div>`;
    expect(() => blocksOf(wrap('<svg><g/></svg>'))).toThrow(/viewBox/);
    expect(() => blocksOf(wrap('<svg viewBox="0 0 1 1"><script></script></svg>'))).toThrow(
      /script/,
    );
    expect(() => blocksOf(wrap('<svg viewBox="0 0 1 1"><g></svg>'))).toThrow(/well formed/);
  });

  it('fails loudly on unknown constructs and on KaTeX errors', () => {
    expect(() => blocksOf('ข้อความ $ไม่ปิด')).toThrow(/unmatched/);
    expect(() => blocksOf('<span>x</span>')).toThrow(/unsupported HTML/);
    expect(() => blocksOf('$$\\frac{$$')).toThrow();
    expect(() => blocksOf('$\\mathbf{ไทย}$')).toThrow();
  });
});

describe('heading levels', () => {
  const headings = (md: string) => parseDocument(md, 'fixture.md').filter((t) => t.k === 'heading');

  it('accepts levels 1 to 4', () => {
    expect(headings('# a\n## b\n### c\n#### d').map((t) => t.k === 'heading' && t.level)).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it('rejects level 5 and above', () => {
    expect(() => parseDocument('##### e', 'fixture.md')).toThrow(/heading level 5/);
  });
});

describe('points in question headings', () => {
  it('splits a trailing "(P คะแนน)" off the title', () => {
    const [h] = parseDocument('## ข้อ 2 Tokenization (2 คะแนน)', 'fixture.md');
    if (h.k !== 'heading') throw new Error('expected a heading');
    const { displayTitle, points } = splitPoints(h.title);
    expect(points).toBe(2);
    expect(inlineText(displayTitle)).toBe('ข้อ 2 Tokenization');
  });

  it('leaves a title without points unchanged', () => {
    const [h] = parseDocument('## ข้อ 2 Tokenization', 'fixture.md');
    if (h.k !== 'heading') throw new Error('expected a heading');
    expect(splitPoints(h.title)).toEqual({ displayTitle: h.title });
  });
});

describe('tree rules', () => {
  const build = (md: string): { file: ContentFile; warnings: string[] } => {
    const warnings: string[] = [];
    const raw = buildRaw(parseDocument(md, 'fixture.md'), 'fixture.md');
    const file = buildContentFile(raw, { id: 'fixture', file: 'fixture.md' }, (m) =>
      warnings.push(m),
    );
    return { file, warnings };
  };

  const full = [
    '# ชื่อไฟล์',
    '',
    '## ข้อ 2 หัวข้อ (2 คะแนน)',
    '',
    'นิยามของข้อ 2',
    '',
    '### 2.1  รายการตรง',
    '',
    'โจทย์',
    '',
    SOL,
    '',
    'วิธีทำ',
    '',
    ANS,
    '',
    '---',
    '',
    '## ข้อ 3 อีกหัวข้อ (10 คะแนน)',
    '',
    '### 3.1  กลุ่ม',
    '',
    'นิยามของกลุ่ม',
    '',
    '#### 3.1.1  รายการในกลุ่ม',
    '',
    'โจทย์',
    '',
    SOL,
    '',
    'วิธีทำ',
    '',
    ANS,
    '',
  ].join('\n');

  it('builds questions, groups and items with stable ids, numbers and points', () => {
    const { file, warnings } = build(full);
    expect(warnings).toEqual([]);
    const [q2, q3] = file.root.children;
    expect(q2).toMatchObject({ kind: 'question', id: 'q2', number: '2', points: 2, level: 2 });
    expect(inlineText(q2.displayTitle)).toBe('ข้อ 2 หัวข้อ');
    expect(inlineText(q2.title)).toContain('(2 คะแนน)');
    expect(q2.explain).toHaveLength(1);
    expect(q2.children[0]).toMatchObject({ kind: 'item', id: 'i2.1', level: 3, number: '2.1' });
    expect(q3).toMatchObject({ kind: 'question', id: 'q3', points: 10 });
    const group = q3.children[0];
    expect(group).toMatchObject({ kind: 'group', id: 'g3.1', level: 3 });
    expect(group.explain).toHaveLength(1);
    expect(group.children[0]).toMatchObject({ kind: 'item', id: 'i3.1.1', level: 4 });
  });

  it('turns an item into one example with problem, solution and answer', () => {
    const { file } = build(full);
    const item = file.root.children[0].children[0];
    expect(item.explain).toEqual([]);
    expect(item.examples).toHaveLength(1);
    const ex = item.examples[0];
    expect(ex.t).toBe('example');
    if (ex.t !== 'example') return;
    expect([ex.problem.length, ex.sol.length, ex.ans.length]).toEqual([1, 1, 1]);
  });

  it('lets an item without a Sol marker through with a warning', () => {
    const { file, warnings } = build('# T\n\n## ข้อ 2 ก\n\n### 2.1  ข\n\nข้อความธรรมดา\n');
    expect(file.root.children[0].children[0].examples).toEqual([]);
    expect(warnings.join('\n')).toMatch(/no Sol marker/);
  });

  it('does not warn about a missing problem when the question holds a shared statement', () => {
    const md = (statement: string) =>
      `# T\n\n## ข้อ 2 ก\n\n${statement}### 2.1  ข\n\n${SOL}\n\nวิธีทำ\n`;
    expect(build(md('กำหนดข้อความ x\n\n')).warnings).toEqual([]);
    expect(build(md('')).warnings.join('\n')).toMatch(/no problem text/);
  });

  it('uses a positional id and warns when a heading has no number', () => {
    const { file, warnings } = build(
      '# T\n\n## ข้อ 2 ก\n\n### ไม่มีเลข\n\nโจทย์\n\n' + SOL + '\n\nx\n',
    );
    expect(file.root.children[0].children[0].id).toBe('ih3-1-1');
    expect(warnings.join('\n')).toMatch(/no number/);
  });

  it('rejects a #### that is not under a ###', () => {
    expect(() => build('# T\n\n## ข้อ 2 ก\n\n#### 2.1.1  ข\n')).toThrow(/must sit directly under/);
  });

  it('rejects two Sol markers in one item', () => {
    const md = `# T\n\n## ข้อ 2 ก\n\n### 2.1  ข\n\nโจทย์\n\n${SOL}\n\nx\n\n${SOL}\n\ny\n`;
    expect(() => build(md)).toThrow(/2 Sol markers/);
  });

  it('rejects a Sol marker outside an item', () => {
    expect(() => build(`# T\n\n## ข้อ 2 ก\n\n${SOL}\n\n### 2.1  ข\n\nx\n`)).toThrow(
      /only allowed inside an item/,
    );
    expect(() =>
      build(`# T\n\n## ข้อ 2 ก\n\n### 2.1  ข\n\nนิยาม\n\n${SOL}\n\n#### 2.1.1  ค\n\nx\n`),
    ).toThrow(/only allowed inside an item/);
  });

  it('rejects a number that does not belong under its parent', () => {
    expect(() => build('# T\n\n## ข้อ 3 ก\n\n### 2.1  ข\n\nx\n')).toThrow(
      /does not belong under 3/,
    );
    expect(() => build('# T\n\n## ข้อ 3 ก\n\n### 3.1  ข\n\nนิยาม\n\n#### 3.2.1  ค\n\nx\n')).toThrow(
      /does not belong under 3.1/,
    );
  });

  it('rejects a question without sub-headings and a second level-1 heading', () => {
    expect(() => build('# T\n\n## ข้อ 2 ก\n\nข้อความ\n')).toThrow(/no sub-headings/);
    expect(() => build('# T\n\n## ข้อ 2 ก\n\n### 2.1  ข\n\nx\n\n# U\n')).toThrow(
      /exactly one level-1/,
    );
  });
});
