import { type Direction } from './direction';

export class Coord {
  readonly row: number;
  readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  equals(other: Coord): boolean {
    return this.row === other.row && this.col === other.col;
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

  goTo(direction: Direction): Coord {
    return this[direction]();
  }

  x2(): Coord[] {
    const top = this.row * 2;
    const left = this.col * 2;
    return [
      new Coord(top, left),
      new Coord(top, left + 1),
      new Coord(top + 1, left),
      new Coord(top + 1, left + 1),
    ];
  }

  distance(other: Coord): number {
    return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
  }
}
