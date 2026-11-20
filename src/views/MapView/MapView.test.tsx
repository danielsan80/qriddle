import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapView } from './MapView';
import { config } from '../../lib/config';
import { encode, readState } from '../../lib/browser/urlState';
import { WizardProvider } from '../../context/WizardContext';
import { puzzleFactory } from '../../context/puzzleFactory';
import { Image } from '../../lib/domain/image';
import type { Puzzle } from '../../lib/domain/puzzle';
import { getQRMatrix } from '../../lib/util';
import type { CardSpec } from '../../lib/domain/card';
import { qrDrawer } from '../../lib/render';
import { MapViewPage } from './MapView.page';

vi.mock('../../lib/render', () => ({
  CanvasPainter: class {
    paint() {}
  },
  qrDrawer: { draw: vi.fn() },
  renderInnerPdfPreview: vi.fn().mockResolvedValue(undefined),
  downloadPuzzlePdf: vi.fn(),
}));

function renderInWizard() {
  render(
    <WizardProvider>
      <MapView />
    </WizardProvider>,
  );
}

function renderMapView() {
  renderInWizard();
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

  it('loads an example into the secret text', async () => {
    const input = renderMapView();

    await userEvent.click(screen.getByRole('link', { name: 'coordinates' }));

    expect(input.value).toBe('https://www.google.com/maps?q=44.18,12.6167');
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
    renderInWizard();

    expect(
      screen.getByRole('button', { name: 'Another puzzle' }),
    ).toHaveTextContent(/^↻$/);
  });

  it('draws another puzzle with a new seed', async () => {
    renderInWizard();
    const firstSeed = seedInUrl();

    await userEvent.click(
      screen.getByRole('button', { name: 'Another puzzle' }),
    );

    expect(seedInUrl()).not.toBe(firstSeed);
  });
});

describe('MapView prefill', () => {
  const cardSpec: CardSpec = {
    qrText: 'treasure',
    seed: 'abcdefghij',
    prefillPercentage: 30,
    textBoxes: [],
  };
  const mapViewPage = new MapViewPage();

  function puzzleWithPrefill(prefillPercentage: number): Puzzle {
    return puzzleFactory.create(
      new Image(getQRMatrix(cardSpec.qrText).matrix),
      cardSpec.seed,
      prefillPercentage,
    );
  }

  function expectTheQrOfThePuzzleDrawn(puzzle: Puzzle) {
    expect(qrDrawer.draw).toHaveBeenLastCalledWith(
      puzzle.qr,
      puzzle.prefilledModules,
    );
  }

  function prefillInUrl(): number | undefined {
    return readState<{ prefillPercentage?: number }>({}).prefillPercentage;
  }

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(qrDrawer.draw).mockClear();
    window.location.hash = '#' + encode(cardSpec);
  });

  it('shows the prefill of the card spec on a slider from 0 to the maximum', () => {
    renderInWizard();

    expect({
      value: mapViewPage.prefillSlider.value,
      min: mapViewPage.prefillSlider.getAttribute('min'),
      max: mapViewPage.prefillSlider.getAttribute('max'),
      step: mapViewPage.prefillSlider.getAttribute('step'),
    }).toEqual({
      value: '30',
      min: '0',
      max: String(config.maxPrefillPercentage),
      step: '1',
    });
  });

  it('shows the percentage while the slider moves, without changing the card spec', () => {
    renderInWizard();

    mapViewPage.movePrefillSlider(50);

    expect({
      shown: mapViewPage.prefillValue.textContent,
      saved: prefillInUrl(),
    }).toEqual({ shown: '50%', saved: 30 });
  });

  it('saves the prefill in the card spec when the slider is released', () => {
    renderInWizard();

    mapViewPage.releasePrefillSlider(50);

    expect(prefillInUrl()).toBe(50);
  });

  it('redraws the QR with the prefill of the released slider', async () => {
    renderInWizard();
    expectTheQrOfThePuzzleDrawn(puzzleWithPrefill(cardSpec.prefillPercentage));

    mapViewPage.releasePrefillSlider(50);

    await waitFor(() => expectTheQrOfThePuzzleDrawn(puzzleWithPrefill(50)));
  });

  it('shows the prefill of a link pasted in the address bar', async () => {
    renderInWizard();

    window.location.hash = '#' + encode({ ...cardSpec, prefillPercentage: 60 });
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() =>
      expect(mapViewPage.prefillValue.textContent).toBe('60%'),
    );
  });

  it('draws the prefilled modules of the puzzle on the QR', () => {
    renderInWizard();

    expectTheQrOfThePuzzleDrawn(puzzleWithPrefill(cardSpec.prefillPercentage));
  });
});
