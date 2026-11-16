import { describe, it, expect } from 'vitest';
import { Coord } from './coord';
import { Size } from './image';
import { Visited } from './visited';

describe('Visited', () => {
  const size = new Size(2, 3);

  it('has visited nothing when created', () => {
    const visited = Visited.create(size);

    expect(visited.size).toBe(0);
  });

  it('has a coord once marked', () => {
    const visited = Visited.create(size);

    visited.mark(new Coord(1, 2));

    expect(visited.has(new Coord(1, 2))).toBe(true);
  });

  it('has not the coords never marked', () => {
    const visited = Visited.create(size);

    visited.mark(new Coord(1, 2));

    expect(visited.has(new Coord(0, 2))).toBe(false);
  });

  it('counts a coord marked twice once', () => {
    const visited = Visited.create(size);

    visited.mark(new Coord(1, 2));
    visited.mark(new Coord(1, 2));

    expect(visited.size).toBe(1);
  });

  it('answers about a coord outside the grid without throwing', () => {
    const visited = Visited.create(size);

    expect(visited.has(new Coord(-1, 0))).toBe(false);
  });

  it('rejects marking a coord outside the grid', () => {
    const visited = Visited.create(size);

    expect(() => visited.mark(new Coord(0, 3))).toThrow(
      'The coord 0,3 is outside the grid',
    );
  });
});
