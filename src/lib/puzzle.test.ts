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

  it('generates deterministic maze with fixed seed', () => {
    const maze = new Maze([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1],
    ]);

    const puzzle = Puzzle.create(maze, 'fixed-seed');

    expect(toBoxDrawing(puzzle)).toBe(
      [
        '┌─────────┬─┐',
        '│◾ ◾ ◾ ◾ ◾│◾│',
        '│ ╶─────┐ ╵ │',
        '│◾ ◾ ◾ ◾│◾ ◾│',
        '│ ╶─┬─╴ ├───┤',
        '│◾ ◾│◾ ◾│◻ ◻│',
        '├─╴ └─┬─┘ ╶─┤',
        '│◾ ◾ ◾│◻ ◻ ◻│',
        '│ ┌───┤ ┌───┤',
        '│◾│◻ ◻│◻│◾ ◾│',
        '├─┘ ╷ ╵ │ ╷ │',
        '│◻ ◻│◻ ◻│◾│◾│',
        '└───┴───┴─┴─┘',
      ].join('\n'),
    );
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
  const { rows, cols } = puzzle.maze.size;
  const result: string[][] = [];
  for (let row = 0; row < rows; row++) {
    result[row] = [];
    for (let col = 0; col < cols; col++) {
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

function toBoxDrawing(puzzle: Puzzle): string {
  const { rows, cols } = puzzle.maze.size;
  const grid: string[][] = [];

  for (let r = 0; r < rows * 2 + 1; r++) {
    grid[r] = [];
    for (let c = 0; c < cols * 2 + 1; c++) {
      grid[r][c] = ' ';
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = puzzle.maze.get(new Coord(row, col));
      grid[row * 2 + 1][col * 2 + 1] = cell.color === 'black' ? '◾' : '◻';
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coord = new Coord(row, col);
      if (puzzle.hasWall(coord, 'north')) {
        grid[row * 2][col * 2 + 1] = '─';
      }
      if (puzzle.hasWall(coord, 'south')) {
        grid[row * 2 + 2][col * 2 + 1] = '─';
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coord = new Coord(row, col);
      if (puzzle.hasWall(coord, 'west')) {
        grid[row * 2 + 1][col * 2] = '│';
      }
      if (puzzle.hasWall(coord, 'east')) {
        grid[row * 2 + 1][col * 2 + 2] = '│';
      }
    }
  }

  for (let r = 0; r < rows * 2 + 1; r += 2) {
    for (let c = 0; c < cols * 2 + 1; c += 2) {
      const up = r > 0 && grid[r - 1][c] === '│';
      const down = r < rows * 2 && grid[r + 1][c] === '│';
      const left = c > 0 && grid[r][c - 1] === '─';
      const right = c < cols * 2 && grid[r][c + 1] === '─';

      grid[r][c] = getCorner(up, down, left, right);
    }
  }

  return grid.map((row) => row.join('')).join('\n');
}

function getCorner(
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
): string {
  const key = `${up ? 'U' : ''}${down ? 'D' : ''}${left ? 'L' : ''}${right ? 'R' : ''}`;
  const corners: Record<string, string> = {
    '': ' ',
    U: '╵',
    D: '╷',
    L: '╴',
    R: '╶',
    UD: '│',
    LR: '─',
    DR: '┌',
    DL: '┐',
    UR: '└',
    UL: '┘',
    UDR: '├',
    UDL: '┤',
    ULR: '┴',
    DLR: '┬',
    UDLR: '┼',
  };
  return corners[key] || '+';
}
