import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Centered page column: max 1200 px, 16 px gutters on phones, 24 px from md. */
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6 md:py-12', className)}>
      {children}
    </div>
  );
}
