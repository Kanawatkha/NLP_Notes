import type { Inline } from '@/content/types';

/**
 * Renders inline nodes. Math HTML is pre-rendered KaTeX produced by scripts/build-content
 * (trusted build output), so it is inserted as-is.
 */
export function InlineContent({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.t) {
          case 'text':
            return node.v;
          case 'strong':
            return (
              <strong key={i} className="font-semibold">
                <InlineContent nodes={node.c} />
              </strong>
            );
          case 'code':
            return (
              <code key={i} className="rounded-[6px] bg-surface-soft px-1.5 py-0.5 font-mono text-[0.92em]">
                {node.v}
              </code>
            );
          case 'math':
            return <span key={i} dangerouslySetInnerHTML={{ __html: node.html }} />;
        }
      })}
    </>
  );
}
