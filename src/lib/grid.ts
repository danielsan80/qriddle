import { Coord } from './coord';

export type Color = 'black' | 'white';
export type Matrix = number[][];

export interface Cell {
  readonly coord: Coord;
  readonly color: Color;
}

export class Grid {
  readonly size: number;
  private cells: Cell[][];

  constructor(matrix: number[][]) {
    this.size = matrix.length;
    this.cells = matrix.map((row, i) =>
      row.map((value, j) => ({
        coord: new Coord(i, j),
        color: value === 1 ? 'black' : ('white' as Color),
      })),
    );
  }

  get(coord: Coord): Cell {
    return this.cells[coord.row][coord.col];
  }

  has(coord: Coord): boolean {
    return (
      coord.row >= 0 &&
      coord.row < this.size &&
      coord.col >= 0 &&
      coord.col < this.size
    );
  }

  forEach(callback: (cell: Cell) => void): void {
    for (const row of this.cells) {
      for (const cell of row) {
        callback(cell);
      }
    }
  }

  asMatrix(): Matrix {
    return this.cells.map((row) =>
      row.map((cell) => (cell.color === 'black' ? 1 : 0)),
    );
  }

  x2(): Grid {
    const doubledSize = this.size * 2;
    const matrix: Matrix = [];

    for (let row = 0; row < doubledSize; row++) {
      matrix[row] = [];
      for (let col = 0; col < doubledSize; col++) {
        const orig = this.get({
          row: Math.floor(row / 2),
          col: Math.floor(col / 2),
        });
        matrix[row][col] = orig.color === 'black' ? 1 : 0;
      }
    }

    return new Grid(matrix);
  }
}
