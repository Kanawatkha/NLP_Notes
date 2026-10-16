// @vitest-environment node
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { afterAll, describe, expect, it } from 'vitest';
import { PAGES } from '../src/config/site';
import { buildContent } from '../scripts/build-content/index';
import { walkNodes } from '../scripts/build-content/tree';

const root = process.cwd();
const result = buildContent(root, PAGES);
const page = result.pages[0];

describe('real content (content/midterm/exam_practice.md)', () => {
  it('converts with no errors (parse, KaTeX strict, SVG rules, round trip, tree checks)', () => {
    expect(result.errors).toEqual([]);
    expect(result.pages).toHaveLength(PAGES.length);
  });

  it('produces no warnings', () => {
    expect(result.warnings).toEqual([]);
  });

  it('has the structure the page is designed for', () => {
    const { questions, groups, items, examples } = page.stats;
    expect({ questions, groups, items, examples }).toEqual({
      questions: 5,
      groups: 12,
      items: 41,
      examples: 35,
    });
    expect(page.stats.totalPoints).toBe(20);
    expect(page.file.root.children.map((q) => [q.number, q.points])).toEqual([
      ['1', 1],
      ['2', 2],
      ['3', 10],
      ['4', 4],
      ['5', 3],
    ]);
  });

  it('gives every item exactly one example with a problem, a solution and an answer', () => {
    walkNodes(page.file.root, (n) => {
      // ข้อ 1 (Intro to NLP) is made of definition cards: no problem, no Sol
      if (n.kind !== 'item' || n.id.startsWith('i1.')) return;
      expect(n.examples, n.id).toHaveLength(1);
      const ex = n.examples[0];
      if (ex.t !== 'example') throw new Error(`${n.id}: not an example`);
      expect(ex.sol.length, `${n.id} solution`).toBeGreaterThan(0);
      expect(ex.ans.length, `${n.id} answer`).toBeGreaterThan(0);
    });
  });

  it('keeps counts stable (review any change before accepting the snapshot)', () => {
    expect(page.stats).toMatchSnapshot();
  });

  it('stays inside the content budget (200 KB gzip)', () => {
    expect(gzipSync(page.json).length).toBeLessThan(200 * 1024);
  });
});

describe('what the build reads', () => {
  const dirs: string[] = [];
  afterAll(() => {
    for (const d of dirs) rmSync(d, { recursive: true, force: true });
  });

  const sandbox = () => {
    const dir = mkdtempSync(join(tmpdir(), 'nlp-notes-'));
    dirs.push(dir);
    mkdirSync(join(dir, 'content/midterm'), { recursive: true });
    cpSync(
      join(root, 'content/midterm/exam_practice.md'),
      join(dir, 'content/midterm/exam_practice.md'),
    );
    return dir;
  };

  it('ignores study notes next to the page, even when they would not parse', () => {
    const dir = sandbox();
    writeFileSync(join(dir, 'content/midterm/99_broken_note.md'), '# a\n\n$ไม่ปิด\n\n##### x\n');
    const r = buildContent(dir, PAGES);
    expect(r.errors).toEqual([]);
    expect(r.pages).toHaveLength(1);
  });

  it('reports a missing page source as an error', () => {
    const r = buildContent(sandbox(), [{ id: 'final', source: 'content/final/nope.md' }]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toMatch(/content\/final\/nope\.md/);
  });

  it('reports a reference to a heading that does not exist', () => {
    const dir = sandbox();
    const file = join(dir, 'content/midterm/exam_practice.md');
    const md = [
      '# T',
      '',
      '## ข้อ 2 ก (1 คะแนน)',
      '',
      '### 2.1  ข',
      '',
      'ดูข้อ 9.9',
      '',
      '$\\mathbf{Sol}^{n}$',
      '',
      'x',
      '',
    ].join('\n');
    writeFileSync(file, md);
    const r = buildContent(dir, PAGES);
    expect(r.errors.join('\n')).toMatch(/reference "ข้อ 9\.9"/);
  });
});
