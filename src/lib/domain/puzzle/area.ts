import {
  Coord,
  CoordSet,
  directions,
  Image,
  type Color,
  type Pixel,
  Visited,
} from '../image';

export type AreaKind = 'toSolve' | 'prefilled';

export class Area {
  readonly pixels: Pixel[];
  readonly color: Color;
  readonly kind: AreaKind;

  constructor(pixels: Pixel[], kind: AreaKind) {
    const color = requireOneColor(pixels);
    if (kind === 'prefilled' && color !== 'black') {
      throw new Error('A prefilled area is black');
    }
    this.pixels = pixels;
    this.color = color;
    this.kind = kind;
  }

  cells(): CoordSet {
    return CoordSet.create(this.pixels.map((pixel) => pixel.coord));
  }
}

function requireOneColor(pixels: Pixel[]): Color {
  if (pixels.length === 0) {
    throw new Error('An area has at least one pixel');
  }
  const color = pixels[0].color;
  if (pixels.some((pixel) => pixel.color !== color)) {
    throw new Error('The pixels of an area have the same color');
  }
  return color;
}

export class AreaStore {
  private readonly areas: Area[];
  private readonly prefilledCells: CoordSet;

  constructor(image: Image, prefilledCells: CoordSet) {
    this.prefilledCells = prefilledCells;
    this.areas = this.findAreas(image);
  }

  private isPrefilled(coord: Coord): boolean {
    return this.prefilledCells.has(coord);
  }

  at(index: number): Area | undefined {
    return this.areas.at(index);
  }

  forEach(callback: (area: Area, index: number) => void): void {
    this.areas.forEach(callback);
  }

  map<T>(callback: (area: Area) => T): T[] {
    return this.areas.map(callback);
  }

  all(): Area[] {
    return this.areas;
  }

  toSolve(): Area[] {
    return this.areas.filter((area) => area.kind === 'toSolve');
  }

  prefilled(): Area[] {
    return this.areas.filter((area) => area.kind === 'prefilled');
  }

  private findAreas(image: Image): Area[] {
    const visited = Visited.create(image.size);
    const areas: Area[] = [];

    image.forEach((pixel) => {
      if (visited.has(pixel.coord)) return;

      const prefilled = this.isPrefilled(pixel.coord);
      const areaPixels: Pixel[] = [];
      const queue: Pixel[] = [pixel];
      visited.mark(pixel.coord);

      while (queue.length > 0) {
        const current = queue.shift()!;
        areaPixels.push(current);

        for (const direction of directions) {
          const neighborCoord = current.coord.goTo(direction);
          if (
            image.has(neighborCoord) &&
            !visited.has(neighborCoord) &&
            image.get(neighborCoord).color === pixel.color &&
            this.isPrefilled(neighborCoord) === prefilled
          ) {
            visited.mark(neighborCoord);
            queue.push(image.get(neighborCoord));
          }
        }
      }

      areas.push(new Area(areaPixels, prefilled ? 'prefilled' : 'toSolve'));
    });

    return areas;
  }
}
