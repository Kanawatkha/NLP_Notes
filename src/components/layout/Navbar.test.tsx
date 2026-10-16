import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Navbar } from '@/components/layout/Navbar';
import { DEFAULT_ROUTE, PAGES } from '@/config/site';

function setup(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Navbar />
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

  it('has no solutions switch: the solutions are always shown', () => {
    setup(DEFAULT_ROUTE);
    expect(screen.queryByRole('switch')).toBeNull();
  });
});
