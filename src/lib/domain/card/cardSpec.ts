import type { FacedTextBox } from './textBox';

export type CardSpec = {
  qrText: string;
  seed: string;
  textBoxes: FacedTextBox[];
};
