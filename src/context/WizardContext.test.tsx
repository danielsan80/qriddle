import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { WizardProvider } from './WizardContext';
import type { Work } from './work';
import { useWizard } from './useWizard';
import { STEPS } from './steps';
import { encode, readState } from '../lib/browser/urlState';
import { config } from '../lib/config';
import { Puzzle } from '../lib/domain/puzzle';
import type { FacedTextBox } from '../lib/domain/card';
import { analytics } from '../lib/browser/analytics';

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
      step: STEPS[0],
      puzzle: null,
    });
  });

  it('updates step via setStep', () => {
    const wizard = renderWizard();
    act(() => wizard.current.setStep('download'));
    expect(wizard.current.step).toBe('download');
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

  it('leaves the URL empty while nothing has been touched', () => {
    renderWizard();
    expect(window.location.hash).toBe('');
  });

  it.each([
    {
      action: 'a step change',
      touch: (wizard: ReturnType<typeof renderWizard>) =>
        wizard.current.setStep('inner.map'),
      step: 'inner.map',
    },
    {
      action: 'a change of the work',
      touch: (wizard: ReturnType<typeof renderWizard>) =>
        wizard.current.updateWork((current) => ({ ...current, qrText: 'x' })),
      step: STEPS[0],
    },
  ])('saves step and work at the first touch: $action', ({ touch, step }) => {
    const wizard = renderWizard();

    act(() => touch(wizard));

    expect(urlState()).toEqual({ step, ...wizard.current.work });
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

    act(() => wizard.current.setStep('outer.front'));
    act(() => wizard.current.setStep('outer.back'));

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
        step: wizard.current.step,
        puzzle: wizard.current.puzzle,
        work: wizard.current.work,
      }).toEqual({
        step: 'outer.center',
        puzzle: expect.any(Puzzle),
        work,
      }),
    );
  });
});

describe('WizardContext analytics', () => {
  let stepChanged: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stepChanged = vi
      .spyOn(analytics, 'stepChanged')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.location.hash = '';
  });

  it('tracks every step the user moves to', () => {
    const wizard = renderWizard();

    act(() => wizard.current.setStep('inner.map'));
    act(() => wizard.current.setStep('outer.front'));

    expect(stepChanged.mock.calls).toEqual([['inner.map'], ['outer.front']]);
  });

  it('does not track a move to the step already shown', () => {
    const wizard = renderWizard();

    act(() => wizard.current.setStep(STEPS[0]));

    expect(stepChanged).not.toHaveBeenCalled();
  });

  it('does not track the step of a link pasted in the address bar', async () => {
    const wizard = renderWizard();

    window.location.hash = '#' + encode({ step: 'outer.center', ...work });
    await waitFor(() => expect(wizard.current.step).toBe('outer.center'));

    expect(stepChanged).not.toHaveBeenCalled();
  });
});
