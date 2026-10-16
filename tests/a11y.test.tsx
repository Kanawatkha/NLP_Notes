import axe from 'axe-core';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../src/app/App';
import { PAGES, UI_TEXT } from '../src/config/site';
import { MidtermOutline } from '../src/features/midterm/MidtermOutline';
import { FIXTURE_MD, fixtureFile } from '../src/test/fixture';
import { buildContent } from '../scripts/build-content/index';

// jsdom has no layout, so colour contrast cannot be computed here; the pairings are checked by
// tests/design-tokens.test.ts and in a real browser (PLAN.md Phase 6).
const OPTIONS: axe.RunOptions = {
  rules: { 'color-contrast': { enabled: false } },
  resultTypes: ['violations'],
};

async function violationsIn(node: Element): Promise<string[]> {
  const results = await axe.run(node, OPTIONS);
  return results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(' | ')})`,
  );
}

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide && query.includes('1024px'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

vi.mock('../src/content/loaders', () => ({
  loadPageContent: () => Promise.resolve(fixtureFile(FIXTURE_MD)),
}));

const realFile = buildContent(process.cwd(), PAGES).pages[0].file;

const app = () => (
  <MemoryRouter initialEntries={['/midterm']}>
    <AppRoutes />
  </MemoryRouter>
);

describe('accessibility (axe, structure and names)', () => {
  beforeEach(() => window.localStorage.clear());

  it('the whole app on a wide screen has no violations', async () => {
    mockViewport(true);
    const { container } = render(app());
    await screen.findByRole('heading', { level: 2, name: /Tokenization/ });
    expect(await violationsIn(container)).toEqual([]);
  });

  it('the whole app on a narrow screen has no violations, also with the drawer open', async () => {
    mockViewport(false);
    const { container } = render(app());
    await screen.findByRole('heading', { level: 2, name: /Tokenization/ });
    expect(await violationsIn(container)).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.railOpen }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(await violationsIn(container)).toEqual([]);
  });

  it('all 35 cards of the real content have no violations ', async () => {
    mockViewport(true);
    const on = render(<MidtermOutline file={realFile} mountAll />);
    const onResults = await axe.run(on.container, {
      ...OPTIONS,
      // the page landmark comes from the app shell, not from this outline
      rules: { ...OPTIONS.rules, region: { enabled: false } },
    });
    expect(onResults.violations.map((v) => v.id)).toEqual([]);
  });
});
