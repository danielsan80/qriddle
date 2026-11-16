import { describe, it, expect } from 'vitest';
import { Coord, CoordSet, directions, Image } from '../image';
import { createRandom } from '../../util';
import { cellsOfModules, choosePrefilledModules } from './prefill';
import { type Area } from './area';
import { Puzzle } from './puzzle';

describe('Puzzle', () => {
  it('exposes the image', () => {
    const image = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle = Puzzle.create(image, createRandom('seed'), []);

    expect(puzzle.image).toBe(image);
  });

  it('produces same result with same seed', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const puzzle1 = Puzzle.create(image, createRandom('test-seed'), []);
    const puzzle2 = Puzzle.create(image, createRandom('test-seed'), []);

    expect(wallMap(puzzle1)).toEqual(wallMap(puzzle2));
  });

  it('produces different results with different seeds', () => {
    const image = new Image([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const puzzle1 = Puzzle.create(image, createRandom('seed-a'), []);
    const puzzle2 = Puzzle.create(image, createRandom('seed-b'), []);

    expect(wallMap(puzzle1)).not.toEqual(wallMap(puzzle2));
  });

  it('preserves external walls', () => {
    const image = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle = Puzzle.create(image, createRandom('seed'), []);

    // External edges always have walls
    expect(puzzle.hasWall(new Coord(0, 0), 'north')).toBe(true);
    expect(puzzle.hasWall(new Coord(0, 0), 'west')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 1), 'south')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 1), 'east')).toBe(true);
  });

  it('preserves walls between different colors', () => {
    const image = new Image([
      [0, 1],
      [0, 1],
    ]);

    const puzzle = Puzzle.create(image, createRandom('seed'), []);

    // Color boundary walls are preserved
    expect(puzzle.hasWall(new Coord(0, 0), 'east')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 0), 'east')).toBe(true);
    expect(puzzle.hasWall(new Coord(0, 1), 'west')).toBe(true);
    expect(puzzle.hasWall(new Coord(1, 1), 'west')).toBe(true);
  });

  it('generates deterministic puzzle with fixed seed', () => {
    const image = new Image([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1],
    ]);

    const puzzle = Puzzle.create(image, createRandom('fixed-seed'), []);

    expect(toBoxDrawing(puzzle)).toBe(
      [
        '┌─────────┬─┐',
        '│◾ ◾ ◾ ◾ ◾│◾│',
        '│ ╶─────┐ ╵ │',
        '│◾ ◾ ◾ ◾│◾ ◾│',
        '│ ╶─┬─╴ ├───┤',
        '│◉ ◾│◾ ◾│◻ ◻│',
        '├─╴ └─┬─┘ ╶─┤',
        '│◾ ◾ ◾│◻ ◻ ◻│',
        '│ ┌───┤ ┌───┤',
        '│◾│◻ ◻│◻│◾ ◾│',
        '├─┘ ╷ ╵ │ ╷ │',
        '│◻ ◻│◻ ◻│◾│◉│',
        '└───┴───┴─┴─┘',
      ].join('\n'),
    );
  });

  it('ensures all cells in an area are connected (spanning tree)', () => {
    const image = new Image([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);

    const puzzle = Puzzle.create(image, createRandom('seed'), []);

    const area = puzzle.areas.at(0)!;
    expect(reachableFrom(puzzle, area.pixels[0].coord).size).toBe(
      area.pixels.length,
    );
  });

  describe('with prefilled cells', () => {
    const qr = new Image([
      [1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [0, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 0, 1, 0, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0, 1],
    ]);
    const image = qr.x2();

    function createWithPrefill(percentage: number): Puzzle {
      const modules = choosePrefilledModules(
        qr,
        percentage,
        createRandom('prefill'),
      );
      return Puzzle.create(
        image,
        createRandom('seed'),
        cellsOfModules(modules),
      );
    }

    it('tells which cells are prefilled', () => {
      const puzzle = Puzzle.create(
        new Image([
          [1, 1],
          [1, 1],
        ]),
        createRandom('seed'),
        [new Coord(0, 1)],
      );

      expect(
        puzzle.image.map((pixel) => puzzle.isPrefilled(pixel.coord)),
      ).toEqual([
        [false, true],
        [false, false],
      ]);
    });

    it('draws a prefilled module full, walled from the areas to solve', () => {
      const puzzle = Puzzle.create(
        new Image([
          [1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1],
          [1, 1, 0, 0, 1, 1],
        ]),
        createRandom('fixed-seed'),
        cellsOfModules([new Coord(0, 1)]),
      );

      expect(toBoxDrawing(puzzle)).toBe(
        [
          '┌───┬───┬───┐',
          '│◾ ◉│■ ■│◾ ◾│',
          '├─╴ │   │ ╷ │',
          '│◾ ◾│■ ■│◾│◾│',
          '│ ╷ ├───┼─┤ │',
          '│◾│◾│◻ ◻│◾│◾│',
          '├─┘ │ ╶─┤ ╵ │',
          '│◾ ◾│◻ ◻│◉ ◾│',
          '└───┴───┴───┘',
        ].join('\n'),
      );
    });

    for (const percentage of [20, 50, 80]) {
      it(`connects every area to solve at ${percentage}%`, () => {
        const puzzle = createWithPrefill(percentage);

        for (const area of areasToSolve(puzzle)) {
          expect(reachableFrom(puzzle, area.pixels[0].coord).size).toBe(
            area.pixels.length,
          );
        }
      });

      it(`leaves no 2x2 block in the areas to solve at ${percentage}%`, () => {
        const puzzle = createWithPrefill(percentage);

        expect(openBlocksOutsidePrefill(puzzle)).toEqual([]);
      });

      it(`keeps at least 4 cells in every area to solve at ${percentage}%`, () => {
        const puzzle = createWithPrefill(percentage);

        const smallAreas = areasToSolve(puzzle).filter(
          (area) => area.pixels.length < 4,
        );
        expect(smallAreas).toEqual([]);
      });
    }

    it('puts one dot in each black area to solve', () => {
      const puzzle = createWithPrefill(50);

      const blackAreas = areasToSolve(puzzle).filter(
        (area) => area.color === 'black',
      );
      const dotAreas = puzzle.dots.map((dot) =>
        blackAreas.findIndex((area) => cellsOf(area).has(dot)),
      );
      expect(dotAreas).toEqual(blackAreas.map((_area, index) => index));
    });
  });

  describe('dots', () => {
    it('has one dot per black area', () => {
      const image = new Image([
        [1, 1, 0, 0],
        [1, 1, 0, 0],
      ]);

      const puzzle = Puzzle.create(image, createRandom('seed'), []);
      const blackAreas = puzzle.areas.all().filter((a) => a.color === 'black');

      expect(puzzle.dots.length).toBe(blackAreas.length);
    });

    it('each dot belongs to a black area', () => {
      const image = new Image([
        [1, 1, 0, 0],
        [1, 1, 0, 0],
      ]);

      const puzzle = Puzzle.create(image, createRandom('seed'), []);
      const blackAreas = puzzle.areas.all().filter((a) => a.color === 'black');

      puzzle.dots.forEach((dot, index) => {
        const area = blackAreas[index];
        expect(cellsOf(area).has(dot)).toBe(true);
      });
    });

    it('produces same dots with same seed', () => {
      const image = new Image([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);

      const puzzle1 = Puzzle.create(image, createRandom('test-seed'), []);
      const puzzle2 = Puzzle.create(image, createRandom('test-seed'), []);

      const dots1 = puzzle1.dots.map((d) => d.toString());
      const dots2 = puzzle2.dots.map((d) => d.toString());
      expect(dots1).toEqual(dots2);
    });

    it('produces different dots with different seeds', () => {
      const image = new Image([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]);

      const puzzle1 = Puzzle.create(image, createRandom('seed-a'), []);
      const puzzle2 = Puzzle.create(image, createRandom('seed-b'), []);

      const dots1 = puzzle1.dots.map((d) => d.toString());
      const dots2 = puzzle2.dots.map((d) => d.toString());
      expect(dots1).not.toEqual(dots2);
    });
  });
});

function areasToSolve(puzzle: Puzzle): Area[] {
  return puzzle.areas.all().filter((area) => !area.prefilled);
}

function cellsOf(area: Area): CoordSet {
  return CoordSet.of(area.pixels.map((pixel) => pixel.coord));
}

function reachableFrom(puzzle: Puzzle, start: Coord): CoordSet {
  const visited = CoordSet.of([start]);
  const queue = [start];
  while (queue.length > 0) {
    const coord = queue.shift()!;
    for (const direction of directions) {
      const neighbor = coord.goTo(direction);
      if (puzzle.hasWall(coord, direction)) continue;
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }
  return visited;
}

function openBlocksOutsidePrefill(puzzle: Puzzle): string[] {
  const { rows, cols } = puzzle.image.size;
  const blocks: string[] = [];
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const topLeft = new Coord(row, col);
      const bottomRight = new Coord(row + 1, col + 1);
      if (puzzle.isPrefilled(topLeft)) continue;
      const open =
        !puzzle.hasWall(topLeft, 'east') &&
        !puzzle.hasWall(topLeft, 'south') &&
        !puzzle.hasWall(bottomRight, 'north') &&
        !puzzle.hasWall(bottomRight, 'west');
      if (open) blocks.push(topLeft.toString());
    }
  }
  return blocks;
}

function wallMap(puzzle: Puzzle): string[][] {
  const { rows, cols } = puzzle.image.size;
  const result: string[][] = [];
  for (let row = 0; row < rows; row++) {
    result[row] = [];
    for (let col = 0; col < cols; col++) {
      const coord = new Coord(row, col);
      const walls = directions
        .filter((dir) => puzzle.hasWall(coord, dir))
        .map((d) => d[0].toUpperCase())
        .join('');
      result[row][col] = walls || '-';
    }
  }
  return result;
}

function toBoxDrawing(puzzle: Puzzle): string {
  const { rows, cols } = puzzle.image.size;
  const grid: string[][] = [];
  const dotSet = new Set(puzzle.dots.map((d) => d.toString()));

  for (let r = 0; r < rows * 2 + 1; r++) {
    grid[r] = [];
    for (let c = 0; c < cols * 2 + 1; c++) {
      grid[r][c] = ' ';
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coord = new Coord(row, col);
      const cell = puzzle.image.get(coord);
      const isDot = dotSet.has(coord.toString());
      grid[row * 2 + 1][col * 2 + 1] = isDot
        ? '◉'
        : puzzle.isPrefilled(coord)
          ? '■'
          : cell.color === 'black'
            ? '◾'
            : '◻';
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
      const north = r > 0 && grid[r - 1][c] === '│';
      const south = r < rows * 2 && grid[r + 1][c] === '│';
      const west = c > 0 && grid[r][c - 1] === '─';
      const east = c < cols * 2 && grid[r][c + 1] === '─';

      grid[r][c] = getCorner(north, east, south, west);
    }
  }

  return grid.map((row) => row.join('')).join('\n');
}

function getCorner(
  north: boolean,
  east: boolean,
  south: boolean,
  west: boolean,
): string {
  const key = `${north ? 'N' : ''}${east ? 'E' : ''}${south ? 'S' : ''}${west ? 'W' : ''}`;
  const corners: Record<string, string> = {
    '': ' ',
    'N': '╵',
    'E': '╶',
    'S': '╷',
    'W': '╴',
    'NE': '└',
    'NS': '│',
    'NW': '┘',
    'ES': '┌',
    'EW': '─',
    'SW': '┐',
    'NES': '├',
    'NEW': '┴',
    'NSW': '┤',
    'ESW': '┬',
    'NESW': '┼',
  };
  return corners[key] || '+';
}
