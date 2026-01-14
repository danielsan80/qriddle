import { AreaStore } from './area';
import { Coord } from './coord';
import { type Direction } from './direction';
import { EdgeStore } from './edge';
import { Image } from './image';
import { digPaths } from './path';

export class Puzzle {
  readonly image: Image;
  readonly areas: AreaStore;
  private readonly edges: EdgeStore;

  private constructor(image: Image, areas: AreaStore, edges: EdgeStore) {
    this.image = image;
    this.areas = areas;
    this.edges = edges;
  }

  static create(image: Image, seed: string): Puzzle {
    const edges = digPaths(image, seed);
    const areas = new AreaStore(image);
    return new Puzzle(image, areas, edges);
  }

  hasWall(coord: Coord, direction: Direction): boolean {
    return this.edges.get(coord, direction).hasWall;
  }
}
