import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MobileBlock } from './MobileBlock';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches }),
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    value: matches ? 1 : 0,
  });
}

describe('MobileBlock', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('renders nothing on desktop', () => {
    render(<MobileBlock />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders overlay on mobile', () => {
    mockMatchMedia(true);
    render(<MobileBlock />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('copy button copies current URL', async () => {
    mockMatchMedia(true);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText },
    });
    render(<MobileBlock />);
    await userEvent.click(
      screen.getByRole('button', { name: /copy the link/i }),
    );
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('share button calls navigator.share', async () => {
    mockMatchMedia(true);
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: share,
    });
    render(<MobileBlock />);
    await userEvent.click(
      screen.getByRole('button', { name: /share the link/i }),
    );
    expect(share).toHaveBeenCalledWith({
      url: window.location.href,
      title: 'QRiddle',
    });
  });
});
