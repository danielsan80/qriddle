import { Coord } from './coord';

export class CoordSet {
  private readonly coords: ReadonlyMap<string, Coord>;

  private constructor(coords: ReadonlyMap<string, Coord>) {
    this.coords = coords;
  }

  static create(coords: Coord[]): CoordSet {
    return new CoordSet(
      new Map(coords.map((coord) => [coord.toString(), coord])),
    );
  }

  static empty(): CoordSet {
    return CoordSet.create([]);
  }

  get size(): number {
    return this.coords.size;
  }

  has(coord: Coord): boolean {
    return this.coords.has(coord.toString());
  }

  isSupersetOf(other: CoordSet): boolean {
    return [...other.coords.keys()].every((key) => this.coords.has(key));
  }

  x2(): CoordSet {
    return CoordSet.create(
      [...this.coords.values()].flatMap((coord) => coord.x2()),
    );
  }
}
