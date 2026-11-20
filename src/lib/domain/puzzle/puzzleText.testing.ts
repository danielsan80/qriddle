import { Coord, directions, type Direction, type Size } from '../image';
import { type Puzzle } from './puzzle';

export type WallKind = 'external' | 'betweenAreas' | 'insideArea';

export const ALL_WALLS: WallKind[] = ['external', 'betweenAreas', 'insideArea'];

type SymbolOf = (coord: Coord) => string;

export class PuzzleText {
  private readonly puzzle: Puzzle;

  private constructor(puzzle: Puzzle) {
    this.puzzle = puzzle;
  }

  static create(puzzle: Puzzle): PuzzleText {
    return new PuzzleText(puzzle);
  }

  full(): string {
    return this.draw((coord) => this.symbolOf(coord), ALL_WALLS);
  }

  walls(kinds: WallKind[]): string {
    return this.draw(noSymbol, kinds);
  }

  private kindOf(coord: Coord, direction: Direction): WallKind {
    const neighbor = coord.goTo(direction);
    if (this.isOutside(neighbor)) return 'external';
    return this.inSameArea(coord, neighbor) ? 'insideArea' : 'betweenAreas';
  }

  private isOutside(coord: Coord): boolean {
    return !this.puzzle.image.has(coord);
  }

  private inSameArea(coord: Coord, other: Coord): boolean {
    return this.puzzle.areas
      .all()
      .some((area) => area.cells().has(coord) && area.cells().has(other));
  }

  private symbolOf(coord: Coord): string {
    if (this.puzzle.dots.some((dot) => dot.equals(coord))) {
      return '◉';
    }
    if (this.puzzle.prefilledCells.has(coord)) return '■';
    return this.puzzle.image.get(coord).color === 'black' ? '◾' : '◻';
  }

  private draw(symbolOf: SymbolOf, kinds: WallKind[]): string {
    const { size } = this.puzzle.image;
    const grid = CharGrid.create(size);
    for (let row = 0; row < size.rows; row++) {
      for (let col = 0; col < size.cols; col++) {
        const coord = new Coord(row, col);
        grid.drawCell(coord, symbolOf(coord));
        for (const direction of directions) {
          if (!this.puzzle.hasWall(coord, direction)) continue;
          const kind = this.kindOf(coord, direction);
          if (!kinds.includes(kind)) continue;
          if (kind === 'external') {
            grid.drawExternalWall(coord, direction);
          } else {
            grid.drawWall(coord, direction);
          }
        }
      }
    }
    return grid.toString();
  }
}

function noSymbol(): string {
  return ' ';
}

const WALLS: Record<Direction, string> = {
  north: '─',
  south: '─',
  east: '│',
  west: '│',
};

const EXTERNAL_WALLS: Record<Direction, string> = {
  north: '═',
  south: '═',
  east: '║',
  west: '║',
};

const CORNERS: Record<string, string> = {
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

const DOUBLE_CORNERS: Record<string, string> = {
  'NS|21': '║',
  'EW|12': '═',
  'ES|22': '╔',
  'SW|22': '╗',
  'NE|22': '╚',
  'NW|22': '╝',
  'NES|22': '╠',
  'NSW|22': '╣',
  'ESW|22': '╦',
  'NEW|22': '╩',
  'NESW|22': '╬',
  'ES|12': '╒',
  'SW|12': '╕',
  'NE|12': '╘',
  'NW|12': '╛',
  'NES|12': '╞',
  'NSW|12': '╡',
  'ESW|12': '╤',
  'NEW|12': '╧',
  'NESW|12': '╪',
  'ES|21': '╓',
  'SW|21': '╖',
  'NE|21': '╙',
  'NW|21': '╜',
  'NES|21': '╟',
  'NSW|21': '╢',
  'ESW|21': '╥',
  'NEW|21': '╨',
  'NESW|21': '╫',
};

class CharGrid {
  private readonly chars: string[][];

  private constructor(chars: string[][]) {
    this.chars = chars;
  }

  static create(size: Size): CharGrid {
    return new CharGrid(
      Array.from({ length: size.rows * 2 + 1 }, () =>
        Array.from({ length: size.cols * 2 + 1 }, () => ' '),
      ),
    );
  }

  drawCell(coord: Coord, symbol: string): void {
    this.set(this.centerOf(coord), symbol);
  }

  drawWall(coord: Coord, direction: Direction): void {
    this.set(this.centerOf(coord).goTo(direction), WALLS[direction]);
  }

  drawExternalWall(coord: Coord, direction: Direction): void {
    this.set(this.centerOf(coord).goTo(direction), EXTERNAL_WALLS[direction]);
  }

  toString(): string {
    return this.chars
      .map((line, row) =>
        line.map((char, col) => this.cornerAt(row, col) ?? char).join(''),
      )
      .join('\n');
  }

  private centerOf(coord: Coord): Coord {
    return new Coord(coord.row * 2 + 1, coord.col * 2 + 1);
  }

  private set(position: Coord, char: string): void {
    this.chars[position.row][position.col] = char;
  }

  private cornerAt(row: number, col: number): string | undefined {
    if (row % 2 !== 0 || col % 2 !== 0) return undefined;
    const corner = new Coord(row, col);
    const arms = directions
      .filter((direction) => this.charAt(corner.goTo(direction)) !== ' ')
      .map((direction) => direction[0].toUpperCase())
      .join('');
    const vertical = this.isDouble(corner, ['north', 'south']) ? '2' : '1';
    const horizontal = this.isDouble(corner, ['east', 'west']) ? '2' : '1';
    return DOUBLE_CORNERS[`${arms}|${vertical}${horizontal}`] ?? CORNERS[arms];
  }

  private isDouble(corner: Coord, arms: Direction[]): boolean {
    return arms.some((direction) =>
      ['═', '║'].includes(this.charAt(corner.goTo(direction))),
    );
  }

  private charAt(position: Coord): string {
    return this.chars[position.row]?.[position.col] ?? ' ';
  }
}
