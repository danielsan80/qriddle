import { describe, it, expect } from 'vitest';
import { Maze } from './maze';
import { directions } from './direction';
import { Image, type Pixel } from './image';

describe('Maze', () => {
  function externalSummary(maze: Maze) {
    return (pixel: Pixel): string => {
      const dirs = ['N', 'E', 'S', 'W'] as const;
      const edges = directions.map((dir) => maze.edges.get(pixel.coord, dir));
      return dirs.filter((_, i) => edges[i].isExternal).join('') || '-';
    };
  }

  function wallSummary(maze: Maze) {
    return (pixel: Pixel): string => {
      const dirs = ['N', 'E', 'S', 'W'] as const;
      const edges = directions.map((dir) => maze.edges.get(pixel.coord, dir));
      return dirs.filter((_, i) => edges[i].hasWall).join('') || '-';
    };
  }

  describe('edges', () => {
    it('marks external edges for border cells', () => {
      const maze = new Maze(
        new Image([
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ]),
      );

      expect(maze.image.map(externalSummary(maze))).toEqual([
        ['NW', 'N', 'NE'],
        ['W', '-', 'E'],
        ['SW', 'S', 'ES'],
      ]);
    });

    it('has walls between different colors and on external edges', () => {
      const maze = new Maze(
        new Image([
          [0, 1],
          [0, 1],
        ]),
      );

      expect(maze.image.map(wallSummary(maze))).toEqual([
        ['NEW', 'NEW'],
        ['ESW', 'ESW'],
      ]);
    });

    it('has no internal walls between same colors', () => {
      const maze = new Maze(
        new Image([
          [1, 1],
          [1, 1],
        ]),
      );

      expect(maze.image.map(wallSummary(maze))).toEqual([
        ['NW', 'NE'],
        ['SW', 'ES'],
      ]);
    });
  });
});
