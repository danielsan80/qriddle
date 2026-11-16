import { describe, it, expect } from 'vitest';
import { Coord, Image } from '../image';
import { createRandom } from '../../util';
import { cellsOfModules, choosePrefilledModules } from './prefill';

const qr = new Image([
  [1, 0, 1, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 0, 1, 0],
]);
const blackModules = [
  '0,0',
  '0,2',
  '0,3',
  '1,0',
  '1,1',
  '1,3',
  '1,4',
  '2,1',
  '2,2',
  '2,4',
  '3,0',
  '3,2',
  '3,3',
  '3,4',
  '4,0',
  '4,1',
  '4,3',
];

function keys(coords: Coord[]): string[] {
  return coords.map((coord) => coord.toString());
}

function choose(seed: string, percentage: number): string[] {
  return keys(choosePrefilledModules(qr, percentage, createRandom(seed)));
}

describe('choosePrefilledModules', () => {
  it('chooses no module at 0%', () => {
    expect(choose('seed', 0)).toEqual([]);
  });

  it('chooses every black module at 100%', () => {
    expect(choose('seed', 100).sort()).toEqual(blackModules.sort());
  });

  it('rounds the given percentage of the black modules to the nearest', () => {
    expect(choose('seed', 50)).toHaveLength(9);
  });

  it('chooses the same modules with the same seed and percentage', () => {
    expect(choose('seed', 40)).toEqual(choose('seed', 40));
  });

  it('chooses different modules with different seeds', () => {
    expect(choose('seed-a', 40)).not.toEqual(choose('seed-b', 40));
  });

  it('keeps the modules already chosen when the percentage grows', () => {
    const fewer = choose('seed', 30);
    const more = choose('seed', 70);

    expect(more).toEqual(expect.arrayContaining(fewer));
  });
});

describe('cellsOfModules', () => {
  it('turns each module into its four cells in the doubled image', () => {
    const cells = cellsOfModules([new Coord(0, 0), new Coord(1, 2)]);

    expect(keys(cells)).toEqual([
      '0,0',
      '0,1',
      '1,0',
      '1,1',
      '2,4',
      '2,5',
      '3,4',
      '3,5',
    ]);
  });
});
