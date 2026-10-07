import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { WizardProvider } from './context/WizardContext';
import { encode, readState } from './lib/browser/urlState';
import type { Face, FacedTextBox } from './lib/domain/card';

vi.mock('./lib/render', () => ({
  renderImage: vi.fn(),
  renderInnerPdfPreview: vi.fn().mockResolvedValue(undefined),
  renderOuterPdfPreview: vi.fn(),
  downloadPuzzlePdf: vi.fn(),
}));

function box(text: string, face: Face): FacedTextBox {
  return { id: text, x: 10, y: 20, text, fontSize: 8, face };
}

function renderApp() {
  render(
    <WizardProvider>
      <App />
    </WizardProvider>,
  );
}

function clickStepButton(name: 'Next' | 'Previous') {
  return userEvent.click(screen.getAllByRole('button', { name })[0]);
}

describe('App', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('goes back to the intro after loading an example on the map', async () => {
    renderApp();
    await clickStepButton('Next');
    await userEvent.click(screen.getByRole('link', { name: 'coordinates' }));

    await clickStepButton('Previous');

    expect(await screen.findByText('How it works')).toBeInTheDocument();
  });

  it('keeps the text written on later faces after Previous and Next', async () => {
    const work = {
      qrText: 'treasure',
      seed: 'abcdefghij',
      textBoxes: [box('A', 'front'), box('B', 'center'), box('C', 'back')],
    };
    window.location.hash = '#' + encode({ step: 'outer.back', ...work });
    renderApp();

    await clickStepButton('Previous');
    expect(readState<{ step?: string }>({}).step).toBe('outer.center');
    await clickStepButton('Next');

    expect(readState({})).toEqual({ step: 'outer.back', ...work });
  });
});
