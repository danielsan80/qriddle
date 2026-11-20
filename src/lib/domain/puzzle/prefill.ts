import { Coord, CoordSet, Image } from '../image';
import { type RandomFn } from './random';
import { shuffle } from './shuffle';

export function choosePrefilledModules(
  qr: Image,
  percentage: number,
  random: RandomFn,
): CoordSet {
  const validPercentage = requireValidPercentage(percentage);
  const blackModules: Coord[] = [];
  qr.forEach((module) => {
    if (module.color === 'black') blackModules.push(module.coord);
  });

  const count = Math.round((blackModules.length * validPercentage) / 100);
  if (count === 0) return CoordSet.empty();
  return CoordSet.create(shuffle(blackModules, random).slice(0, count));
}

function requireValidPercentage(percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error(`The prefill percentage ${percentage} is outside 0..100`);
  }
  return percentage;
}
