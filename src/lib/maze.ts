import { Image, type Pixel } from './image';
import { Coord } from './coord';
import { AreaStore } from './area';
import { EdgeStore } from './edge';

export class Maze {
  readonly image: Image;
  readonly edges: EdgeStore;
  readonly areas: AreaStore;

  constructor(image: Image) {
    this.image = image;
    this.edges = EdgeStore.create(image);
    this.areas = new AreaStore(image);
  }

  get(coord: Coord): Pixel {
    return this.image.get(coord);
  }

  has(coord: Coord): boolean {
    return this.image.has(coord);
  }

  forEach(callback: (pixel: Pixel) => void): void {
    this.image.forEach(callback);
  }
}
