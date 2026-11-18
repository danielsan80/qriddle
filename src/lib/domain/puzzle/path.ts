import { config } from '../../config';
import { Coord, directions, type Direction, Visited } from '../image';
import { type RandomFn } from './random';
import { type Area } from './area';
import { EdgeStore } from './edge';

export function digPaths(
  areas: Area[],
  edges: EdgeStore,
  random: RandomFn,
): void {
  for (const area of areas) {
    if (area.pixels.length <= 1) continue;
    digAreaPaths(area, edges, random);
  }
}

type StackItem = { coord: Coord; lastDir: Direction | null };

function digAreaPaths(area: Area, edges: EdgeStore, random: RandomFn): void {
  const cells = area.cells();
  const visited = Visited.create(edges.imageSize);

  const startIndex = Math.floor(random() * area.pixels.length);
  const start = area.pixels[startIndex].coord;

  const stack: StackItem[] = [{ coord: start, lastDir: null }];
  visited.mark(start);

  while (stack.length > 0) {
    const { coord, lastDir } = stack[stack.length - 1];

    const unvisitedDirs = directions.filter((dir) => {
      const neighbor = coord.goTo(dir);
      return cells.has(neighbor) && !visited.has(neighbor);
    });

    if (unvisitedDirs.length === 0) {
      stack.pop();
      continue;
    }

    const dir = chooseDirection(unvisitedDirs, lastDir, random);
    const next = coord.goTo(dir);

    edges.removeWall(coord, dir);
    visited.mark(next);
    stack.push({ coord: next, lastDir: dir });
  }
}

function chooseDirection(
  candidates: Direction[],
  lastDir: Direction | null,
  random: RandomFn,
): Direction {
  if (candidates.length === 1) return candidates[0];

  const { biasStraight } = config;

  const weights: number[] = candidates.map((dir) => {
    if (dir === lastDir) return biasStraight;
    const remaining =
      lastDir !== null && candidates.includes(lastDir)
        ? candidates.length - 1
        : candidates.length;
    return (1 - biasStraight) / remaining;
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let r = random() * total;

  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }

  return candidates[candidates.length - 1];
}
