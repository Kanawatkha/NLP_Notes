import { InlineContent } from '@/components/content/InlineContent';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { ContentNode } from '@/content/types';
import { cn } from '@/lib/cn';
import { splitNumber } from '@/lib/text';

type NumberedHeadingProps = {
  node: ContentNode;
  /** Heading level of the element: 2 for a question, 3 for a group, 3 or 4 for an item. */
  level: 2 | 3 | 4;
  tone: BadgeTone;
  /** Type utility for the title (type-h2, type-h3, type-h4). */
  titleClass: string;
  className?: string;
  /** Extra classes for the number badge (for the entrance animation). */
  badgeClass?: string;
};

/**
 * Heading whose leading number ("ข้อ 3", "3.1", "3.1.1") is shown as a badge. The badge sits inside
 * the heading, so the heading text is exactly the Markdown heading, and the element carries the
 * node id so the rail and the jump button can find it.
 */
export function NumberedHeading({
  node,
  level,
  tone,
  titleClass,
  className,
  badgeClass,
}: NumberedHeadingProps) {
  const { label, rest } = splitNumber(node.displayTitle, node.number, node.kind === 'question');
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <Tag
      id={node.id}
      tabIndex={-1}
      className={cn(
        titleClass,
        'flex scroll-mt-24 flex-wrap items-center gap-x-3 gap-y-2 outline-none',
        className,
      )}
    >
      {label ? (
        <Badge tone={tone} className={badgeClass}>
          {label}
        </Badge>
      ) : null}{' '}
      <span>
        <InlineContent nodes={rest} />
      </span>
    </Tag>
  );
}
