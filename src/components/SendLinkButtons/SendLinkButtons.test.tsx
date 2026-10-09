import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SendLinkButtons } from './SendLinkButtons';

describe('SendLinkButtons', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies the current URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText },
    });
    render(<SendLinkButtons />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Copy the link' }),
    );
    expect(writeText).toHaveBeenCalledExactlyOnceWith(window.location.href);
  });

  it('shares the current URL', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: share,
    });
    render(<SendLinkButtons />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Share the link' }),
    );
    expect(share).toHaveBeenCalledExactlyOnceWith({
      url: window.location.href,
      title: 'QRiddle',
    });
  });

  it('keeps the confirmation as long as the Save button in the sidebar', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    vi.useFakeTimers();
    render(<SendLinkButtons />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy the link' }));
    await act(async () => {});
    act(() => vi.advanceTimersByTime(4999));

    expect(
      screen.getByRole('button', { name: 'Link copied!' }),
    ).toBeInTheDocument();
  });
});
