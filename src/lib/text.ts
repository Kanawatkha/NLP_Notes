import type { Inline } from '@/content/types';

/** Plain text of inline nodes (formulas are skipped). Used for page titles and short labels. */
export function plainText(nodes: Inline[]): string {
  return nodes
    .map((n) => {
      if (n.t === 'text' || n.t === 'code') return n.v;
      if (n.t === 'strong') return plainText(n.c);
      return '';
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Splits the leading number off a heading ("ข้อ 3 ..." for a question, "3.1  ..." for a group or
 * an item) so it can be shown as a badge. The badge is rendered inside the heading, so the
 * heading text is unchanged. `label` is undefined when the heading does not start with it.
 */
export function splitNumber(
  nodes: Inline[],
  number: string | undefined,
  isQuestion: boolean,
): { label?: string; rest: Inline[] } {
  const first = nodes[0];
  if (!number || !first || first.t !== 'text') return { rest: nodes };
  const n = escapeRegExp(number);
  const pattern = isQuestion
    ? new RegExp('^ข้อ\\s*' + n + '\\s+')
    : new RegExp('^' + n + '\\.?\\s+');
  const m = pattern.exec(first.v);
  if (!m) return { rest: nodes };
  const remainder = first.v.slice(m[0].length);
  const rest: Inline[] = remainder
    ? [{ t: 'text', v: remainder }, ...nodes.slice(1)]
    : nodes.slice(1);
  return { label: m[0].trim(), rest };
}

/**
 * A readable name for a formula that is the only content of a table header cell. The KaTeX output
 * has the formula as hidden MathML, but a header cell needs a name that checkers and every screen
 * reader can see, so it gets this rough reading of the TeX: text commands unwrapped, `_` as "sub",
 * `^` as "sup", `\times` as "times".
 */
export function texLabel(tex: string): string {
  return tex
    .replace(/\\(?:text|textbf|mathbf|mathrm|mathit)\{([^{}]*)\}/g, '$1')
    .replace(/\\(?:times|cdot)/g, ' times ')
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\([A-Za-z]+)/g, '$1')
    .replace(/_/g, ' sub ')
    .replace(/\^/g, ' sup ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
