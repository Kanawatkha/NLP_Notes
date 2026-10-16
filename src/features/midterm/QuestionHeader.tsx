import { BlockList } from '@/components/content/BlockRenderer';
import { InlineContent } from '@/components/content/InlineContent';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { UI_TEXT } from '@/config/site';
import type { ContentNode } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { NumberedHeading } from './NumberedHeading';

/**
 * Mint header panel of a question (`##`): the number badge and title, the points, then the
 * question's text. The first paragraph is its definition (light lead text); anything after it, such
 * as the statement shared by the sub-questions, is regular text. On entering the screen the panel
 * rises, the number badge pops and the points pill slides in (A5).
 */
export function QuestionHeader({ node }: { node: ContentNode }) {
  const [first, ...rest] = node.explain;
  const lead = first?.t === 'p' ? first : undefined;
  const reveal = useReveal();
  return (
    <Card {...reveal} variant="mint" as="header" className="flex flex-col gap-4">
      <NumberedHeading node={node} level={2} tone="dark" titleClass="type-h2" badgeClass="pop-in" />
      {node.points !== undefined ? (
        <p>
          <Badge tone="outline" className="slide-in-right">
            {node.points} {UI_TEXT.points}
          </Badge>
        </p>
      ) : null}
      {lead ? (
        <p className="type-body-lg">
          <InlineContent nodes={lead.c} />
        </p>
      ) : null}
      <BlockList blocks={lead ? rest : node.explain} />
    </Card>
  );
}
