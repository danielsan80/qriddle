import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WizardContext } from '../../context/WizardContext';
import { StepView } from './StepView';
import type { WorkStep } from '../../context/steps';

vi.mock('../MapView', () => ({
  MapView: () => <div>MapView</div>,
}));

function wizardOn(step: WorkStep, setStep = vi.fn()) {
  return {
    step,
    setStep,
    puzzle: null,
    setPuzzle: vi.fn(),
    work: { qrText: '', seed: '', textBoxes: [] },
    updateWork: vi.fn(),
  };
}

function renderWithStep(step: WorkStep, setStep = vi.fn()) {
  render(
    <WizardContext value={wizardOn(step, setStep)}>
      <StepView step={step} />
    </WizardContext>,
  );
  return { setStep };
}

describe('StepView', () => {
  it('renders MapView for inner.map', () => {
    renderWithStep('inner.map');
    expect(screen.getByText('MapView')).toBeDefined();
  });

  it('renders FrontView for outer.front', () => {
    renderWithStep('outer.front');
    expect(screen.getByText('Front')).toBeDefined();
  });

  it('renders CenterView for outer.center', () => {
    renderWithStep('outer.center');
    expect(screen.getByText('Center')).toBeDefined();
  });

  it('renders BackView for outer.back', () => {
    renderWithStep('outer.back');
    expect(screen.getByText('Back')).toBeDefined();
  });

  it('renders DownloadView for download', () => {
    renderWithStep('download');
    expect(screen.getByText('Preview')).toBeDefined();
  });

  it('shows next-step button on non-last steps', () => {
    renderWithStep('inner.map');
    expect(screen.getAllByRole('button', { name: /next/i })).toHaveLength(2);
  });

  it('hides next-step button on last step', () => {
    renderWithStep('download');
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
  });

  it('shows previous-step button on non-first steps', () => {
    renderWithStep('inner.map');
    expect(screen.getAllByRole('button', { name: /previous/i })).toHaveLength(
      2,
    );
  });

  it('calls setStep with next step on next-step button click', async () => {
    const { setStep } = renderWithStep('inner.map');
    await userEvent.click(screen.getAllByRole('button', { name: /next/i })[0]);
    expect(setStep).toHaveBeenCalledWith('outer.front');
  });

  it('calls setStep with previous step on previous-step button click', async () => {
    const { setStep } = renderWithStep('outer.front');
    await userEvent.click(
      screen.getAllByRole('button', { name: /previous/i })[0],
    );
    expect(setStep).toHaveBeenCalledWith('inner.map');
  });
});

describe('StepView scroll behavior', () => {
  let scrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (HTMLElement.prototype as any).scrollTo;
  });

  it('scrolls main to top when step changes', () => {
    const { rerender } = render(
      <main>
        <WizardContext value={wizardOn('inner.map')}>
          <StepView step="inner.map" />
        </WizardContext>
      </main>,
    );

    scrollTo.mockClear();

    rerender(
      <main>
        <WizardContext value={wizardOn('outer.front')}>
          <StepView step="outer.front" />
        </WizardContext>
      </main>,
    );

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
