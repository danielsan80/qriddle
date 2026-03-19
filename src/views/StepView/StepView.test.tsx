import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WizardContext } from '../../context/WizardContext';
import { StepView } from './StepView';
import type { TrackStep } from '../../components/TrackNav';

vi.mock('../MapView', () => ({
  MapView: () => <div>MapView</div>,
}));

function renderWithStep(trackStep: TrackStep) {
  render(
    <WizardContext
      value={{
        trackStep,
        setTrackStep: vi.fn(),
        puzzle: null,
        setPuzzle: vi.fn(),
      }}
    >
      <StepView />
    </WizardContext>,
  );
}

describe('StepView', () => {
  it('renders MapView for inner.map', () => {
    renderWithStep('inner.map');
    expect(screen.getByText('MapView')).toBeDefined();
  });

  it('renders FrontView for outer.front', () => {
    renderWithStep('outer.front');
    expect(screen.getByText('Fronte')).toBeDefined();
  });

  it('renders CenterView for outer.center', () => {
    renderWithStep('outer.center');
    expect(screen.getByText('Centro')).toBeDefined();
  });

  it('renders BackView for outer.back', () => {
    renderWithStep('outer.back');
    expect(screen.getByText('Retro')).toBeDefined();
  });

  it('renders Download placeholder for download', () => {
    renderWithStep('download');
    expect(screen.getByText('Download — TODO')).toBeDefined();
  });
});
