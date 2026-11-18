import { describe, it, expect } from 'vitest';
import { Coord, CoordSet, Image } from '../image';
import { Area, AreaStore } from './area';

describe('Area', () => {
  it('rejects a white prefilled area', () => {
    expect(() => new Area([], 'white', 'prefilled')).toThrow(
      'A prefilled area is black',
    );
  });

  it('has the cells of its pixels', () => {
    const image = new Image([[1, 1, 0]]);
    const store = new AreaStore(image, CoordSet.empty());

    expect(store.at(0)!.cells()).toEqual(
      CoordSet.create([new Coord(0, 0), new Coord(0, 1)]),
    );
  });
});

describe('AreaStore', () => {
  function mapAreas(image: Image, store: AreaStore): string[][] {
    const areaMap = new Map<string, string>();
    store.forEach((area, index) => {
      const symbol =
        area.kind === 'prefilled' ? '■' : area.color === 'black' ? '◾' : '◻';
      area.pixels.forEach((pixel) => {
        areaMap.set(pixel.coord.toString(), `${index}${symbol}`);
      });
    });

    return image.map((pixel) => areaMap.get(pixel.coord.toString())!);
  }

  it('groups cells by color', () => {
    const image = new Image([
      [0, 1],
      [0, 1],
    ]);
    const store = new AreaStore(image, CoordSet.empty());

    expect(mapAreas(image, store)).toEqual([
      ['0◻', '1◾'],
      ['0◻', '1◾'],
    ]);
  });

  it('separates non-adjacent same-color cells into different areas', () => {
    const image = new Image([
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ]);
    const store = new AreaStore(image, CoordSet.empty());

    expect(mapAreas(image, store)).toEqual([
      ['0◾', '1◻', '2◾'],
      ['1◻', '1◻', '1◻'],
      ['3◾', '1◻', '4◾'],
    ]);
  });

  it('merges adjacent same-color cells into one area', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const store = new AreaStore(image, CoordSet.empty());

    expect(mapAreas(image, store)).toEqual([
      ['0◾', '0◾', '0◾'],
      ['0◾', '0◾', '0◾'],
      ['0◾', '0◾', '0◾'],
    ]);
  });

  describe('with prefilled cells', () => {
    it('groups the prefilled cells into areas of their own', () => {
      const image = new Image([
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const store = new AreaStore(
        image,
        CoordSet.create([new Coord(0, 0), new Coord(1, 0)]),
      );

      expect(mapAreas(image, store)).toEqual([
        ['0■', '1◾', '1◾'],
        ['0■', '1◾', '1◾'],
      ]);
    });

    it('splits a black area crossed by prefilled cells', () => {
      const image = new Image([
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const store = new AreaStore(
        image,
        CoordSet.create([new Coord(0, 1), new Coord(1, 1)]),
      );

      expect(mapAreas(image, store)).toEqual([
        ['0◾', '1■', '2◾'],
        ['0◾', '1■', '2◾'],
      ]);
    });

    it('gives the areas to solve, without the prefilled ones', () => {
      const image = new Image([
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const store = new AreaStore(
        image,
        CoordSet.create([new Coord(0, 0), new Coord(1, 0)]),
      );

      expect(store.toSolve().map((area) => area.cells())).toEqual([
        CoordSet.create([new Coord(0, 1), new Coord(1, 1)]),
        CoordSet.create([new Coord(0, 2), new Coord(1, 2)]),
      ]);
    });

    it('gives the prefilled areas, without the ones to solve', () => {
      const image = new Image([
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const store = new AreaStore(
        image,
        CoordSet.create([new Coord(0, 0), new Coord(1, 0)]),
      );

      expect(store.prefilled().map((area) => area.cells())).toEqual([
        CoordSet.create([new Coord(0, 0), new Coord(1, 0)]),
      ]);
    });
  });
});
