import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * dark     black pill, question number ("ข้อ 3")
 * square   black square-pill, group number ("3.1")
 * outline  white pill with an ink border, points
 * soft     surface-soft chip, item number
 */
export type BadgeTone = 'dark' | 'square' | 'outline' | 'soft';

const TONES: Record<BadgeTone, string> = {
  dark: 'rounded-full bg-ink text-on-dark',
  square: 'rounded-sm bg-ink text-on-dark',
  outline: 'rounded-full border border-ink bg-canvas text-ink',
  soft: 'rounded-full bg-surface-soft text-ink',
};

type BadgeProps = { tone?: BadgeTone; className?: string; children: ReactNode };

export function Badge({ tone = 'soft', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'type-caption inline-flex items-center px-3 py-1 font-semibold whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
