import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PAGES } from '../src/config/site';
import type { ContentNode } from '../src/content/types';
import { MidtermOutline } from '../src/features/midterm/MidtermOutline';
import { plainText } from '../src/lib/text';
import { buildContent } from '../scripts/build-content/index';
import { walkNodes } from '../scripts/build-content/tree';

const result = buildContent(process.cwd(), PAGES);
const page = result.pages[0];

const nodesOf = (root: ContentNode) => {
  const all: ContentNode[] = [];
  walkNodes(root, (n) => all.push(n));
  return all.filter((n) => n.kind !== 'root');
};

describe('rendering the real Midterm content', () => {
  it('builds without errors first', () => {
    expect(result.errors).toEqual([]);
  });

  it('renders every question, group and item with its heading text, id and card', () => {
    const { container } = render(<MidtermOutline file={page.file} mountAll />);
    const nodes = nodesOf(page.file.root);
    expect(nodes).toHaveLength(5 + 12 + 41);

    for (const n of nodes) {
      const el = container.querySelector(`[id="${n.id}"]`);
      expect(el, n.id).not.toBeNull();
      expect(el?.textContent?.replace(/\s+/g, ''), n.id).toBe(
        plainText(n.displayTitle).replace(/\s+/g, ''),
      );
    }
    // one article for the page column plus one card per item
    expect(screen.getAllByRole('article')).toHaveLength(1 + 41);
  });

  it('renders all formulas, tables and the figure', () => {
    const { container } = render(<MidtermOutline file={page.file} mountAll />);
    expect(container.querySelectorAll('.katex')).toHaveLength(page.stats.formulas);
    expect(container.querySelectorAll('table')).toHaveLength(page.stats.tables);
    expect(container.querySelectorAll('figure')).toHaveLength(page.stats.figures);
    expect(container.querySelectorAll('ol')).toHaveLength(page.stats.orderedLists);
  });

  it('shows 35 solutions, one for every card, with nothing to hide them', () => {
    const { container } = render(<MidtermOutline file={page.file} mountAll />);
    expect(container.querySelectorAll('[data-solution]')).toHaveLength(35);
    expect(container.querySelectorAll('[data-example]')).toHaveLength(35);
  });
});
