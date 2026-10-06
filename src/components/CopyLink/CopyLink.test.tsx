import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyLink } from './CopyLink';

describe('CopyLink', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies the current URL, which holds the work', async () => {
    window.location.hash = '#state=abc';
    render(<CopyLink />);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('confirms the save on the button', async () => {
    render(<CopyLink />);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('button')).toHaveTextContent('Saved! Link copied');
  });

  function renderWithFakeTimers() {
    vi.useFakeTimers();
    render(<CopyLink />);
  }

  async function clickAndWait(name: string, milliseconds: number) {
    fireEvent.click(screen.getByRole('button', { name }));
    await act(async () => {});
    act(() => vi.advanceTimersByTime(milliseconds));
  }

  it('keeps the confirmation for almost 5 seconds', async () => {
    renderWithFakeTimers();
    await clickAndWait('Save', 4999);

    expect(screen.getByRole('button')).toHaveTextContent('Saved! Link copied');
  });

  it('goes back to Save after 5 seconds', async () => {
    renderWithFakeTimers();
    await clickAndWait('Save', 5000);

    expect(screen.getByRole('button')).toHaveTextContent(/^Save$/);
  });

  it('restarts the 5 seconds on every click', async () => {
    renderWithFakeTimers();
    await clickAndWait('Save', 4000);
    await clickAndWait('Saved! Link copied', 4999);

    expect(screen.getByRole('button')).toHaveTextContent('Saved! Link copied');
  });
});
