import { Coord, directions, Image, type Direction } from '../image';

export type Edges = {
  north: Edge;
  east: Edge;
  south: Edge;
  west: Edge;
};

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

export function edgeKey(a: Coord, b: Coord): string {
  if (a.distance(b) !== 1) {
    throw new Error('edgeKey: coordinates must be adjacent');
  }
  const [first, second] =
    a.row < b.row || (a.row === b.row && a.col < b.col) ? [a, b] : [b, a];
  return `${first}-${second}`;
}

export class EdgeMap<T> {
  private map = new Map<string, T>();

  set(a: Coord, b: Coord, value: T): void {
    this.map.set(edgeKey(a, b), value);
  }

  get(a: Coord, b: Coord): T | undefined {
    return this.map.get(edgeKey(a, b));
  }

  has(a: Coord, b: Coord): boolean {
    return this.map.has(edgeKey(a, b));
  }

  unset(a: Coord, b: Coord): void {
    this.map.delete(edgeKey(a, b));
  }
}

export class EdgeStore {
  private readonly image: Image;
  private readonly hasWallOverrides = new EdgeMap<boolean>();

  private constructor(image: Image) {
    this.image = image;
  }

  static create(image: Image): EdgeStore {
    return new EdgeStore(image);
  }

  static walled(image: Image): EdgeStore {
    const store = new EdgeStore(image);
    store.addAllWalls();
    return store;
  }

  get(coord: Coord, direction: Direction): Edge {
    const neighborCoord = coord.goTo(direction);
    const isExternal = !this.image.has(neighborCoord);

    if (isExternal) {
      return Edge.external();
    }

    const override = this.hasWallOverrides.get(coord, neighborCoord);
    if (override !== undefined) {
      return Edge.internal(override);
    }

    const pixel = this.image.get(coord);
    const neighbor = this.image.get(neighborCoord);
    return Edge.internal(pixel.color !== neighbor.color);
  }

  addWall(coord: Coord, direction: Direction): void {
    const neighborCoord = coord.goTo(direction);
    const pixel = this.image.get(coord);
    const neighbor = this.image.get(neighborCoord);
    if (pixel.color === neighbor.color) {
      this.hasWallOverrides.set(coord, neighborCoord, true);
    }
  }

  removeWall(coord: Coord, direction: Direction): void {
    const neighborCoord = coord.goTo(direction);
    const pixel = this.image.get(coord);
    const neighbor = this.image.get(neighborCoord);
    if (pixel.color !== neighbor.color) {
      throw new Error('Cannot remove wall between different colors');
    }
    if (this.hasWallOverrides.has(coord, neighborCoord)) {
      this.hasWallOverrides.unset(coord, neighborCoord);
    }
  }

  addAllWalls(): void {
    this.image.forEach((pixel) => {
      if (this.image.has(pixel.coord.east())) {
        this.addWall(pixel.coord, 'east');
      }
      if (this.image.has(pixel.coord.south())) {
        this.addWall(pixel.coord, 'south');
      }
    });
  }

  map<T>(fn: (edges: Edges) => T): T[][] {
    return this.image.map((pixel) => {
      const edges: Edges = {
        north: this.get(pixel.coord, 'north'),
        east: this.get(pixel.coord, 'east'),
        south: this.get(pixel.coord, 'south'),
        west: this.get(pixel.coord, 'west'),
      };
      return fn(edges);
    });
  }

  wallMap(): string[][] {
    return this.map<string>(
      (edges: Edges): string =>
        directions
          .filter((dir) => edges[dir].hasWall)
          .map((dir) => dir[0].toUpperCase())
          .join('') || '-',
    );
  }

  externalMap(): string[][] {
    return this.map<string>(
      (edges: Edges): string =>
        directions
          .filter((dir) => edges[dir].isExternal)
          .map((dir) => dir[0].toUpperCase())
          .join('') || '-',
    );
  }
}
