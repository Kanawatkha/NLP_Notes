import { Fragment } from 'react';
import { InlineContent } from '@/components/content/InlineContent';
import type { Inline } from '@/content/types';

/** The words of a title rise one after another; only this many are staggered, the rest follow together. */
const MAX_STAGGERED = 12;
const STEP_MS = 60;

type Piece = { kind: 'space'; text: string } | { kind: 'word'; nodes: Inline[] };

/** Splits the title at spaces. Anything that is not plain text (bold, code, a formula) stays whole. */
function toPieces(nodes: Inline[]): Piece[] {
  const out: Piece[] = [];
  for (const node of nodes) {
    if (node.t !== 'text') {
      out.push({ kind: 'word', nodes: [node] });
      continue;
    }
    for (const part of node.v.split(/(\s+)/)) {
      if (part === '') continue;
      out.push(
        /^\s+$/.test(part)
          ? { kind: 'space', text: part }
          : { kind: 'word', nodes: [{ t: 'text', v: part }] },
      );
    }
  }
  return out;
}

/**
 * Title with a word-by-word entrance (A1). The text is exactly the title: only the words are
 * wrapped in spans (60 ms apart, at most 12 staggered). Under reduced motion the animation ends at
 * once (index.css), so the title simply shows.
 */
export function AnimatedTitle({ nodes }: { nodes: Inline[] }) {
  let index = 0;
  return (
    <>
      {toPieces(nodes).map((piece, i) => {
        if (piece.kind === 'space') return <Fragment key={i}>{piece.text}</Fragment>;
        const delay = Math.min(index++, MAX_STAGGERED - 1) * STEP_MS;
        return (
          <span key={i} className="word-rise" style={{ animationDelay: `${delay}ms` }}>
            <InlineContent nodes={piece.nodes} />
          </span>
        );
      })}
    </>
  );
}
