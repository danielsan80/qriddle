import { act, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import type { CardSpec, FacedTextBox } from '../lib/domain/card';
import { STEPS } from './steps';
import { encode, readState } from '../lib/browser/urlState';
import { config } from '../lib/config';
import { Puzzle } from '../lib/domain/puzzle';
import { analytics } from '../lib/browser/analytics';
import { WizardDriver } from './WizardContext.driver';

function urlState() {
  return readState<Record<string, unknown>>({});
}

function box(text: string, face: FacedTextBox['face']): FacedTextBox {
  return { id: text, x: 10, y: 20, text, fontSize: 8, face };
}

const cardSpec: CardSpec = {
  qrText: 'treasure',
  seed: 'abcdefghij',
  textBoxes: [box('A', 'front')],
};

describe('WizardContext', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('starts with the first track step', () => {
    expect(WizardDriver.render().step).toBe(STEPS[0]);
  });

  it('updates step via setStep', () => {
    const wizardDriver = WizardDriver.render();
    wizardDriver.setStep('download');
    expect(wizardDriver.step).toBe('download');
  });

  it('starts from the default text and a fresh seed when the URL is empty', () => {
    expect(WizardDriver.render().cardSpec).toEqual({
      qrText: config.defaultQrText,
      seed: expect.any(String),
      textBoxes: [],
    });
  });

  it('reads the card spec from the URL at start', () => {
    window.location.hash = '#' + encode(cardSpec);
    expect(WizardDriver.render().cardSpec).toEqual(cardSpec);
  });

  it('leaves the URL empty while nothing has been touched', () => {
    WizardDriver.render();
    expect(window.location.hash).toBe('');
  });

  it('saves step and card spec at the first step change', () => {
    const wizardDriver = WizardDriver.render();

    wizardDriver.setStep('inner.map');

    expect(urlState()).toEqual({ step: 'inner.map', ...wizardDriver.cardSpec });
  });

  it('saves step and card spec at the first change of the card spec', () => {
    const wizardDriver = WizardDriver.render();

    wizardDriver.changeQrText('x');

    expect(urlState()).toEqual({ step: STEPS[0], ...wizardDriver.cardSpec });
  });

  it('writes every change of the card spec into the URL', () => {
    window.location.hash = '#' + encode({ step: 'outer.front' });
    const wizardDriver = WizardDriver.render();

    wizardDriver.setCardSpec(cardSpec);

    expect(urlState()).toEqual({ step: 'outer.front', ...cardSpec });
  });

  it('changes step without adding entries to the browser history', () => {
    const wizardDriver = WizardDriver.render();
    const entries = history.length;

    wizardDriver.setStep('outer.front');
    wizardDriver.setStep('outer.back');

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

  it('opens the step, the puzzle and the card spec of a link pasted in the address bar', async () => {
    const wizardDriver = WizardDriver.render();

    window.location.hash = '#' + encode({ step: 'outer.center', ...cardSpec });

    await waitFor(() =>
      expect({
        step: wizardDriver.step,
        puzzle: wizardDriver.puzzle,
        cardSpec: wizardDriver.cardSpec,
      }).toEqual({
        step: 'outer.center',
        puzzle: expect.any(Puzzle),
        cardSpec,
      }),
    );
  });
});

describe('WizardContext puzzle', () => {
  const delay = config.puzzleGenerationDelayMs;

  function wait(ms: number) {
    act(() => vi.advanceTimersByTime(ms));
  }

  beforeEach(() => {
    vi.useFakeTimers();
    window.location.hash = '#' + encode(cardSpec);
  });

  afterEach(() => {
    vi.useRealTimers();
    window.location.hash = '';
  });

  it('gives the same puzzle to the same card spec', () => {
    expect(WizardDriver.render().puzzle).toEqual(WizardDriver.render().puzzle);
  });

  it('generates the puzzle of the new card spec once the changes pause', () => {
    const wizardDriver = WizardDriver.render();
    const before = wizardDriver.puzzle;

    wizardDriver.changeSeed('another');
    wait(delay - 1);
    expect(wizardDriver.puzzle).toBe(before);

    wait(1);
    expect(wizardDriver.puzzle).not.toEqual(before);
  });

  it('restarts the wait at each change', () => {
    const wizardDriver = WizardDriver.render();
    const before = wizardDriver.puzzle;

    wizardDriver.changeSeed('another');
    wait(delay - 100);
    wizardDriver.changeSeed('yet another');
    wait(delay - 1);
    expect(wizardDriver.puzzle).toBe(before);

    wait(1);
    expect(wizardDriver.puzzle).not.toEqual(before);
  });

  it('has no puzzle without a QR text', () => {
    const wizardDriver = WizardDriver.render();

    wizardDriver.changeQrText('');
    wait(delay);

    expect(wizardDriver.puzzle).toBeNull();
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
    const wizardDriver = WizardDriver.render();

    wizardDriver.setStep('inner.map');
    wizardDriver.setStep('outer.front');

    expect(stepChanged.mock.calls).toEqual([['inner.map'], ['outer.front']]);
  });

  it('does not track a move to the step already shown', () => {
    WizardDriver.render().setStep(STEPS[0]);

    expect(stepChanged).not.toHaveBeenCalled();
  });

  it('does not track the step of a link pasted in the address bar', async () => {
    const wizardDriver = WizardDriver.render();

    window.location.hash = '#' + encode({ step: 'outer.center', ...cardSpec });
    await waitFor(() => expect(wizardDriver.step).toBe('outer.center'));

    expect(stepChanged).not.toHaveBeenCalled();
  });
});
