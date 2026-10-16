import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Reading column (880 px). The block styling for rendered Markdown is added in Phase 4. */
export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('type-body-md max-w-[880px] text-ink', className)}>{children}</div>;
}
