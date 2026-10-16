import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CountUp } from './CountUp';

let notify: (intersecting: boolean) => void = () => {};

class FakeObserver {
  constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
    notify = (isIntersecting) => cb([{ isIntersecting }]);
  }
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('CountUp', () => {
  it('shows the plain number when there is no IntersectionObserver', () => {
    const { container } = render(<CountUp value={35} />);
    expect(container).toHaveTextContent(/^35$/);
    expect(container.querySelector('.sr-only')).toBeNull();
  });

  it('shows the plain number under reduced motion', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const { container } = render(<CountUp value={19} />);
    expect(container).toHaveTextContent(/^19$/);
  });

  it('starts at 0, counts up once on screen, and keeps the real number readable throughout', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    const { container } = render(<CountUp value={35} />);

    // before it is seen: 0 on screen, the final value for assistive technology
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('0');
    expect(container.querySelector('.sr-only')).toHaveTextContent('35');

    act(() => notify(true));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    const middle = Number(container.querySelector('[aria-hidden="true"]')?.textContent);
    expect(middle).toBeGreaterThan(0);
    expect(middle).toBeLessThan(35);
    expect(container.querySelector('.sr-only')).toHaveTextContent('35');

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(container).toHaveTextContent(/^35$/);
    expect(container.querySelector('.sr-only')).toBeNull();
  });

  it('does not count while it is off screen', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    const { container } = render(<CountUp value={4} />);
    act(() => notify(false));
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('0');
  });
});
