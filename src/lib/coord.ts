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

  north(): Coord {
    return new Coord(this.row - 1, this.col);
  }

  south(): Coord {
    return new Coord(this.row + 1, this.col);
  }

  east(): Coord {
    return new Coord(this.row, this.col + 1);
  }

  west(): Coord {
    return new Coord(this.row, this.col - 1);
  }
}
