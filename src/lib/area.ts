import { type Color, Image, type Pixel } from './image';
import { directions } from './direction';

export class Area {
  readonly pixels: Pixel[];
  readonly color: Color;

  constructor(pixels: Pixel[], color: Color) {
    this.pixels = pixels;
    this.color = color;
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
    const visited = new Set<string>();
    const areas: Area[] = [];

    image.forEach((pixel) => {
      const key = pixel.coord.toString();
      if (visited.has(key)) return;

      const areaPixels: Pixel[] = [];
      const queue: Pixel[] = [pixel];
      visited.add(key);

      while (queue.length > 0) {
        const current = queue.shift()!;
        areaPixels.push(current);

        for (const direction of directions) {
          const neighborCoord = current.coord.goTo(direction);
          const neighborKey = neighborCoord.toString();

          if (
            image.has(neighborCoord) &&
            !visited.has(neighborKey) &&
            image.get(neighborCoord).color === pixel.color
          ) {
            visited.add(neighborKey);
            queue.push(image.get(neighborCoord));
          }
        }
      }

      areas.push(new Area(areaPixels, pixel.color));
    });

    return areas;
  }
}
