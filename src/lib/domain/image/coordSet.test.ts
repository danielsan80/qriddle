import { describe, it, expect } from 'vitest';
import { Coord } from './coord';
import { CoordSet } from './coordSet';

describe('CoordSet', () => {
  it('has the coords it is built from', () => {
    const coords = CoordSet.create([new Coord(1, 2), new Coord(3, 4)]);

    expect(coords.has(new Coord(1, 2))).toBe(true);
  });

  it('does not have other coords', () => {
    const coords = CoordSet.create([new Coord(1, 2)]);

    expect(coords.has(new Coord(2, 1))).toBe(false);
  });

  it('counts each coord once', () => {
    const coords = CoordSet.create([
      new Coord(1, 2),
      new Coord(3, 4),
      new Coord(1, 2),
    ]);

    expect(coords.size).toBe(2);
  });

  it('is empty when built empty', () => {
    expect(CoordSet.empty().size).toBe(0);
  });

  it('turns each module into its four cells in the doubled image', () => {
    const modules = CoordSet.create([new Coord(0, 0), new Coord(1, 2)]);

    expect(modules.x2()).toEqual(
      CoordSet.create([
        new Coord(0, 0),
        new Coord(0, 1),
        new Coord(1, 0),
        new Coord(1, 1),
        new Coord(2, 4),
        new Coord(2, 5),
        new Coord(3, 4),
        new Coord(3, 5),
      ]),
    );
  });

  describe('isSupersetOf', () => {
    const coords = CoordSet.create([new Coord(1, 2), new Coord(3, 4)]);

    it('is a superset of a set with some of its coords', () => {
      expect(coords.isSupersetOf(CoordSet.create([new Coord(1, 2)]))).toBe(
        true,
      );
    });

    it('is a superset of itself', () => {
      expect(coords.isSupersetOf(coords)).toBe(true);
    });

    it('is a superset of the empty set', () => {
      expect(coords.isSupersetOf(CoordSet.empty())).toBe(true);
    });

    it('is not a superset of a set with a coord it does not have', () => {
      expect(
        coords.isSupersetOf(
          CoordSet.create([new Coord(1, 2), new Coord(5, 6)]),
        ),
      ).toBe(false);
    });
  });
});
