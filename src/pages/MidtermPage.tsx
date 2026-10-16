import 'katex/dist/katex-swap.min.css';
import '@/styles/content.css';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { UI_TEXT } from '@/config/site';
import { Hero } from '@/features/midterm/Hero';
import { MidtermOutline } from '@/features/midterm/MidtermOutline';
import { useAfterPaint } from '@/hooks/useAfterPaint';
import { usePageContent } from '@/hooks/usePageContent';
import { usePageTitle } from '@/hooks/usePageTitle';

function LoadError({ retry }: { retry: () => void }) {
  return (
    <PageContainer>
      <div role="alert" className="flex flex-col items-start gap-4">
        <p className="type-body-md">{UI_TEXT.loadError}</p>
        <Button variant="dark-square" onClick={retry}>
          {UI_TEXT.retry}
        </Button>
      </div>
    </PageContainer>
  );
}

/**
 * The Midterm page: the content of content/midterm/exam_practice.md. The hero is static and painted
 * first; the content, which is big, is only asked for after that paint, so the first thing a visitor
 * sees does not wait for it.
 */
export default function MidtermPage() {
  usePageTitle('Midterm');
  const heroPainted = useAfterPaint(true);
  const content = usePageContent('midterm', heroPainted);

  return (
    <>
      <Hero />
      {content.status === 'ready' ? (
        <MidtermOutline file={content.data} />
      ) : content.status === 'error' ? (
        <LoadError retry={content.retry} />
      ) : (
        <PageContainer>
          <PageSkeleton />
        </PageContainer>
      )}
    </>
  );
}
