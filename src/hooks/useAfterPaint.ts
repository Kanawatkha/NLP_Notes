import { useEffect, useState } from 'react';

/**
 * False until two frames after `active` became true, that is, until what `active` let appear has
 * been painted. Used to start heavy work (loading the content) after the first paint instead of
 * competing with it. Without requestAnimationFrame it follows `active` at once.
 */
export function useAfterPaint(active: boolean): boolean {
  const [done, setDone] = useState(false);
  const immediate = typeof requestAnimationFrame !== 'function';
  useEffect(() => {
    if (!active || immediate) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setDone(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [active, immediate]);
  return active && (immediate || done);
}
