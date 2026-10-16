import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { PAGES } from '../../src/config/site.ts';
import { buildContent, writeOutput } from './index.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const result = buildContent(root, PAGES);

if (result.errors.length > 0) {
  console.error(`content: ${result.errors.length} error(s)`);
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

writeOutput(result, `${root}src/content/generated`);
for (const p of result.pages) {
  const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
  console.log(
    `content: ${p.file.id} -> ${kb(Buffer.byteLength(p.json))} (${kb(gzipSync(p.json).length)} gzip), ${p.stats.questions} questions, ${p.stats.groups} groups, ${p.stats.items} items`,
  );
}
console.log(
  `content: ${result.pages.length} page(s) converted, ${result.warnings.length} warning(s). Report: src/content/generated/report.txt`,
);
