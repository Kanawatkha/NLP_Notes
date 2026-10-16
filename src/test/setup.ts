import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Some suites run in the node environment (content pipeline tests), where there is no window.
if (typeof window !== 'undefined') {
  // jsdom does not implement scrolling; the app scrolls after a navigation and on jumps.
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();
}

afterEach(() => {
  if (typeof document !== 'undefined') cleanup();
});
