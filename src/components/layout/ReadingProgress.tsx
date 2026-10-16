import { useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

/**
 * 3 px line along the bottom of the navbar that grows with the scroll (A4): a hairline track and a
 * mint fill. It only writes a CSS transform, so scrolling never re-renders anything. Decorative
 * (it repeats the scrollbar), so it is hidden from assistive technology.
 */
export function ReadingProgress() {
  const fill = useRef<HTMLDivElement>(null);
  useScrollProgress((progress) => {
    if (fill.current) fill.current.style.transform = `scaleX(${progress})`;
  });
  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-hairline">
      <div
        ref={fill}
        data-progress-fill=""
        className="h-full origin-left scale-x-0 bg-primary will-change-transform"
      />
    </div>
  );
}
