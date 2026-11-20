import { describe, it, expect } from 'vitest';
import { Coord, Image } from '../image';
import { EdgeStoreDriver } from './edge.driver';
import { edgeKey, EdgeMap, EdgeStore } from './edge';

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
  it('has the external edges on the margin of the image', () => {
    const image = new Image([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
    const edgeStoreDriver = new EdgeStoreDriver(EdgeStore.walled(image));

    expect(edgeStoreDriver.externalMap()).toEqual([
      ['NW', 'N', 'NE'],
      ['W', '-', 'E'],
      ['SW', 'S', 'ES'],
    ]);
  });

  it('starts with a wall on every edge', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const edgeStoreDriver = new EdgeStoreDriver(EdgeStore.walled(image));

    expect(edgeStoreDriver.wallMap()).toEqual([
      ['NESW', 'NESW', 'NESW'],
      ['NESW', 'NESW', 'NESW'],
      ['NESW', 'NESW', 'NESW'],
    ]);
  });

  it('removes a wall', () => {
    const edgeStore = EdgeStore.walled(new Image([[1, 1]]));

    edgeStore.removeWall(new Coord(0, 0), 'east');

    expect(new EdgeStoreDriver(edgeStore).wallMap()).toEqual([['NSW', 'NES']]);
  });

  it('has walls between different colors and on the margin', () => {
    const image = new Image([
      [0, 1],
      [0, 1],
    ]);
    const edgeStoreDriver = new EdgeStoreDriver(EdgeStore.create(image));

    expect(edgeStoreDriver.wallMap()).toEqual([
      ['NEW', 'NEW'],
      ['ESW', 'ESW'],
    ]);
  });

  it('has no walls between same colors', () => {
    const image = new Image([
      [1, 1],
      [1, 1],
    ]);
    const edgeStoreDriver = new EdgeStoreDriver(EdgeStore.create(image));

    expect(edgeStoreDriver.wallMap()).toEqual([
      ['NW', 'NE'],
      ['SW', 'ES'],
    ]);
  });

  it('adds a wall', () => {
    const edgeStore = EdgeStore.create(new Image([[1, 1]]));

    edgeStore.addWall(new Coord(0, 0), 'east');

    expect(new EdgeStoreDriver(edgeStore).wallMap()).toEqual([
      ['NESW', 'NESW'],
    ]);
  });

  it('refuses to remove a wall between different colors', () => {
    const edgeStore = EdgeStore.walled(new Image([[0, 1]]));

    expect(() => edgeStore.removeWall(new Coord(0, 0), 'east')).toThrow(
      'Cannot remove wall between different colors',
    );
  });
});
