import { useEffect, useState } from 'react';
import type { PageId } from '@/config/site';
import { loadPageContent, loadPageMeta } from '@/content/loaders';
import type { ContentFile, PageMeta } from '@/content/types';

export type LoadState<T> =
  { status: 'loading' } | { status: 'error'; retry: () => void } | { status: 'ready'; data: T };

type Result<T> = { id: string; data?: T; failed?: boolean };

/** Loads something lazily for a page. Shows loading until the data for `id` has arrived. */
function useLazy<T>(id: PageId, load: (id: PageId) => Promise<T>, enabled: boolean): LoadState<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T>>({ id: '' });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    load(id)
      .then((data) => {
        if (!cancelled) setResult({ id, data });
      })
      .catch(() => {
        if (!cancelled) setResult({ id, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [id, load, enabled, attempt]);

  if (result.id !== id) return { status: 'loading' };
  if (result.failed || result.data === undefined) {
    return {
      status: 'error',
      retry: () => {
        setResult({ id: '' });
        setAttempt((n) => n + 1);
      },
    };
  }
  return { status: 'ready', data: result.data };
}

/** The small file for the top of the page. */
export function usePageMeta(id: PageId): LoadState<PageMeta> {
  return useLazy(id, loadPageMeta, true);
}

/** The big content file. Pass `enabled` false to hold it back, for example until the hero is painted. */
export function usePageContent(id: PageId, enabled = true): LoadState<ContentFile> {
  return useLazy(id, loadPageContent, enabled);
}
