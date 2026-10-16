/**
 * Data model produced by scripts/build-content and consumed by the React app.
 * Shared by both sides, so it must stay free of runtime code. See CONTENT-SCHEMA.md.
 */

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'math'; tex: string; html: string };

/** Table column alignment: n = none, l = left, c = center, r = right. */
export type Align = 'n' | 'l' | 'c' | 'r';

export type ListItem = { c: Inline[]; children: Block[] };

export type Block =
  | { t: 'p'; c: Inline[] }
  | { t: 'math'; tex: string; html: string }
  | { t: 'list'; ordered: boolean; items: ListItem[] }
  | { t: 'table'; align: Align[]; head: Inline[][]; rows: Inline[][][] }
  | { t: 'figure'; svg: string }
  | { t: 'note'; c: Block[] }
  | { t: 'example'; id: string; problem: Block[]; sol: Block[]; ans: Block[] };

/**
 * root     the `#` title
 * question `##`  (ข้อ N)
 * group    `###` that has `####` children
 * item     a `###` without children, or a `####`; holds exactly one worked example
 */
export type NodeKind = 'root' | 'question' | 'group' | 'item';

export type ContentNode = {
  /** Stable id: "root", "q3", "g3.2", "i3.2.2". Positional ("h2-1") when a heading has no number. */
  id: string;
  kind: NodeKind;
  level: 1 | 2 | 3 | 4;
  /** "3" for "ข้อ 3", "3.2", "3.2.2". Absent on the root and on unnumbered headings. */
  number?: string;
  /** The full heading, kept for the round trip. */
  title: Inline[];
  /** The heading without a trailing "(P คะแนน)". Equals `title` when there is none. */
  displayTitle: Inline[];
  /** Questions only, parsed from the trailing "(P คะแนน)". */
  points?: number;
  /** Definition and shared statement. Never the worked example. */
  explain: Block[];
  /** Items only: one `example` block (empty when the item has no Sol marker). */
  examples: Block[];
  children: ContentNode[];
  source: { file: string; line: number };
};

export type ContentFile = {
  /** The page id from PAGES in src/config/site.ts. */
  id: string;
  title: Inline[];
  root: ContentNode;
};

/** Numbers shown in the hero, derived from the content tree (never typed by hand). */
export type PageStats = {
  questions: number;
  groups: number;
  items: number;
  examples: number;
  /** Sum of the points of all questions; 0 when no question states its points. */
  totalPoints: number;
};

/**
 * What the top of the page needs, in a file of its own (a few hundred bytes) so the hero can be
 * painted before the big content file has arrived and been parsed.
 */
export type PageMeta = {
  id: string;
  title: Inline[];
  stats: PageStats;
  /** Id of the first question, for the button of the hero. */
  firstQuestionId?: string;
};
