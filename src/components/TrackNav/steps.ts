import type { Face } from '../CardFaceNav';

export type TrackStep = Face | 'download';

export const TRACK_STEPS: { step: TrackStep; label: string }[] = [
  { step: 'inner.map', label: 'Map' },
  { step: 'outer.front', label: 'Front' },
  { step: 'outer.center', label: 'Center' },
  { step: 'outer.back', label: 'Back' },
  { step: 'download', label: 'Download' },
];
