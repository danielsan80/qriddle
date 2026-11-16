import { config } from '../../config';
import {
  Coord,
  CoordSet,
  directions,
  Image,
  type Direction,
  type Pixel,
} from '../image';
import { type RandomFn } from '../../util';
import { Area, AreaStore } from './area';
import { EdgeStore } from './edge';

export function digPaths(
  image: Image,
  random: RandomFn,
  prefilledCells: Coord[],
): EdgeStore {
  const areas = new AreaStore(image, prefilledCells);
  const edges = EdgeStore.walled(image);

  for (const area of areas.all()) {
    if (area.prefilled) {
      openArea(area, edges);
      continue;
    }
    if (area.pixels.length <= 1) continue;
    digAreaPaths(image, area, edges, random);
  }

  return edges;
}

function openArea(area: Area, edges: EdgeStore): void {
  const cells = CoordSet.of(area.pixels.map((pixel) => pixel.coord));
  for (const pixel of area.pixels) {
    for (const direction of ['east', 'south'] as const) {
      if (cells.has(pixel.coord.goTo(direction))) {
        edges.removeWall(pixel.coord, direction);
      }
    }
  }
}

function digAreaPaths(
  image: Image,
  area: Area,
  edges: EdgeStore,
  random: RandomFn,
): void {
  const pixelSet = CoordSet.of(area.pixels.map((pixel) => pixel.coord));
  const visited = CoordSet.of([]);

  const startIndex = Math.floor(random() * area.pixels.length);
  const start = area.pixels[startIndex];

  const stack: { pixel: Pixel; lastDir: Direction | null }[] = [
    { pixel: start, lastDir: null },
  ];
  visited.add(start.coord);

  while (stack.length > 0) {
    const { pixel, lastDir } = stack[stack.length - 1];

    const unvisitedDirs = directions.filter((dir) => {
      const neighborCoord = pixel.coord.goTo(dir);
      return pixelSet.has(neighborCoord) && !visited.has(neighborCoord);
    });

    if (unvisitedDirs.length === 0) {
      stack.pop();
      continue;
    }

    const dir = chooseDirection(unvisitedDirs, lastDir, random);
    const nextCoord = pixel.coord.goTo(dir);
    const next = image.get(nextCoord);

    edges.removeWall(pixel.coord, dir);
    visited.add(nextCoord);
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
