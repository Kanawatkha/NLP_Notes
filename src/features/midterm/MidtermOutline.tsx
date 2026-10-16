import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { ContentFile, ContentNode } from '@/content/types';
import { GroupHeading } from './GroupHeading';
import { ProblemCard } from './ProblemCard';
import { QuestionHeader } from './QuestionHeader';
import { estimateCard } from '@/lib/estimate';
import { RailLayout } from './rail/RailLayout';

/**
 * The page is long (about 35 cards and 500 formulas), so cards are mounted in three ways, all
 * cheap for the first load:
 * - the first two at once, so the hero and the first problems are there on the first paint;
 * - the others when they come within about three screens of the window (`demand`), through the
 *   placeholder that holds their place;
 * - whatever is left, two cards at a time in idle moments, starting five seconds after the page
 *   opened, so scrolling later finds everything ready without competing with the first seconds.
 * A jump from the contents mounts everything first (see below).
 */
export const FIRST_CARDS = 2;
export const CARDS_PER_STEP = 2;
export const BACKGROUND_DELAY_MS = 5000;
const NEAR_MARGIN = '1600px 0px';

function useCardLimit(total: number, mountAll: boolean) {
  const [limit, setLimit] = useState(FIRST_CARDS);
  const openedAt = useRef<number | null>(null);

  const demand = useCallback((index: number) => {
    setLimit((l) => Math.max(l, index + 3));
  }, []);

  useEffect(() => {
    if (mountAll || limit >= total) return;
    openedAt.current ??= performance.now();
    const wait = Math.max(0, BACKGROUND_DELAY_MS - (performance.now() - openedAt.current));
    const next = () => setLimit((l) => l + CARDS_PER_STEP);
    let idle = 0;
    const timer = window.setTimeout(() => {
      if (typeof requestIdleCallback === 'function')
        idle = requestIdleCallback(next, { timeout: 1000 });
      else next();
    }, wait);
    return () => {
      window.clearTimeout(timer);
      if (idle && typeof cancelIdleCallback === 'function') cancelIdleCallback(idle);
    };
  }, [limit, total, mountAll]);

  return { limit: mountAll ? total : limit, demand };
}

/**
 * The first layout of the page is the expensive part of loading it (one layout of a few hundred
 * boxes with Thai text takes about 100 ms on a fast machine, several hundred on a phone). So the
 * hero is committed and painted alone, and the questions follow one at a time in idle moments.
 * Without idle callbacks (old browsers, tests) everything is shown at once.
 */
function useShownQuestions(total: number, all: boolean): number {
  const staged = typeof requestIdleCallback === 'function';
  const [count, setCount] = useState(staged ? 0 : total);
  useEffect(() => {
    if (!staged || all || count >= total) return;
    const grow = () => setCount((c) => Math.min(total, c + 1));
    if (count === 0) {
      // after the hero has been painted
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(grow);
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }
    const id = requestIdleCallback(grow, { timeout: 300 });
    return () => cancelIdleCallback(id);
  }, [staged, all, count, total]);
  return staged && !all ? count : total;
}

/**
 * Keeps the id (and the place in the page) of a card that is not mounted yet, with an estimate of
 * its height. When it comes near the window it asks for its card and the ones after it.
 */
function Pending({
  node,
  index,
  demand,
}: {
  node: ContentNode;
  index: number;
  demand: (index: number) => void;
}) {
  const watch = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) demand(index);
        },
        { rootMargin: NEAR_MARGIN },
      );
      observer.observe(el);
      return () => observer.disconnect();
    },
    [index, demand],
  );
  return (
    <div
      ref={watch}
      id={node.id}
      tabIndex={-1}
      className="scroll-mt-24 outline-none"
      style={{ height: estimateCard(node) }}
    />
  );
}

function itemsOf(root: ContentNode): ContentNode[] {
  const out: ContentNode[] = [];
  const visit = (n: ContentNode) => {
    if (n.kind === 'item') out.push(n);
    n.children.forEach(visit);
  };
  visit(root);
  return out;
}

type MidtermOutlineProps = {
  file: ContentFile;
  /** Mounts every card at once (tests and server rendering). */
  mountAll?: boolean;
};

/** Each question: header panel, groups, problem cards, in source order (the hero is above, in the page). */
export function MidtermOutline({ file, mountAll = false }: MidtermOutlineProps) {
  const items = itemsOf(file.root);
  // a jump to the contents mounts every card first, so the target does not move when the rest arrives
  const [forceAll, setForceAll] = useState(false);
  const { limit, demand } = useCardLimit(items.length, mountAll || forceAll);
  const shownQuestions = useShownQuestions(file.root.children.length, mountAll || forceAll);
  const position = new Map(items.map((n, i) => [n.id, i]));

  const card = (node: ContentNode) => {
    const index = position.get(node.id) ?? 0;
    return index < limit ? (
      <ProblemCard key={node.id} node={node} />
    ) : (
      <Pending key={node.id} node={node} index={index} demand={demand} />
    );
  };

  return (
    <RailLayout root={file.root} beforeJump={() => flushSync(() => setForceAll(true))}>
      <article className="flex flex-col gap-12 py-12 md:py-section">
        {file.root.children.slice(0, shownQuestions).map((question) => (
          <section key={question.id} className="flex flex-col gap-8">
            <QuestionHeader node={question} />
            {question.children.map((child) =>
              child.kind === 'group' ? (
                <section key={child.id} className="flex flex-col gap-6">
                  <GroupHeading node={child} />
                  {child.children.map(card)}
                </section>
              ) : (
                card(child)
              ),
            )}
          </section>
        ))}
      </article>
    </RailLayout>
  );
}
