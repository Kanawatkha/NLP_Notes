import { useSolutions } from '@/components/content/solutions';
import { UI_TEXT } from '@/config/site';
import { cn } from '@/lib/cn';

/**
 * Switch that shows or hides the Sol and Ans of every card (UI-SPEC.md section 6). The label is
 * always visible, so the state is never color-only; on phones the label shortens to "เฉลย".
 */
export function SolutionsSwitch() {
  const { show, setShow } = useSolutions();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={show}
      aria-label={UI_TEXT.solutions}
      onClick={() => setShow(!show)}
      className="type-nav inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-ink"
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border border-ink transition-colors duration-150',
          show ? 'bg-ink' : 'bg-surface-soft',
        )}
      >
        <span
          className={cn(
            'absolute top-[2px] left-[2px] size-[18px] rounded-full transition-transform duration-[450ms] ease-[var(--ease-spring)]',
            show ? 'translate-x-5 bg-primary' : 'bg-ink',
          )}
        />
      </span>
      <span aria-hidden="true" className="hidden sm:inline">
        {UI_TEXT.solutions}
      </span>
      <span aria-hidden="true" className="sm:hidden">
        {UI_TEXT.solutionsShort}
      </span>
    </button>
  );
}
