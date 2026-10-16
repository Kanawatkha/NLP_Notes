import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { DEFAULT_ROUTE, UI_TEXT } from '@/config/site';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle(UI_TEXT.notFound);
  return (
    <PageContainer className="flex flex-col items-start gap-6">
      <h1 className="type-h2">{UI_TEXT.notFound}</h1>
      <ButtonLink to={DEFAULT_ROUTE} variant="dark-square">
        {UI_TEXT.backToMidterm}
      </ButtonLink>
    </PageContainer>
  );
}
