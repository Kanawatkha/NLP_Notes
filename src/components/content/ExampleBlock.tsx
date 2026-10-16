import { useState } from 'react';
import type { Block } from '@/content/types';
import { BlockList } from '@/components/content/BlockRenderer';
import { Fold } from '@/components/content/Fold';
import { ScrollArea } from '@/components/content/ScrollArea';
import { useSolutions } from '@/components/content/solutions';
import { Button } from '@/components/ui/Button';
import { UI_TEXT } from '@/config/site';

type ExampleBlockProps = { block: Extract<Block, { t: 'example' }> };

/**
 * A problem with its solution. The solution (the Sol label, the steps and the Ans strip) follows
 * the global "show solutions" switch; while the switch is off, a button reveals just this card.
 * Flipping the global switch clears every per-card choice. Hidden solutions are not rendered; a
 * card near the window folds open or shut (A12), the answer strip catches a light sweep on opening.
 */
export function ExampleBlock({ block }: ExampleBlockProps) {
  const { show } = useSolutions();
  const [state, setState] = useState({ show, revealed: false });
  if (state.show !== show) setState({ show, revealed: false });

  const hasSolution = block.sol.length > 0 || block.ans.length > 0;
  const visible = show || state.revealed;
  const solutionId = `${block.id}-solution`;
  // the heading of the card has the id of the item, which is the example id without its suffix
  const anchorId = block.id.replace(/\/e\d+$/, '');

  return (
    <section data-example={block.id} className="flex flex-col gap-4">
      <BlockList blocks={block.problem} />
      {hasSolution && !show ? (
        <div>
          <Button
            variant="dark-square"
            aria-expanded={visible}
            aria-controls={solutionId}
            onClick={() => setState((s) => ({ ...s, revealed: !s.revealed }))}
          >
            {visible ? UI_TEXT.hideSolution : UI_TEXT.showSolution}
          </Button>
        </div>
      ) : null}
      {hasSolution ? (
        <Fold anchorId={anchorId} open={visible}>
          <div id={solutionId} data-solution="" className="flex flex-col gap-4">
          {block.sol.length > 0 ? (
            <>
              <p className="type-caption w-fit rounded-full bg-surface-soft px-3 py-1 font-semibold">
                Sol
              </p>
              <BlockList blocks={block.sol} />
            </>
          ) : null}
          {block.ans.length > 0 ? (
            <ScrollArea className="ans-strip rounded-md border-l-4 border-ink bg-canvas-mint p-4">
              <BlockList blocks={block.ans} />
            </ScrollArea>
          ) : null}
          </div>
        </Fold>
      ) : null}
    </section>
  );
}
