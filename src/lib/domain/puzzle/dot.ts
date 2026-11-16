import { Coord, Image } from '../image';
import { type RandomFn } from '../../util';
import { AreaStore } from './area';

export function chooseDots(
  image: Image,
  random: RandomFn,
  prefilledCells: Coord[],
): Coord[] {
  const areas = new AreaStore(image, prefilledCells);

  return areas
    .all()
    .filter((area) => area.color === 'black' && !area.prefilled)
    .map((area) => {
      const index = Math.floor(random() * area.pixels.length);
      return area.pixels[index].coord;
    });
}
