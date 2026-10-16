import { useCallback, type RefCallback } from 'react';
import { observeReveal } from '@/lib/reveal';

/**
 * Gives an element a one-time entrance when it comes into view: spread the result on the element
 * (`<article {...useReveal()}>`). It is a callback ref plus the `data-reveal` attribute; the styles
 * live in motion.css (`data-reveal`, `data-shown`).
 */
export function useReveal(variant: 'rise' | 'fade' = 'rise'): {
  ref: RefCallback<HTMLElement>;
  'data-reveal': 'rise' | 'fade';
} {
  const ref = useCallback<RefCallback<HTMLElement>>(
    (el) => (el ? observeReveal(el) : undefined),
    [],
  );
  return { ref, 'data-reveal': variant };
}
