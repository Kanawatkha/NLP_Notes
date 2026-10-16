import { useEffect } from 'react';
import { SITE_NAME } from '@/config/site';

/** Sets document.title to "<page> | NLP Notes". */
export function usePageTitle(page?: string): void {
  useEffect(() => {
    document.title = page ? `${page} | ${SITE_NAME}` : SITE_NAME;
  }, [page]);
}
