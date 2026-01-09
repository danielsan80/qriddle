import { describe, it, expect } from 'vitest';
import {
  Maze,
  MazeCell,
  generateMazeBorders,
  findAreas,
  generateMaze,
} from './maze';
import { type Grid } from './grid';
import { Coord } from './coord';

describe('generateMazeBorders', () => {
  it('generates no internal borders for uniform grid', () => {
    const grid: Grid = [
      [0, 0],
      [0, 0],
    ];

    const borders = generateMazeBorders(grid);

    expect(borders).toEqual({
      horizontal: [[false, false]],
      vertical: [[false], [false]],
    });
  });

  it('generates borders between different color cells', () => {
    const grid: Grid = [
      [0, 1],
      [0, 1],
    ];

    const borders = generateMazeBorders(grid);

    expect(borders).toEqual({
      horizontal: [[false, false]],
      vertical: [[true], [true]],
    });
  });
});

describe('findAreas', () => {
  it('finds areas divided from borders', () => {
    const grid: Grid = [
      [0, 1],
      [0, 1],
    ];
    const borders = generateMazeBorders(grid);

    const areas = findAreas(grid, borders);

    expect(areas).toEqual([
      {
        cells: [
          [0, 0],
          [1, 0],
        ],
        isBlack: false,
      },
      {
        cells: [
          [0, 1],
          [1, 1],
        ],
        isBlack: true,
      },
    ]);
  });
});

describe('generateMaze', () => {
  it('generates a complete maze from a QR code', () => {
    const qrMatrix: Grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];

    const result = generateMaze(qrMatrix);

    expect(result.grid.length).toBe(6);
    expect(result.borders.horizontal).toBeDefined();
    expect(result.borders.vertical).toBeDefined();
    expect(result.areas.length).toBeGreaterThan(0);
  });

  it('keeps the connection between the areas', () => {
    const qrMatrix: Grid = [
      [0, 0],
      [0, 0],
    ];

    const result = generateMaze(qrMatrix);

    const totalCells = result.areas.reduce(
      (sum, area) => sum + area.cells.length,
      0,
    );
    expect(totalCells).toBe(16);
  });

  it('generates the same maze with the same seed, and different ones with different ones', () => {
    const qrMatrix: Grid = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ];

    const result1 = generateMaze(qrMatrix, 'soy seed');
    const result2 = generateMaze(qrMatrix, 'soy seed');
    const result3 = generateMaze(qrMatrix, 'stink seed');

    expect(result1.borders).toEqual(result2.borders);
    expect(result1.areas).toEqual(result2.areas);

    expect(result1.borders).not.toEqual(result3.borders);
    expect(result1.areas).not.toEqual(result3.areas);
  });
});

describe('Maze', () => {
  function externalSummary(cell: MazeCell): string {
    const dirs = ['N', 'E', 'S', 'W'] as const;
    const edges = [cell.edges.north, cell.edges.east, cell.edges.south, cell.edges.west];
    return dirs.filter((_, i) => edges[i].isExternal).join('') || '-';
  }

  function wallSummary(cell: MazeCell): string {
    const dirs = ['N', 'E', 'S', 'W'] as const;
    const edges = [cell.edges.north, cell.edges.east, cell.edges.south, cell.edges.west];
    return dirs.filter((_, i) => edges[i].hasWall).join('') || '-';
  }

  function mapMaze(maze: Maze, fn: (cell: MazeCell) => string): string[][] {
    const result: string[][] = [];
    for (let row = 0; row < maze.size; row++) {
      result[row] = [];
      for (let col = 0; col < maze.size; col++) {
        result[row][col] = fn(maze.get(new Coord(row, col)));
      }
    }
    return result;
  }

  describe('edges', () => {
    it('marks external edges for border cells', () => {
      const maze = new Maze([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);

      expect(mapMaze(maze, externalSummary)).toEqual([
        ['NW', 'N', 'NE'],
        ['W', '-', 'E'],
        ['SW', 'S', 'ES'],
      ]);
    });

    it('has walls between different colors and on external edges', () => {
      const maze = new Maze([
        [0, 1],
        [0, 1],
      ]);

      expect(mapMaze(maze, wallSummary)).toEqual([
        ['NEW', 'NEW'],
        ['ESW', 'ESW'],
      ]);
    });

    it('has no internal walls between same colors', () => {
      const maze = new Maze([
        [1, 1],
        [1, 1],
      ]);

      expect(mapMaze(maze, wallSummary)).toEqual([
        ['NW', 'NE'],
        ['SW', 'ES'],
      ]);
    });
  });
});
