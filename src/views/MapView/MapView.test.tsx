import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapView } from './MapView';
import { config } from '../../lib/config';
import { readState } from '../../lib/browser/urlState';
import { WizardProvider } from '../../context/WizardContext';

vi.mock('../../lib/render', () => ({
  renderImage: vi.fn(),
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
