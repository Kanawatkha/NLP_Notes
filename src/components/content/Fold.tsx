import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const DURATION_MS = 240;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

type FoldProps = {
  /** Id of the element the card lives in; its position tells whether it is worth animating. */
  anchorId: string;
  open: boolean;
  children: ReactNode;
};

/** Whether a change to the box of `anchorId` is going to be seen: near the window and motion allowed. */
function worthAnimating(anchorId: string): boolean {
  if (typeof Element.prototype.animate !== 'function' || prefersReducedMotion()) return false;
  const rect = document.getElementById(anchorId)?.getBoundingClientRect();
  if (!rect) return false;
  return rect.bottom > -window.innerHeight && rect.top < window.innerHeight * 2;
}

type Run = { id: number; opening: boolean };

/**
 * Shows or hides its children. Hidden children are not rendered at all (A12).
 *
 * When the visitor flips the switch, a block near the window unrolls or rolls up (height, 240 ms)
 * while its content fades; a block far away, or any block under reduced motion or without the Web
 * Animations API, changes at once. The first render never animates. `data-opening` is set while
 * an opening animation runs, which is what the answer sheen in motion.css listens to.
 */
export function Fold({ anchorId, open, children }: FoldProps) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(false);
  const [run, setRun] = useState<Run | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);

  // decided in the same render as the flip, so the page never paints an in-between state
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (worthAnimating(anchorId)) {
      setRun({ id: (run?.id ?? 0) + 1, opening: open });
      setClosing(!open);
      setOpening(open);
    } else {
      setRun(null);
      setClosing(false);
      setOpening(false);
    }
  }

  useEffect(() => {
    const el = box.current;
    if (!run || !el) return;
    animation.current?.cancel();
    const from = run.opening ? 0 : el.getBoundingClientRect().height;
    const to = run.opening ? el.scrollHeight : 0;
    el.style.overflow = 'hidden';
    const anim = el.animate(
      [
        { height: `${from}px`, opacity: run.opening ? 0 : 1 },
        { height: `${to}px`, opacity: run.opening ? 1 : 0 },
      ],
      { duration: DURATION_MS, easing: EASING, fill: 'both' },
    );
    animation.current = anim;
    anim.onfinish = () => {
      el.style.overflow = '';
      anim.cancel();
      setClosing(false);
      setOpening(false);
    };
    return () => {
      anim.onfinish = null;
      anim.cancel();
      el.style.overflow = '';
    };
  }, [run]);

  const shown = open || closing;
  return (
    <div ref={box} className={shown ? 'fold' : 'fold hidden'} data-opening={opening ? '' : undefined}>
      {shown ? children : null}
    </div>
  );
}
