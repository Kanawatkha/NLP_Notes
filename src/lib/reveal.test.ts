import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { observeReveal, resetRevealObserver } from './reveal';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback = () => {};
const observed = new Set<Element>();

class FakeObserver {
  constructor(cb: Callback) {
    callback = cb;
  }
  observe = (el: Element) => observed.add(el);
  unobserve = (el: Element) => observed.delete(el);
  disconnect = () => observed.clear();
}

const makeEl = () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
};

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
  resetRevealObserver();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.innerHTML = '';
  observed.clear();
});

describe('observeReveal', () => {
  it('waits for the block to come into view, then shows it once and lets it go', () => {
    const el = makeEl();
    observeReveal(el);
    expect(el).not.toHaveAttribute('data-shown');
    expect(observed.has(el)).toBe(true);

    callback([{ target: el, isIntersecting: true }]);
    expect(el).toHaveAttribute('data-shown');
    expect(el).not.toHaveAttribute('data-instant');
    expect(observed.has(el)).toBe(false);
  });

  it('staggers blocks that come into view together by 40 ms, at most three steps', () => {
    const els = [0, 1, 2, 3, 4].map(makeEl);
    els.forEach((el) => observeReveal(el));
    callback(els.map((target) => ({ target, isIntersecting: true })));
    expect(els.map((el) => el.style.transitionDelay)).toEqual([
      '',
      '40ms',
      '80ms',
      '120ms',
      '120ms',
    ]);
  });

  it('clears the entrance delay afterwards, so hover transitions are not delayed', () => {
    vi.useFakeTimers();
    const els = [makeEl(), makeEl()];
    els.forEach((el) => observeReveal(el));
    callback(els.map((target) => ({ target, isIntersecting: true })));
    expect(els[1].style.transitionDelay).toBe('40ms');
    vi.advanceTimersByTime(1000);
    expect(els[1].style.transitionDelay).toBe('');
  });

  it('shows a block that is already above the window in its final state, without an entrance', () => {
    const el = makeEl();
    observeReveal(el);
    callback([
      { target: el, isIntersecting: false, boundingClientRect: { top: -400 } as DOMRectReadOnly },
    ]);
    expect(el).toHaveAttribute('data-shown');
    expect(el).toHaveAttribute('data-instant');
  });

  it('leaves a block below the window waiting', () => {
    const el = makeEl();
    observeReveal(el);
    callback([
      { target: el, isIntersecting: false, boundingClientRect: { top: 900 } as DOMRectReadOnly },
    ]);
    expect(el).not.toHaveAttribute('data-shown');
  });

  it('shows the block at once when the visitor asked for less motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const el = makeEl();
    observeReveal(el);
    expect(el).toHaveAttribute('data-shown');
    expect(el).toHaveAttribute('data-instant');
  });

  it('shows the block at once when there is no IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const el = makeEl();
    observeReveal(el);
    expect(el).toHaveAttribute('data-shown');
  });

  it('stops observing when its cleanup runs', () => {
    const el = makeEl();
    const stop = observeReveal(el);
    stop();
    expect(observed.has(el)).toBe(false);
  });
});
