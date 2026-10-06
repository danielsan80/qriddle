import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DownloadView } from './DownloadView';
import { downloadPuzzlePdf } from '../../lib/render';

const wizard: { puzzle: object | null } = vi.hoisted(() => ({
  puzzle: null,
}));

vi.mock('../../context/useWizard', () => ({
  useWizard: () => wizard,
}));

vi.mock('../../lib/render', () => ({
  renderInnerPdfPreview: vi.fn(),
  renderOuterPdfPreview: vi.fn(),
  downloadPuzzlePdf: vi.fn().mockResolvedValue(undefined),
}));

function downloadButton() {
  return screen.getByRole('button', { name: /download the pdf/i });
}

describe('DownloadView', () => {
  beforeEach(() => {
    vi.mocked(downloadPuzzlePdf).mockClear();
  });

  it('downloads the puzzle PDF from the labelled button', async () => {
    const puzzle = {};
    wizard.puzzle = puzzle;
    render(<DownloadView />);

    await userEvent.click(downloadButton());

    expect(downloadPuzzlePdf).toHaveBeenCalledWith(puzzle, []);
  });

  it('disables the download until the puzzle exists', () => {
    wizard.puzzle = null;
    render(<DownloadView />);

    expect(downloadButton()).toBeDisabled();
  });
});
