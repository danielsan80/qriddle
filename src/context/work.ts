import { generateSeed } from '../lib/util';
import { config } from '../lib/config';
import type { FacedTextBox } from '../lib/domain/card';

export type Work = {
  qrText: string;
  seed: string;
  textBoxes: FacedTextBox[];
};

export function workFrom(state: Partial<Work>): Work {
  return {
    qrText: state.qrText ?? config.defaultQrText,
    seed: state.seed ?? generateSeed(),
    textBoxes: state.textBoxes ?? [],
  };
}
