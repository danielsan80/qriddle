import { describe, it, expect } from 'vitest';
import { Maze, MazeCell } from './maze';

describe('Maze', () => {
  function externalSummary(cell: MazeCell): string {
    const dirs = ['N', 'E', 'S', 'W'] as const;
    const edges = [
      cell.edges.north,
      cell.edges.east,
      cell.edges.south,
      cell.edges.west,
    ];
    return dirs.filter((_, i) => edges[i].isExternal).join('') || '-';
  }

  function wallSummary(cell: MazeCell): string {
    const dirs = ['N', 'E', 'S', 'W'] as const;
    const edges = [
      cell.edges.north,
      cell.edges.east,
      cell.edges.south,
      cell.edges.west,
    ];
    return dirs.filter((_, i) => edges[i].hasWall).join('') || '-';
  }

  describe('edges', () => {
    it('marks external edges for border cells', () => {
      const maze = new Maze([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);

      expect(maze.map(externalSummary)).toEqual([
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

      expect(maze.map(wallSummary)).toEqual([
        ['NEW', 'NEW'],
        ['ESW', 'ESW'],
      ]);
    });

    it('has no internal walls between same colors', () => {
      const maze = new Maze([
        [1, 1],
        [1, 1],
      ]);

      expect(maze.map(wallSummary)).toEqual([
        ['NW', 'NE'],
        ['SW', 'ES'],
      ]);
    });
  });

  describe('areas', () => {
    function mapAreas(maze: Maze): string[][] {
      const areaMap = new Map<string, string>();
      maze.areas.forEach((area, index) => {
        const symbol = area.color === 'black' ? '◾' : '◻';
        area.cells.forEach((cell) => {
          areaMap.set(cell.coord.toString(), `${index}${symbol}`);
        });
      });

      return maze.map((cell) => areaMap.get(cell.coord.toString())!);
    }

    it('groups cells by color', () => {
      const maze = new Maze([
        [0, 1],
        [0, 1],
      ]);

      expect(mapAreas(maze)).toEqual([
        ['0◻', '1◾'],
        ['0◻', '1◾'],
      ]);
    });

    it('separates non-adjacent same-color cells into different areas', () => {
      const maze = new Maze([
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ]);

      expect(mapAreas(maze)).toEqual([
        ['0◾', '1◻', '2◾'],
        ['1◻', '1◻', '1◻'],
        ['3◾', '1◻', '4◾'],
      ]);
    });

    it('merges adjacent same-color cells into one area', () => {
      const maze = new Maze([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);

      expect(mapAreas(maze)).toEqual([
        ['0◾', '0◾', '0◾'],
        ['0◾', '0◾', '0◾'],
        ['0◾', '0◾', '0◾'],
      ]);
    });
  });
});
