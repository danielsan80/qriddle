import { describe, it, expect } from 'vitest';
import { Grid } from './grid';

describe('Grid', () => {
  const grid = new Grid([
    [0, 1],
    [1, 0],
  ]);

  describe('size', () => {
    it('returns the grid dimension', () => {
      expect(grid.size).toBe(2);
    });
  });

  describe('get', () => {
    it('returns cell with coord and color', () => {
      expect(grid.get({ row: 0, col: 0 })).toEqual({
        coord: { row: 0, col: 0 },
        color: 'white',
      });
      expect(grid.get({ row: 0, col: 1 })).toEqual({
        coord: { row: 0, col: 1 },
        color: 'black',
      });
    });
  });

  describe('has', () => {
    it('returns true for valid coords', () => {
      expect(grid.has({ row: 0, col: 0 })).toBe(true);
      expect(grid.has({ row: 1, col: 1 })).toBe(true);
    });

    it('returns false for out of bounds', () => {
      expect(grid.has({ row: -1, col: 0 })).toBe(false);
      expect(grid.has({ row: 0, col: 2 })).toBe(false);
      expect(grid.has({ row: 2, col: 0 })).toBe(false);
    });
  });

  describe('forEach', () => {
    it('iterates all cells in row-major order', () => {
      const coords: string[] = [];
      grid.forEach((cell) => coords.push(`${cell.coord.row},${cell.coord.col}`));
      expect(coords).toEqual(['0,0', '0,1', '1,0', '1,1']);
    });
  });

  describe('asMatrix', () => {
    it('converts back to number matrix', () => {
      expect(grid.asMatrix()).toEqual([
        [0, 1],
        [1, 0],
      ]);
    });
  });

  describe('x2', () => {
    it('doubles the size of the grid', () => {
      const result = grid.x2();

      expect(result.asMatrix()).toEqual([
        [0, 0, 1, 1],
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 0],
      ]);
    });
  });
});