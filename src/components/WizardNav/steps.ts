import type { Face } from '../CardFaceNav';

export type WizardStep = Face | 'beer';

export const WIZARD_STEPS: { step: WizardStep; label: string }[] = [
  { step: 'inner.map', label: 'Mappa' },
  { step: 'outer.front', label: 'Fronte' },
  { step: 'outer.center', label: 'Centro' },
  { step: 'outer.back', label: 'Retro' },
  { step: 'beer', label: 'Download' },
];
