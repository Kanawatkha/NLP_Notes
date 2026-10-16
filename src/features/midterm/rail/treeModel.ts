import type { ContentNode } from '@/content/types';
import { plainText, truncate } from '@/lib/text';

/** One line of the contents tree: a question, a group, or an item. */
export type RailEntry = {
  id: string;
  kind: 'question' | 'group' | 'item';
  label: string;
  questionId: string;
  /** The group this entry is or sits in. Items directly under a question have none. */
  groupId?: string;
  children: RailEntry[];
};

/** Where the reader is: the deepest entry reached, and the question and group it belongs to. */
export type ReadingPosition = { entryId: string; questionId: string; groupId?: string };

const LABEL_MAX = 44;

/** Builds the contents tree (questions, groups, items) from the content tree. */
export function buildRailTree(root: ContentNode): RailEntry[] {
  return root.children.map((q) => {
    const entry = (n: ContentNode, groupId?: string): RailEntry => ({
      id: n.id,
      kind: n.kind === 'question' ? 'question' : n.kind === 'group' ? 'group' : 'item',
      label: truncate(plainText(n.displayTitle), LABEL_MAX),
      questionId: q.id,
      ...(n.kind === 'group' ? { groupId: n.id } : groupId ? { groupId } : {}),
      children: n.children.map((c) => entry(c, n.kind === 'group' ? n.id : groupId)),
    });
    return entry(q);
  });
}

/** Every entry in page order (a question, then its groups and items). */
export function flattenRail(entries: RailEntry[]): RailEntry[] {
  return entries.flatMap((e) => [e, ...flattenRail(e.children)]);
}

export function positionOf(entry: RailEntry): ReadingPosition {
  return {
    entryId: entry.id,
    questionId: entry.questionId,
    ...(entry.groupId ? { groupId: entry.groupId } : {}),
  };
}
