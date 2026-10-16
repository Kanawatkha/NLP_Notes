import { metaOf } from '../content/stats';
import type { Block, ContentFile, PageMeta } from '../content/types';
import { parseDocument } from '../../scripts/build-content/parse';
import { buildContentFile, buildRaw } from '../../scripts/build-content/tree';

/** Builds typed content from Markdown with the real pipeline, for component tests. */
export function fixtureFile(md: string): ContentFile {
  const raw = buildRaw(parseDocument(md, 'fixture.md'), 'fixture.md');
  return buildContentFile(raw, { id: 'midterm', file: 'fixture.md' }, () => {});
}

/** The small file for the top of the page, built the same way as the content build does. */
export function fixtureMeta(file: ContentFile): PageMeta {
  return metaOf(file);
}

/** The blocks of a Markdown snippet. */
export function fixtureBlocks(md: string): Block[] {
  return parseDocument(md, 'fixture.md').flatMap((t) => (t.k === 'block' ? [t.block] : []));
}

/** The example block of an item whose body is `md` (problem, Sol marker, steps, Ans). */
export function fixtureExample(md: string): Block[] {
  const file = fixtureFile(`# T\n\n## ข้อ 2 ก\n\n### 2.1  ข\n\n${md}\n`);
  return file.root.children[0].children[0].examples;
}

const SOL = '$\\mathbf{Sol}^{n}$';

/** Two questions: one with a group and two items (a table, a figure, math), one with a direct item. */
export const FIXTURE_MD = [
  '# แนวข้อสอบทดสอบ (Test Exam)',
  '',
  '## ข้อ 2 Tokenization (2 คะแนน)',
  '',
  '**Tokenization** คือการแบ่งข้อความ',
  '',
  'กำหนดข้อความ `new renew set`',
  '',
  '### 2.1  Token และ Type',
  '',
  SOL,
  '',
  'วิธีทำ นับคำ',
  '',
  '$\\mathbf{Ans}\\quad$ Token $=\\mathbf{3}$',
  '',
  '---',
  '',
  '## ข้อ 3 Word Segmentation (10 คะแนน)',
  '',
  '### 3.1  FMM',
  '',
  'นิยามของกลุ่ม',
  '',
  '#### 3.1.1  จับคำ',
  '',
  'จงตัดคำ $x+y$',
  '',
  SOL,
  '',
  '| ขั้น | ผล |',
  '|:---:|:---|',
  '| 1 | $a$ |',
  '',
  '<div align="center">',
  '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>',
  '</div>',
  '',
  '$\\mathbf{Ans}\\quad$ ตัดได้ $\\mathbf{2}$',
  '',
  '#### 3.1.2  อีกข้อ',
  '',
  'โจทย์ข้อสอง',
  '',
  SOL,
  '',
  '$$a=b$$',
  '',
  '$\\mathbf{Ans}\\quad$ $\\mathbf{1}$',
  '',
].join('\n');
