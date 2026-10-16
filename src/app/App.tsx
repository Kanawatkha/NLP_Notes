import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { DEFAULT_ROUTE, PAGES, UI_TEXT, type PageId } from '@/config/site';
import { installDragScroll } from '@/lib/dragScroll';

const MidtermPage = lazy(() => import('@/pages/MidtermPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/** One component per page declared in PAGES; a missing entry is a type error. */
const PAGE_COMPONENTS: Record<PageId, ComponentType> = {
  midterm: MidtermPage,
};

/** The routes without a router, so tests can mount them in a MemoryRouter. */
export function AppRoutes() {
  return (
    <Suspense fallback={<p className="p-6">{UI_TEXT.loading}</p>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={DEFAULT_ROUTE} replace />} />
          {PAGES.map((page) => {
            const Page = PAGE_COMPONENTS[page.id];
            return <Route key={page.id} path={page.route} element={<Page />} />;
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export function App() {
  useEffect(installDragScroll, []);
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
