import { describe, it, expect } from 'vitest';
import { Coord, directions, Image, type Direction } from '../image';
import { edgeKey, EdgeMap, EdgeStore, type Edges } from './edge';

const boxChars: Record<string, string> = {
  '': '·',
  N: '╵',
  E: '╶',
  S: '╷',
  W: '╴',
  NE: '└',
  NS: '│',
  NW: '┘',
  ES: '┌',
  EW: '─',
  SW: '┐',
  NES: '├',
  NEW: '┴',
  NSW: '┤',
  ESW: '┬',
  NESW: '┼',
};

function toBoxChar(edges: Edges): string {
  const key = directions
    .filter((dir: Direction): boolean => edges[dir].hasWall)
    .map((dir: Direction): string => dir[0].toUpperCase())
    .join('');
  return boxChars[key] ?? '?';
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
  it('externalMap returns external edges', () => {
    const image = new Image([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
    const store = EdgeStore.create(image);

    expect(store.externalMap()).toEqual([
      ['NW', 'N', 'NE'],
      ['W', '-', 'E'],
      ['SW', 'S', 'ES'],
    ]);
  });

  it('wallMap shows walls between different colors and on external edges', () => {
    const image = new Image([
      [0, 1],
      [0, 1],
    ]);
    const store = EdgeStore.create(image);

    expect(store.wallMap()).toEqual([
      ['NEW', 'NEW'],
      ['ESW', 'ESW'],
    ]);
  });

  it('wallMap shows no internal walls between same colors', () => {
    const image = new Image([
      [1, 1],
      [1, 1],
    ]);
    const store = EdgeStore.create(image);

    expect(store.wallMap()).toEqual([
      ['NW', 'NE'],
      ['SW', 'ES'],
    ]);
  });

  it('addWall adds a wall', () => {
    const image = new Image([[1, 1]]);
    const store = EdgeStore.create(image);

    store.addWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(true);
  });

  it('removeWall removes a wall', () => {
    const image = new Image([[1, 1]]);
    const store = EdgeStore.create(image);
    store.addWall(new Coord(0, 0), 'east');

    store.removeWall(new Coord(0, 0), 'east');

    expect(store.get(new Coord(0, 0), 'east').hasWall).toBe(false);
  });

  it('removeWall throws an error when removing wall between different colors', () => {
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

    expect(store.wallMap()).toEqual([
      ['NESW', 'NESW', 'NESW'],
      ['NESW', 'NESW', 'NESW'],
      ['NESW', 'NESW', 'NESW'],
    ]);
  });

  it('map allows custom wall rendering with box-drawing characters', () => {
    const image = new Image([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const store = EdgeStore.create(image);

    // prettier-ignore
    expect(
      store
        .map(toBoxChar)
        .map((row) => row.join(''))
        .join('\n'),
    ).toBe([
      '┘╵╵╵╵└',
      '╴·╷╷·╶',
      '╴╶┘└╴╶',
      '╴╶┐┌╴╶',
      '╴·╵╵·╶',
      '┐╷╷╷╷┌',
    ].join('\n'));
  });
});
