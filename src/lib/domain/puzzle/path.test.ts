import { describe, it, expect } from 'vitest';
import { Coord, CoordSet, directions, Image, Visited } from '../image';
import { createRandom } from '../../util';
import { AreaStore } from './area';
import { EdgeStore } from './edge';
import { digPaths, openAreas } from './path';

function dig(image: Image, seed: string, prefilledCells: CoordSet): EdgeStore {
  const areas = new AreaStore(image, prefilledCells);
  const edges = EdgeStore.walled(image);
  openAreas(areas.prefilled(), edges);
  digPaths(areas.toSolve(), edges, createRandom(seed));
  return edges;
}

describe('digPaths', () => {
  it('produces same result with same seed', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const edges1 = dig(image, 'test-seed', CoordSet.empty());
    const edges2 = dig(image, 'test-seed', CoordSet.empty());

    expect(edges1.wallMap()).toEqual(edges2.wallMap());
  });

  it('produces different results with different seeds', () => {
    const image = new Image([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const edges1 = dig(image, 'seed-a', CoordSet.empty());
    const edges2 = dig(image, 'seed-b', CoordSet.empty());

    expect(edges1.wallMap()).not.toEqual(edges2.wallMap());
  });

  it('preserves external walls', () => {
    const image = new Image([
      [1, 1],
      [1, 1],
    ]);

    const edges = dig(image, 'seed', CoordSet.empty());

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

    const edges = dig(image, 'seed', CoordSet.empty());

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

    const edges = dig(image, 'seed', CoordSet.empty());
    const areas = new AreaStore(image, CoordSet.empty());

    const area = areas.at(0)!;
    const start = area.pixels[0];
    const visited = Visited.create(image.size);
    const queue = [start.coord];
    visited.mark(start.coord);

    while (queue.length > 0) {
      const coord = queue.shift()!;

      for (const dir of directions) {
        if (!edges.get(coord, dir).hasWall) {
          const neighbor = coord.goTo(dir);
          if (!visited.has(neighbor) && image.has(neighbor)) {
            visited.mark(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    expect(visited.size).toBe(area.pixels.length);
  });

  describe('with prefilled cells', () => {
    const image = new Image([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);
    const prefilledCells = CoordSet.create([
      new Coord(0, 0),
      new Coord(0, 1),
      new Coord(1, 0),
      new Coord(1, 1),
    ]);

    it('opens the prefilled cells', () => {
      const areas = new AreaStore(image, prefilledCells);
      const edges = EdgeStore.walled(image);

      openAreas(areas.prefilled(), edges);

      const insideTheModule = [
        [new Coord(0, 0), 'east'],
        [new Coord(0, 0), 'south'],
        [new Coord(1, 1), 'north'],
        [new Coord(1, 1), 'west'],
      ] as const;

      expect(
        insideTheModule.map(
          ([coord, direction]) => edges.get(coord, direction).hasWall,
        ),
      ).toEqual([false, false, false, false]);
    });

    it('walls the prefilled cells from the area to solve', () => {
      const edges = dig(image, 'seed', prefilledCells);

      const towardsTheAreaToSolve = [
        [new Coord(0, 1), 'east'],
        [new Coord(1, 1), 'east'],
      ] as const;

      expect(
        towardsTheAreaToSolve.map(
          ([coord, direction]) => edges.get(coord, direction).hasWall,
        ),
      ).toEqual([true, true]);
    });
  });
});
