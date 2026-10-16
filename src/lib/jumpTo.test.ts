import { afterEach, describe, expect, it, vi } from 'vitest';
import { jumpTo } from './jumpTo';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('jumpTo', () => {
  it('scrolls to the element (instantly under reduced motion) and focuses it without touching the URL', () => {
    document.body.innerHTML = '<h2 id="q3" tabindex="-1">ข้อ 3</h2>';
    const el = document.getElementById('q3') as HTMLElement;
    el.scrollIntoView = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const hash = window.location.hash;

    expect(jumpTo('q3')).toBe(true);
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    expect(el).toHaveFocus();
    expect(window.location.hash).toBe(hash);
  });

  it('uses smooth scrolling unless the visitor asked for less motion', () => {
    document.body.innerHTML = '<h2 id="q3" tabindex="-1">ข้อ 3</h2>';
    const el = document.getElementById('q3') as HTMLElement;
    el.scrollIntoView = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
    jumpTo('q3');
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('marks the arrival for a moment, and restarts the mark when the same target is chosen again', () => {
    vi.useFakeTimers();
    try {
      document.body.innerHTML = '<h2 id="q3" tabindex="-1">ข้อ 3</h2>';
      const el = document.getElementById('q3') as HTMLElement;
      el.scrollIntoView = vi.fn();
      window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;

      jumpTo('q3');
      expect(el).toHaveAttribute('data-arrive');
      vi.advanceTimersByTime(1000);
      expect(el).toHaveAttribute('data-arrive');

      jumpTo('q3'); // chosen again: the earlier timer must not end the new mark
      vi.advanceTimersByTime(900);
      expect(el).toHaveAttribute('data-arrive');
      vi.advanceTimersByTime(1000);
      expect(el).not.toHaveAttribute('data-arrive');
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns false when there is no such element', () => {
    expect(jumpTo('nope')).toBe(false);
  });
});

describe('jumpTo settling', () => {
  /** A heading whose distance from the top of the window is read from `tops`, one value per look. */
  function heading(tops: number[], margin = '96px') {
    document.body.innerHTML = '<h2 id="i1" tabindex="-1" style="scroll-margin-top: 96px">x</h2>';
    const el = document.getElementById('i1') as HTMLElement;
    el.scrollIntoView = vi.fn();
    const looks = [...tops];
    el.getBoundingClientRect = () =>
      ({ top: looks.length > 1 ? looks.shift() : looks[0] }) as DOMRect;
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      scrollMarginTop: margin,
    } as CSSStyleDeclaration);
    return el;
  }

  const motion = (reduced: boolean) => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: reduced }) as typeof window.matchMedia;
  };

  it('puts the target right again when the cards near it changed size during a smooth scroll', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const el = heading([380, 96]); // 284 px off, then in place
      jumpTo('i1');
      expect(el.scrollIntoView).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1300);
      expect(el.scrollIntoView).toHaveBeenCalledTimes(2);
      expect(el.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto', block: 'start' });

      vi.advanceTimersByTime(500); // checked again, now in place: nothing more
      expect(el.scrollIntoView).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does nothing more when the target is where the scroll margin puts it', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const el = heading([98]); // within 4 px of 96
      jumpTo('i1');
      vi.advanceTimersByTime(3000);
      expect(el.scrollIntoView).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('waits for the end of the scroll event when the browser sends one', () => {
    vi.useFakeTimers();
    try {
      motion(false);
      const el = heading([380, 96]);
      jumpTo('i1');
      window.dispatchEvent(new Event('scrollend'));
      expect(el.scrollIntoView).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('checks soon after an instant jump, and gives up after three corrections', () => {
    vi.useFakeTimers();
    try {
      motion(true);
      const el = heading([500]); // never gets right
      jumpTo('i1');
      expect(el.scrollIntoView).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(130);
      expect(el.scrollIntoView).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(5000);
      expect(el.scrollIntoView).toHaveBeenCalledTimes(4); // the jump plus three corrections
    } finally {
      vi.useRealTimers();
    }
  });
});
