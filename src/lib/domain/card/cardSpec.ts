import type { FacedTextBox } from './textBox';

export type CardSpec = {
  qrText: string;
  seed: string;
  prefillPercentage: number;
  textBoxes: FacedTextBox[];
};
