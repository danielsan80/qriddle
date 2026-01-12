import { describe, it, expect } from 'vitest';
import { AreaStore } from './area';
import { Image } from './image';

describe('AreaStore', () => {
  function mapAreas(image: Image, store: AreaStore): string[][] {
    const areaMap = new Map<string, string>();
    store.forEach((area, index) => {
      const symbol = area.color === 'black' ? '◾' : '◻';
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
    const store = new AreaStore(image);

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
    const store = new AreaStore(image);

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
    const store = new AreaStore(image);

    expect(mapAreas(image, store)).toEqual([
      ['0◾', '0◾', '0◾'],
      ['0◾', '0◾', '0◾'],
      ['0◾', '0◾', '0◾'],
    ]);
  });
});
