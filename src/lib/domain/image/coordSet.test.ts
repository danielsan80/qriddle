import { describe, it, expect } from 'vitest';
import { Coord } from './coord';
import { CoordSet } from './coordSet';

describe('CoordSet', () => {
  it('has the coords it is built from', () => {
    const coords = CoordSet.of([new Coord(1, 2), new Coord(3, 4)]);

    expect(coords.has(new Coord(1, 2))).toBe(true);
  });

  it('does not have other coords', () => {
    const coords = CoordSet.of([new Coord(1, 2)]);

    expect(coords.has(new Coord(2, 1))).toBe(false);
  });

  it('has a coord once added', () => {
    const coords = CoordSet.of([]);

    coords.add(new Coord(1, 2));

    expect(coords.has(new Coord(1, 2))).toBe(true);
  });

  it('counts each coord once', () => {
    const coords = CoordSet.of([new Coord(1, 2), new Coord(3, 4)]);

    coords.add(new Coord(1, 2));

    expect(coords.size).toBe(2);
  });
});
