import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { WizardProvider } from './WizardContext';
import type { Work } from './work';
import { useWizard } from './useWizard';
import { TRACK_STEPS } from '../components/navigation/TrackNav';
import { encode, readState } from '../lib/browser/urlState';
import { config } from '../lib/config';
import { Puzzle } from '../lib/domain/puzzle';
import type { FacedTextBox } from '../views/useOuterTextBoxes';

function wrapper({ children }: { children: React.ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>;
}

function renderWizard() {
  return renderHook(() => useWizard(), { wrapper }).result;
}

function urlState() {
  return readState<Record<string, unknown>>({});
}

function box(text: string, face: FacedTextBox['face']): FacedTextBox {
  return { id: text, x: 10, y: 20, text, fontSize: 8, face };
}

const work: Work = {
  qrText: 'treasure',
  seed: 'abcdefghij',
  textBoxes: [box('A', 'front')],
};

describe('WizardContext', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('starts with the first track step and no puzzle', () => {
    const wizard = renderWizard();
    expect(wizard.current).toMatchObject({
      trackStep: TRACK_STEPS[0].code,
      puzzle: null,
    });
  });

  it('updates trackStep via setTrackStep', () => {
    const wizard = renderWizard();
    act(() => wizard.current.setTrackStep('download'));
    expect(wizard.current.trackStep).toBe('download');
  });

  it('updates puzzle via setPuzzle', () => {
    const wizard = renderWizard();
    const fakePuzzle = {} as never;
    act(() => wizard.current.setPuzzle(fakePuzzle));
    expect(wizard.current.puzzle).toBe(fakePuzzle);
  });

  it('starts from the default text and a fresh seed when the URL is empty', () => {
    const wizard = renderWizard();
    expect(wizard.current.work).toEqual({
      qrText: config.defaultQrText,
      seed: expect.any(String),
      textBoxes: [],
    });
  });

  it('reads the work from the URL at start', () => {
    window.location.hash = '#' + encode(work);
    const wizard = renderWizard();
    expect(wizard.current.work).toEqual(work);
  });

  it('writes every change of the work into the URL', () => {
    window.location.hash = '#' + encode({ step: 'outer.front' });
    const wizard = renderWizard();

    act(() => wizard.current.updateWork(() => work));

    expect(urlState()).toEqual({ step: 'outer.front', ...work });
  });

  it('changes step without adding entries to the browser history', () => {
    const wizard = renderWizard();
    const entries = history.length;

    act(() => wizard.current.setTrackStep('outer.front'));
    act(() => wizard.current.setTrackStep('outer.back'));

    expect({ entries: history.length, url: urlState() }).toEqual({
      entries,
      url: {
        step: 'outer.back',
        qrText: config.defaultQrText,
        seed: expect.any(String),
        textBoxes: [],
      },
    });
  });

  it('opens the step, the puzzle and the work of a link pasted in the address bar', async () => {
    const wizard = renderWizard();

    window.location.hash = '#' + encode({ step: 'outer.center', ...work });

    await waitFor(() =>
      expect({
        trackStep: wizard.current.trackStep,
        puzzle: wizard.current.puzzle,
        work: wizard.current.work,
      }).toEqual({
        trackStep: 'outer.center',
        puzzle: expect.any(Puzzle),
        work,
      }),
    );
  });
});
