import type { ElementType, HTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

/**
 * outlined  white card with a hairline border (problem cards)
 * mint      pale-mint panel with one square corner (question headers)
 * feature   white mockup card, 40 px with one square corner, floating on a whisper shadow
 * soft      surface-soft inset panel (figures, notes)
 */
export type CardVariant = 'outlined' | 'mint' | 'feature' | 'soft';

const VARIANTS: Record<CardVariant, string> = {
  outlined: 'rounded-lg border border-hairline bg-canvas p-4 md:p-6',
  mint: 'rounded-card rounded-tl-none bg-canvas-mint p-6 md:p-8',
  feature: 'rounded-card rounded-tl-none bg-canvas p-6 shadow-float',
  soft: 'rounded-md bg-surface-soft p-4',
};

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: CardVariant;
  as?: ElementType;
  ref?: Ref<HTMLElement>;
};

export function Card({ variant = 'outlined', as: Tag = 'div', className, ...rest }: CardProps) {
  return <Tag className={cn('text-ink', VARIANTS[variant], className)} {...rest} />;
}
