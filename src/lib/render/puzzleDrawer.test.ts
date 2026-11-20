import { describe, it, expect } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { config } from '../config';
import { Coord, CoordSet, Image, type Direction } from '../domain/image';
import { type Puzzle } from '../domain/puzzle';
import { PuzzleDrawer } from './puzzleDrawer';
import { type Circle, type Line, type Rect } from './shape';

const {
  cellSize,
  backgroundColor,
  wallColor,
  wallWidth,
  dotColor,
  dotRadius,
  prefilledColor,
} = config.puzzle;
const puzzleDrawer = new PuzzleDrawer(config.puzzle);

const blackThenWhite = new Image([[1, 0]]);
const blackCell = new Coord(0, 0);
const whiteCell = new Coord(0, 1);

const whiteThenBlack = new Image([[0, 1]]);
const leftCell = new Coord(0, 0);
const rightCell = new Coord(0, 1);

function puzzleOf({
  image,
  hasWall,
  dots,
  prefilledCells,
}: {
  image: Image;
  hasWall: (coord: Coord, direction: Direction) => boolean;
  dots: Coord[];
  prefilledCells: CoordSet;
}): Puzzle {
  const puzzle = mock<Puzzle>({ image, dots });
  puzzle.hasWall.mockImplementation(hasWall);
  puzzle.isPrefilledCell.mockImplementation((coord) =>
    prefilledCells.has(coord),
  );
  return puzzle;
}

function isWallOf(cell: Coord, side: Direction) {
  return (coord: Coord, direction: Direction) =>
    coord.equals(cell) && direction === side;
}

function isBetweenBlackAndWhite(coord: Coord, direction: Direction): boolean {
  return (
    (coord.equals(blackCell) && direction === 'east') ||
    (coord.equals(whiteCell) && direction === 'west')
  );
}

function background(): Rect {
  return {
    kind: 'rect',
    color: backgroundColor,
    topLeft: { x: 0, y: 0 },
    width: 2 * cellSize,
    height: cellSize,
  };
}

function prefilledCell(cell: Coord): Rect {
  return {
    kind: 'rect',
    color: prefilledColor,
    topLeft: { x: cell.col * cellSize, y: cell.row * cellSize },
    width: cellSize,
    height: cellSize,
  };
}

function wall(cell: Coord, side: Direction): Line {
  const left = cell.col * cellSize;
  const top = cell.row * cellSize;
  const right = left + cellSize;
  const bottom = top + cellSize;
  const [from, to] = {
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
  }[side];
  return { kind: 'line', color: wallColor, width: wallWidth, from, to };
}

function dot(cell: Coord): Circle {
  return {
    kind: 'circle',
    color: dotColor,
    center: { x: (cell.col + 0.5) * cellSize, y: (cell.row + 0.5) * cellSize },
    radius: cellSize * dotRadius,
  };
}

describe('PuzzleDrawer', () => {
  it('measures the drawing on the size of the image', () => {
    const { width, height } = puzzleDrawer.draw(
      puzzleOf({
        image: blackThenWhite,
        hasWall: () => true,
        dots: [],
        prefilledCells: CoordSet.empty(),
      }),
    );

    expect({ width, height }).toEqual({
      width: 2 * cellSize,
      height: cellSize,
    });
  });

  it('draws a wall along the side of its cell', () => {
    const puzzle = puzzleOf({
      image: blackThenWhite,
      hasWall: isWallOf(whiteCell, 'south'),
      dots: [],
      prefilledCells: CoordSet.empty(),
    });

    expect(
      puzzleDrawer.draw(puzzle).shapes.filter((shape) => shape.kind === 'line'),
    ).toEqual([
      {
        kind: 'line',
        color: wallColor,
        width: wallWidth,
        from: { x: cellSize, y: cellSize },
        to: { x: 2 * cellSize, y: cellSize },
      },
    ]);
  });

  it('draws the background, each wall once and the dots', () => {
    const puzzle = puzzleOf({
      image: blackThenWhite,
      hasWall: () => true,
      dots: [blackCell],
      prefilledCells: CoordSet.empty(),
    });

    expect(puzzleDrawer.draw(puzzle).shapes).toEqual([
      background(),
      wall(blackCell, 'north'),
      wall(blackCell, 'west'),
      wall(blackCell, 'south'),
      wall(whiteCell, 'north'),
      wall(whiteCell, 'west'),
      wall(whiteCell, 'south'),
      wall(whiteCell, 'east'),
      dot(blackCell),
    ]);
  });

  it('leaves out the edges without a wall', () => {
    const puzzle = puzzleOf({
      image: blackThenWhite,
      hasWall: (coord, direction) => !isBetweenBlackAndWhite(coord, direction),
      dots: [],
      prefilledCells: CoordSet.empty(),
    });

    expect(
      puzzleDrawer.draw(puzzle).shapes.filter((shape) => shape.kind === 'line'),
    ).toEqual([
      wall(blackCell, 'north'),
      wall(blackCell, 'west'),
      wall(blackCell, 'south'),
      wall(whiteCell, 'north'),
      wall(whiteCell, 'south'),
      wall(whiteCell, 'east'),
    ]);
  });

  it('fills the prefilled cells under the walls, with no wall next to them', () => {
    const puzzle = puzzleOf({
      image: blackThenWhite,
      hasWall: () => true,
      dots: [],
      prefilledCells: CoordSet.create([blackCell]),
    });

    expect(puzzleDrawer.draw(puzzle).shapes).toEqual([
      background(),
      prefilledCell(blackCell),
      wall(blackCell, 'north'),
      wall(blackCell, 'west'),
      wall(blackCell, 'south'),
      wall(whiteCell, 'north'),
      wall(whiteCell, 'south'),
      wall(whiteCell, 'east'),
    ]);
  });

  it('hides the wall on the side of a prefilled cell', () => {
    const puzzle = puzzleOf({
      image: whiteThenBlack,
      hasWall: () => true,
      dots: [],
      prefilledCells: CoordSet.create([rightCell]),
    });

    expect(
      puzzleDrawer.draw(puzzle).shapes.filter((shape) => shape.kind === 'line'),
    ).toEqual([
      wall(leftCell, 'north'),
      wall(leftCell, 'west'),
      wall(leftCell, 'south'),
      wall(rightCell, 'north'),
      wall(rightCell, 'south'),
      wall(rightCell, 'east'),
    ]);
  });
});
