import type { ContentFile, ContentNode } from '../../src/content/types.ts';
import { inlineText, walkBlocks, walkNodes } from './tree.ts';

/** Counts that the tests snapshot and the report prints. */
export type Stats = {
  questions: number;
  groups: number;
  items: number;
  examples: number;
  tables: number;
  figures: number;
  orderedLists: number;
  formulas: number;
  totalPoints: number;
};

export function statsOf(file: ContentFile): Stats {
  const s: Stats = {
    questions: 0,
    groups: 0,
    items: 0,
    examples: 0,
    tables: 0,
    figures: 0,
    orderedLists: 0,
    formulas: 0,
    totalPoints: 0,
  };
  const countInline = (c: { t: string }[]) => c.filter((i) => i.t === 'math').length;
  walkNodes(file.root, (n) => {
    if (n.kind === 'question') {
      s.questions++;
      s.totalPoints += n.points ?? 0;
    }
    if (n.kind === 'group') s.groups++;
    if (n.kind === 'item') s.items++;
    s.formulas += countInline(n.title);
    walkBlocks([...n.explain, ...n.examples], (b) => {
      if (b.t === 'example') s.examples++;
      if (b.t === 'table') {
        s.tables++;
        for (const row of [b.head, ...b.rows])
          for (const cell of row) s.formulas += countInline(cell);
      }
      if (b.t === 'figure') s.figures++;
      if (b.t === 'list') {
        if (b.ordered) s.orderedLists++;
        for (const it of b.items) s.formulas += countInline(it.c);
      }
      if (b.t === 'math') s.formulas++;
      if (b.t === 'p') s.formulas += countInline(b.c);
    });
  });
  return s;
}

function line(n: ContentNode, depth: number): string[] {
  const pad = '  '.repeat(depth);
  const label = inlineText(n.displayTitle).trim();
  const extra =
    n.kind === 'question'
      ? `, ${n.points ?? '?'} points, ${n.children.length} children`
      : n.kind === 'group'
        ? `, ${n.children.length} items`
        : `, ${n.examples.length} example`;
  const out = [
    `${pad}[${n.kind}] ${n.id}  ${label}  (explain: ${n.explain.length} blocks${extra})`,
  ];
  for (const c of n.children) out.push(...line(c, depth + 1));
  return out;
}

/** Human-readable report: counts, the full tree with ids and points, warnings. */
export function renderReport(
  files: { file: ContentFile; source: string; stats: Stats; bytes: number; gzipBytes: number }[],
  warnings: string[],
): string {
  const out: string[] = ['CONTENT REPORT', ''];
  for (const { file, source, stats, bytes, gzipBytes } of files) {
    out.push(`Page "${file.id}"  (${source})`);
    out.push(`  title: ${inlineText(file.title)}`);
    out.push(
      `  questions ${stats.questions}, groups ${stats.groups}, items ${stats.items}, examples ${stats.examples}, tables ${stats.tables}, figures ${stats.figures}, ordered lists ${stats.orderedLists}, formulas ${stats.formulas}, total points ${stats.totalPoints}`,
    );
    out.push(
      `  generated JSON: ${(bytes / 1024).toFixed(1)} KB, ${(gzipBytes / 1024).toFixed(1)} KB gzip`,
    );
    out.push('', 'Tree');
    for (const c of file.root.children) out.push(...line(c, 1));
    out.push('');
  }
  out.push(`Warnings (${warnings.length})`);
  for (const w of warnings) out.push(`  - ${w}`);
  out.push('');
  return out.join('\n');
}
