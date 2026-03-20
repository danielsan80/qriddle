import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Controls } from './Controls';

function renderControls(
  overrides: Partial<React.ComponentProps<typeof Controls>> = {},
) {
  const props = {
    qrText: 'hello',
    onQrTextChange: vi.fn(),
    onQrTextBlur: vi.fn(),
    ...overrides,
  };
  render(<Controls {...props} />);
  return props;
}

describe('Controls', () => {
  it('calls onQrTextBlur when qrText field loses focus', async () => {
    const { onQrTextBlur } = renderControls();
    const input = screen.getByLabelText(/testo o url/i);

    await userEvent.click(input);
    await userEvent.tab();

    expect(onQrTextBlur).toHaveBeenCalledOnce();
  });
});
