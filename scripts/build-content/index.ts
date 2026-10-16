import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import type { ContentFile } from '../../src/content/types.ts';
import { metaOf } from '../../src/content/stats.ts';
import { parseDocument } from './parse.ts';
import { projectData, projectMarkdown } from './project.ts';
import { renderReport, statsOf, type Stats } from './report.ts';
import {
  blockText,
  buildContentFile,
  buildRaw,
  inlineText,
  walkBlocks,
  walkNodes,
} from './tree.ts';

/** A page to build: its id and the Markdown source, relative to the project root. */
export type PageSource = { readonly id: string; readonly source: string };

export type BuiltPage = {
  file: ContentFile;
  source: string;
  stats: Stats;
  json: string;
};

export type BuildResult = {
  pages: BuiltPage[];
  warnings: string[];
  errors: string[];
  report: string;
};

const REF_RE = /ข้อ\s*(\d+(?:\.\d+)+)/g;

/** Checks of CONTENT-SCHEMA.md section 9 that need the whole tree. */
function checkTree(file: ContentFile, rel: string, errors: string[]): void {
  const seen = new Set<string>();
  const numbers = new Set<string>();
  walkNodes(file.root, (n) => {
    if (seen.has(n.id)) errors.push(`${rel}: duplicate node id ${n.id}`);
    seen.add(n.id);
    if (n.number) numbers.add(n.number);
    if (n.kind === 'group' && n.children.length === 0)
      errors.push(`${rel}: group ${n.id} has no items`);
  });
  // "ข้อ 2.2" in the text must point at a heading that exists
  walkNodes(file.root, (n) => {
    const texts = [inlineText(n.title), ...[...n.explain, ...n.examples].map(blockText)];
    walkBlocks(n.examples, (b) => {
      if (b.t === 'example') texts.push(...[...b.problem, ...b.sol, ...b.ans].map(blockText));
    });
    for (const text of texts) {
      for (const m of text.matchAll(REF_RE)) {
        if (!numbers.has(m[1]))
          errors.push(`${rel}: reference "ข้อ ${m[1]}" in ${n.id} has no matching heading`);
      }
    }
  });
}

/** Converts every declared page. Reads only `pages[].source`, never scans folders. Never writes. */
export function buildContent(root: string, pages: readonly PageSource[]): BuildResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const built: BuiltPage[] = [];

  for (const page of pages) {
    const rel = page.source;
    try {
      const md = readFileSync(join(root, page.source), 'utf8');
      const raw = buildRaw(parseDocument(md, rel), rel);
      const file = buildContentFile(raw, { id: page.id, file: rel }, (m) => warnings.push(m));

      // round trip: Markdown and generated data must project to the same text, math and figures
      const a = projectMarkdown(md);
      const b = projectData(file);
      if (a.text !== b.text) {
        let k = 0;
        while (k < a.text.length && a.text[k] === b.text[k]) k++;
        errors.push(
          `${rel}: round-trip text mismatch at char ${k}\n    md  : ...${a.text.slice(Math.max(0, k - 20), k + 40)}\n    data: ...${b.text.slice(Math.max(0, k - 20), k + 40)}`,
        );
      }
      if (a.figures !== b.figures)
        errors.push(`${rel}: figure count md=${a.figures} data=${b.figures}`);
      if (a.math.length !== b.math.length || a.math.some((x, i) => x !== b.math[i])) {
        const i = a.math.findIndex((x, idx) => x !== b.math[idx]);
        errors.push(
          `${rel}: math mismatch (md ${a.math.length}, data ${b.math.length}) first diff at #${i}: ${a.math[i]} | ${b.math[i]}`,
        );
      }

      checkTree(file, rel, errors);
      built.push({ file, source: rel, stats: statsOf(file), json: JSON.stringify(file) });
    } catch (e) {
      errors.push(`${rel}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const report = renderReport(
    built.map((p) => ({
      file: p.file,
      source: p.source,
      stats: p.stats,
      bytes: Buffer.byteLength(p.json),
      gzipBytes: gzipSync(p.json).length,
    })),
    warnings,
  );
  return { pages: built, warnings, errors, report };
}

export function writeOutput(result: BuildResult, outDir: string): void {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const p of result.pages) {
    writeFileSync(join(outDir, `${p.file.id}.json`), p.json);
    // the small file for the top of the page, so the hero does not wait for the content
    writeFileSync(join(outDir, `${p.file.id}.meta.json`), JSON.stringify(metaOf(p.file)));
  }
  writeFileSync(join(outDir, 'report.txt'), result.report);
}
