import { type Color } from './image';
import { Coord, type Direction } from './coord';

export class Cell {
  readonly coord: Coord;
  readonly color: Color;
  readonly edges!: Edges;

  constructor(coord: Coord, color: Color) {
    this.coord = coord;
    this.color = color;
  }
}

export class Edge {
  readonly isExternal: boolean;
  readonly hasWall: boolean;

  private constructor(isExternal: boolean, hasWall: boolean) {
    this.isExternal = isExternal;
    this.hasWall = hasWall;
  }

  static create(cell: Cell, neighbor: Cell | null): Edge {
    const isExternal = neighbor === null;
    const hasWall = neighbor === null || cell.color !== neighbor.color;
    return new Edge(isExternal, hasWall);
  }

  withWall(hasWall: boolean): Edge {
    return new Edge(this.isExternal, hasWall);
  }
}

export class EdgeMap<T> {
  private map = new Map<string, T>();

  private key(a: Coord, b: Coord): string {
    const [first, second] =
      a.row < b.row || (a.row === b.row && a.col < b.col) ? [a, b] : [b, a];
    return `${first}-${second}`;
  }

  set(a: Coord, b: Coord, value: T): void {
    if (a.distance(b) !== 1) {
      throw new Error('EdgeMap: coordinates must be adjacent');
    }
    this.map.set(this.key(a, b), value);
  }

  get(a: Coord, b: Coord): T | undefined {
    return this.map.get(this.key(a, b));
  }

  has(a: Coord, b: Coord): boolean {
    return this.map.has(this.key(a, b));
  }
}

export interface Edges {
  north: Edge;
  east: Edge;
  south: Edge;
  west: Edge;
}

export class Area {
  readonly cells: Cell[];
  readonly color: Color;

  constructor(cells: Cell[], color: Color) {
    this.cells = cells;
    this.color = color;
  }
}

export class Maze {
  readonly size: number;
  readonly areas: Area[];
  private readonly cells: Cell[][];

  constructor(matrix: number[][]) {
    this.size = matrix.length;

    this.cells = matrix.map((row, i) =>
      row.map((value, j) => {
        const coord = new Coord(i, j);
        const color: Color = value === 1 ? 'black' : 'white';
        return new Cell(coord, color);
      }),
    );

    this.forEach((cell) => {
      (cell as { edges: Edges }).edges = {
        north: this.createEdge(cell, 'north'),
        east: this.createEdge(cell, 'east'),
        south: this.createEdge(cell, 'south'),
        west: this.createEdge(cell, 'west'),
      };
    });

    this.areas = this.findAreas();
  }

  private findAreas(): Area[] {
    const visited = new Set<string>();
    const areas: Area[] = [];

    this.forEach((cell) => {
      const key = cell.coord.toString();
      if (visited.has(key)) return;

      const areaCells: Cell[] = [];
      const queue: Cell[] = [cell];
      visited.add(key);

      while (queue.length > 0) {
        const current = queue.shift()!;
        areaCells.push(current);

        for (const direction of ['north', 'east', 'south', 'west'] as const) {
          const neighborCoord = current.coord.goTo(direction);
          const neighborKey = neighborCoord.toString();

          if (
            this.has(neighborCoord) &&
            !visited.has(neighborKey) &&
            this.get(neighborCoord).color === cell.color
          ) {
            visited.add(neighborKey);
            queue.push(this.get(neighborCoord));
          }
        }
      }

      areas.push(new Area(areaCells, cell.color));
    });

    return areas;
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

  map<T>(fn: (cell: Cell) => T): T[][] {
    const result: T[][] = [];
    for (let row = 0; row < this.size; row++) {
      result[row] = [];
      for (let col = 0; col < this.size; col++) {
        result[row][col] = fn(this.get(new Coord(row, col)));
      }
    }
    return result;
  }

  createEdge(cell: Cell, direction: Direction): Edge {
    const neighborCoord = cell.coord.goTo(direction);
    const neighbor = this.has(neighborCoord) ? this.get(neighborCoord) : null;
    return Edge.create(cell, neighbor);
  }
}
