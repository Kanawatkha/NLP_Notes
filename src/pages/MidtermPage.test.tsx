import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { FIXTURE_MD, fixtureFile } from '@/test/fixture';
import MidtermPage from './MidtermPage';

const loaders = vi.hoisted(() => ({ loadPageContent: vi.fn() }));
vi.mock('@/content/loaders', () => loaders);

const file = fixtureFile(FIXTURE_MD);

/** A promise the test settles by hand. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

beforeEach(() => {
  loaders.loadPageContent.mockReset();
});

describe('MidtermPage', () => {
  it('paints the hero first, with a skeleton for the content, then shows the content', async () => {
    const content = deferred<typeof file>();
    loaders.loadPageContent.mockReturnValue(content.promise);
    const { container } = render(<MidtermPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Midterm Practice Exam');
    // the content is only requested after the hero has been painted
    expect(loaders.loadPageContent).not.toHaveBeenCalled();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });
    expect(loaders.loadPageContent).toHaveBeenCalledWith('midterm');
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();

    await act(async () => content.resolve(file));
    expect(
      await screen.findByRole('heading', { level: 2, name: /Tokenization/ }),
    ).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
    expect(document.title).toBe('Midterm | NLP Notes');
  });

  it('keeps the hero when the content fails, and retries just the content', async () => {
    loaders.loadPageContent.mockRejectedValueOnce(new Error('chunk failed'));
    loaders.loadPageContent.mockResolvedValueOnce(file);
    render(<MidtermPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent(UI_TEXT.loadError);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.retry }));
    expect(
      await screen.findByRole('heading', { level: 2, name: /Tokenization/ }),
    ).toBeInTheDocument();
    expect(loaders.loadPageContent).toHaveBeenCalledTimes(2);
  });
});
