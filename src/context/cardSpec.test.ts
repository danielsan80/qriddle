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

  it('takes the default text, a fresh seed and no text boxes from an empty URL state', () => {
    expect(cardSpecFromUrlState({})).toEqual({
      qrText: config.defaultQrText,
      seed: expect.any(String),
      textBoxes: [],
    });
  });

  it('takes the defaults in place of values of the wrong type', () => {
    expect(
      cardSpecFromUrlState({ qrText: 42, seed: null, textBoxes: 'none' }),
    ).toEqual({
      qrText: config.defaultQrText,
      seed: expect.any(String),
      textBoxes: [],
    });
  });
});
