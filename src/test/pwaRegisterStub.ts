/**
 * Stand-in for `virtual:pwa-register/react` in tests (see the alias in vite.config.ts): the real
 * module is produced by vite-plugin-pwa, which Vitest cannot load. It reports nothing to show.
 */
export function useRegisterSW() {
  return {
    offlineReady: [false, () => {}] as const,
    needRefresh: [false, () => {}] as const,
    updateServiceWorker: () => Promise.resolve(),
  };
}
