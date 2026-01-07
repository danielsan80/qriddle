export class Coord {
  readonly row: number;
  readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  toString(): string {
    return `${this.row},${this.col}`;
  }
}
