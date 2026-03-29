import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WizardProvider } from './WizardContext';
import { useWizard } from './useWizard';
import { TRACK_STEPS } from '../components/TrackNav';

function wrapper({ children }: { children: React.ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>;
}

describe('WizardContext', () => {
  it('starts with the first track step and no puzzle', () => {
    const { result } = renderHook(() => useWizard(), { wrapper });
    expect(result.current).toMatchObject({
      trackStep: TRACK_STEPS[0].code,
      puzzle: null,
    });
  });

  it('updates trackStep via setTrackStep', () => {
    const { result } = renderHook(() => useWizard(), { wrapper });
    act(() => result.current.setTrackStep('download'));
    expect(result.current.trackStep).toBe('download');
  });

  it('updates puzzle via setPuzzle', () => {
    const { result } = renderHook(() => useWizard(), { wrapper });
    const fakePuzzle = {} as never;
    act(() => result.current.setPuzzle(fakePuzzle));
    expect(result.current.puzzle).toBe(fakePuzzle);
  });
});
