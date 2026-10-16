import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SOLUTIONS_STORAGE_KEY, SolutionsProvider } from '@/components/content/SolutionsProvider';
import { useSolutions } from '@/components/content/solutions';
import { SolutionsSwitch } from '@/components/layout/SolutionsSwitch';
import { UI_TEXT } from '@/config/site';

function Probe() {
  const { show } = useSolutions();
  return <p data-testid="state">{show ? 'shown' : 'hidden'}</p>;
}

function setup() {
  return render(
    <SolutionsProvider>
      <SolutionsSwitch />
      <Probe />
    </SolutionsProvider>,
  );
}

const getSwitch = () => screen.getByRole('switch', { name: UI_TEXT.solutions });

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('SolutionsSwitch', () => {
  it('is on by default and exposes its state to assistive technology', () => {
    setup();
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('state')).toHaveTextContent('shown');
  });

  it('toggles with a click and is a real button, so Enter and Space work natively', () => {
    setup();
    const sw = getSwitch();
    expect(sw.tagName).toBe('BUTTON');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('remembers the choice across visits', () => {
    const first = setup();
    fireEvent.click(getSwitch());
    expect(window.localStorage.getItem(SOLUTIONS_STORAGE_KEY)).toBe('0');
    first.unmount();

    setup();
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');
  });

  it('keeps working for the visit when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    setup();
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(getSwitch());
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false');
  });

  it('shows the label in full and in the short form for small screens', () => {
    setup();
    expect(screen.getByText(UI_TEXT.solutions, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.solutionsShort)).toBeInTheDocument();
  });
});
