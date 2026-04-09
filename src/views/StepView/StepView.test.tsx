import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WizardContext } from '../../context/WizardContext';
import { StepView } from './StepView';
import type { TrackStep } from '../../components/navigation/TrackNav';

vi.mock('../MapView', () => ({
  MapView: () => <div>MapView</div>,
}));

function renderWithStep(trackStep: TrackStep, setTrackStep = vi.fn()) {
  render(
    <WizardContext
      value={{
        trackStep,
        setTrackStep,
        puzzle: null,
        setPuzzle: vi.fn(),
      }}
    >
      <StepView />
    </WizardContext>,
  );
  return { setTrackStep };
}

describe('StepView', () => {
  it('renders IntroView for intro', () => {
    renderWithStep('intro');
    expect(screen.getByText('How it works')).toBeDefined();
  });

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
    renderWithStep('intro');
    expect(screen.getByRole('button', { name: /next/i })).toBeDefined();
  });

  it('hides next-step button on last step', () => {
    renderWithStep('download');
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
  });

  it('hides previous-step button on first step', () => {
    renderWithStep('intro');
    expect(screen.queryByRole('button', { name: /previous/i })).toBeNull();
  });

  it('shows previous-step button on non-first steps', () => {
    renderWithStep('inner.map');
    expect(screen.getByRole('button', { name: /previous/i })).toBeDefined();
  });

  it('calls setTrackStep with next step on next-step button click', async () => {
    const { setTrackStep } = renderWithStep('intro');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(setTrackStep).toHaveBeenCalledWith('inner.map');
  });

  it('calls history.back on previous-step button click', async () => {
    const historyBack = vi
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});
    renderWithStep('inner.map');
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(historyBack).toHaveBeenCalledOnce();
    historyBack.mockRestore();
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
        <WizardContext
          value={{
            trackStep: 'intro',
            setTrackStep: vi.fn(),
            puzzle: null,
            setPuzzle: vi.fn(),
          }}
        >
          <StepView />
        </WizardContext>
      </main>,
    );

    scrollTo.mockClear();

    rerender(
      <main>
        <WizardContext
          value={{
            trackStep: 'inner.map',
            setTrackStep: vi.fn(),
            puzzle: null,
            setPuzzle: vi.fn(),
          }}
        >
          <StepView />
        </WizardContext>
      </main>,
    );

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
