import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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

  it('calls setTrackStep with next step on next-step button click', async () => {
    const { setTrackStep } = renderWithStep('intro');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(setTrackStep).toHaveBeenCalledWith('inner.map');
  });
});
