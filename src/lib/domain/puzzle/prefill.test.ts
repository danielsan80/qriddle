import { describe, it, expect, vi } from 'vitest';
import { Coord, CoordSet, Image } from '../image';
import { createRandom } from '../../util';
import { choosePrefilledModules } from './prefill';

const blackModules = 17;
const qr = new Image([
  [1, 0, 1, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 0, 1, 0],
]);

function choose(seed: string, percentage: number): CoordSet {
  return choosePrefilledModules(qr, percentage, createRandom(seed));
}

describe('choosePrefilledModules', () => {
  it('chooses no module at 0%', () => {
    expect(choose('seed', 0)).toEqual(CoordSet.empty());
  });

  it('leaves the random untouched at 0%, so a seed gives the puzzle it gave before the prefill', () => {
    const random = vi.fn(createRandom('seed'));

    choosePrefilledModules(qr, 0, random);

    expect(random).not.toHaveBeenCalled();
  });

  it('chooses every black module at 100%', () => {
    const diagonal = new Image([
      [1, 0],
      [0, 1],
    ]);

    expect(choosePrefilledModules(diagonal, 100, createRandom('seed'))).toEqual(
      CoordSet.create([new Coord(0, 0), new Coord(1, 1)]),
    );
  });

  it(`rounds down to the nearest: 30% of ${blackModules} black modules is 5`, () => {
    expect(choose('seed', 30).size).toBe(5);
  });

  it(`rounds up to the nearest: 40% of ${blackModules} black modules is 7`, () => {
    expect(choose('seed', 40).size).toBe(7);
  });

  it('rejects a percentage below 0', () => {
    expect(() => choose('seed', -10)).toThrow(
      'The prefill percentage -10 is outside 0..100',
    );
  });

  it('rejects a percentage above 100', () => {
    expect(() => choose('seed', 150)).toThrow(
      'The prefill percentage 150 is outside 0..100',
    );
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

    expect(more.isSupersetOf(fewer)).toBe(true);
  });
});
