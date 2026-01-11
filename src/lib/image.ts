import { Coord } from './coord';

export type Color = 'black' | 'white';
export type Matrix = number[][];

export interface Pixel {
  readonly coord: Coord;
  readonly color: Color;
}

export class Image {
  readonly size: number;
  private readonly pixels: Pixel[][];

  constructor(matrix: number[][]) {
    this.size = matrix.length;
    this.pixels = matrix.map((row, i) =>
      row.map((value, j) => ({
        coord: new Coord(i, j),
        color: value === 1 ? 'black' : ('white' as Color),
      })),
    );
  }

  get(coord: Coord): Pixel {
    return this.pixels[coord.row][coord.col];
  }

  has(coord: Coord): boolean {
    return (
      coord.row >= 0 &&
      coord.row < this.size &&
      coord.col >= 0 &&
      coord.col < this.size
    );
  }

  forEach(callback: (pixel: Pixel) => void): void {
    for (const row of this.pixels) {
      for (const pixel of row) {
        callback(pixel);
      }
    }
  }

  asMatrix(): Matrix {
    return this.pixels.map((row) =>
      row.map((pixel) => (pixel.color === 'black' ? 1 : 0)),
    );
  }

  x2(): Image {
    const doubledSize = this.size * 2;
    const matrix: Matrix = [];

    for (let row = 0; row < doubledSize; row++) {
      matrix[row] = [];
      for (let col = 0; col < doubledSize; col++) {
        const pixel = this.get(
          new Coord(Math.floor(row / 2), Math.floor(col / 2)),
        );
        matrix[row][col] = pixel.color === 'black' ? 1 : 0;
      }
    }

    return new Image(matrix);
  }
}
