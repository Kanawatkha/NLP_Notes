import { useMemo, useRef, useState, type ReactNode } from 'react';
import type { ContentNode } from '@/content/types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { jumpTo } from '@/lib/jumpTo';
import { useActiveAnchor } from '../useActiveAnchor';
import { RailDrawer } from './RailDrawer';
import { RailToggle } from './RailToggle';
import { RailTree } from './RailTree';
import { buildRailTree } from './treeModel';
import { UI_TEXT } from '@/config/site';

const RAIL_ID = 'contents-rail';
const DRAWER_ID = 'contents-drawer';

type RailLayoutProps = {
  root: ContentNode;
  /** Runs right before a jump, for example to mount cards that are still placeholders. */
  beforeJump?: () => void;
  children: ReactNode;
};

/**
 * Puts the contents next to the content (UI-SPEC.md section 4).
 *
 * Desktop (1024 px and up): an icon button in a narrow gutter folds a sticky rail. The content
 * takes all the room that is left, so it is as wide as the page margins allow with the rail open
 * and wider with it folded. The width of the rail column is animated (a CSS transition on the grid
 * columns), so the content grows and shrinks with it; cards that are far from the window are
 * skipped by `content-visibility`, which keeps each frame cheap. Reduced motion changes at once.
 *
 * Below that: one column, a round floating button at the bottom left, and the same contents in a
 * drawer. Only one of the two layouts is rendered, so there is never a second, hidden tree.
 */
export function RailLayout({ root, beforeJump, children }: RailLayoutProps) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const entries = useMemo(() => buildRailTree(root), [root]);
  const reading = useActiveAnchor(entries);
  const [railOpen, setRailOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fabRef = useRef<HTMLButtonElement>(null);

  const select = (id: string) => {
    reading.activate(id);
    beforeJump?.();
    jumpTo(id);
  };

  const selectInDrawer = (id: string) => {
    setDrawerOpen(false);
    // the page is scroll-locked until the drawer has started to close
    window.setTimeout(() => select(id), 50);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    fabRef.current?.focus();
  };

  const toggleRail = () => setRailOpen((open) => !open);

  // the drawer has no place on a wide screen: close it in the same render, so it never reopens on narrowing
  if (desktop && drawerOpen) setDrawerOpen(false);

  if (desktop) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div
          className={cn(
            'grid overflow-x-clip transition-[grid-template-columns] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            railOpen
              ? 'grid-cols-[48px_264px_minmax(0,1fr)]'
              : 'grid-cols-[48px_0px_minmax(0,1fr)]',
          )}
        >
          <div className="relative z-10">
            <div className="sticky top-20 mt-section">
              <RailToggle open={railOpen} onClick={toggleRail} controls={RAIL_ID} />
            </div>
          </div>
          <div aria-hidden={!railOpen} inert={!railOpen}>
            <div
              className={cn(
                'sticky top-20 mt-section w-[248px] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none',
                railOpen ? 'translate-x-0 opacity-100' : '-translate-x-[264px] opacity-0',
              )}
            >
              <nav id={RAIL_ID} aria-label={UI_TEXT.railLabel}>
                <RailTree
                  entries={entries}
                  position={reading.position}
                  progress={reading.progress}
                  onSelect={select}
                  className="max-h-[calc(100dvh-8rem)]"
                />
              </nav>
            </div>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[880px] px-4 md:px-6">
      {children}
      <RailToggle
        ref={fabRef}
        open={drawerOpen}
        onClick={() => setDrawerOpen((open) => !open)}
        controls={DRAWER_ID}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-[60] size-12 shadow-float"
      />
      <RailDrawer
        id={DRAWER_ID}
        open={drawerOpen}
        onClose={closeDrawer}
        entries={entries}
        position={reading.position}
        progress={reading.progress}
        onSelect={selectInDrawer}
      />
    </div>
  );
}
