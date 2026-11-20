import { describe, it, expect } from 'vitest';
import type { CardSpec, FacedTextBox } from '../lib/domain/card';
import { config } from '../lib/config';
import { cardSpecFromUrlState } from './cardSpec';
import type { UrlState } from '../lib/browser/urlState.ts';

const frontBox: FacedTextBox = {
  id: 'A',
  x: 10,
  y: 20,
  text: 'A',
  fontSize: 8,
  face: 'front',
};

const cardSpec: CardSpec = {
  qrText: 'treasure',
  seed: 'abcdefghij',
  prefillPercentage: 30,
  textBoxes: [frontBox],
};

const urlState: UrlState = { step: 'aStep', ...cardSpec };

describe('cardSpecFromUrlState', () => {
  it('reads the card spec from the URL state', () => {
    expect(cardSpecFromUrlState({ ...urlState })).toEqual(cardSpec);
  });

  it('leaves out what is not part of the card spec', () => {
    expect(cardSpecFromUrlState({ ...urlState, step: 'download' })).toEqual(
      cardSpec,
    );
  });

  it('takes the default text, a fresh seed, no prefill and no text boxes from an empty URL state', () => {
    expect(cardSpecFromUrlState({})).toEqual({
      qrText: config.defaultQrText,
      seed: expect.any(String),
      prefillPercentage: 0,
      textBoxes: [],
    });
  });

  it('takes the defaults in place of values of the wrong type', () => {
    expect(
      cardSpecFromUrlState({
        qrText: 42,
        seed: null,
        prefillPercentage: '30',
        textBoxes: 'none',
      }),
    ).toEqual({
      qrText: config.defaultQrText,
      seed: expect.any(String),
      prefillPercentage: 0,
      textBoxes: [],
    });
  });

  it('takes no prefill in place of a percentage below 0', () => {
    expect(
      cardSpecFromUrlState({ ...cardSpec, prefillPercentage: -10 })
        .prefillPercentage,
    ).toBe(0);
  });

  it('takes the maximum in place of a percentage above it', () => {
    expect(
      cardSpecFromUrlState({
        ...cardSpec,
        prefillPercentage: config.maxPrefillPercentage + 1,
      }).prefillPercentage,
    ).toBe(config.maxPrefillPercentage);
  });
});
