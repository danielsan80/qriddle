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
});
