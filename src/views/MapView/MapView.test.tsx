import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapView } from './MapView';
import { config } from '../../lib/config';
import { readState } from '../../lib/browser/urlState';

vi.mock('../../context/useWizard', () => ({
  useWizard: () => ({ setPuzzle: vi.fn(), puzzle: null }),
}));

vi.mock('../../lib/render', () => ({
  renderImage: vi.fn(),
  renderInnerPdfPreview: vi.fn().mockResolvedValue(undefined),
  downloadPuzzlePdf: vi.fn(),
}));

function renderMapView() {
  render(<MapView />);
  return screen.getByLabelText(/enter the secret text/i) as HTMLInputElement;
}

describe('MapView', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {}); // used by mergeState
  });

  it('restores default text on blur when field is empty', async () => {
    const input = renderMapView();

    await userEvent.clear(input);
    await userEvent.tab();

    expect(input.value).toBe(config.defaultQrText);
  });

  it('does not restore default text on blur when field has content', async () => {
    const input = renderMapView();

    await userEvent.clear(input);
    await userEvent.type(input, 'custom text');
    await userEvent.tab();

    expect(input.value).toBe('custom text');
  });
});

describe('MapView puzzle seed', () => {
  function seedInUrl() {
    return readState<{ seed?: string }>({}).seed;
  }

  beforeEach(() => {
    vi.restoreAllMocks();
    window.location.hash = '';
  });

  it('shows the another puzzle button as ↻', () => {
    render(<MapView />);

    expect(
      screen.getByRole('button', { name: 'Another puzzle' }),
    ).toHaveTextContent(/^↻$/);
  });

  it('draws another puzzle with a new seed', async () => {
    render(<MapView />);
    const firstSeed = seedInUrl();

    await userEvent.click(
      screen.getByRole('button', { name: 'Another puzzle' }),
    );

    expect(seedInUrl()).not.toBe(firstSeed);
  });
});
