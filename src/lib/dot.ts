import { AreaStore } from './area';
import { Coord } from './coord';
import { Image } from './image';
import { type RandomFn } from './random';

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
