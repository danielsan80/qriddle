import { describe, it, expect } from 'vitest';
import { Coord, Image } from '../image';
import { createRandom } from '../../util';
import { AreaStore } from './area';
import { chooseDots } from './dot';

describe('chooseDots', () => {
  it('produces same result with same seed', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const dots1 = chooseDots(image, createRandom('test-seed'), []);
    const dots2 = chooseDots(image, createRandom('test-seed'), []);

    expect(dots1.map((d) => d.toString())).toEqual(
      dots2.map((d) => d.toString()),
    );
  });

  it('produces different results with different seeds', () => {
    const image = new Image([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ]);

    const dots1 = chooseDots(image, createRandom('seed-a'), []);
    const dots2 = chooseDots(image, createRandom('seed-b'), []);

    expect(dots1.map((d) => d.toString())).not.toEqual(
      dots2.map((d) => d.toString()),
    );
  });

  it('returns one dot per black area', () => {
    const image = new Image([
      [1, 1, 0, 0],
      [1, 1, 0, 0],
    ]);

    const dots = chooseDots(image, createRandom('seed'), []);
    const blackAreas = new AreaStore(image, [])
      .all()
      .filter((a) => a.color === 'black');

    expect(dots.length).toBe(blackAreas.length);
  });

  it('each dot belongs to exactly one black area', () => {
    const image = new Image([
      [1, 0, 1, 0],
      [1, 0, 1, 0],
    ]);

    const dots = chooseDots(image, createRandom('seed'), []);
    const blackAreas = new AreaStore(image, [])
      .all()
      .filter((a) => a.color === 'black');

    for (const dot of dots) {
      const containingAreas = blackAreas.filter((area) =>
        area.pixels.some((p) => p.coord.toString() === dot.toString()),
      );
      expect(containingAreas.length).toBe(1);
    }
  });

  it('every black area contains exactly one dot', () => {
    const image = new Image([
      [1, 0, 1, 0],
      [1, 0, 1, 0],
    ]);

    const dots = chooseDots(image, createRandom('seed'), []);
    const blackAreas = new AreaStore(image, [])
      .all()
      .filter((a) => a.color === 'black');

    for (const area of blackAreas) {
      const dotsInArea = dots.filter((dot) =>
        area.pixels.some((p) => p.coord.toString() === dot.toString()),
      );
      expect(dotsInArea.length).toBe(1);
    }
  });

  it('returns empty array for all-white image', () => {
    const image = new Image([
      [0, 0],
      [0, 0],
    ]);

    const dots = chooseDots(image, createRandom('seed'), []);

    expect(dots).toEqual([]);
  });

  it('puts one dot in each area to solve and none in the prefilled cells', () => {
    const image = new Image([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const prefilledCells = [
      new Coord(0, 2),
      new Coord(0, 3),
      new Coord(1, 2),
      new Coord(1, 3),
    ];

    const dots = chooseDots(image, createRandom('seed'), prefilledCells);

    const sides = dots.map((dot) =>
      dot.col < 2 ? 'left' : dot.col > 3 ? 'right' : 'prefilled',
    );
    expect(sides).toEqual(['left', 'right']);
  });
});
