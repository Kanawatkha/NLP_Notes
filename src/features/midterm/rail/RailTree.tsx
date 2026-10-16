import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ProgressRing } from './ProgressRing';
import type { RailEntry, ReadingPosition } from './treeModel';

const STAGGER_MAX = 8;
const STAGGER_BASE_MS = 120;
const STAGGER_STEP_MS = 30;

type RailTreeProps = {
  entries: RailEntry[];
  position: ReadingPosition;
  progress: Record<string, number>;
  onSelect: (id: string) => void;
  /** The first entries rise in one after another (the drawer opening, A10). */
  stagger?: boolean;
  /** Sizing of the scrolling container (the tree scrolls inside it when it is longer than the window). */
  className?: string;
};

/** Height animation without measuring: a one-row grid that goes from 0fr to 1fr. */
function Expand({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      inert={!open}
      className={cn(
        'grid transition-[grid-template-rows] duration-200 ease-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

/**
 * The contents: questions, their groups, and the items of the group being read. The question and
 * the group that hold the reading position are expanded, the rest are folded, so all 35 items are
 * reachable without a very long list. One highlight slides to the current entry.
 */
export function RailTree({
  entries,
  position,
  progress,
  onSelect,
  stagger = false,
  className,
}: RailTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  // Slides the highlight to the current entry, and keeps up while the tree expands or the window resizes.
  useLayoutEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    const scroller = scrollRef.current;
    if (!list || !marker) return;

    const place = () => {
      const entry = Array.from(list.querySelectorAll<HTMLElement>('[data-rail-id]')).find(
        (el) => el.dataset.railId === position.entryId,
      );
      if (!entry) {
        marker.style.opacity = '0';
        return;
      }
      if (!placed.current) {
        // the first placement jumps there instead of sliding in from the top
        marker.style.transition = 'none';
        placed.current = true;
      }
      marker.style.height = `${entry.offsetHeight}px`;
      marker.style.transform = `translateY(${entry.offsetTop}px)`;
      marker.style.opacity = '1';
      if (marker.style.transition === 'none') {
        void marker.offsetHeight;
        marker.style.transition = '';
      }
      if (scroller) {
        const top = entry.offsetTop;
        const bottom = top + entry.offsetHeight;
        if (
          top < scroller.scrollTop + 8 ||
          bottom > scroller.scrollTop + scroller.clientHeight - 8
        ) {
          scroller.scrollTo({
            top: Math.max(0, top - scroller.clientHeight / 2),
            behavior: 'smooth',
          });
        }
      }
    };

    place();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [position.entryId]);

  let entryIndex = 0;
  const entryButton = (e: RailEntry, depth: 1 | 2 | 3) => {
    const current = e.id === position.entryId;
    const order = entryIndex++;
    const staggered = stagger && order < STAGGER_MAX;
    return (
      <button
        type="button"
        data-rail-id={e.id}
        aria-current={current ? 'location' : undefined}
        onClick={() => onSelect(e.id)}
        style={
          staggered
            ? { animationDelay: `${STAGGER_BASE_MS + order * STAGGER_STEP_MS}ms` }
            : undefined
        }
        className={cn(
          'relative flex w-full items-center gap-3 rounded-sm py-2 pe-3 text-start',
          staggered && 'rise-in',
          depth === 1 && 'type-nav ps-3',
          depth === 2 && 'type-body-sm ps-3',
          depth === 3 && 'type-caption ps-3',
          current ? 'font-semibold' : depth === 1 ? '' : 'font-medium',
        )}
      >
        {depth === 1 ? <ProgressRing value={progress[e.id] ?? 0} /> : null}
        <span>{e.label}</span>
      </button>
    );
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        'overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <ul ref={listRef} className="relative flex flex-col gap-1">
        <span
          ref={markerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 rounded-sm border-s-4 border-primary bg-surface-soft opacity-0 shadow-[inset_1px_0_0_0_var(--color-ink)] transition-[transform,height] duration-300 ease-out motion-reduce:transition-none"
        />
        {entries.map((q) => (
          <li key={q.id}>
            {entryButton(q, 1)}
            {q.children.length > 0 ? (
              <Expand open={q.id === position.questionId}>
                <ul className="ms-5 flex flex-col gap-1 border-s border-hairline ps-2">
                  {q.children.map((child) => (
                    <li key={child.id}>
                      {entryButton(child, 2)}
                      {child.children.length > 0 ? (
                        <Expand open={child.id === position.groupId}>
                          <ul className="ms-4 flex flex-col gap-1 border-s border-hairline ps-2">
                            {child.children.map((item) => (
                              <li key={item.id}>{entryButton(item, 3)}</li>
                            ))}
                          </ul>
                        </Expand>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Expand>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
