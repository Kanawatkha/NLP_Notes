import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Body text that fills its container. The block styling for rendered Markdown is added in Phase 4. */
export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('type-body-md text-ink', className)}>{children}</div>;
}
