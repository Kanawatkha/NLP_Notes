import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { SolutionsSwitch } from '@/components/layout/SolutionsSwitch';
import { DEFAULT_ROUTE, PAGES, SITE_NAME } from '@/config/site';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/cn';

/**
 * Top navigation (UI-SPEC.md section 2): logo, one tab per page declared in PAGES, and the
 * solutions switch. Sticky, 64 px. The reading-progress line runs along its bottom edge (A4), and
 * a whisper shadow fades in once the page has scrolled 8 px (A15).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useScrollProgress((_progress, y) => setScrolled(y > 8));
  return (
    <header
      data-scrolled={scrolled ? '' : undefined}
      className={cn(
        'sticky top-0 z-50 bg-canvas transition-shadow duration-150',
        scrolled && 'shadow-float',
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-[var(--spacing-nav)] max-w-[1200px] items-center gap-3 px-4 md:gap-6 md:px-6"
      >
        <Link to={DEFAULT_ROUTE} className="rounded-sm" aria-label={`${SITE_NAME}: Midterm`}>
          <Logo />
        </Link>

        <ul className="flex items-center gap-1">
          {PAGES.map((page) => (
            <li key={page.id}>
              <NavLink
                to={page.route}
                className={({ isActive }) =>
                  cn(
                    'type-nav inline-flex min-h-11 items-center rounded-pill-nav px-4 whitespace-nowrap',
                    isActive ? 'bg-ink text-on-dark' : 'text-ink',
                  )
                }
              >
                {page.tab}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ms-auto">
          <SolutionsSwitch />
        </div>
      </nav>
      <ReadingProgress />
    </header>
  );
}
