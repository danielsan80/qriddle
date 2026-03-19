import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrontView } from './FrontView';
import type { TextBox } from '../../components/SvgTextEditor';

vi.mock('../useOuterTextBoxes', () => ({
  useOuterTextBoxes: vi.fn().mockReturnValue([[], vi.fn()]),
}));

vi.mock('../../components/SvgTextEditor', () => ({
  SvgTextEditor: ({ textBoxes }: { textBoxes: TextBox[] }) => (
    <div data-testid="svg-editor">{JSON.stringify(textBoxes)}</div>
  ),
}));

describe('FrontView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders textBoxes from useOuterTextBoxes', () => {
    const { container } = render(<FrontView />);
    expect(
      container.querySelector('[data-testid="svg-editor"]')!.textContent,
    ).toBe('[]');
  });
});
