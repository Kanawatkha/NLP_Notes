import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CHECK_MS, MAX_RELOADS, check, watchVersion } from './versionCheck';

const reload = vi.fn();
const unregister = vi.fn().mockResolvedValue(true);
const deleteCache = vi.fn().mockResolvedValue(true);

function answer(body: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) } as Response),
  );
}

beforeEach(() => {
  sessionStorage.clear();
  reload.mockReset();
  unregister.mockClear();
  deleteCache.mockClear();
  Object.defineProperty(window, 'location', {
    value: { ...window.location, reload },
    configurable: true,
  });
  Object.defineProperty(navigator, 'serviceWorker', {
    value: { getRegistrations: () => Promise.resolve([{ unregister }]) },
    configurable: true,
  });
  vi.stubGlobal('caches', {
    keys: () => Promise.resolve(['workbox-precache-v2', 'other']),
    delete: deleteCache,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('check', () => {
  it('asks the network for version.json without using a cache', async () => {
    answer({ id: __BUILD_ID__ });
    await check();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toMatch(/version\.json\?t=\d+$/);
    expect(options).toEqual({ cache: 'no-store' });
  });

  it('keeps the page when the build id is the same', async () => {
    answer({ id: __BUILD_ID__ });
    await check();
    expect(reload).not.toHaveBeenCalled();
    expect(unregister).not.toHaveBeenCalled();
  });

  it('drops the service worker and every cache, then reloads, when a newer build exists', async () => {
    answer({ id: 'a-newer-build' });
    await check();
    expect(unregister).toHaveBeenCalledTimes(1);
    expect(deleteCache).toHaveBeenCalledWith('workbox-precache-v2');
    expect(deleteCache).toHaveBeenCalledWith('other');
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('stops after three reloads in a row, so a lagging server cannot trap the page in a loop', async () => {
    answer({ id: 'a-newer-build' });
    for (let i = 0; i < MAX_RELOADS + 2; i++) await check();
    expect(reload).toHaveBeenCalledTimes(MAX_RELOADS);
  });

  it('keeps the page offline, on a bad answer, and when the file has no id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await check();
    answer({}, false);
    await check();
    answer({});
    await check();
    expect(reload).not.toHaveBeenCalled();
  });
});

describe('watchVersion', () => {
  it('does nothing in development builds', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    watchVersion()();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('checks when the page opens, on a timer, when it comes back, and when the network returns', async () => {
    vi.stubEnv('DEV', false);
    vi.useFakeTimers();
    answer({ id: __BUILD_ID__ });
    const stop = watchVersion();
    const calls = () => (fetch as ReturnType<typeof vi.fn>).mock.calls.length;

    expect(calls()).toBe(1);
    await vi.advanceTimersByTimeAsync(CHECK_MS);
    expect(calls()).toBe(2);
    window.dispatchEvent(new Event('online'));
    expect(calls()).toBe(3);
    window.dispatchEvent(new Event('pageshow'));
    expect(calls()).toBe(4);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(calls()).toBe(5);

    stop();
    await vi.advanceTimersByTimeAsync(CHECK_MS * 2);
    window.dispatchEvent(new Event('online'));
    expect(calls()).toBe(5);
    vi.unstubAllEnvs();
  });
});
