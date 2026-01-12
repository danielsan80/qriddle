import { Image } from './image';
import { Coord, type Direction } from './coord';

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
  private readonly image: Image;
  private readonly hasWallOverrides = new EdgeMap<boolean>();

  constructor(image: Image) {
    this.image = image;
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
      throw Error('...');
    }
    if (this.hasWallOverrides.has(coord, neighborCoord)) {
      this.hasWallOverrides.unset(coord, neighborCoord);
    }
  }
}
