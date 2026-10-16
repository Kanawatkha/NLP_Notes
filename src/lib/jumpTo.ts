import { prefersReducedMotion } from '@/lib/motion';

/** How long the underline that marks the arrival stays on the heading (A13). */
const ARRIVE_MS = 1800;

/** After the scroll, the target is put right again up to this many times (cards near it may have changed size). */
const SETTLE_TRIES = 3;
/** Longest a smooth scroll is waited for when the browser sends no scrollend event. */
const SMOOTH_WAIT_MS = 1200;
const INSTANT_WAIT_MS = 120;
/** The target counts as in place when it is this close to where the scroll margin puts it. */
const SETTLE_TOLERANCE = 4;

/** The pending timer that ends the mark of each target, so choosing it again restarts the mark. */
const timers = new WeakMap<HTMLElement, number>();

/**
 * Scrolls to the element with `id` (smooth, instant under reduced motion) and moves focus to it,
 * so keyboard and screen reader users arrive where the page does. The URL hash is not touched:
 * it belongs to the router. The target gets `data-arrive` for a moment: motion.css draws an
 * underline under it (A13). Returns false when there is no such element.
 */
/**
 * Cards far from the window are laid out from a height estimate (content-visibility), so a long
 * scroll can end a little off when the cards near the target take their real size. Once the scroll
 * has ended, this looks at where the target is and, if it is off, puts it right again.
 */
function settle(el: HTMLElement, smooth: boolean, tries = SETTLE_TRIES): void {
  let done = false;
  const check = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', check);
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const off = el.getBoundingClientRect().top - margin;
    if (Math.abs(off) > SETTLE_TOLERANCE && tries > 0 && el.isConnected) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      settle(el, false, tries - 1);
    }
  };
  window.addEventListener('scrollend', check, { once: true });
  window.setTimeout(check, smooth ? SMOOTH_WAIT_MS : INSTANT_WAIT_MS);
}

export function jumpTo(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const smooth = !prefersReducedMotion();
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  settle(el, smooth);
  el.focus({ preventScroll: true });
  // restart the underline when the same target is chosen again
  el.removeAttribute('data-arrive');
  void el.offsetWidth;
  el.setAttribute('data-arrive', '');
  window.clearTimeout(timers.get(el));
  timers.set(
    el,
    window.setTimeout(() => el.removeAttribute('data-arrive'), ARRIVE_MS),
  );
  return true;
}
