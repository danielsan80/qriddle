import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { WizardProvider } from './context/WizardContext';

vi.mock('./lib/render', () => ({
  renderImage: vi.fn(),
  renderInnerPdfPreview: vi.fn().mockResolvedValue(undefined),
  renderOuterPdfPreview: vi.fn(),
  downloadPuzzlePdf: vi.fn(),
}));

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
    render(
      <WizardProvider>
        <App />
      </WizardProvider>,
    );
    await clickStepButton('Next');
    await userEvent.click(screen.getByRole('link', { name: 'coordinates' }));

    await clickStepButton('Previous');

    expect(await screen.findByText('How it works')).toBeInTheDocument();
  });
});
