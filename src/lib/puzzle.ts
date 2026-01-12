import { type RandomFn, mulberry32, hashString } from './random';
import { Maze } from './maze';
import { Area } from './area';
import { Coord, type Direction, directions } from './coord';
import { type Pixel } from './image';

export class Puzzle {
  readonly maze: Maze;
  private readonly passages: Set<string>;

  private constructor(maze: Maze, passages: Set<string>) {
    this.maze = maze;
    this.passages = passages;
  }

  static create(maze: Maze, seed: string): Puzzle {
    const random = mulberry32(hashString(seed));
    const passages = computePassages(maze, random);
    return new Puzzle(maze, passages);
  }

  hasWall(coord: Coord, direction: Direction): boolean {
    const edge = this.maze.edges.get(coord, direction);

    // External edges and color boundaries always have walls
    if (edge.isExternal || edge.hasWall) {
      return true;
    }

    // Internal same-color edge: check passages
    const neighborCoord = coord.goTo(direction);
    const key = passageKey(coord, neighborCoord);
    return !this.passages.has(key);
  }
}

function computePassages(maze: Maze, random: RandomFn): Set<string> {
  const passages = new Set<string>();

  for (const area of maze.areas.all()) {
    if (area.pixels.length <= 1) continue;
    generateAreaPassages(maze, area, random, passages);
  }

  return passages;
}

function generateAreaPassages(
  maze: Maze,
  area: Area,
  random: RandomFn,
  passages: Set<string>,
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
    const next = maze.get(nextCoord);

    passages.add(passageKey(pixel.coord, nextCoord));
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

function passageKey(a: Coord, b: Coord): string {
  const [first, second] =
    a.row < b.row || (a.row === b.row && a.col < b.col) ? [a, b] : [b, a];
  return `${first.toString()}-${second.toString()}`;
}
