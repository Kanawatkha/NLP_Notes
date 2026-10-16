import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { UI_TEXT } from '@/config/site';
import { watchVersion } from './versionCheck';

/** How often an open page asks the server whether a new service worker exists. */
const UPDATE_CHECK_MS = 60_000;

/**
 * Bottom-left host for the "offline ready" and "new version ready" toasts, driven by the service
 * worker. A new version is applied automatically: the page checks for one on a timer and when the
 * tab regains focus, then activates it and reloads without asking. The toast stays as a backup: on
 * a phone that is slow to switch, its button applies the update at once. It sits above the
 * floating contents button on narrow screens.
 */
export function ToastHost() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => void registration.update().catch(() => undefined);
      setInterval(check, UPDATE_CHECK_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });

  useEffect(() => watchVersion(), []);

  useEffect(() => {
    if (needRefresh) void updateServiceWorker(true);
  }, [needRefresh, updateServiceWorker]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 left-4 z-[55] max-w-[calc(100vw-2rem)] lg:bottom-4"
    >
      {needRefresh ? (
        <div className="pointer-events-auto">
          <Toast
            action={
              <Button variant="primary-sm" onClick={() => void updateServiceWorker(true)}>
                {UI_TEXT.updateAction}
              </Button>
            }
          >
            {UI_TEXT.updateReady}
          </Toast>
        </div>
      ) : offlineReady ? (
        <div className="pointer-events-auto">
          <Toast
            action={
              <Button variant="primary-sm" onClick={() => setOfflineReady(false)}>
                {UI_TEXT.dismiss}
              </Button>
            }
          >
            {UI_TEXT.offlineReady}
          </Toast>
        </div>
      ) : null}
    </div>
  );
}
