import { type RandomFn, mulberry32, hashString } from './random';
import { Image, type Matrix, type Color } from './image';
import { Coord, type Direction } from './coord';

export class MazeCell {
  readonly coord: Coord;
  readonly color: Color;
  readonly edges!: Edges;

  constructor(coord: Coord, color: Color) {
    this.coord = coord;
    this.color = color;
  }
}

export class Edge {
  readonly isExternal: boolean;
  readonly hasWall: boolean;

  private constructor(isExternal: boolean, hasWall: boolean) {
    this.isExternal = isExternal;
    this.hasWall = hasWall;
  }

  static create(cell: MazeCell, neighbor: MazeCell | null): Edge {
    const isExternal = neighbor === null;
    const hasWall = neighbor === null || cell.color !== neighbor.color;
    return new Edge(isExternal, hasWall);
  }

  withWall(hasWall: boolean): Edge {
    return new Edge(this.isExternal, hasWall);
  }
}

export interface Edges {
  north: Edge;
  east: Edge;
  south: Edge;
  west: Edge;
}

export class Area {
  readonly cells: MazeCell[];
  readonly color: Color;

  constructor(cells: MazeCell[], color: Color) {
    this.cells = cells;
    this.color = color;
  }
}

export class Maze {
  readonly size: number;
  readonly areas: Area[];
  private readonly cells: MazeCell[][];

  constructor(matrix: number[][]) {
    this.size = matrix.length;

    this.cells = matrix.map((row, i) =>
      row.map((value, j) => {
        const coord = new Coord(i, j);
        const color: Color = value === 1 ? 'black' : 'white';
        return new MazeCell(coord, color);
      }),
    );

    this.forEach((cell) => {
      (cell as { edges: Edges }).edges = {
        north: this.createEdge(cell, 'north'),
        east: this.createEdge(cell, 'east'),
        south: this.createEdge(cell, 'south'),
        west: this.createEdge(cell, 'west'),
      };
    });

    this.areas = this.findAreas();
  }

  private findAreas(): Area[] {
    const visited = new Set<string>();
    const areas: Area[] = [];

    this.forEach((cell) => {
      const key = cell.coord.toString();
      if (visited.has(key)) return;

      const areaCells: MazeCell[] = [];
      const queue: MazeCell[] = [cell];
      visited.add(key);

      while (queue.length > 0) {
        const current = queue.shift()!;
        areaCells.push(current);

        for (const direction of ['north', 'east', 'south', 'west'] as const) {
          const neighborCoord = current.coord.goTo(direction);
          const neighborKey = neighborCoord.toString();

          if (
            this.has(neighborCoord) &&
            !visited.has(neighborKey) &&
            this.get(neighborCoord).color === cell.color
          ) {
            visited.add(neighborKey);
            queue.push(this.get(neighborCoord));
          }
        }
      }

      areas.push(new Area(areaCells, cell.color));
    });

    return areas;
  }

  get(coord: Coord): MazeCell {
    return this.cells[coord.row][coord.col];
  }

  has(coord: Coord): boolean {
    return (
      coord.row >= 0 &&
      coord.row < this.size &&
      coord.col >= 0 &&
      coord.col < this.size
    );
  }

  forEach(callback: (cell: MazeCell) => void): void {
    for (const row of this.cells) {
      for (const cell of row) {
        callback(cell);
      }
    }
  }

  map<T>(fn: (cell: MazeCell) => T): T[][] {
    const result: T[][] = [];
    for (let row = 0; row < this.size; row++) {
      result[row] = [];
      for (let col = 0; col < this.size; col++) {
        result[row][col] = fn(this.get(new Coord(row, col)));
      }
    }
    return result;
  }

  createEdge(cell: MazeCell, direction: Direction): Edge {
    const neighborCoord = cell.coord.goTo(direction);
    const neighbor = this.has(neighborCoord) ? this.get(neighborCoord) : null;
    return Edge.create(cell, neighbor);
  }
}

export interface Borders {
  horizontal: boolean[][];
  vertical: boolean[][];
}

export interface LegacyArea {
  cells: [number, number][];
  isBlack: boolean;
}

export interface MazeResult {
  grid: Matrix;
  borders: Borders;
  areas: LegacyArea[];
}

/**
 * Normalized key for an edge between two adjacent cells
 */
function getEdgeKey(r1: number, c1: number, r2: number, c2: number): string {
  const cells: [number, number][] = [
    [r1, c1],
    [r2, c2],
  ];
  cells.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
  return `${cells[0][0]},${cells[0][1]}-${cells[1][0]},${cells[1][1]}`;
}

/**
 * Checks if there's a 2x2 block without internal walls near the given edge
 */
function has2x2BlockNearEdge(
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  horizontal: boolean[][],
  vertical: boolean[][],
  rows: number,
  cols: number,
  cellSet: Set<string>,
): boolean {
  const blocks: [number, number][][] = [];

  if (r2 === r1 + 1 && c2 === c1) {
    // Vertical edge - check left and right
    if (c1 < cols - 1) {
      blocks.push([
        [r1, c1],
        [r1, c1 + 1],
        [r2, c1],
        [r2, c1 + 1],
      ]);
    }
    if (c1 > 0) {
      blocks.push([
        [r1, c1 - 1],
        [r1, c1],
        [r2, c1 - 1],
        [r2, c1],
      ]);
    }
  } else if (c2 === c1 + 1 && r2 === r1) {
    // Horizontal edge - check above and below
    if (r1 < rows - 1) {
      blocks.push([
        [r1, c1],
        [r1, c2],
        [r1 + 1, c1],
        [r1 + 1, c2],
      ]);
    }
    if (r1 > 0) {
      blocks.push([
        [r1 - 1, c1],
        [r1 - 1, c2],
        [r1, c1],
        [r1, c2],
      ]);
    }
  }

  for (const block of blocks) {
    const allInArea = block.every(([r, c]) => cellSet.has(`${r},${c}`));
    if (!allInArea) continue;

    const [r, c] = block[0];

    const hasInternalWalls =
      horizontal[r][c] ||
      horizontal[r][c + 1] ||
      vertical[r][c] ||
      vertical[r + 1][c];

    if (!hasInternalWalls) {
      return true;
    }
  }

  return false;
}

/**
 * Adds internal walls to create serpentine paths without 2x2 blocks
 */
function addSerpentineWalls(
  cells: [number, number][],
  horizontal: boolean[][],
  vertical: boolean[][],
  rows: number,
  cols: number,
  random: RandomFn,
): void {
  if (cells.length <= 4) return;

  const cellSet = new Set(cells.map(([r, c]) => `${r},${c}`));

  // Build adjacency list
  const adjList = new Map<string, [number, number][]>();
  for (const [row, col] of cells) {
    const key = `${row},${col}`;
    const neighbors: [number, number][] = [];

    if (row > 0 && cellSet.has(`${row - 1},${col}`))
      neighbors.push([row - 1, col]);
    if (row < rows - 1 && cellSet.has(`${row + 1},${col}`))
      neighbors.push([row + 1, col]);
    if (col > 0 && cellSet.has(`${row},${col - 1}`))
      neighbors.push([row, col - 1]);
    if (col < cols - 1 && cellSet.has(`${row},${col + 1}`))
      neighbors.push([row, col + 1]);

    adjList.set(key, neighbors);
  }

  // Create spanning tree (DFS) - these edges will NOT have walls
  const treeEdges = new Set<string>();
  const visitedDFS = new Set<string>();
  const startCell = cells[Math.floor(random() * cells.length)];
  const stack: [number, number][] = [startCell];
  visitedDFS.add(`${startCell[0]},${startCell[1]}`);

  while (stack.length > 0) {
    const [row, col] = stack[stack.length - 1];
    const key = `${row},${col}`;
    const neighbors = adjList.get(key) || [];

    const shuffled = [...neighbors].sort(() => random() - 0.5);

    let found = false;
    for (const [nr, nc] of shuffled) {
      const nKey = `${nr},${nc}`;
      if (!visitedDFS.has(nKey)) {
        visitedDFS.add(nKey);
        stack.push([nr, nc]);
        treeEdges.add(getEdgeKey(row, col, nr, nc));
        found = true;
        break;
      }
    }

    if (!found) {
      stack.pop();
    }
  }

  // Collect all edges not in the tree
  const allEdges: { row: number; col: number; nr: number; nc: number }[] = [];
  for (const [row, col] of cells) {
    const neighbors = adjList.get(`${row},${col}`) || [];
    for (const [nr, nc] of neighbors) {
      if (nr < row || (nr === row && nc < col)) continue;

      const edge = getEdgeKey(row, col, nr, nc);
      if (!treeEdges.has(edge)) {
        allEdges.push({ row, col, nr, nc });
      }
    }
  }

  // Add walls to 70% of non-tree edges, avoiding 2x2 blocks
  const shuffledEdges = allEdges.sort(() => random() - 0.5);

  for (const { row, col, nr, nc } of shuffledEdges) {
    if (random() < 0.7) {
      if (nr === row + 1 && nc === col) {
        horizontal[row][col] = true;
      } else if (nc === col + 1 && nr === row) {
        vertical[row][col] = true;
      }

      if (
        has2x2BlockNearEdge(
          row,
          col,
          nr,
          nc,
          horizontal,
          vertical,
          rows,
          cols,
          cellSet,
        )
      ) {
        if (nr === row + 1 && nc === col) {
          horizontal[row][col] = false;
        } else if (nc === col + 1 && nr === row) {
          vertical[row][col] = false;
        }
      }
    }
  }
}

/**
 * It generates the borders of the maze for the given grid
 * horizontal: (rows-1) x cols - borders between adjacent rows
 * vertical: rows x (cols-1) - borders between  adjacent cols
 * the external borders are implicit (always exist)
 */
export function generateMazeBorders(
  grid: Matrix,
  random: RandomFn = Math.random,
): Borders {
  const rows = grid.length;
  const cols = grid[0].length;

  const horizontal: boolean[][] = Array(rows - 1)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const vertical: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols - 1).fill(false));

  // PHASE 1: Divide by color (black vs white)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];

      if (col < cols - 1 && grid[row][col + 1] !== current) {
        vertical[row][col] = true;
      }

      if (row < rows - 1 && grid[row + 1][col] !== current) {
        horizontal[row][col] = true;
      }
    }
  }

  // PHASE 2: Add internal walls for serpentine paths
  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  function findMacroArea(
    startRow: number,
    startCol: number,
  ): [number, number][] {
    const color = grid[startRow][startCol];
    const cells: [number, number][] = [];
    const queue: [number, number][] = [[startRow, startCol]];
    visited[startRow][startCol] = true;

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      cells.push([row, col]);

      const neighbors: [number, number][] = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !visited[nr][nc] &&
          grid[nr][nc] === color
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    return cells;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!visited[row][col]) {
        const macroArea = findMacroArea(row, col);
        if (macroArea.length > 4) {
          addSerpentineWalls(
            macroArea,
            horizontal,
            vertical,
            rows,
            cols,
            random,
          );
        }
      }
    }
  }

  return { horizontal, vertical };
}

/**
 * Finds all areas delimited by borders
 */
export function findAreas(grid: Matrix, borders: Borders): LegacyArea[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const areas: LegacyArea[] = [];

  function floodFill(startRow: number, startCol: number): LegacyArea {
    const area: LegacyArea = {
      cells: [],
      isBlack: grid[startRow][startCol] === 1,
    };
    const queue: [number, number][] = [[startRow, startCol]];
    visited[startRow][startCol] = true;

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      area.cells.push([row, col]);

      const neighbors: {
        nr: number;
        nc: number;
        hasBorder: boolean;
      }[] = [
        {
          nr: row - 1,
          nc: col,
          hasBorder: row > 0 && borders.horizontal[row - 1][col],
        },
        {
          nr: row + 1,
          nc: col,
          hasBorder: row < rows - 1 && borders.horizontal[row][col],
        },
        {
          nr: row,
          nc: col - 1,
          hasBorder: col > 0 && borders.vertical[row][col - 1],
        },
        {
          nr: row,
          nc: col + 1,
          hasBorder: col < cols - 1 && borders.vertical[row][col],
        },
      ];

      for (const { nr, nc, hasBorder } of neighbors) {
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !visited[nr][nc] &&
          !hasBorder
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    return area;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!visited[row][col]) {
        areas.push(floodFill(row, col));
      }
    }
  }

  return areas;
}

/**
 * Generates the complete maze from a QR matrix
 */
export function generateMaze(matrix: Matrix, seed?: string): MazeResult {
  const random =
    seed !== undefined ? mulberry32(hashString(seed)) : Math.random;
  const grid = new Image(matrix).x2();
  const mazeMatrix = grid.asMatrix();
  const borders = generateMazeBorders(mazeMatrix, random);
  const areas = findAreas(mazeMatrix, borders);

  return { grid: mazeMatrix, borders, areas };
}
