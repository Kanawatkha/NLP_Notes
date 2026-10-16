import type { Block } from '@/content/types';
import { BlockList } from '@/components/content/BlockRenderer';
import { ScrollArea } from '@/components/content/ScrollArea';

type ExampleBlockProps = { block: Extract<Block, { t: 'example' }> };

/** A problem with its solution: the problem, the Sol label and steps, and the Ans strip. Always shown. */
export function ExampleBlock({ block }: ExampleBlockProps) {
  const hasSolution = block.sol.length > 0 || block.ans.length > 0;
  return (
    <section data-example={block.id} className="flex flex-col gap-4">
      <BlockList blocks={block.problem} />
      {hasSolution ? (
        <div data-solution="" className="flex flex-col gap-4">
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
      ) : null}
    </section>
  );
}
