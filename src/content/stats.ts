import type { ContentFile, ContentNode, PageMeta, PageStats } from './types';

/** Numbers shown in the hero, derived from the content tree (never typed by hand). */
export function computeStats(root: ContentNode): PageStats {
  const s: PageStats = { questions: 0, groups: 0, items: 0, examples: 0, totalPoints: 0 };
  const visit = (n: ContentNode) => {
    if (n.kind === 'question') {
      s.questions++;
      s.totalPoints += n.points ?? 0;
    }
    if (n.kind === 'group') s.groups++;
    if (n.kind === 'item') {
      s.items++;
      if (n.examples.length > 0) s.examples++;
    }
    n.children.forEach(visit);
  };
  visit(root);
  return s;
}

/** The small file for the top of the page. Written by the content build, also used by tests. */
export function metaOf(file: ContentFile): PageMeta {
  return {
    id: file.id,
    title: file.title,
    stats: computeStats(file.root),
    ...(file.root.children[0] ? { firstQuestionId: file.root.children[0].id } : {}),
  };
}
