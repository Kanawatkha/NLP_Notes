import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { ToastHost } from './ToastHost';

const sw = vi.hoisted(() => ({
  state: { offlineReady: false, needRefresh: false },
  update: vi.fn(),
  setOffline: vi.fn(),
  setRefresh: vi.fn(),
}));

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [sw.state.offlineReady, sw.setOffline],
    needRefresh: [sw.state.needRefresh, sw.setRefresh],
    updateServiceWorker: sw.update,
  }),
}));

describe('ToastHost', () => {
  beforeEach(() => {
    sw.state = { offlineReady: false, needRefresh: false };
    sw.update.mockReset();
    sw.setOffline.mockReset();
  });

  it('is a polite live region and shows nothing until the service worker reports something', () => {
    const { container } = render(<ToastHost />);
    expect(container.firstElementChild).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('announces that offline use is ready and can be dismissed', () => {
    sw.state.offlineReady = true;
    render(<ToastHost />);
    expect(screen.getByRole('status')).toHaveTextContent(UI_TEXT.offlineReady);
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.dismiss }));
    expect(sw.setOffline).toHaveBeenCalledWith(false);
  });

  it('applies a new version automatically and keeps a reload button as a backup', () => {
    sw.state.needRefresh = true;
    render(<ToastHost />);
    expect(sw.update).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent(UI_TEXT.updateReady);
    sw.update.mockClear();
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.updateAction }));
    expect(sw.update).toHaveBeenCalledWith(true);
  });

  it('shows the update toast rather than the offline toast when both are pending', () => {
    sw.state = { offlineReady: true, needRefresh: true };
    render(<ToastHost />);
    expect(screen.getByRole('status')).toHaveTextContent(UI_TEXT.updateReady);
    expect(screen.queryByText(UI_TEXT.offlineReady)).toBeNull();
  });

  it('stays clear of the floating contents button on narrow screens', () => {
    const { container } = render(<ToastHost />);
    expect(container.firstElementChild?.className).toContain('bottom-24');
    expect(container.firstElementChild?.className).toContain('lg:bottom-4');
  });
});
