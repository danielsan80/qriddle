import { describe, it, expect } from 'vitest';
import { Image } from './image';
import { Coord } from './coord';

describe('Image', () => {
  const image = new Image([
    [0, 1],
    [1, 0],
  ]);

  describe('size', () => {
    it('returns the image dimensions', () => {
      expect(image.size.rows).toBe(2);
      expect(image.size.cols).toBe(2);
    });
  });

  describe('get', () => {
    it('returns cell with coord and color', () => {
      expect(image.get(new Coord(0, 0))).toEqual({
        coord: new Coord(0, 0),
        color: 'white',
      });
      expect(image.get(new Coord(0, 1))).toEqual({
        coord: new Coord(0, 1),
        color: 'black',
      });
    });
  });

  describe('has', () => {
    it('returns true for valid coords', () => {
      expect(image.has(new Coord(0, 0))).toBe(true);
      expect(image.has(new Coord(1, 1))).toBe(true);
    });

    it('returns false for out of bounds', () => {
      expect(image.has(new Coord(-1, 0))).toBe(false);
      expect(image.has(new Coord(0, 2))).toBe(false);
      expect(image.has(new Coord(2, 0))).toBe(false);
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
    it('doubles the size of the image', () => {
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
