import { describe, it, expect } from 'vitest';
import { edgeKey, EdgeMap, EdgeStore } from './edge';
import { Coord } from './coord';
import { directions } from './direction';
import { Image, type Pixel } from './image';

function wallSummary(store: EdgeStore) {
  return (pixel: Pixel): string => {
    const dirs = ['N', 'E', 'S', 'W'] as const;
    const edges = directions.map((dir) => store.get(pixel.coord, dir));
    return dirs.filter((_, i) => edges[i].hasWall).join('') || '-';
  };
}

describe('edgeKey', () => {
  it('returns same key regardless of coord order', () => {
    const a = new Coord(0, 0);
    const b = new Coord(0, 1);

    expect(edgeKey(a, b)).toBe(edgeKey(b, a));
  });

  it('formats key as "row,col-row,col" with smaller coord first', () => {
    expect(edgeKey(new Coord(1, 2), new Coord(1, 3))).toBe('1,2-1,3');
    expect(edgeKey(new Coord(1, 3), new Coord(1, 2))).toBe('1,2-1,3');
  });

  it('throws an error on non-adjacent coords', () => {
    const a = new Coord(0, 0);
    const b = new Coord(2, 2);

    expect(() => edgeKey(a, b)).toThrow();
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
});

describe('EdgeStore', () => {
  it('returns external edge for border cells', () => {
    const image = new Image([[0]]);
    const store = EdgeStore.create(image);

    const edge = store.get(new Coord(0, 0), 'north');

    expect(edge.isExternal).toBe(true);
    expect(edge.hasWall).toBe(true);
  });

  it('returns wall between different colors', () => {
    const image = new Image([[0, 1]]);
    const store = EdgeStore.create(image);

    const edge = store.get(new Coord(0, 0), 'east');

    expect(edge.isExternal).toBe(false);
    expect(edge.hasWall).toBe(true);
  });

  it('returns no wall between same colors', () => {
    const image = new Image([[1, 1]]);
    const store = EdgeStore.create(image);

    const edge = store.get(new Coord(0, 0), 'east');

    expect(edge.isExternal).toBe(false);
    expect(edge.hasWall).toBe(false);
  });

  it('allows to add custom walls', () => {
    const image = new Image([[1, 1]]);
    const store = EdgeStore.create(image);

    store.addWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(true);
  });

  it('allows to remove custom wall', () => {
    const image = new Image([[1, 1]]);
    const store = EdgeStore.create(image);
    store.addWall(new Coord(0, 0), 'east');

    store.removeWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(false);
  });

  it('throws when removing wall between different colors', () => {
    const image = new Image([[0, 1]]);
    const store = EdgeStore.create(image);

    expect(() => store.removeWall(new Coord(0, 0), 'east')).toThrow(
      'Cannot remove wall between different colors',
    );
  });

  it('addAllWalls adds walls between all same-color cells', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const store = EdgeStore.create(image);

    store.addAllWalls();

    expect(image.map(wallSummary(store))).toEqual([
      ['NESW', 'NESW', 'NESW'],
      ['NESW', 'NESW', 'NESW'],
      ['NESW', 'NESW', 'NESW'],
    ]);
  });
});
