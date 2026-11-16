import {
  Coord,
  CoordSet,
  directions,
  Image,
  type Color,
  type Pixel,
} from '../image';

export class Area {
  readonly pixels: Pixel[];
  readonly color: Color;
  readonly prefilled: boolean;

  constructor(pixels: Pixel[], color: Color, prefilled: boolean) {
    if (prefilled && color === 'white') {
      throw new Error('A prefilled area is black');
    }
    this.pixels = pixels;
    this.color = color;
    this.prefilled = prefilled;
  }
}

export class AreaStore {
  private readonly areas: Area[];
  private readonly prefilledCells: CoordSet;

  constructor(image: Image, prefilledCells: Coord[]) {
    this.prefilledCells = CoordSet.of(prefilledCells);
    this.areas = this.findAreas(image);
  }

  isPrefilled(coord: Coord): boolean {
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

  private findAreas(image: Image): Area[] {
    const visited = CoordSet.of([]);
    const areas: Area[] = [];

    image.forEach((pixel) => {
      if (visited.has(pixel.coord)) return;

      const prefilled = this.isPrefilled(pixel.coord);
      const areaPixels: Pixel[] = [];
      const queue: Pixel[] = [pixel];
      visited.add(pixel.coord);

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
            visited.add(neighborCoord);
            queue.push(image.get(neighborCoord));
          }
        }
      }

      areas.push(new Area(areaPixels, pixel.color, prefilled));
    });

    return areas;
  }
}
