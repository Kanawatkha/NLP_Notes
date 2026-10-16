import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const DURATION_MS = 900;

/** Whether the number should count up at all (not under reduced motion, and needs an observer). */
function canAnimate(): boolean {
  return typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion();
}

/**
 * A number that counts up from 0 once it is on the screen (A2, 900 ms, ease-out). While it counts,
 * the final value is also in the page as hidden text, so a screen reader reads the real number at
 * once; before and after the count there is just the number.
 */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [animate] = useState(canAnimate);
  const [shown, setShown] = useState(animate ? 0 : value);

  useEffect(() => {
    const el = ref.current;
    if (!animate || !el) return;
    let frame = 0;
    const start = (startTime: number) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / DURATION_MS);
        const eased = 1 - (1 - t) ** 3;
        setShown(Math.round(value * eased));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      start(performance.now());
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [animate, value]);

  const counting = shown !== value;
  return (
    <span ref={ref} className="tabular">
      {counting ? (
        <>
          <span className="sr-only">{value}</span>
          <span aria-hidden="true">{shown}</span>
        </>
      ) : (
        value
      )}
    </span>
  );
}
