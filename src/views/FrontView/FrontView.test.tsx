import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrontView } from './FrontView';
import { mergeState } from '../../lib/browser/urlState';
import type { TextBox } from '../../components/SvgTextEditor';

vi.mock('../../lib/browser/urlState', () => ({
  readState: vi.fn().mockReturnValue({ frontTextBoxes: [] }),
  mergeState: vi.fn(),
}));

const mockOnTextBoxesChange = vi.fn();

vi.mock('../../components/SvgTextEditor', () => ({
  SvgTextEditor: ({
    textBoxes,
    onTextBoxesChange,
  }: {
    textBoxes: TextBox[];
    onTextBoxesChange: (boxes: TextBox[]) => void;
  }) => {
    mockOnTextBoxesChange.mockImplementation(onTextBoxesChange);
    return <div data-testid="svg-editor">{JSON.stringify(textBoxes)}</div>;
  },
}));

describe('FrontView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with empty textBoxes from URL state', () => {
    const { container } = render(<FrontView />);
    expect(
      container.querySelector('[data-testid="svg-editor"]')!.textContent,
    ).toBe('[]');
  });

  it('syncs textBoxes to URL state on render', () => {
    render(<FrontView />);
    expect(mergeState).toHaveBeenCalledWith({ frontTextBoxes: [] });
  });
});
