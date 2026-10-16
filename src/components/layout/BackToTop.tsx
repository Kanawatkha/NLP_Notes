import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { UI_TEXT } from '@/config/site';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from '@/lib/motion';

const SIZE = 56;
const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Round button at the bottom right that scrolls to the top (A14). It appears (fade and scale) once
 * the first screen has been scrolled past, and a thin mint ring around it fills with the page
 * progress. While hidden it is out of the tab order.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useScrollProgress((progress, y) => {
    setVisible(y > window.innerHeight * 0.75);
    if (ring.current) ring.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
  });

  return (
    <button
      type="button"
      aria-label={UI_TEXT.backToTop}
      inert={!visible}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
      className={cn(
        'fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] inline-flex items-center justify-center rounded-full bg-ink text-on-dark shadow-float transition-[opacity,transform] duration-300 ease-[var(--ease-spring)]',
        visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0',
      )}
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        fill="none"
        aria-hidden="true"
        className="absolute inset-0"
      >
        <circle
          ref={ring}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <Icon name="arrow-up" size={22} />
    </button>
  );
}
