import { Coord, Image } from '../image';
import { type RandomFn } from '../util';
import { AreaStore } from './area';

export function chooseDots(image: Image, random: RandomFn): Coord[] {
  const areas = new AreaStore(image);

  return areas
    .all()
    .filter((area) => area.color === 'black')
    .map((area) => {
      const index = Math.floor(random() * area.pixels.length);
      return area.pixels[index].coord;
    });
}
