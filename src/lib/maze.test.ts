import { describe, it, expect } from 'vitest';
import { Maze, EdgeMap, EdgeStore } from './maze';
import { Coord, directions } from './coord';
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

describe('EdgeMap', () => {
  it('stores and retrieves values for adjacent coords', () => {
    const map = new EdgeMap<string>();
    const a = new Coord(0, 0);
    const b = new Coord(0, 1);

    map.set(a, b, 'test');

    expect(map.get(a, b)).toBe('test');
    expect(map.has(a, b)).toBe(true);
  });

  it('returns same value regardless of coord order', () => {
    const map = new EdgeMap<string>();
    const a = new Coord(0, 0);
    const b = new Coord(0, 1);

    map.set(a, b, 'test');

    expect(map.get(b, a)).toBe('test');
    expect(map.has(b, a)).toBe(true);
  });

  it('returns undefined for missing edges', () => {
    const map = new EdgeMap<string>();
    const a = new Coord(0, 0);
    const b = new Coord(0, 1);

    expect(map.get(a, b)).toBeUndefined();
    expect(map.has(a, b)).toBe(false);
  });

  it('asserts on non-adjacent coords', () => {
    const map = new EdgeMap<string>();
    const a = new Coord(0, 0);
    const b = new Coord(2, 2);

    expect(() => map.set(a, b, 'test')).toThrow();
  });
});

describe('EdgeStore', () => {
  it('returns external edge for border cells', () => {
    const image = new Image([[0]]);
    const store = new EdgeStore(image);

    const edge = store.get(new Coord(0, 0), 'north');

    expect(edge.isExternal).toBe(true);
    expect(edge.hasWall).toBe(true);
  });

  it('returns wall between different colors', () => {
    const image = new Image([[0, 1]]);
    const store = new EdgeStore(image);

    const edge = store.get(new Coord(0, 0), 'east');

    expect(edge.isExternal).toBe(false);
    expect(edge.hasWall).toBe(true);
  });

  it('returns no wall between same colors', () => {
    const image = new Image([[1, 1]]);
    const store = new EdgeStore(image);

    const edge = store.get(new Coord(0, 0), 'east');

    expect(edge.isExternal).toBe(false);
    expect(edge.hasWall).toBe(false);
  });

  it('allows to add custom walls', () => {
    const image = new Image([[1, 1]]);
    const store = new EdgeStore(image);

    store.addWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(true);
  });

  it('allows to remove custom wall', () => {
    const image = new Image([[1, 1]]);
    const store = new EdgeStore(image);
    store.addWall(new Coord(0, 0), 'east');

    store.removeWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(false);
  });
});
