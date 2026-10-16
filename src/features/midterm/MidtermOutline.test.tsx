import { act, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SolutionsContext } from '@/components/content/solutions';
import { UI_TEXT } from '@/config/site';
import { FIXTURE_MD, fixtureFile } from '@/test/fixture';
import { BACKGROUND_DELAY_MS, FIRST_CARDS, MidtermOutline } from './MidtermOutline';

const file = fixtureFile(FIXTURE_MD);

describe('MidtermOutline', () => {
  it('renders questions, groups and items with the heading levels h2, h3 and h4 (h3 for a direct item)', () => {
    render(<MidtermOutline file={file} mountAll />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 2, name: /Tokenization/ })).toHaveAttribute(
      'id',
      'q2',
    );
    // group 3.1 and the direct item 2.1 are h3, the items inside the group are h4
    expect(screen.getByRole('heading', { level: 3, name: /FMM/ })).toHaveAttribute('id', 'g3.1');
    expect(screen.getByRole('heading', { level: 3, name: /Token และ Type/ })).toHaveAttribute(
      'id',
      'i2.1',
    );
    expect(screen.getByRole('heading', { level: 4, name: /จับคำ/ })).toHaveAttribute(
      'id',
      'i3.1.1',
    );
    expect(screen.getAllByRole('article')).toHaveLength(4); // the page column plus 3 cards
  });

  it('keeps the heading text exactly as written, with the number as a badge inside it', () => {
    render(<MidtermOutline file={file} mountAll />);
    const q = document.getElementById('q3') as HTMLElement;
    expect(q.textContent?.replace(/\s+/g, ' ').trim()).toBe('ข้อ 3 Word Segmentation');
    expect(q.querySelector('span')).toHaveTextContent('ข้อ 3');
    const item = document.getElementById('i3.1.2') as HTMLElement;
    expect(item.textContent?.replace(/\s+/g, ' ').trim()).toBe('3.1.2 อีกข้อ');
  });

  it('shows the points of a question as a pill, not inside the heading', () => {
    render(<MidtermOutline file={file} mountAll />);
    expect(screen.getByText(`10 ${UI_TEXT.points}`)).toBeInTheDocument();
    expect(document.getElementById('q3')?.textContent).not.toContain(UI_TEXT.points);
  });

  it('shows the definition as lead text and the shared statement after it', () => {
    render(<MidtermOutline file={file} mountAll />);
    const lead = screen.getByText(/คือการแบ่งข้อความ/).closest('p');
    expect(lead?.className).toContain('type-body-lg');
    expect(screen.getByText('new renew set').tagName).toBe('CODE');
  });

  it('renders the table and the figure of an item', () => {
    render(<MidtermOutline file={file} mountAll />);
    const card = document.getElementById('i3.1.1')?.closest('article') as HTMLElement;
    expect(within(card).getByRole('table')).toBeInTheDocument();
    expect(within(card).getByRole('figure', { name: /จับคำ/ })).toBeInTheDocument();
  });

  it('hides every Sol and Ans while solutions are off', () => {
    const { container, rerender } = render(<MidtermOutline file={file} mountAll />);
    expect(container.querySelectorAll('[data-solution]')).toHaveLength(3);
    rerender(
      <SolutionsContext.Provider value={{ show: false, setShow: () => {} }}>
        <MidtermOutline file={file} mountAll />
      </SolutionsContext.Provider>,
    );
    expect(container.querySelectorAll('[data-solution]')).toHaveLength(0);
    expect(screen.getAllByRole('button', { name: UI_TEXT.showSolution })).toHaveLength(3);
  });

  describe('showing the questions one at a time', () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('shows everything at once when the browser has no idle callbacks', () => {
      render(<MidtermOutline file={file} />);
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    });

    it('starts with none, then adds a question per frame or idle moment, in source order', async () => {
      vi.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'],
      });
      vi.stubGlobal('requestIdleCallback', (cb: () => void) => window.setTimeout(cb, 0));
      vi.stubGlobal('cancelIdleCallback', (id: number) => window.clearTimeout(id));
      render(<MidtermOutline file={file} />);
      expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0);

      await act(async () => {
        vi.advanceTimersByTime(100); // two frames: the first question
      });
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
      expect(document.getElementById('q2')).not.toBeNull();
      expect(document.getElementById('q3')).toBeNull();

      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    });
  });

  describe('mounting the cards', () => {
    const item = (n: number) =>
      `### 2.${n}  ข้อย่อย ${n}\n\nโจทย์ ${n}\n\n$\\mathbf{Sol}^{n}$\n\nวิธี\n\n$\\mathbf{Ans}\\quad 1$\n`;
    const md = `# T\n\n## ข้อ 2 ก (1 คะแนน)\n\n${Array.from({ length: 9 }, (_, i) => item(i + 1)).join('\n')}`;
    const cards = () => screen.getAllByRole('article').length - 1; // minus the page column

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('mounts only the first two at once and keeps an anchor and a height for every other card', () => {
      render(<MidtermOutline file={fixtureFile(md)} />);
      expect(cards()).toBe(FIRST_CARDS);
      for (let n = 1; n <= 9; n++) {
        const el = document.getElementById(`i2.${n}`) as HTMLElement;
        expect(el, `i2.${n}`).not.toBeNull();
        if (n > FIRST_CARDS) expect(parseInt(el.style.height, 10)).toBeGreaterThan(100);
      }
    });

    it('fills in the rest two cards at a time, but only after the first five seconds', async () => {
      vi.useFakeTimers();
      render(<MidtermOutline file={fixtureFile(md)} />);
      await act(async () => {
        vi.advanceTimersByTime(BACKGROUND_DELAY_MS - 500);
      });
      expect(cards()).toBe(FIRST_CARDS); // quiet while the page is new

      // one step per render: a new step is only scheduled after React has shown the last one
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          vi.advanceTimersByTime(2000);
        });
      }
      expect(cards()).toBe(9);
      expect(screen.getByRole('heading', { name: /ข้อย่อย 9/ })).toBeInTheDocument();
    });

    it('mounts a card, and the two after it, as soon as its placeholder comes near the window', () => {
      // every placeholder has its own observer: remember which callback belongs to which element
      const callbacks = new Map<Element, (entries: Partial<IntersectionObserverEntry>[]) => void>();
      class FakeObserver {
        constructor(private readonly cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {}
        observe = (el: Element) => callbacks.set(el, this.cb);
        unobserve = () => {};
        disconnect = () => {};
      }
      vi.stubGlobal('IntersectionObserver', FakeObserver);
      render(<MidtermOutline file={fixtureFile(md)} />);
      expect(cards()).toBe(FIRST_CARDS);

      const placeholder = document.getElementById('i2.5') as HTMLElement;
      expect(callbacks.has(placeholder)).toBe(true);
      act(() => callbacks.get(placeholder)?.([{ target: placeholder, isIntersecting: true }]));
      expect(cards()).toBe(7); // cards 1 to 7: index 4 plus the next two
      expect(document.getElementById('i2.8')?.tagName).toBe('DIV');
    });
  });
});
