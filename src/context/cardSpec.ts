import { generateSeed } from '../lib/util';
import { config } from '../lib/config';
import type { CardSpec, FacedTextBox } from '../lib/domain/card';
import type { UrlState } from '../lib/browser/urlState';

export function cardSpecFromUrlState(state: UrlState): CardSpec {
  return {
    qrText:
      typeof state.qrText === 'string' ? state.qrText : config.defaultQrText,
    seed: typeof state.seed === 'string' ? state.seed : generateSeed(),
    textBoxes: Array.isArray(state.textBoxes)
      ? (state.textBoxes as FacedTextBox[])
      : [],
  };
}
