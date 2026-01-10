import { describe, it, expect } from 'vitest';
import { Image } from './image';

describe('Image', () => {
  const image = new Image([
    [0, 1],
    [1, 0],
  ]);

  describe('size', () => {
    it('returns the grid dimension', () => {
      expect(image.size).toBe(2);
    });
  });

  describe('get', () => {
    it('returns cell with coord and color', () => {
      expect(image.get({ row: 0, col: 0 })).toEqual({
        coord: { row: 0, col: 0 },
        color: 'white',
      });
      expect(image.get({ row: 0, col: 1 })).toEqual({
        coord: { row: 0, col: 1 },
        color: 'black',
      });
    });
  });

  describe('has', () => {
    it('returns true for valid coords', () => {
      expect(image.has({ row: 0, col: 0 })).toBe(true);
      expect(image.has({ row: 1, col: 1 })).toBe(true);
    });

    it('returns false for out of bounds', () => {
      expect(image.has({ row: -1, col: 0 })).toBe(false);
      expect(image.has({ row: 0, col: 2 })).toBe(false);
      expect(image.has({ row: 2, col: 0 })).toBe(false);
    });
  });

  describe('forEach', () => {
    it('iterates all cells in row-major order', () => {
      const coords: string[] = [];
      image.forEach((cell) => coords.push(cell.coord.toString()));
      expect(coords).toEqual(['0,0', '0,1', '1,0', '1,1']);
    });
  });

  describe('asMatrix', () => {
    it('converts back to number matrix', () => {
      expect(image.asMatrix()).toEqual([
        [0, 1],
        [1, 0],
      ]);
    });
  });

  describe('x2', () => {
    it('doubles the size of the grid', () => {
      const result = image.x2();

      expect(result.asMatrix()).toEqual([
        [0, 0, 1, 1],
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 0],
      ]);
    });
  });
});
