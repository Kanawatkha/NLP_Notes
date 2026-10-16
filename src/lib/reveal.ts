import { prefersReducedMotion } from '@/lib/motion';

/** Delay between blocks that come into view together, and how many of them are staggered. */
const STAGGER_MS = 40;
const STAGGER_MAX = 3;

let observer: IntersectionObserver | undefined;

function show(el: HTMLElement, instant: boolean, delayMs = 0): void {
  if (instant) el.dataset.instant = '';
  if (delayMs > 0) {
    el.style.transitionDelay = `${delayMs}ms`;
    // the delay belongs to the entrance only, not to later hover transitions
    window.setTimeout(() => {
      el.style.transitionDelay = '';
    }, 900);
  }
  el.dataset.shown = '';
}

function onEntries(entries: IntersectionObserverEntry[]): void {
  let together = 0;
  for (const entry of entries) {
    const el = entry.target as HTMLElement;
    if (entry.isIntersecting) {
      show(el, false, Math.min(together++, STAGGER_MAX) * STAGGER_MS);
      observer?.unobserve(el);
    } else if (entry.boundingClientRect.top < 0) {
      // already above the window, for example after a jump: no entrance, just the final state
      show(el, true);
      observer?.unobserve(el);
    }
  }
}

/**
 * Shows `el` (data-shown) once it comes into view. One IntersectionObserver serves every block on
 * the page, and each block is released after its single entrance. Without an observer, or when the
 * visitor asked for less motion, the block is shown at once. Returns a cleanup function.
 */
export function observeReveal(el: HTMLElement): () => void {
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    show(el, true);
    return () => {};
  }
  // the bottom margin makes a block start its entrance a little before it is fully in view
  observer ??= new IntersectionObserver(onEntries, { rootMargin: '0px 0px -10% 0px' });
  observer.observe(el);
  return () => observer?.unobserve(el);
}

/** Test hook: forget the shared observer so a test can install its own IntersectionObserver. */
export function resetRevealObserver(): void {
  observer?.disconnect();
  observer = undefined;
}
