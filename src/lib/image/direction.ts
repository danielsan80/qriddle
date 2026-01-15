export type Direction = 'north' | 'south' | 'east' | 'west';

export const directions: readonly Direction[] = [
  'north',
  'east',
  'south',
  'west',
] as const;

export const opposite: Record<Direction, Direction> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};
