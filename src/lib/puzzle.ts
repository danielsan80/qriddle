import { type RandomFn, mulberry32, hashString } from './random';
import { Area, AreaStore } from './area';
import { Coord } from './coord';
import { type Direction, directions } from './direction';
import { EdgeStore } from './edge';
import { Image, type Pixel } from './image';

export class Puzzle {
  readonly image: Image;
  readonly areas: AreaStore;
  private readonly edges: EdgeStore;

  private constructor(image: Image, areas: AreaStore, edges: EdgeStore) {
    this.image = image;
    this.areas = areas;
    this.edges = edges;
  }

  static create(image: Image, seed: string): Puzzle {
    const random = mulberry32(hashString(seed));
    const areas = new AreaStore(image);
    const edges = EdgeStore.walled(image);
    generatePassages(image, areas, edges, random);
    return new Puzzle(image, areas, edges);
  }

  hasWall(coord: Coord, direction: Direction): boolean {
    return this.edges.get(coord, direction).hasWall;
  }
}

function generatePassages(
  image: Image,
  areas: AreaStore,
  edges: EdgeStore,
  random: RandomFn,
): void {
  for (const area of areas.all()) {
    if (area.pixels.length <= 1) continue;
    generateAreaPassages(image, area, edges, random);
  }
}

function generateAreaPassages(
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

  const biasStraight = 0.7;

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

    const dir = chooseDirection(unvisitedDirs, lastDir, biasStraight, random);
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
  biasStraight: number,
  random: RandomFn,
): Direction {
  if (candidates.length === 1) return candidates[0];

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
