import { Coord, type Direction } from '../domain/image';
import { type Puzzle } from '../domain/puzzle';
import {
  type Circle,
  type Drawing,
  type Line,
  type Point,
  type Rect,
} from './shape';

export interface PuzzleDrawOptions {
  cellSize: number;
  backgroundColor: string;
  wallColor: string;
  wallWidth: number;
  dotColor: string;
  dotRadius: number;
}

export class PuzzleDrawer {
  private readonly options: PuzzleDrawOptions;

  constructor(options: PuzzleDrawOptions) {
    this.options = options;
  }

  draw(puzzle: Puzzle): Drawing {
    const { rows, cols } = puzzle.image.size;
    const width = cols * this.options.cellSize;
    const height = rows * this.options.cellSize;
    return {
      width,
      height,
      shapes: [
        background(width, height, this.options),
        ...walls(puzzle, this.options),
        ...dots(puzzle, this.options),
      ],
    };
  }
}

function background(
  width: number,
  height: number,
  options: PuzzleDrawOptions,
): Rect {
  return {
    kind: 'rect',
    color: options.backgroundColor,
    topLeft: { x: 0, y: 0 },
    width,
    height,
  };
}

function walls(puzzle: Puzzle, options: PuzzleDrawOptions): Line[] {
  const { rows, cols } = puzzle.image.size;
  const lines: Line[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coord = new Coord(row, col);
      const sides: Direction[] = ['north', 'west'];
      if (row === rows - 1) sides.push('south');
      if (col === cols - 1) sides.push('east');

      for (const side of sides) {
        if (puzzle.hasWall(coord, side)) {
          lines.push(wall(coord, side, options));
        }
      }
    }
  }
  return lines;
}

function wall(coord: Coord, side: Direction, options: PuzzleDrawOptions): Line {
  const { cellSize } = options;
  const left = coord.col * cellSize;
  const top = coord.row * cellSize;
  const right = left + cellSize;
  const bottom = top + cellSize;
  const ends: Record<Direction, [Point, Point]> = {
    north: [
      { x: left, y: top },
      { x: right, y: top },
    ],
    south: [
      { x: left, y: bottom },
      { x: right, y: bottom },
    ],
    west: [
      { x: left, y: top },
      { x: left, y: bottom },
    ],
    east: [
      { x: right, y: top },
      { x: right, y: bottom },
    ],
  };
  const [from, to] = ends[side];
  return {
    kind: 'line',
    color: options.wallColor,
    width: options.wallWidth,
    from,
    to,
  };
}

function dots(puzzle: Puzzle, options: PuzzleDrawOptions): Circle[] {
  const { cellSize } = options;
  return puzzle.dots.map((dot) => ({
    kind: 'circle',
    color: options.dotColor,
    center: { x: (dot.col + 0.5) * cellSize, y: (dot.row + 0.5) * cellSize },
    radius: cellSize * options.dotRadius,
  }));
}
