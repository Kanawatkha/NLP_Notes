import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { FIXTURE_MD, fixtureFile } from '@/test/fixture';
import { MidtermOutline } from '../MidtermOutline';

const file = fixtureFile(FIXTURE_MD);

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide && query.includes('1024px'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  document.documentElement.removeAttribute('style');
});

describe('contents on a wide screen', () => {
  beforeEach(() => mockViewport(true));

  it('shows the rail as a navigation landmark with every question, and an icon toggle', () => {
    render(<MidtermOutline file={file} mountAll />);
    const nav = screen.getByRole('navigation', { name: UI_TEXT.railLabel });
    expect(within(nav).getAllByRole('button').length).toBeGreaterThanOrEqual(2);
    expect(
      within(nav).getByRole('button', { name: /ข้อ 3 Word Segmentation/ }),
    ).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: UI_TEXT.railClose });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls', nav.id);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('folds and unfolds with the toggle, keeping the rail out of the tab order while folded', () => {
    render(<MidtermOutline file={file} mountAll />);
    const nav = screen.getByRole('navigation', { name: UI_TEXT.railLabel });
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railClose }));
    expect(screen.getByRole('button', { name: UI_TEXT.railOpen })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(nav.closest('[inert]')).not.toBeNull();
    expect(nav.closest('[aria-hidden="true"]')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
    expect(nav.closest('[inert]')).toBeNull();
  });

  it('gives the room of the rail to the content when it folds, with a transition on the columns', () => {
    const { container } = render(<MidtermOutline file={file} mountAll />);
    const grid = container.querySelector('.grid') as HTMLElement;
    expect(grid.className).toContain('grid-cols-[48px_264px_minmax(0,1fr)]');
    expect(grid.className).toContain('transition-[grid-template-columns]');
    expect(grid.className).toContain('motion-reduce:transition-none');

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railClose }));
    expect(grid.className).toContain('grid-cols-[48px_0px_minmax(0,1fr)]');
    expect(grid.className).not.toContain('max-w-[880px]');
  });

  it('jumps to a card that is still a placeholder after mounting every card', () => {
    const item = (n: number) =>
      `### 2.${n}  ข้อย่อย ${n}\n\nโจทย์ ${n}\n\n$\\mathbf{Sol}^{n}$\n\nวิธี\n\n$\\mathbf{Ans}\\quad 1$\n`;
    const md = `# T\n\n## ข้อ 2 ก (1 คะแนน)\n\n${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item).join('\n')}`;
    render(<MidtermOutline file={fixtureFile(md)} />);
    expect(screen.getAllByRole('article').length).toBeLessThan(10);

    // the question is open in the rail, so its items are pressable
    fireEvent.click(screen.getByRole('button', { name: /2\.9 ข้อย่อย 9/ }));
    expect(screen.getAllByRole('article')).toHaveLength(10);
    const target = document.getElementById('i2.9') as HTMLElement;
    expect(target.tagName).toBe('H3');
    expect(target).toHaveFocus();
    expect(target.scrollIntoView).toHaveBeenCalled();
  });
});

describe('contents on a narrow screen', () => {
  beforeEach(() => mockViewport(false));

  it('has a floating icon button instead of a rail, and no drawer until it is pressed', () => {
    render(<MidtermOutline file={file} mountAll />);
    expect(screen.queryByRole('navigation', { name: UI_TEXT.railLabel })).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    const fab = screen.getByRole('button', { name: UI_TEXT.railOpen });
    expect(fab.className).toContain('fixed');
    expect(fab).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a modal drawer with the contents, traps focus, locks the page, and closes with Escape', () => {
    render(<MidtermOutline file={file} mountAll />);
    const fab = screen.getByRole('button', { name: UI_TEXT.railOpen });
    fab.focus();
    fireEvent.click(fab);

    const dialog = screen.getByRole('dialog', { name: UI_TEXT.railLabel });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(fab).toHaveAttribute('aria-expanded', 'true');
    expect(within(dialog).getByRole('button', { name: /ข้อ 2 Tokenization/ })).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('hidden');

    // Tab from the last control wraps to the first one
    const items = within(dialog)
      .getAllByRole('button')
      .filter((b) => !b.closest('[inert]'));
    items[items.length - 1].focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(items[0]).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(fab).toHaveAttribute('aria-expanded', 'false');
    expect(document.documentElement.style.overflow).toBe('');
    expect(fab).toHaveFocus();
  });

  it('closes by pressing the dimmed page, but not by pressing inside the panel', () => {
    render(<MidtermOutline file={file} mountAll />);
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(dialog);
    expect(screen.getByRole('button', { name: UI_TEXT.railClose })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    fireEvent.pointerDown(dialog.parentElement as HTMLElement);
    expect(screen.getByRole('button', { name: UI_TEXT.railOpen })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes when an entry is chosen, then jumps to its heading', async () => {
    vi.useFakeTimers();
    try {
      render(<MidtermOutline file={file} mountAll />);
      fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
      const dialog = screen.getByRole('dialog');
      fireEvent.click(within(dialog).getByRole('button', { name: /ข้อ 3 Word Segmentation/ }));
      expect(screen.getByRole('button', { name: UI_TEXT.railOpen })).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(document.getElementById('q3')).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });
});
