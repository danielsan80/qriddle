import { Coord, Image } from '../image';
import { type RandomFn } from '../../util';

export function choosePrefilledModules(
  qr: Image,
  percentage: number,
  random: RandomFn,
): Coord[] {
  const blackModules: Coord[] = [];
  qr.forEach((pixel) => {
    if (pixel.color === 'black') blackModules.push(pixel.coord);
  });

  const count = Math.round((blackModules.length * percentage) / 100);
  return shuffle(blackModules, random).slice(0, count);
}

export function cellsOfModules(modules: Coord[]): Coord[] {
  return modules.flatMap((module) => module.x2());
}

function shuffle<T>(items: T[], random: RandomFn): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}
