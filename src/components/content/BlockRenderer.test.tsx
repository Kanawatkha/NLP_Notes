import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlockList } from '@/components/content/BlockRenderer';
import { FigureLabelContext } from '@/components/content/figureLabel';
import { fixtureBlocks, fixtureExample } from '@/test/fixture';

const SOL = '$\\mathbf{Sol}^{n}$';

const renderMd = (md: string) => render(<BlockList blocks={fixtureBlocks(md)} />);

describe('BlockRenderer', () => {
  it('renders paragraphs with bold, code and inline formulas', () => {
    const { container } = renderMd('**สูตร** ค่า $x+y$ และ `new set`');
    expect(container.querySelector('strong')).toHaveTextContent('สูตร');
    expect(container.querySelector('code')).toHaveTextContent('new set');
    expect(container.querySelectorAll('.katex')).toHaveLength(1);
  });

  it('renders display math inside a scroll area', () => {
    const { container } = renderMd('$$a=b$$');
    expect(container.querySelector('.thin-scroll .katex-display')).not.toBeNull();
  });

  it('renders ordered and bullet lists, including nested blocks', () => {
    const { container } = renderMd('1. ก\n2. ข\n\n- ค\n- ง');
    expect(container.querySelector('ol')?.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelector('ul')?.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders a table with column headers, alignment and formulas in cells', () => {
    renderMd('| ขั้น | ผล |\n|:---:|:---|\n| 1 | $a$ |');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(2);
    const cells = within(table).getAllByRole('cell');
    expect(cells[0].className).toContain('text-center');
    expect(cells[1].className).toContain('text-left');
    expect(cells[1].querySelector('.katex')).not.toBeNull();
  });

  it('names a table header cell that holds only a formula, and leaves other headers alone', () => {
    renderMd('| ขั้น | $d_1$ | $v_1(\\text{NNP})$ |\n|:---:|:---:|:---:|\n| 1 | 2 | 3 |');
    const heads = within(screen.getByRole('table')).getAllByRole('columnheader');
    expect(heads[0]).not.toHaveAttribute('aria-label');
    expect(heads[1]).toHaveAttribute('aria-label', 'd sub 1');
    expect(heads[2]).toHaveAttribute('aria-label', 'v sub 1(NNP)');
  });

  it('renders a figure named after its card, and a note as an aside', () => {
    const md =
      '<div align="center">\n<svg viewBox="0 0 1 1"><g/></svg>\n</div>\n\n> หมายเหตุ';
    const { container } = render(
      <FigureLabelContext.Provider value="4.1.1 Derivation">
        <BlockList blocks={fixtureBlocks(md)} />
      </FigureLabelContext.Provider>,
    );
    expect(screen.getByRole('figure', { name: '4.1.1 Derivation' }).querySelector('svg')).not.toBeNull();
    expect(container.querySelector('aside')).toHaveTextContent('หมายเหตุ');
  });
});

describe('example block', () => {
  const md = `จงหา $x$\n\n${SOL}\n\nวิธีทำ ขั้นแรก\n\n$\\mathbf{Ans}\\quad$ คำตอบ`;

  it('always shows problem, Sol label, steps and answer, with no button to hide them', () => {
    render(
      <>
        <BlockList blocks={fixtureExample(md)} />
        <BlockList blocks={fixtureExample(md.replace('$x$', '$y$'))} />
      </>,
    );
    expect(screen.getAllByText('Sol')).toHaveLength(2);
    expect(screen.getAllByText(/วิธีทำ ขั้นแรก/)).toHaveLength(2);
    expect(screen.getAllByText(/คำตอบ/)).toHaveLength(2);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
