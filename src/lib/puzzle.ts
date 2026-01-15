import { AreaStore } from './area';
import { Coord } from './coord';
import { type Direction } from './direction';
import { chooseDots } from './dot';
import { EdgeStore } from './edge';
import { Image } from './image';
import { digPaths } from './path';
import { type RandomFn } from './random';

export class Puzzle {
  readonly image: Image;
  readonly areas: AreaStore;
  readonly dots: Coord[];
  private readonly edges: EdgeStore;

  private constructor(
    image: Image,
    areas: AreaStore,
    edges: EdgeStore,
    dots: Coord[],
  ) {
    this.image = image;
    this.areas = areas;
    this.edges = edges;
    this.dots = dots;
  }

  static create(image: Image, random: RandomFn): Puzzle {
    const edges = digPaths(image, random);
    const areas = new AreaStore(image);
    const dots = chooseDots(image, random);
    return new Puzzle(image, areas, edges, dots);
  }

  hasWall(coord: Coord, direction: Direction): boolean {
    return this.edges.get(coord, direction).hasWall;
  }
}
