import { describe, it, expect } from 'vitest';
import { Coord, CoordSet, Image } from '../image';
import { createRandom } from '../../util';
import { AreaStore } from './area';
import { chooseDots } from './dot';

function dotsOf(image: Image, seed: string, prefilledCells: CoordSet): Coord[] {
  return chooseDots(
    new AreaStore(image, prefilledCells).toSolve(),
    createRandom(seed),
  );
}

describe('chooseDots', () => {
  it('rejects a prefilled area', () => {
    const image = new Image([[1]]);
    const prefilled = new AreaStore(
      image,
      CoordSet.create([new Coord(0, 0)]),
    ).prefilled();

    expect(() => chooseDots(prefilled, createRandom('seed'))).toThrow(
      'A prefilled area gets no dot',
    );
  });

  it('produces same result with same seed', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const dots1 = dotsOf(image, 'test-seed', CoordSet.empty());
    const dots2 = dotsOf(image, 'test-seed', CoordSet.empty());

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

    const dots1 = dotsOf(image, 'seed-a', CoordSet.empty());
    const dots2 = dotsOf(image, 'seed-b', CoordSet.empty());

    expect(dots1.map((d) => d.toString())).not.toEqual(
      dots2.map((d) => d.toString()),
    );
  });

  it('returns one dot per black area', () => {
    const image = new Image([
      [1, 1, 0, 0],
      [1, 1, 0, 0],
    ]);

    const dots = dotsOf(image, 'seed', CoordSet.empty());
    const blackAreas = new AreaStore(image, CoordSet.empty())
      .all()
      .filter((a) => a.color === 'black');

    expect(dots.length).toBe(blackAreas.length);
  });

  it('each dot belongs to exactly one black area', () => {
    const image = new Image([
      [1, 0, 1, 0],
      [1, 0, 1, 0],
    ]);

    const dots = dotsOf(image, 'seed', CoordSet.empty());
    const blackAreas = new AreaStore(image, CoordSet.empty())
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

    const dots = dotsOf(image, 'seed', CoordSet.empty());
    const blackAreas = new AreaStore(image, CoordSet.empty())
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

    const dots = dotsOf(image, 'seed', CoordSet.empty());

    expect(dots).toEqual([]);
  });

  it('puts one dot in each area to solve and none in the prefilled cells', () => {
    const image = new Image([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const prefilledCells = CoordSet.create([
      new Coord(0, 2),
      new Coord(0, 3),
      new Coord(1, 2),
      new Coord(1, 3),
    ]);

    const dots = dotsOf(image, 'seed', prefilledCells);

    const sides = dots.map((dot) =>
      dot.col < 2 ? 'left' : dot.col > 3 ? 'right' : 'prefilled',
    );
    expect(sides).toEqual(['left', 'right']);
  });
});
