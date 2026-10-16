import { BlockList } from '@/components/content/BlockRenderer';
import type { ContentNode } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { NumberedHeading } from './NumberedHeading';

/**
 * Heading of a group (`###` with `####` items): square number badge, the title, and the group's
 * definition. A 4 px mint bar with an ink outline marks it (the outline carries the contrast).
 * On entering the screen the bar grows and the text fades in (A6).
 */
export function GroupHeading({ node }: { node: ContentNode }) {
  const reveal = useReveal('fade');
  return (
    <header {...reveal} className="relative flex flex-col gap-3 ps-5">
      <span
        aria-hidden="true"
        className="bar-grow absolute inset-y-0 left-0 w-1 rounded-full bg-primary shadow-[0_0_0_1px_var(--color-ink)]"
      />
      <NumberedHeading node={node} level={3} tone="square" titleClass="type-h3" />
      <BlockList blocks={node.explain} />
    </header>
  );
}
