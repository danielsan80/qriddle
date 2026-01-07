import { describe, it, expect } from 'vitest';
import { Grid } from './grid';

describe('Grid.x2', () => {
  it('doubles the size of the grid', () => {
    const grid = new Grid([
      [0, 1],
      [1, 0],
    ]);

    const result = grid.x2();

    expect(result.asMatrix()).toEqual([
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 0, 0],
    ]);
  });
});