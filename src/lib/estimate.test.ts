import { describe, expect, it } from 'vitest';
import { FIXTURE_MD, fixtureBlocks, fixtureFile } from '@/test/fixture';
import { estimateBlock, estimateCard } from './estimate';

describe('height estimates', () => {
  it('give every kind of block a sensible size, tables by their rows and figures a tall one', () => {
    const [p] = fixtureBlocks('ข้อความ');
    const [table] = fixtureBlocks('| a | b |\n|:---:|:---:|\n| 1 | 2 |\n| 3 | 4 |');
    const [figure] = fixtureBlocks(
      '<div align="center">\n<svg viewBox="0 0 1 1"><g/></svg>\n</div>',
    );
    const [list] = fixtureBlocks('1. ก\n2. ข\n3. ค');
    expect(estimateBlock(p)).toBeGreaterThan(30);
    expect(estimateBlock(table)).toBe(52 + 3 * 46);
    expect(estimateBlock(figure)).toBeGreaterThan(estimateBlock(table));
    expect(estimateBlock(list)).toBe(3 * 34);
  });

  it('grows with the content of a card', () => {
    const file = fixtureFile(FIXTURE_MD);
    const direct = file.root.children[0].children[0]; // 2.1: a short worked example
    const rich = file.root.children[1].children[0].children[0]; // 3.1.1: table, figure, formulas
    expect(estimateCard(rich)).toBeGreaterThan(estimateCard(direct));
    expect(estimateCard(direct)).toBeGreaterThan(120);
  });
});
