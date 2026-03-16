import type { Face } from '../CardFaceNav';

export type WizardStep = Face | 'download';

export const WIZARD_STEPS: { step: WizardStep; label: string }[] = [
  { step: 'inner.map', label: 'Map' },
  { step: 'outer.front', label: 'Front' },
  { step: 'outer.center', label: 'Center' },
  { step: 'outer.back', label: 'Back' },
  { step: 'download', label: 'Download' },
];
