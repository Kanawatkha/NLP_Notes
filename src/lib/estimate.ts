import type { Block, ContentNode } from '@/content/types';

/**
 * Rough height in pixels of a block on a phone, used as the placeholder size of a card that the
 * browser has not laid out yet (`contain-intrinsic-size`). It only has to be in the right range:
 * once a card has been shown the browser remembers its real size. A good guess keeps the scroll
 * bar, the reading progress and the jump targets from drifting while the cards are laid out.
 */
export function estimateBlock(block: Block): number {
  switch (block.t) {
    case 'p':
      return 52;
    case 'math':
      return 72;
    case 'list':
      return block.items.reduce(
        (sum, it) => sum + 34 + it.children.reduce((s, b) => s + estimateBlock(b), 0),
        0,
      );
    case 'table':
      return 52 + (block.rows.length + 1) * 46;
    case 'figure':
      return 340;
    case 'note':
      return 32 + block.c.reduce((sum, b) => sum + estimateBlock(b), 0);
    case 'example':
      return [...block.problem, ...block.sol, ...block.ans].reduce(
        (sum, b) => sum + estimateBlock(b),
        0,
      );
  }
}

/** Estimated height of the card of an item: padding and heading, plus the blocks. */
export function estimateCard(node: ContentNode): number {
  const blocks = [...node.explain, ...node.examples].reduce((sum, b) => sum + estimateBlock(b), 0);
  return Math.round(120 + blocks);
}
