export type IconName =
  'list' | 'close' | 'arrow-up' | 'chevron-down' | 'check' | 'layers' | 'pencil' | 'star';

const PATHS: Record<IconName, string> = {
  list: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  'chevron-down': 'M6 9l6 6 6-6',
  check: 'M5 12.5l5 5 9-10.5',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  star: 'M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7L12 3z',
};

type IconProps = { name: IconName; size?: number; className?: string };

/** Decorative stroke icon. Pair it with a text label or aria-label on the parent control. */
export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
