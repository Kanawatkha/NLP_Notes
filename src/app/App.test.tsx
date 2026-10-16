import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '@/app/App';
import { UI_TEXT } from '@/config/site';
import { FIXTURE_MD, fixtureFile } from '@/test/fixture';

vi.mock('@/content/loaders', () => ({
  loadPageContent: () => Promise.resolve(fixtureFile(FIXTURE_MD)),
}));

const TITLE = 'Midterm Practice Exam';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('routes', () => {
  it('redirects / to the Midterm page', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument();
    expect(document.title).toBe('Midterm | NLP Notes');
  });

  it('renders the Midterm page at /midterm', async () => {
    renderAt('/midterm');
    expect(await screen.findByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument();
  });

  it('shows the not-found page with a link back to Midterm for unknown routes', async () => {
    renderAt('/nowhere');
    expect(await screen.findByRole('heading', { name: UI_TEXT.notFound })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: UI_TEXT.backToMidterm })).toHaveAttribute(
      'href',
      '/midterm',
    );
  });
});
