import { Coord } from './coord';

export class CoordSet {
  private readonly keys: Set<string>;

  private constructor(keys: Set<string>) {
    this.keys = keys;
  }

  static of(coords: Coord[]): CoordSet {
    return new CoordSet(new Set(coords.map((coord) => coord.toString())));
  }

  get size(): number {
    return this.keys.size;
  }

  has(coord: Coord): boolean {
    return this.keys.has(coord.toString());
  }

  add(coord: Coord): void {
    this.keys.add(coord.toString());
  }
}
