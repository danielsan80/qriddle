import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { WizardProvider } from './WizardContext';
import type { Work } from './work';
import { useWizard } from './useWizard';
import { TRACK_STEPS } from '../components/navigation/TrackNav';
import { encode, readState } from '../lib/browser/urlState';
import { config } from '../lib/config';
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

  it('takes only the step from the URL on popstate, and writes the current work back', () => {
    const wizard = renderWizard();
    act(() => wizard.current.updateWork(() => work));

    window.location.hash =
      '#' + encode({ step: 'inner.map', qrText: 'old', textBoxes: [] });
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));

    expect({
      trackStep: wizard.current.trackStep,
      work: wizard.current.work,
      url: urlState(),
    }).toEqual({
      trackStep: 'inner.map',
      work,
      url: { step: 'inner.map', ...work },
    });
  });

  it('goes back to the first step from the second one', async () => {
    const wizard = renderWizard();
    act(() => wizard.current.setTrackStep(TRACK_STEPS[1].code));

    act(() => history.back());

    await waitFor(() =>
      expect(wizard.current.trackStep).toBe(TRACK_STEPS[0].code),
    );
  });

  it('keeps what was written in later steps after Previous and Next', async () => {
    const wizard = renderWizard();
    const boxes = [box('A', 'front'), box('B', 'center'), box('C', 'back')];
    function writeOn(step: FacedTextBox['face'], textBox: FacedTextBox) {
      act(() => wizard.current.setTrackStep(`outer.${step}`));
      act(() =>
        wizard.current.updateWork((current) => ({
          ...current,
          textBoxes: [...current.textBoxes, textBox],
        })),
      );
    }
    writeOn('front', boxes[0]);
    writeOn('center', boxes[1]);
    writeOn('back', boxes[2]);

    act(() => history.back());
    await waitFor(() => expect(wizard.current.trackStep).toBe('outer.center'));
    act(() => wizard.current.setTrackStep('outer.back'));

    expect(urlState()).toEqual({
      step: 'outer.back',
      qrText: config.defaultQrText,
      seed: expect.any(String),
      textBoxes: boxes,
    });
  });
});
