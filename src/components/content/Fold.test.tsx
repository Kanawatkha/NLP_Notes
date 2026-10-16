import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fold } from './Fold';

type FakeAnimation = { onfinish: (() => void) | null; cancel: () => void };

let animations: { keyframes: Keyframe[]; options: KeyframeAnimationOptions; anim: FakeAnimation }[] =
  [];

function installAnimate() {
  animations = [];
  Element.prototype.animate = function (keyframes, options) {
    const anim: FakeAnimation = { onfinish: null, cancel: vi.fn() };
    animations.push({
      keyframes: keyframes as Keyframe[],
      options: options as KeyframeAnimationOptions,
      anim,
    });
    return anim as unknown as Animation;
  } as typeof Element.prototype.animate;
}

function removeAnimate() {
  delete (Element.prototype as { animate?: unknown }).animate;
}

/** A card element near the window, which is what Fold looks at to decide whether to animate. */
function placeCard(top: number) {
  document.body.innerHTML = '<h3 id="i1.1"></h3>';
  const h = document.getElementById('i1.1') as HTMLElement;
  h.getBoundingClientRect = () => ({ top, bottom: top + 40 }) as DOMRect;
}

const view = (open: boolean) => (
  <Fold anchorId="i1.1" open={open}>
    <p>solution</p>
  </Fold>
);

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as typeof window.matchMedia;
  placeCard(100);
});

afterEach(() => {
  removeAnimate();
  document.body.innerHTML = '';
});

describe('Fold without animation support', () => {
  it('renders its children only while open, and switches at once', () => {
    const { rerender } = render(view(false));
    expect(screen.queryByText('solution')).toBeNull();
    rerender(view(true));
    expect(screen.getByText('solution')).toBeInTheDocument();
    rerender(view(false));
    expect(screen.queryByText('solution')).toBeNull();
  });

  it('takes no room while closed', () => {
    const { container } = render(view(false));
    expect(container.firstElementChild?.className).toContain('hidden');
  });
});

describe('Fold with animation support', () => {
  beforeEach(installAnimate);

  it('never animates on the first render', () => {
    render(view(true));
    expect(screen.getByText('solution')).toBeInTheDocument();
    expect(animations).toHaveLength(0);
  });

  it('unrolls from 0 while fading in, and flags the opening for the answer sheen', () => {
    const { rerender, container } = render(view(false));
    rerender(view(true));
    expect(screen.getByText('solution')).toBeInTheDocument();
    expect(animations).toHaveLength(1);
    const [first, last] = animations[0].keyframes;
    expect(first).toMatchObject({ height: '0px', opacity: 0 });
    expect(last).toMatchObject({ opacity: 1 });
    expect(animations[0].options.duration).toBe(240);
    expect(container.firstElementChild).toHaveAttribute('data-opening');

    act(() => animations[0].anim.onfinish?.());
    expect(container.firstElementChild).not.toHaveAttribute('data-opening');
    expect(screen.getByText('solution')).toBeInTheDocument();
  });

  it('keeps the children until the roll-up has finished, then removes them', () => {
    const { rerender, container } = render(view(true));
    rerender(view(false));
    expect(screen.getByText('solution')).toBeInTheDocument(); // still there while it rolls up
    expect(animations).toHaveLength(1);
    expect(animations[0].keyframes[1]).toMatchObject({ height: '0px', opacity: 0 });
    expect(container.firstElementChild?.className).not.toContain('hidden');

    act(() => animations[0].anim.onfinish?.());
    expect(screen.queryByText('solution')).toBeNull();
    expect(container.firstElementChild?.className).toContain('hidden');
  });

  it('changes at once when the card is far from the window', () => {
    placeCard(5000);
    const { rerender } = render(view(true));
    rerender(view(false));
    expect(screen.queryByText('solution')).toBeNull();
    expect(animations).toHaveLength(0);
  });

  it('changes at once under reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    const { rerender } = render(view(true));
    rerender(view(false));
    expect(screen.queryByText('solution')).toBeNull();
    expect(animations).toHaveLength(0);
  });

  it('turns around when flipped again while it is moving', () => {
    const { rerender } = render(view(false));
    rerender(view(true));
    rerender(view(false));
    rerender(view(true));
    expect(animations.length).toBeGreaterThanOrEqual(3);
    expect(animations[0].anim.cancel).toHaveBeenCalled();
    expect(screen.getByText('solution')).toBeInTheDocument();
  });
});
