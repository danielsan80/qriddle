import type { Face } from '../CardFaceNav';

export type TrackStep = 'intro' | Face | 'download';

export const TRACK_STEPS: { code: TrackStep; label: string }[] = [
  { code: 'intro', label: 'Intro' },
  { code: 'inner.map', label: 'Map' },
  { code: 'outer.front', label: 'Front' },
  { code: 'outer.center', label: 'Center' },
  { code: 'outer.back', label: 'Back' },
  { code: 'download', label: 'Download' },
];
