import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DownloadView } from './DownloadView';
import { downloadPuzzlePdf } from '../../lib/render';
import { analytics } from '../../lib/browser/analytics';

const wizard: { puzzle: object | null; work: { textBoxes: object[] } } =
  vi.hoisted(() => ({ puzzle: null, work: { textBoxes: [] } }));

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('downloads the puzzle PDF, with the text boxes, from the labelled button', async () => {
    const puzzle = {};
    const textBoxes = [{ id: '1', text: 'hi', face: 'front' }];
    wizard.puzzle = puzzle;
    wizard.work.textBoxes = textBoxes;
    render(<DownloadView />);

    await userEvent.click(downloadButton());

    expect(downloadPuzzlePdf).toHaveBeenCalledWith(puzzle, textBoxes);
  });

  it('reports the download request to the analytics', async () => {
    const downloadRequested = vi
      .spyOn(analytics, 'downloadRequested')
      .mockImplementation(() => {});
    wizard.puzzle = {};
    render(<DownloadView />);

    await userEvent.click(downloadButton());

    expect(downloadRequested).toHaveBeenCalledExactlyOnceWith();
  });

  it('disables the download until the puzzle exists', () => {
    wizard.puzzle = null;
    render(<DownloadView />);

    expect(downloadButton()).toBeDisabled();
  });
});
