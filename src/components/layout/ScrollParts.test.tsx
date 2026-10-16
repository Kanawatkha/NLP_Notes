import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BackToTop } from '@/components/layout/BackToTop';
import { Navbar } from '@/components/layout/Navbar';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { UI_TEXT } from '@/config/site';

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

const frame = () =>
  act(async () => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 4800,
    configurable: true,
  });
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ReadingProgress', () => {
  it('is decorative and its fill follows the scroll (a transform, no re-render)', async () => {
    const { container } = render(<ReadingProgress />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    const fill = container.querySelector('[data-progress-fill]') as HTMLElement;

    scrollTo(2000); // of 4000 scrollable
    await frame();
    expect(fill.style.transform).toBe('scaleX(0.5)');

    scrollTo(4000);
    await frame();
    expect(fill.style.transform).toBe('scaleX(1)');
  });
});

describe('BackToTop', () => {
  it('stays hidden and out of the tab order on the first screen', async () => {
    render(<BackToTop />);
    await frame();
    const button = screen.getByRole('button', { name: UI_TEXT.backToTop, hidden: true });
    expect(button).toHaveAttribute('inert');
    expect(button.className).toContain('opacity-0');
  });

  it('appears after the first screen, shows the page progress in its ring, and scrolls to the top', async () => {
    window.scrollTo = vi.fn();
    render(<BackToTop />);
    scrollTo(2000);
    await frame();
    const button = screen.getByRole('button', { name: UI_TEXT.backToTop });
    expect(button).not.toHaveAttribute('inert');
    expect(button.className).toContain('opacity-100');
    const ring = button.querySelector('circle') as SVGCircleElement;
    const full = Number(ring.getAttribute('stroke-dasharray'));
    expect(Number(ring.style.strokeDashoffset)).toBeCloseTo(full / 2, 1);

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrolls instantly under reduced motion', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    window.scrollTo = vi.fn();
    render(<BackToTop />);
    scrollTo(3000);
    await frame();
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.backToTop }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });
});

describe('Navbar scroll state', () => {
  it('gets a shadow once the page has scrolled 8 px, and loses it at the top', async () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    const header = container.querySelector('header') as HTMLElement;
    await frame();
    expect(header).not.toHaveAttribute('data-scrolled');
    expect(header.className).not.toContain('shadow-float');

    scrollTo(20);
    await frame();
    expect(header).toHaveAttribute('data-scrolled');
    expect(header.className).toContain('shadow-float');

    scrollTo(0);
    await frame();
    expect(header).not.toHaveAttribute('data-scrolled');
  });

  it('carries the reading-progress line', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(container.querySelector('header [data-progress-fill]')).not.toBeNull();
  });
});
