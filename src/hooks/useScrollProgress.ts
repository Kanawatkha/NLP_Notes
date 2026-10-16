import { useEffect, useRef } from 'react';

/**
 * Calls `onChange(progress, scrollY)` when the page scrolls or resizes, at most once per frame.
 * `progress` is 0 to 1 over the scrollable height of the page. The callback is meant for cheap DOM
 * writes (a CSS transform) or a state setter that bails out on equal values, so the page does not
 * re-render on every scroll event.
 */
export function useScrollProgress(onChange: (progress: number, scrollY: number) => void): void {
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
      latest.current(progress, y);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
}
