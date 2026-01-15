import { config } from '../config';
import { directions, Image, type Direction, type Pixel } from '../image';
import { type RandomFn } from '../util';
import { Area, AreaStore } from './area';
import { EdgeStore } from './edge';

export function digPaths(image: Image, random: RandomFn): EdgeStore {
  const areas = new AreaStore(image);
  const edges = EdgeStore.walled(image);

  for (const area of areas.all()) {
    if (area.pixels.length <= 1) continue;
    digAreaPaths(image, area, edges, random);
  }

  return edges;
}

function digAreaPaths(
  image: Image,
  area: Area,
  edges: EdgeStore,
  random: RandomFn,
): void {
  const pixelSet = new Set(area.pixels.map((p) => p.coord.toString()));
  const visited = new Set<string>();

  const startIndex = Math.floor(random() * area.pixels.length);
  const start = area.pixels[startIndex];

  const stack: { pixel: Pixel; lastDir: Direction | null }[] = [
    { pixel: start, lastDir: null },
  ];
  visited.add(start.coord.toString());

  while (stack.length > 0) {
    const { pixel, lastDir } = stack[stack.length - 1];

    const unvisitedDirs = directions.filter((dir) => {
      const neighborCoord = pixel.coord.goTo(dir);
      return (
        pixelSet.has(neighborCoord.toString()) &&
        !visited.has(neighborCoord.toString())
      );
    });

    if (unvisitedDirs.length === 0) {
      stack.pop();
      continue;
    }

    const dir = chooseDirection(unvisitedDirs, lastDir, random);
    const nextCoord = pixel.coord.goTo(dir);
    const next = image.get(nextCoord);

    edges.removeWall(pixel.coord, dir);
    visited.add(nextCoord.toString());
    stack.push({ pixel: next, lastDir: dir });
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
