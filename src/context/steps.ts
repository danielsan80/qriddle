export const STEP_MAP = {
  'intro': { label: 'Intro' },
  'inner.map': { label: 'Map' },
  'outer.front': { label: 'Front' },
  'outer.center': { label: 'Center' },
  'outer.back': { label: 'Back' },
  'download': { label: 'Download' },
} as const;

export type Step = keyof typeof STEP_MAP;

export const STEPS = Object.keys(STEP_MAP) as Step[];
