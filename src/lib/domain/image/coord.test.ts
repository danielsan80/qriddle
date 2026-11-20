import { describe, it, expect } from 'vitest';
import { Coord } from './coord';

describe('Coord', () => {
  const coord = new Coord(5, 3);

  describe('directional methods', () => {
    it('north decreases row by 1', () => {
      expect(coord.north()).toEqual(new Coord(4, 3));
    });

    it('south increases row by 1', () => {
      expect(coord.south()).toEqual(new Coord(6, 3));
    });

    it('east increases col by 1', () => {
      expect(coord.east()).toEqual(new Coord(5, 4));
    });

    it('west decreases col by 1', () => {
      expect(coord.west()).toEqual(new Coord(5, 2));
    });
  });

  it('equals a coord with the same row and col', () => {
    expect(new Coord(5, 3).equals(new Coord(5, 3))).toBe(true);
  });

  it('differs from a coord in another row', () => {
    expect(new Coord(5, 3).equals(new Coord(4, 3))).toBe(false);
  });

  it('differs from a coord in another col', () => {
    expect(new Coord(5, 3).equals(new Coord(5, 4))).toBe(false);
  });

  it('x2 gives the four cells it becomes in the doubled image', () => {
    expect(coord.x2()).toEqual([
      new Coord(10, 6),
      new Coord(10, 7),
      new Coord(11, 6),
      new Coord(11, 7),
    ]);
  });
});
