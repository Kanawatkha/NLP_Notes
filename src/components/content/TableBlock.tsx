import type { Align, Inline } from '@/content/types';
import { InlineContent } from '@/components/content/InlineContent';
import { ScrollArea } from '@/components/content/ScrollArea';
import { texLabel } from '@/lib/text';

const ALIGN_CLASS: Record<Align, string> = {
  n: 'text-center',
  l: 'text-left',
  c: 'text-center',
  r: 'text-right',
};

/** A header cell that holds nothing but formulas gets a readable name (see texLabel). */
function formulaOnlyLabel(cell: Inline[]): string | undefined {
  if (!cell.every((n) => n.t === 'math')) return undefined;
  return cell.map((n) => (n.t === 'math' ? texLabel(n.tex) : '')).join(' ');
}

type TableBlockProps = { align: Align[]; head: Inline[][]; rows: Inline[][][] };

/** Pipe table (ex-data-table-cell chrome). The wrapper scrolls sideways so a wide table never widens the page. */
export function TableBlock({ align, head, rows }: TableBlockProps) {
  return (
    <ScrollArea className="rounded-md border border-hairline">
      <table className="type-body-sm w-full border-collapse">
        <thead>
          <tr>
            {head.map((cell, c) => {
              const label = formulaOnlyLabel(cell);
              return cell.length === 0 ? (
                // an empty header cell is not a column label, so it is a plain cell
                <td key={c} className="bg-surface-soft" />
              ) : (
                <th
                  key={c}
                  scope="col"
                  aria-label={label}
                  className={`type-caption bg-surface-soft px-4 py-3 font-semibold whitespace-nowrap ${ALIGN_CLASS[align[c] ?? 'n']}`}
                >
                  <InlineContent nodes={cell} />
                  {label ? <span className="sr-only">{label}</span> : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`border-t border-hairline px-4 py-3 ${ALIGN_CLASS[align[c] ?? 'n']}`}
                >
                  <InlineContent nodes={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
