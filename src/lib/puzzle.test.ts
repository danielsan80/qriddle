import { describe, it, expect } from 'vitest';
import { Puzzle } from './puzzle';
import { Maze } from './maze';
import { Coord, type Direction } from './coord';

describe('Puzzle', () => {
  it('wraps a Maze instance', () => {
    const maze = new Maze([
      [1, 1],
      [1, 1],
    ]);

    const puzzle = Puzzle.create(maze, 'seed');

    expect(puzzle.maze).toBe(maze);
  });

  it('produces same result with same seed', () => {
    const maze = new Maze([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const puzzle1 = Puzzle.create(maze, 'test-seed');
    const puzzle2 = Puzzle.create(maze, 'test-seed');

    expect(wallMap(puzzle1)).toEqual(wallMap(puzzle2));
  });

  it('produces different results with different seeds', () => {
    const maze = new Maze([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const puzzle1 = Puzzle.create(maze, 'seed-a');
    const puzzle2 = Puzzle.create(maze, 'seed-b');

    expect(wallMap(puzzle1)).not.toEqual(wallMap(puzzle2));
  });

  it('preserves external walls from maze', () => {
    const maze = new Maze([
      [1, 1],
      [1, 1],
    ]);

    const puzzle = Puzzle.create(maze, 'seed');

    // External edges always have walls
    expect(puzzle.hasWall(new Coord(0, 0), 'north')).toBe(true);
    expect(puzzle.hasWall(new Coord(0, 0), 'west')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 1), 'south')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 1), 'east')).toBe(true);
  });

  it('preserves walls between different colors', () => {
    const maze = new Maze([
      [0, 1],
      [0, 1],
    ]);

    const puzzle = Puzzle.create(maze, 'seed');

    // Color boundary walls are preserved
    expect(puzzle.hasWall(new Coord(0, 0), 'east')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 0), 'east')).toBe(true);
    expect(puzzle.hasWall(new Coord(0, 1), 'west')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 1), 'west')).toBe(true);
  });

  it('ensures all cells in an area are connected (spanning tree)', () => {
    const maze = new Maze([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const puzzle = Puzzle.create(maze, 'seed');

    // Check connectivity via flood fill through passages
    const area = maze.areas[0];
    const start = area.cells[0];
    const visited = new Set<string>();
    const queue = [start.coord.toString()];
    visited.add(start.coord.toString());

    const directions: Direction[] = ['north', 'east', 'south', 'west'];

    while (queue.length > 0) {
      const key = queue.shift()!;
      const [row, col] = key.split(',').map(Number);
      const coord = new Coord(row, col);

      for (const dir of directions) {
        if (!puzzle.hasWall(coord, dir)) {
          const neighbor = coord.goTo(dir);
          const neighborKey = neighbor.toString();
          if (!visited.has(neighborKey) && maze.has(neighbor)) {
            visited.add(neighborKey);
            queue.push(neighborKey);
          }
        }
      }
    }

    expect(visited.size).toBe(area.cells.length);
  });
});

function wallMap(puzzle: Puzzle): string[][] {
  const result: string[][] = [];
  for (let row = 0; row < puzzle.maze.size; row++) {
    result[row] = [];
    for (let col = 0; col < puzzle.maze.size; col++) {
      const coord = new Coord(row, col);
      const walls = ['north', 'east', 'south', 'west']
        .filter((dir) => puzzle.hasWall(coord, dir as Direction))
        .map((d) => d[0].toUpperCase())
        .join('');
      result[row][col] = walls || '-';
    }
  }
  return result;
}
