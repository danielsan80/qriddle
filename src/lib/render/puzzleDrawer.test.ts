import { describe, it, expect } from 'vitest';
import { config } from '../config';
import { Coord, Image, type Direction } from '../domain/image';
import { type Puzzle } from '../domain/puzzle';
import { PuzzleDrawer } from './puzzleDrawer';
import { type Line, type Point } from './shape';

const { cellSize, backgroundColor, wallColor, wallWidth, dotColor, dotRadius } =
  config.puzzle;
const puzzleDrawer = new PuzzleDrawer(config.puzzle);

const blackThenWhite = new Image([[1, 0]]);

function puzzleOf(
  hasWall: (coord: Coord, direction: Direction) => boolean,
): Puzzle {
  return {
    image: blackThenWhite,
    hasWall,
    dots: [new Coord(0, 0)],
  } as unknown as Puzzle;
}

function isBetweenBlackAndWhite(coord: Coord, direction: Direction): boolean {
  return (
    (coord.col === 0 && direction === 'east') ||
    (coord.col === 1 && direction === 'west')
  );
}

function wall(from: Point, to: Point): Line {
  return { kind: 'line', color: wallColor, width: wallWidth, from, to };
}

const left = 0;
const middle = cellSize;
const right = 2 * cellSize;
const top = 0;
const bottom = cellSize;

const northOfBlack = wall({ x: left, y: top }, { x: middle, y: top });
const westOfBlack = wall({ x: left, y: top }, { x: left, y: bottom });
const southOfBlack = wall({ x: left, y: bottom }, { x: middle, y: bottom });
const northOfWhite = wall({ x: middle, y: top }, { x: right, y: top });
const betweenBlackAndWhite = wall(
  { x: middle, y: top },
  { x: middle, y: bottom },
);
const southOfWhite = wall({ x: middle, y: bottom }, { x: right, y: bottom });
const eastOfWhite = wall({ x: right, y: top }, { x: right, y: bottom });

describe('PuzzleDrawer', () => {
  it('measures the drawing on the size of the image', () => {
    const { width, height } = puzzleDrawer.draw(puzzleOf(() => true));

    expect({ width, height }).toEqual({ width: right, height: bottom });
  });

  it('draws the background, each wall once and the dots', () => {
    expect(puzzleDrawer.draw(puzzleOf(() => true)).shapes).toEqual([
      {
        kind: 'rect',
        color: backgroundColor,
        topLeft: { x: 0, y: 0 },
        width: right,
        height: bottom,
      },
      northOfBlack,
      westOfBlack,
      southOfBlack,
      northOfWhite,
      betweenBlackAndWhite,
      southOfWhite,
      eastOfWhite,
      {
        kind: 'circle',
        color: dotColor,
        center: { x: cellSize / 2, y: cellSize / 2 },
        radius: cellSize * dotRadius,
      },
    ]);
  });

  it('leaves out the edges without a wall', () => {
    const puzzle = puzzleOf(
      (coord, direction) => !isBetweenBlackAndWhite(coord, direction),
    );

    expect(
      puzzleDrawer.draw(puzzle).shapes.filter((shape) => shape.kind === 'line'),
    ).toEqual([
      northOfBlack,
      westOfBlack,
      southOfBlack,
      northOfWhite,
      southOfWhite,
      eastOfWhite,
    ]);
  });
});
