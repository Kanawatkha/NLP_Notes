import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SolutionsContext } from '../src/components/content/solutions';
import { PAGES, UI_TEXT } from '../src/config/site';
import type { ContentNode } from '../src/content/types';
import { metaOf } from '../src/content/stats';
import { Hero } from '../src/features/midterm/Hero';
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
    expect(nodes).toHaveLength(4 + 12 + 35);

    for (const n of nodes) {
      const el = container.querySelector(`[id="${n.id}"]`);
      expect(el, n.id).not.toBeNull();
      expect(el?.textContent?.replace(/\s+/g, ''), n.id).toBe(
        plainText(n.displayTitle).replace(/\s+/g, ''),
      );
    }
    // one article for the page column plus one card per item
    expect(screen.getAllByRole('article')).toHaveLength(1 + 35);
  });

  it('renders all formulas, tables and the figure', () => {
    const { container } = render(<MidtermOutline file={page.file} mountAll />);
    expect(container.querySelectorAll('.katex')).toHaveLength(page.stats.formulas);
    expect(container.querySelectorAll('table')).toHaveLength(page.stats.tables);
    expect(container.querySelectorAll('figure')).toHaveLength(page.stats.figures);
    expect(container.querySelectorAll('ol')).toHaveLength(page.stats.orderedLists);
  });

  it('shows 35 solutions, and none (but 35 reveal buttons) when the switch is off', () => {
    const on = render(<MidtermOutline file={page.file} mountAll />);
    expect(on.container.querySelectorAll('[data-solution]')).toHaveLength(35);
    on.unmount();

    const off = render(
      <SolutionsContext.Provider value={{ show: false, setShow: () => {} }}>
        <MidtermOutline file={page.file} mountAll />
      </SolutionsContext.Provider>,
    );
    expect(off.container.querySelectorAll('[data-solution]')).toHaveLength(0);
    expect(off.container.querySelectorAll('[data-example]')).toHaveLength(35);
    expect(screen.getAllByRole('button', { name: UI_TEXT.showSolution })).toHaveLength(35);
  });

  it('shows the four statistics of the hero, from the meta file the build writes', () => {
    const { container } = render(<Hero meta={metaOf(page.file)} />);
    const hero = within(container.querySelector('section.bg-canvas-mint') as HTMLElement);
    expect(hero.getByText(UI_TEXT.statQuestions).previousSibling).toHaveTextContent('4');
    expect(hero.getByText(UI_TEXT.statItems).previousSibling).toHaveTextContent('35');
    expect(hero.getByText(UI_TEXT.statExamples).previousSibling).toHaveTextContent('35');
    expect(hero.getByText(UI_TEXT.statPoints).previousSibling).toHaveTextContent('19');
  });
});
