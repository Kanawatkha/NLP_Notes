import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';

/**
 * The button family of DESIGN-jobright.md. `primary` (black pill) is the everyday action;
 * `green` (mint pill) is the single signature accent and is kept rare (UI-SPEC.md section 7).
 */
export type ButtonVariant = 'primary' | 'primary-sm' | 'green' | 'dark-square';

const BASE =
  'inline-flex items-center justify-center gap-2 select-none disabled:cursor-not-allowed disabled:opacity-40';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'type-button min-h-12 rounded-xl bg-ink px-10 py-3 text-on-dark md:px-section max-md:w-full',
  'primary-sm': 'type-nav min-h-11 rounded-pill-nav bg-ink px-4 py-1 text-on-dark',
  green:
    'type-button min-h-12 rounded-pill border border-ink bg-primary px-12 py-3 text-on-primary',
  'dark-square': 'type-button min-h-11 rounded-sm bg-ink px-4 py-3 text-on-dark',
};

type CommonProps = { variant?: ButtonVariant; className?: string; children: ReactNode };
type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = CommonProps & Omit<LinkProps, 'className' | 'children'>;

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={cn(BASE, VARIANTS[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/** Same look as Button, rendered as a router link. */
export function ButtonLink({ variant = 'primary', className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cn(BASE, VARIANTS[variant], className)} {...rest}>
      {children}
    </Link>
  );
}
