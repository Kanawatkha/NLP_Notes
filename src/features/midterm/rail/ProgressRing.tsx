const SIZE = 20;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Small ring that fills clockwise as the reader moves through a question (the score-ring idea of
 * DESIGN-jobright.md). Complete: a solid mint disc with an ink check. Decorative, the contents
 * work without it.
 */
export function ProgressRing({ value }: { value: number }) {
  const done = value >= 1;
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      aria-hidden="true"
      data-complete={done ? '' : undefined}
      className="shrink-0 text-ink"
    >
      {done ? (
        <>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            className="fill-primary"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 10.4l2.6 2.6L14 7.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            className="stroke-hairline"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - Math.max(0, value))}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            className="transition-[stroke-dashoffset] duration-300"
          />
        </>
      )}
    </svg>
  );
}
