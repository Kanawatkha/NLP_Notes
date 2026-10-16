import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollArea } from './ScrollArea';

let resizeCb: (entries: { target: Element }[]) => void = () => {};

class FakeResizeObserver {
  constructor(cb: typeof resizeCb) {
    resizeCb = cb;
  }
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}

let fontEvents: (() => void)[] = [];

function sizes(el: HTMLElement, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(el, 'scrollWidth', { value: scrollWidth, configurable: true });
  Object.defineProperty(el, 'clientWidth', { value: clientWidth, configurable: true });
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  fontEvents = [];
  Object.defineProperty(document, 'fonts', {
    value: {
      addEventListener: (_type: string, cb: () => void) => fontEvents.push(cb),
      ready: new Promise(() => {}),
    },
    configurable: true,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete (document as { fonts?: unknown }).fonts;
});

describe('ScrollArea', () => {
  it('is no keyboard stop while its content fits, and a named region once it overflows', () => {
    render(
      <ScrollArea label="Wide table">
        <p>content</p>
      </ScrollArea>,
    );
    const area = screen.getByText('content').parentElement as HTMLElement;
    expect(area).not.toHaveAttribute('tabindex');

    sizes(area, 900, 400);
    act(() => resizeCb([{ target: area }]));
    expect(area).toHaveAttribute('tabindex', '0');
    expect(area).toHaveAttribute('role', 'region');
    expect(area).toHaveAttribute('aria-label', 'Wide table');

    sizes(area, 300, 400);
    act(() => resizeCb([{ target: area }]));
    expect(area).not.toHaveAttribute('tabindex');
    expect(area).not.toHaveAttribute('role');
  });

  it('is focusable but not a landmark when it has no name', () => {
    render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );
    const area = screen.getByText('content').parentElement as HTMLElement;
    sizes(area, 900, 400);
    act(() => resizeCb([{ target: area }]));
    expect(area).toHaveAttribute('tabindex', '0');
    expect(area).not.toHaveAttribute('role');
  });

  it('measures again when fonts have loaded, because the content grows while the box keeps its size', () => {
    render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );
    const area = screen.getByText('content').parentElement as HTMLElement;
    expect(area).not.toHaveAttribute('tabindex');

    sizes(area, 882, 790); // the formula is wider once its font is in
    act(() => fontEvents.forEach((cb) => cb()));
    expect(area).toHaveAttribute('tabindex', '0');
  });

  it('measures again when scrolling has been quiet for a moment (cards laid out late)', () => {
    vi.useFakeTimers();
    try {
      render(
        <ScrollArea>
          <p>content</p>
        </ScrollArea>,
      );
      const area = screen.getByText('content').parentElement as HTMLElement;
      act(() => {
        vi.advanceTimersByTime(300); // the check that follows mounting
      });
      sizes(area, 882, 790);
      act(() => {
        window.dispatchEvent(new Event('scroll'));
        vi.advanceTimersByTime(100);
        window.dispatchEvent(new Event('scroll')); // still scrolling: the wait starts over
        vi.advanceTimersByTime(200);
      });
      expect(area).not.toHaveAttribute('tabindex');
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(area).toHaveAttribute('tabindex', '0');
    } finally {
      vi.useRealTimers();
    }
  });

  it('measures again shortly after areas have been added', () => {
    vi.useFakeTimers();
    try {
      render(
        <ScrollArea>
          <p>content</p>
        </ScrollArea>,
      );
      const area = screen.getByText('content').parentElement as HTMLElement;
      sizes(area, 882, 790);
      expect(area).not.toHaveAttribute('tabindex');
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(area).toHaveAttribute('tabindex', '0');
    } finally {
      vi.useRealTimers();
    }
  });

  it('measures once on mount without a ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('content').parentElement).not.toHaveAttribute('tabindex');
  });
});
