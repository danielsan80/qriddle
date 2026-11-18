import { Coord, CoordSet, Image, type Direction } from '../image';
import { AreaStore } from './area';
import { chooseDots } from './dot';
import { EdgeStore } from './edge';
import { digPaths, openAreas } from './path';
import { choosePrefilledModules } from './prefill';
import { type RandomFn } from './random';

export class Puzzle {
  readonly image: Image;
  readonly areas: AreaStore;
  readonly dots: Coord[];
  readonly prefilledModules: CoordSet;
  readonly prefilledCells: CoordSet;
  private readonly edges: EdgeStore;

  private constructor(
    image: Image,
    areas: AreaStore,
    edges: EdgeStore,
    dots: Coord[],
    prefilledModules: CoordSet,
    prefilledCells: CoordSet,
  ) {
    this.image = image;
    this.areas = areas;
    this.edges = edges;
    this.dots = dots;
    this.prefilledModules = prefilledModules;
    this.prefilledCells = prefilledCells;
  }

  static create(
    qr: Image,
    random: RandomFn,
    prefillPercentage: number,
  ): Puzzle {
    const prefilledModules = choosePrefilledModules(
      qr,
      prefillPercentage,
      random,
    );
    const prefilledCells = prefilledModules.x2();
    const image = qr.x2();
    const areas = new AreaStore(image, prefilledCells);
    const edges = EdgeStore.walled(image);
    openAreas(areas.prefilled(), edges);
    digPaths(areas.toSolve(), edges, random);
    const dots = chooseDots(areas.toSolve(), random);
    return new Puzzle(
      image,
      areas,
      edges,
      dots,
      prefilledModules,
      prefilledCells,
    );
  }

  hasWall(coord: Coord, direction: Direction): boolean {
    return this.edges.get(coord, direction).hasWall;
  }
}
