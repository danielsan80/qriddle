import { Coord, Image, type Direction } from '../image';
import { type RandomFn } from '../../util';
import { AreaStore } from './area';
import { chooseDots } from './dot';
import { EdgeStore } from './edge';
import { digPaths } from './path';

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

  static create(
    image: Image,
    random: RandomFn,
    prefilledCells: Coord[],
  ): Puzzle {
    const edges = digPaths(image, random, prefilledCells);
    const areas = new AreaStore(image, prefilledCells);
    const dots = chooseDots(image, random, prefilledCells);
    return new Puzzle(image, areas, edges, dots);
  }

  isPrefilled(coord: Coord): boolean {
    return this.areas.isPrefilled(coord);
  }

  hasWall(coord: Coord, direction: Direction): boolean {
    return this.edges.get(coord, direction).hasWall;
  }
}
