import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { WizardProvider } from './WizardContext';
import { useWizard } from './useWizard';
import { TRACK_STEPS } from '../components/navigation/TrackNav';
import { encode } from '../lib/browser/urlState';

function wrapper({ children }: { children: React.ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>;
}

describe('WizardContext', () => {
  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

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

  it('restores step on browser back/forward (popstate)', () => {
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
    const { result } = renderHook(() => useWizard(), { wrapper });

    act(() => result.current.setTrackStep('download'));
    expect(result.current.trackStep).toBe('download');

    window.location.hash = '#' + encode({ step: 'inner.map' });
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));

    expect(result.current.trackStep).toBe('inner.map');
  });
});
