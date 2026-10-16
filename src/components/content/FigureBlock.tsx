import { ScrollArea } from '@/components/content/ScrollArea';
import { useFigureLabel } from '@/components/content/figureLabel';

/**
 * Inline SVG figure. The markup is validated at build time (CONTENT-SCHEMA.md section 6) and uses
 * currentColor, so it follows the text color. It sits in a soft frame and never leaves its column.
 * Its accessible name is the heading of the card it belongs to.
 */
export function FigureBlock({ svg }: { svg: string }) {
  const label = useFigureLabel();
  return (
    <figure aria-label={label} className="rounded-md bg-surface-soft p-4 text-ink">
      <ScrollArea className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full" html={svg} />
    </figure>
  );
}
