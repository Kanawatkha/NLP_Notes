import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Listener = (overflowing: boolean) => void;

const listeners = new Map<Element, Listener>();
let observer: ResizeObserver | undefined;
let watchedFonts: FontFaceSet | undefined;
let scrollWatched = false;
const SETTLE_MS = 250;

const overflows = (el: Element) => el.scrollWidth > el.clientWidth + 1;

/** Measures every area again, in one pass (one layout). */
function recheckAll(): void {
  for (const [el, onChange] of listeners) onChange(overflows(el));
}

/**
 * A formula or a table gets wider when its font arrives, but the box that scrolls keeps its size, so
 * the ResizeObserver stays silent. Every area is measured again whenever fonts finish loading.
 */
function watchFonts(): void {
  if (typeof document === 'undefined' || !document.fonts || document.fonts === watchedFonts) return;
  watchedFonts = document.fonts;
  watchedFonts.addEventListener('loadingdone', recheckAll);
  void watchedFonts.ready.then(recheckAll);
}

/**
 * Cards far from the window are skipped by the browser (content-visibility) and report no size, so
 * an area inside one can be measured wrongly just before its card is laid out. Everything is
 * measured again once things have been quiet for a moment: after areas were added, and after
 * scrolling.
 */
let recheckTimer = 0;
function scheduleRecheck(): void {
  window.clearTimeout(recheckTimer);
  recheckTimer = window.setTimeout(recheckAll, SETTLE_MS);
}

function watchScrolling(): void {
  if (scrollWatched || typeof window === 'undefined') return;
  scrollWatched = true;
  window.addEventListener('scroll', scheduleRecheck, { passive: true });
}

/**
 * One ResizeObserver serves every scroll area on the page. Hundreds of observers each reading
 * layout on their own make a long page slow to start. Nothing is measured when an area mounts
 * (that forced a layout for each of the 570 areas, about 200 ms in a Lighthouse run): the observer
 * reports every element once after the first layout, in one batch, and again whenever it resizes.
 */
function watchOverflow(el: HTMLElement, onChange: Listener): () => void {
  if (typeof ResizeObserver === 'undefined') {
    onChange(overflows(el));
    return () => {};
  }
  observer ??= new ResizeObserver((entries) => {
    for (const { target } of entries) listeners.get(target)?.(overflows(target));
  });
  watchFonts();
  watchScrolling();
  listeners.set(el, onChange);
  observer.observe(el);
  scheduleRecheck();
  return () => {
    listeners.delete(el);
    observer?.unobserve(el);
  };
}

type ScrollAreaProps = {
  className?: string;
  /** Pre-rendered trusted markup (KaTeX or a validated SVG). Used instead of children. */
  html?: string;
  children?: ReactNode;
  /** Accessible name for the scrollable region, used while it really overflows. */
  label?: string;
};

/**
 * Horizontal scroll container for wide math, tables and figures. It becomes a keyboard stop
 * (a focusable region) only while its content really overflows, so short blocks add no tab stops.
 */
export function ScrollArea({ className, html, children, label }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watchOverflow(el, setOverflowing);
  }, [html]);

  const shared = {
    ref,
    className: cn('thin-scroll overflow-x-auto', className),
    tabIndex: overflowing ? 0 : undefined,
    // a named region only when the caller gives a name; an unnamed region is not a useful landmark
    role: overflowing && label ? 'region' : undefined,
    'aria-label': overflowing && label ? label : undefined,
  };
  return html !== undefined ? (
    <div {...shared} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div {...shared}>{children}</div>
  );
}
