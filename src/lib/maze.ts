import { type Color } from './image';
import { Coord, type Direction } from './coord';

export class Cell {
  readonly coord: Coord;
  readonly color: Color;

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

  static external(): Edge {
    return new Edge(true, true);
  }

  static internal(hasWall: boolean): Edge {
    return new Edge(false, hasWall);
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

  unset(a: Coord, b: Coord): void {
    this.map.delete(this.key(a, b));
  }
}

export class EdgeStore {
  private readonly maze: Maze;
  private readonly hasWallOverrides = new EdgeMap<boolean>();

  constructor(maze: Maze) {
    this.maze = maze;
  }

  get(coord: Coord, direction: Direction): Edge {
    const neighborCoord = coord.goTo(direction);
    const isExternal = !this.maze.has(neighborCoord);

    if (isExternal) {
      return Edge.external();
    }

    const override = this.hasWallOverrides.get(coord, neighborCoord);
    if (override !== undefined) {
      return Edge.internal(override);
    }

    const cell = this.maze.get(coord);
    const neighbor = this.maze.get(neighborCoord);
    return Edge.internal(cell.color !== neighbor.color);
  }

  addWall(coord: Coord, direction: Direction): void {
    const neighborCoord = coord.goTo(direction);
    const cell = this.maze.get(coord);
    const neighbor = this.maze.get(neighborCoord);
    if (cell.color === neighbor.color) {
      this.hasWallOverrides.set(coord, neighborCoord, true);
    }
  }

  removeWall(coord: Coord, direction: Direction): void {
    const neighborCoord = coord.goTo(direction);
    const cell = this.maze.get(coord);
    const neighbor = this.maze.get(neighborCoord);
    if (cell.color !== neighbor.color) {
      throw Error('...');
    }
    if (this.hasWallOverrides.has(coord, neighborCoord)) {
      this.hasWallOverrides.unset(coord, neighborCoord);
    }
  }
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
  readonly edges: EdgeStore;
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

    this.edges = new EdgeStore(this);
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
}
