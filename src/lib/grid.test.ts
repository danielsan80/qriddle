import { describe, it, expect } from 'vitest';
import { createHighResGrid, type Grid } from './grid';

describe('createHighResGrid', () => {
  it('doubles the size of the grid', () => {
    const input: Grid = [
      [0, 1],
      [1, 0],
    ];

    const result = createHighResGrid(input);

    expect(result).toEqual([
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 0, 0],
    ]);
  });
});