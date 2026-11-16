import {
  CoordSet,
  directions,
  Image,
  type Color,
  type Pixel,
  Visited,
} from '../image';

export class Area {
  readonly pixels: Pixel[];
  readonly color: Color;

  constructor(pixels: Pixel[], color: Color) {
    this.pixels = pixels;
    this.color = color;
  }

  cells(): CoordSet {
    return CoordSet.create(this.pixels.map((pixel) => pixel.coord));
  }
}

export class AreaStore {
  private readonly areas: Area[];

  constructor(image: Image) {
    this.areas = this.findAreas(image);
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
    const visited = Visited.create(image.size);
    const areas: Area[] = [];

    image.forEach((pixel) => {
      if (visited.has(pixel.coord)) return;

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
            image.get(neighborCoord).color === pixel.color
          ) {
            visited.mark(neighborCoord);
            queue.push(image.get(neighborCoord));
          }
        }
      }

      areas.push(new Area(areaPixels, pixel.color));
    });

    return areas;
  }
}
