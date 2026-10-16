import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SolutionsProvider } from '@/components/content/SolutionsProvider';
import { Navbar } from '@/components/layout/Navbar';
import { DEFAULT_ROUTE, PAGES, UI_TEXT } from '@/config/site';

function setup(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <SolutionsProvider>
        <Navbar />
      </SolutionsProvider>
    </MemoryRouter>,
  );
}

describe('Navbar', () => {
  it('has a logo link to Midterm and one tab per declared page', () => {
    setup(DEFAULT_ROUTE);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(PAGES.length + 1);
    expect(links[0]).toHaveAccessibleName('NLP Notes: Midterm');
    expect(links[0]).toHaveAttribute('href', DEFAULT_ROUTE);
    expect(within(nav).getByRole('link', { name: 'Midterm' })).toHaveAttribute('href', '/midterm');
  });

  it('marks the current tab with aria-current and nothing on an unknown route', () => {
    const { unmount } = setup('/midterm');
    expect(screen.getByRole('link', { name: 'Midterm' })).toHaveAttribute('aria-current', 'page');
    unmount();

    setup('/nowhere');
    expect(screen.getByRole('link', { name: 'Midterm' })).not.toHaveAttribute('aria-current');
  });

  it('holds the solutions switch', () => {
    setup(DEFAULT_ROUTE);
    expect(screen.getByRole('switch', { name: UI_TEXT.solutions })).toBeInTheDocument();
  });
});
