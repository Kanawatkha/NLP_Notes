import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { RailToggle } from './RailToggle';

describe('RailToggle', () => {
  it('is an icon button: no visible text, a name that follows the state, aria-expanded and aria-controls', () => {
    const { rerender } = render(<RailToggle open={false} onClick={() => {}} controls="rail" />);
    const closed = screen.getByRole('button', { name: UI_TEXT.railOpen });
    expect(closed).toHaveAttribute('aria-expanded', 'false');
    expect(closed).toHaveAttribute('aria-controls', 'rail');
    expect(closed).toHaveTextContent('');
    expect(closed.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<RailToggle open onClick={() => {}} controls="rail" />);
    const open = screen.getByRole('button', { name: UI_TEXT.railClose });
    expect(open).toHaveAttribute('aria-expanded', 'true');
  });

  it('never shows the word for the contents on screen', () => {
    const { container } = render(<RailToggle open onClick={() => {}} controls="rail" />);
    expect(container.textContent).toBe('');
  });

  it('calls onClick and forwards its ref', () => {
    const onClick = vi.fn();
    let el: HTMLButtonElement | null = null;
    render(
      <RailToggle
        open={false}
        onClick={onClick}
        controls="rail"
        ref={(node) => {
          el = node;
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(el).toBe(screen.getByRole('button'));
  });
});
