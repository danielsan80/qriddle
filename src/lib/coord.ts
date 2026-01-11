export type Direction = 'north' | 'south' | 'east' | 'west';

export const directions: readonly Direction[] = [
  'north',
  'east',
  'south',
  'west',
] as const;

export const opposite: Record<Direction, Direction> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};

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

  goTo(direction: Direction): Coord {
    return this[direction]();
  }

  distance(other: Coord): number {
    return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
  }
}
