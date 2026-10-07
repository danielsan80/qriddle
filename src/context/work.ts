import { generateSeed } from '../lib/util';
import { config } from '../lib/config';
import type { FacedTextBox } from '../views/useOuterTextBoxes';

// @rev type, not interface: an interface is not assignable to UrlState's index signature, so mergeState and encode would refuse it.
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
