import { generateSeed } from '../lib/util';
import { config } from '../lib/config';
import type { CardSpec, FacedTextBox } from '../lib/domain/card';
import type { UrlState } from '../lib/browser/urlState';

export function cardSpecFromUrlState(state: UrlState): CardSpec {
  return {
    qrText:
      typeof state.qrText === 'string' ? state.qrText : config.defaultQrText,
    seed: typeof state.seed === 'string' ? state.seed : generateSeed(),
    prefillPercentage: prefillPercentageFrom(state.prefillPercentage),
    textBoxes: Array.isArray(state.textBoxes)
      ? (state.textBoxes as FacedTextBox[])
      : [],
  };
}

function prefillPercentageFrom(value: unknown): number {
  if (typeof value !== 'number') return 0;
  return Math.min(Math.max(value, 0), config.maxPrefillPercentage);
}
