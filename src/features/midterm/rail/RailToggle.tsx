import type { CSSProperties, Ref } from 'react';
import { UI_TEXT } from '@/config/site';
import { cn } from '@/lib/cn';

type RailToggleProps = {
  open: boolean;
  onClick: () => void;
  /** id of the element this button opens, for aria-controls. */
  controls: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
};

const LINE: CSSProperties = {
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transition: 'transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 160ms ease',
};

/** The list icon turns into a cross: the outer bars rotate into an X while the middle one folds away. */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line
        x1="4"
        x2="20"
        y1="7"
        y2="7"
        className="motion-reduce:transition-none"
        style={{ ...LINE, transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }}
      />
      <line
        x1="4"
        x2="20"
        y1="12"
        y2="12"
        className="motion-reduce:transition-none"
        style={{ ...LINE, opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }}
      />
      <line
        x1="4"
        x2="20"
        y1="17"
        y2="17"
        className="motion-reduce:transition-none"
        style={{ ...LINE, transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none' }}
      />
    </svg>
  );
}

/**
 * Icon-only button that opens and closes the contents (UI-SPEC.md section 4). There is no visible
 * text: the accessible name changes with the state, and it exposes aria-expanded and aria-controls.
 */
export function RailToggle({ open, onClick, controls, className, ref }: RailToggleProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={open ? UI_TEXT.railClose : UI_TEXT.railOpen}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-on-dark',
        className,
      )}
    >
      <ToggleIcon open={open} />
    </button>
  );
}
