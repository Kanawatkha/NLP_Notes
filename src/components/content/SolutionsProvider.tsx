import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { SolutionsContext } from '@/components/content/solutions';

/** localStorage key of the switch (PLAN.md D12: shown by default, remembered in the browser). */
export const SOLUTIONS_STORAGE_KEY = 'nlp:show-solutions';

function readStored(): boolean {
  try {
    return window.localStorage.getItem(SOLUTIONS_STORAGE_KEY) !== '0';
  } catch {
    return true;
  }
}

/** Holds the "show solutions" switch. Storage can be blocked (private windows), then it only lasts for the visit. */
export function SolutionsProvider({ children }: { children: ReactNode }) {
  const [show, setShowState] = useState(readStored);

  const setShow = useCallback((next: boolean) => {
    setShowState(next);
    try {
      window.localStorage.setItem(SOLUTIONS_STORAGE_KEY, next ? '1' : '0');
    } catch {
      // the switch still works for this visit when storage is blocked
    }
  }, []);

  const value = useMemo(() => ({ show, setShow }), [show, setShow]);
  return <SolutionsContext.Provider value={value}>{children}</SolutionsContext.Provider>;
}
