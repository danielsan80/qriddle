import { Coord } from '../image';
import { type RandomFn } from './random';
import { type Area } from './area';

export function chooseDots(areasToSolve: Area[], random: RandomFn): Coord[] {
  if (areasToSolve.some((area) => area.kind === 'prefilled')) {
    throw new Error('A prefilled area gets no dot');
  }
  return areasToSolve
    .filter((area) => area.color === 'black')
    .map((area) => {
      const index = Math.floor(random() * area.pixels.length);
      return area.pixels[index].coord;
    });
}
