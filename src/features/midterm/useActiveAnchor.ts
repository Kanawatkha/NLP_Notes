import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flattenRail, positionOf, type RailEntry, type ReadingPosition } from './rail/treeModel';

/** A heading counts as "reached" once its top is this far below the top of the window. */
export const REACH_OFFSET = 120;
/** Longest a click-triggered smooth scroll is trusted to run; scroll tracking is paused meanwhile. */
const LOCK_MS = 1000;

export type ReadingState = {
  position: ReadingPosition;
  /** 0 to 1 per question: how far the reading line has moved through that question. */
  progress: Record<string, number>;
  /** 0 to 1 for the whole page. */
  page: number;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round2 = (n: number) => Math.round(n * 100) / 100;

function sameState(a: ReadingState, b: ReadingState): boolean {
  if (a.page !== b.page) return false;
  if (a.position.entryId !== b.position.entryId) return false;
  for (const key of Object.keys(b.progress)) if (a.progress[key] !== b.progress[key]) return false;
  return true;
}

/**
 * Scroll spy for the contents tree. One scroll listener (throttled to a frame) works out the
 * deepest heading the reader has reached, how far through each question the reading line is, and
 * how far through the page. `activate` sets the position at once (a click on the contents) and
 * pauses the spy until the smooth scroll that follows has ended, so the highlight goes straight to
 * its target instead of racing through every heading on the way.
 */
export function useActiveAnchor(entries: RailEntry[]) {
  const flat = useMemo(() => flattenRail(entries), [entries]);
  const questions = useMemo(() => entries.map((e) => e.id), [entries]);
  const first = flat[0];
  const [state, setState] = useState<ReadingState>(() => ({
    position: first ? positionOf(first) : { entryId: '', questionId: '' },
    progress: Object.fromEntries(questions.map((q) => [q, 0])),
    page: 0,
  }));
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (performance.now() < lockUntil.current) return;

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let current = flat[0];
      for (const entry of flat) {
        const el = document.getElementById(entry.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= REACH_OFFSET) current = entry;
        else break;
      }
      if (atBottom && flat.length > 0) current = flat[flat.length - 1];

      const progress: Record<string, number> = {};
      for (const id of questions) {
        const box = document.getElementById(id)?.closest('section');
        if (!box) {
          progress[id] = 0;
          continue;
        }
        const { top, height } = box.getBoundingClientRect();
        progress[id] = height > 0 ? round2(clamp01((REACH_OFFSET - top) / height)) : 0;
      }
      const lastQuestion = questions[questions.length - 1];
      if (atBottom && lastQuestion) progress[lastQuestion] = 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const page = scrollable > 0 ? round2(clamp01(window.scrollY / scrollable)) : 0;

      const next: ReadingState = {
        position: current ? positionOf(current) : { entryId: '', questionId: '' },
        progress,
        page,
      };
      setState((prev) => (sameState(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScrollEnd = () => {
      lockUntil.current = 0;
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('scrollend', onScrollEnd);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scrollend', onScrollEnd);
      cancelAnimationFrame(frame);
    };
  }, [flat, questions]);

  const activate = useCallback(
    (id: string) => {
      const entry = flat.find((e) => e.id === id);
      if (!entry) return;
      setState((prev) => ({ ...prev, position: positionOf(entry) }));
      lockUntil.current = performance.now() + LOCK_MS;
      // browsers without a scrollend event: resume tracking once the lock has run out
      setTimeout(() => window.dispatchEvent(new Event('scroll')), LOCK_MS + 50);
    },
    [flat],
  );

  return { ...state, activate };
}
