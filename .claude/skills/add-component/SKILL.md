---
name: add-component
description: Add or change a React component, hook or the page in the NLP Notes app following the project's folder structure, import boundaries, design tokens from DESIGN-jobright.md, accessibility and testing rules. Use when creating or modifying anything under src/.
---

# add-component

Follow `ARCHITECTURE.md` for structure, `UI-SPEC.md` for behavior and the addenda, `DESIGN-jobright.md` for tokens (never edited), `AGENTS.md` for style.

## Checklist

1. **Place it correctly.**
   - Generic, reusable, no course knowledge: `src/components/ui/` or `src/components/layout/`.
   - Renders content blocks: `src/components/content/`.
   - Motion helpers (`Reveal`, `CountUp`, `MotionRoot`): `src/components/motion/`.
   - Belongs to the Midterm page: `src/features/midterm/`.
   - The page itself: `src/pages/MidtermPage.tsx`, declared in `PAGES` (`src/config/site.ts`); a second page is "ask first".
   - Generic hook: `src/hooks/`. Pure helper: `src/lib/`.
2. **Respect import direction.** `pages -> features -> components -> hooks/lib/content types`. A feature never imports another feature. `components/ui` never imports a feature or page. Use the `@/` alias.
3. **Type it.** Strict TypeScript, explicit props type, no `any`. Components take typed content data (`Block`, `ContentNode`) and never raw Markdown or hard-coded course text.
4. **Style with tokens.** Tailwind utilities that reference the `@theme` tokens from `DESIGN-jobright.md` (colors, radius, spacing, type). No inline hex, no magic pixel values that duplicate a token. Apply the pairing rules in `UI-SPEC.md` sections 1 and 12: mint is never text on white and never the only state indicator; `muted` is never text.
5. **Make it accessible.**
   - Semantic element first (`button`, `nav`, `main`, `section`, `h1..h4` in order).
   - Disclosure controls expose `aria-expanded` and `aria-controls` (a switch, if one is ever added, uses `role="switch"` with `aria-checked`).
   - Visible focus ring (2 px ink outline), logical tab order, `Esc` closes transient UI and restores focus.
   - Respect `prefers-reduced-motion` (use the `useReducedMotion` hook).
   - Icon-only controls (the rail toggle, the drawer button, back-to-top) have an accessible name and `aria-expanded` or `aria-label`.
   - Decorative SVG is `aria-hidden`; meaningful figures have a label.
6. **Make it responsive.** Verify 360, 390, 768, 1024, 1440 widths and phone landscape. No horizontal page scroll; wide math and tables scroll inside their own wrapper. Thai headings use the responsive scale in `UI-SPEC.md` Addendum B and keep line height at least 1.25.
7. **Keep it small.** One component per file, named export, file name equals component name. Move data shaping out of JSX into `lib/` or the content pipeline.
8. **Test it.** Add a Vitest test next to the file for logic and each variant (see `TESTING.md` section 4).
9. **Update docs.** If behavior or structure changed, update `UI-SPEC.md` or `ARCHITECTURE.md` in the same change.
10. **Run the gates.** `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` must all pass.

## Anti-patterns

- Hard-coding Thai course text in a component (UI labels from `UI-SPEC.md` go in `src/config/site.ts`).
- Parsing Markdown or running KaTeX in the browser.
- Editing `DESIGN-jobright.md`, or copying the design source's company name, logo, copy or imagery.
- Using the mint accent as the default primary button (the everyday primary is the black pill).
- Heavy shadows, gradients, or a dark theme.
- Adding a dependency without asking.
- Animating width, height or top/left on a long page (use transform and opacity; the exceptions are the rail tree height and the rail column width).
- Creating a new IntersectionObserver per element (use the shared one).
- Importing the full `motion` bundle (use `LazyMotion` and `m.*`).
- Reading `localStorage` without try/catch.

## Component template

```tsx
import type { Block } from '@/content/types';

type NoteBlockProps = { blocks: Block[] };

export function NoteBlock({ blocks }: NoteBlockProps) {
  return (
    <aside className="rounded-sm bg-surface-soft p-md" aria-label="Note">
      {/* render children through BlockRenderer */}
    </aside>
  );
}
```
