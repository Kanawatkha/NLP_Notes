import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { FIXTURE_MD, fixtureFile, fixtureMeta } from '@/test/fixture';
import MidtermPage from './MidtermPage';

const loaders = vi.hoisted(() => ({ loadPageContent: vi.fn(), loadPageMeta: vi.fn() }));
vi.mock('@/content/loaders', () => loaders);

const file = fixtureFile(FIXTURE_MD);
const meta = fixtureMeta(file);

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
  loaders.loadPageMeta.mockReset();
});

describe('MidtermPage', () => {
  it('shows a skeleton while loading, then the hero, then the content', async () => {
    loaders.loadPageMeta.mockResolvedValue(meta);
    loaders.loadPageContent.mockResolvedValue(file);
    const { container } = render(<MidtermPage />);
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('แนวข้อสอบทดสอบ');
    expect(
      await screen.findByRole('heading', { level: 2, name: /Tokenization/ }),
    ).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
    expect(document.title).toBe('Midterm | NLP Notes');
    expect(loaders.loadPageMeta).toHaveBeenCalledWith('midterm');
    expect(loaders.loadPageContent).toHaveBeenCalledWith('midterm');
  });

  it('paints the hero before it even asks for the content, and keeps a skeleton for the rest', async () => {
    const content = deferred<typeof file>();
    loaders.loadPageMeta.mockResolvedValue(meta);
    loaders.loadPageContent.mockReturnValue(content.promise);
    const { container } = render(<MidtermPage />);

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    // the hero is there, the content has not been requested yet: that waits for the paint
    expect(loaders.loadPageContent).not.toHaveBeenCalled();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });
    expect(loaders.loadPageContent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();

    await act(async () => content.resolve(file));
    expect(
      await screen.findByRole('heading', { level: 2, name: /Tokenization/ }),
    ).toBeInTheDocument();
  });

  it('shows the load error of the top of the page with a retry button that loads again', async () => {
    loaders.loadPageMeta.mockRejectedValueOnce(new Error('chunk failed'));
    loaders.loadPageMeta.mockResolvedValueOnce(meta);
    loaders.loadPageContent.mockResolvedValue(file);
    render(<MidtermPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent(UI_TEXT.loadError);

    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.retry }));
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('แนวข้อสอบทดสอบ');
    expect(loaders.loadPageMeta).toHaveBeenCalledTimes(2);
  });

  it('keeps the hero when only the content fails, and retries just the content', async () => {
    loaders.loadPageMeta.mockResolvedValue(meta);
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
    expect(loaders.loadPageMeta).toHaveBeenCalledTimes(1);
  });
});
