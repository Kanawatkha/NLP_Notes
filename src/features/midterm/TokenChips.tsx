import type { CSSProperties } from 'react';

/**
 * Decorative hero graphic (A3): eight token chips that merge in three rounds, like the merges of
 * BPE, ending in one wide mint chip. No text. Geometry and timing are computed here; the keyframes
 * are in motion.css.
 */
const LEAVES = 8;
const LEAF_W = 28;
const GAP = 20;
const HEIGHT = 40;
const RADIUS = 12;
const ROUND_MS = 900;
const FIRST_ROUND_MS = 500;
const DURATION_MS = 800;

type Chip = { level: number; x: number; w: number; dx: number; delay: number; delayOut: number };

/** All chips of all levels: level 0 are the leaves, level k merges two chips of level k - 1. */
function buildChips(): Chip[] {
  const chips: Chip[] = [];
  let previous: Chip[] = Array.from({ length: LEAVES }, (_, i) => ({
    level: 0,
    x: i * (LEAF_W + GAP),
    w: LEAF_W,
    dx: 0,
    delay: 0,
    delayOut: 0,
  }));
  chips.push(...previous);
  for (let level = 1; 2 ** level <= LEAVES; level++) {
    const delay = FIRST_ROUND_MS + (level - 1) * ROUND_MS;
    const next: Chip[] = [];
    for (let j = 0; j < previous.length; j += 2) {
      const left = previous[j];
      const right = previous[j + 1];
      const gap = right.x - (left.x + left.w);
      // the children slide half the gap each, then the wider chip replaces them
      left.dx = gap / 2;
      right.dx = -gap / 2;
      left.delayOut = right.delayOut = delay;
      next.push({
        level,
        x: left.x + gap / 2,
        w: left.w + right.w,
        dx: 0,
        delay,
        delayOut: 0,
      });
    }
    chips.push(...next);
    previous = next;
  }
  return chips;
}

const CHIPS = buildChips();
const TOP_LEVEL = Math.max(...CHIPS.map((c) => c.level));
const WIDTH = LEAVES * LEAF_W + (LEAVES - 1) * GAP;

export function TokenChips({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`-2 -2 ${WIDTH + 4} ${HEIGHT + 4}`}
      aria-hidden="true"
      focusable="false"
      className={className}
      data-chips={CHIPS.length}
    >
      <g stroke="currentColor" strokeWidth="2">
        {CHIPS.map((chip, i) => {
          const merges = chip.level < TOP_LEVEL;
          const appears = chip.level > 0;
          const style = {
            '--dx': `${chip.dx}px`,
            '--delay': `${chip.delay}ms`,
            '--delay-out': `${chip.delayOut}ms`,
            '--dur': `${DURATION_MS}ms`,
          } as CSSProperties;
          const classes = [
            merges ? 'chip-out' : '',
            appears ? 'chip-in' : '',
            chip.level === TOP_LEVEL ? 'chip-final' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <rect
              key={i}
              x={chip.x}
              y={0}
              width={chip.w}
              height={HEIGHT}
              rx={RADIUS}
              className={classes}
              style={style}
              fill={chip.level === TOP_LEVEL ? 'var(--color-primary)' : 'var(--color-canvas)'}
            />
          );
        })}
      </g>
    </svg>
  );
}
