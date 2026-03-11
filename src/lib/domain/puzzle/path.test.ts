import { describe, it, expect } from 'vitest';
import { Coord, directions, Image } from '../image';
import { createRandom } from '../../util';
import { AreaStore } from './area';
import { digPaths } from './path';

describe('digPaths', () => {
  it('produces same result with same seed', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const edges1 = digPaths(image, createRandom('test-seed'));
    const edges2 = digPaths(image, createRandom('test-seed'));

    expect(edges1.wallMap()).toEqual(edges2.wallMap());
  });

  it('produces different results with different seeds', () => {
    const image = new Image([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const edges1 = digPaths(image, createRandom('seed-a'));
    const edges2 = digPaths(image, createRandom('seed-b'));

    expect(edges1.wallMap()).not.toEqual(edges2.wallMap());
  });

  it('preserves external walls', () => {
    const image = new Image([
      [1, 1],
      [1, 1],
    ]);

    const edges = digPaths(image, createRandom('seed'));

    expect(edges.get(new Coord(0, 0), 'north').hasWall).toBe(true);
    expect(edges.get(new Coord(0, 0), 'west').hasWall).toBe(true);
    expect(edges.get(new Coord(0, 1), 'north').hasWall).toBe(true);
    expect(edges.get(new Coord(0, 1), 'east').hasWall).toBe(true);

    expect(edges.get(new Coord(1, 0), 'south').hasWall).toBe(true);
    expect(edges.get(new Coord(1, 0), 'west').hasWall).toBe(true);
    expect(edges.get(new Coord(1, 1), 'south').hasWall).toBe(true);
    expect(edges.get(new Coord(1, 1), 'east').hasWall).toBe(true);
  });

  it('preserves walls between different colors', () => {
    const image = new Image([
      [0, 1],
      [0, 1],
    ]);

    const edges = digPaths(image, createRandom('seed'));

    expect(edges.get(new Coord(0, 0), 'east').hasWall).toBe(true);
    expect(edges.get(new Coord(1, 0), 'east').hasWall).toBe(true);
    expect(edges.get(new Coord(0, 1), 'west').hasWall).toBe(true);
    expect(edges.get(new Coord(1, 1), 'west').hasWall).toBe(true);
  });

  it('connects all pixels in an area (spanning tree)', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const edges = digPaths(image, createRandom('seed'));
    const areas = new AreaStore(image);

    const area = areas.at(0)!;
    const start = area.pixels[0];
    const visited = new Set<string>();
    const queue = [start.coord.toString()];
    visited.add(start.coord.toString());

    while (queue.length > 0) {
      const key = queue.shift()!;
      const [row, col] = key.split(',').map(Number);
      const coord = new Coord(row, col);

      for (const dir of directions) {
        if (!edges.get(coord, dir).hasWall) {
          const neighbor = coord.goTo(dir);
          const neighborKey = neighbor.toString();
          if (!visited.has(neighborKey) && image.has(neighbor)) {
            visited.add(neighborKey);
            queue.push(neighborKey);
          }
        }
      }
    }

    expect(visited.size).toBe(area.pixels.length);
  });
});
