import { describe, it, expect } from 'vitest';
import { Maze, Cell, EdgeMap, EdgeStore } from './maze';
import { Coord, directions } from './coord';

describe('Maze', () => {
  function externalSummary(maze: Maze) {
    return (cell: Cell): string => {
      const dirs = ['N', 'E', 'S', 'W'] as const;
      const edges = directions.map((dir) => maze.edges.get(cell.coord, dir));
      return dirs.filter((_, i) => edges[i].isExternal).join('') || '-';
    };
  }

  function wallSummary(maze: Maze) {
    return (cell: Cell): string => {
      const dirs = ['N', 'E', 'S', 'W'] as const;
      const edges = directions.map((dir) => maze.edges.get(cell.coord, dir));
      return dirs.filter((_, i) => edges[i].hasWall).join('') || '-';
    };
  }

  describe('edges', () => {
    it('marks external edges for border cells', () => {
      const maze = new Maze([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);

      expect(maze.map(externalSummary(maze))).toEqual([
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

      expect(maze.map(wallSummary(maze))).toEqual([
        ['NEW', 'NEW'],
        ['ESW', 'ESW'],
      ]);
    });

    it('has no internal walls between same colors', () => {
      const maze = new Maze([
        [1, 1],
        [1, 1],
      ]);

      expect(maze.map(wallSummary(maze))).toEqual([
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
    const maze = new Maze([[0]]);
    const store = new EdgeStore(maze);

    const edge = store.get(new Coord(0, 0), 'north');

    expect(edge.isExternal).toBe(true);
    expect(edge.hasWall).toBe(true);
  });

  it('returns wall between different colors', () => {
    const maze = new Maze([[0, 1]]);
    const store = new EdgeStore(maze);

    const edge = store.get(new Coord(0, 0), 'east');

    expect(edge.isExternal).toBe(false);
    expect(edge.hasWall).toBe(true);
  });

  it('returns no wall between same colors', () => {
    const maze = new Maze([[1, 1]]);
    const store = new EdgeStore(maze);

    const edge = store.get(new Coord(0, 0), 'east');

    expect(edge.isExternal).toBe(false);
    expect(edge.hasWall).toBe(false);
  });

  it('allows to add custom walls', () => {
    const maze = new Maze([[1, 1]]);
    const store = new EdgeStore(maze);

    store.addWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(true);
  });

  it('allows to remove custom wall', () => {
    const maze = new Maze([[1, 1]]);
    const store = new EdgeStore(maze);
    store.addWall(new Coord(0, 0), 'east');

    store.removeWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(false);
  });
});
