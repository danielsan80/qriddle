import { Coord } from '../image';
import { type RandomFn } from './random';
import { type Area } from './area';

export function chooseDots(areas: Area[], random: RandomFn): Coord[] {
  return areas
    .filter((area) => area.color === 'black')
    .map((area) => {
      const index = Math.floor(random() * area.pixels.length);
      return area.pixels[index].coord;
    });
}
