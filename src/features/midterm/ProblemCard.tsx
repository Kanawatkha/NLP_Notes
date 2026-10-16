import { BlockList } from '@/components/content/BlockRenderer';
import { FigureLabelContext } from '@/components/content/figureLabel';
import { Card } from '@/components/ui/Card';
import type { ContentNode } from '@/content/types';
import { useReveal } from '@/hooks/useReveal';
import { estimateCard } from '@/lib/estimate';
import { plainText } from '@/lib/text';
import { NumberedHeading } from './NumberedHeading';

/**
 * One problem (an item): number chip and title, the problem, then Sol, the steps and the answer.
 * The card rises into place once
 * when it comes into view, and lifts a little under a hovering pointer (A7). The browser skips the
 * layout of a card that is far from the window (`content-visibility`), using an estimate of its
 * height until it has been shown once; this is what keeps the first load of the long page light.
 */
export function ProblemCard({ node }: { node: ContentNode }) {
  const reveal = useReveal();
  return (
    <Card
      {...reveal}
      as="article"
      aria-labelledby={node.id}
      className="card-lift flex flex-col gap-4"
      style={{ contentVisibility: 'auto', containIntrinsicSize: `auto ${estimateCard(node)}px` }}
    >
      <NumberedHeading
        node={node}
        level={node.level === 4 ? 4 : 3}
        tone="soft"
        titleClass="type-h4"
      />
      <FigureLabelContext.Provider value={plainText(node.displayTitle)}>
        <BlockList blocks={node.explain} />
        <BlockList blocks={node.examples} />
      </FigureLabelContext.Provider>
    </Card>
  );
}
