import { Coord } from './coord';
import { Size } from './image';

export class Visited {
  private readonly marks: boolean[][];
  private count = 0;

  private constructor(marks: boolean[][]) {
    this.marks = marks;
  }

  static create(size: Size): Visited {
    return new Visited(
      Array.from({ length: size.rows }, () =>
        Array.from({ length: size.cols }, () => false),
      ),
    );
  }

  get size(): number {
    return this.count;
  }

  has(coord: Coord): boolean {
    return this.marks[coord.row]?.[coord.col] === true;
  }

  mark(coord: Coord): void {
    const row = this.marks[coord.row];
    if (row === undefined || coord.col < 0 || coord.col >= row.length) {
      throw new Error(`The coord ${coord} is outside the grid`);
    }
    if (row[coord.col]) return;
    row[coord.col] = true;
    this.count++;
  }
}
