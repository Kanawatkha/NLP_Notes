import { SITE_NAME } from '@/config/site';

/** Brand mark: three token chips, the last one filled mint (geometry in UI-SPEC.md section 11). */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-ink"
    >
      <g stroke="currentColor" strokeWidth="2">
        <rect x="2" y="11" width="8" height="10" rx="3" />
        <rect x="12" y="11" width="6" height="10" rx="3" />
        <rect x="20" y="11" width="10" height="10" rx="3" className="fill-primary" />
      </g>
    </svg>
  );
}

/** Mark plus wordmark: "NLP" in Titillium Web 700, "Notes" in 600, both ink. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2" aria-label={SITE_NAME}>
      <LogoMark />
      <span
        aria-hidden="true"
        className="font-display text-[22px] leading-none whitespace-nowrap max-[420px]:hidden"
      >
        <span className="font-bold">NLP</span> <span className="font-semibold">Notes</span>
      </span>
    </span>
  );
}
