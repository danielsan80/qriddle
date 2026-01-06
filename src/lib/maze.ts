import { type RandomFn, mulberry32, hashString } from './random'

export type Grid = number[][];

export interface Borders {
  horizontal: boolean[][];
  vertical: boolean[][];
}

export interface Area {
  cells: [number, number][];
  isBlack: boolean;
}

export interface MazeResult {
  grid: Grid;
  borders: Borders;
  areas: Area[];
}

/**
 * Genera la griglia ad alta risoluzione (2x) dal QR matrix
 */
export function createHighResGrid(qrMatrix: Grid): Grid {
  const size = qrMatrix.length;
  const highResSize = size * 2;
  const grid: Grid = [];

  for (let row = 0; row < highResSize; row++) {
    grid[row] = [];
    for (let col = 0; col < highResSize; col++) {
      const origRow = Math.floor(row / 2);
      const origCol = Math.floor(col / 2);
      grid[row][col] = qrMatrix[origRow][origCol];
    }
  }

  return grid;
}

/**
 * Chiave normalizzata per un edge tra due celle adiacenti
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
 * Controlla se c'è un blocco 2x2 senza muri interni vicino all'edge dato
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
  cellSet: Set<string>
): boolean {
  const blocks: [number, number][][] = [];

  if (r2 === r1 + 1 && c2 === c1) {
    // Edge verticale - controlla sinistra e destra
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
    // Edge orizzontale - controlla sopra e sotto
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
 * Aggiunge muri interni per creare percorsi serpentini senza blocchi 2x2
 */
function addSerpentineWalls(
  cells: [number, number][],
  horizontal: boolean[][],
  vertical: boolean[][],
  rows: number,
  cols: number,
  random: RandomFn
): void {
  if (cells.length <= 4) return;

  const cellSet = new Set(cells.map(([r, c]) => `${r},${c}`));

  // Costruisce lista di adiacenza
  const adjList = new Map<string, [number, number][]>();
  for (const [row, col] of cells) {
    const key = `${row},${col}`;
    const neighbors: [number, number][] = [];

    if (row > 0 && cellSet.has(`${row - 1},${col}`)) neighbors.push([row - 1, col]);
    if (row < rows - 1 && cellSet.has(`${row + 1},${col}`)) neighbors.push([row + 1, col]);
    if (col > 0 && cellSet.has(`${row},${col - 1}`)) neighbors.push([row, col - 1]);
    if (col < cols - 1 && cellSet.has(`${row},${col + 1}`)) neighbors.push([row, col + 1]);

    adjList.set(key, neighbors);
  }

  // Crea spanning tree (DFS) - questi edge NON avranno muri
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

  // Raccoglie tutti gli edge non nel tree
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

  // Aggiunge muri al 70% degli edge non-tree, evitando blocchi 2x2
  const shuffledEdges = allEdges.sort(() => random() - 0.5);

  for (const { row, col, nr, nc } of shuffledEdges) {
    if (random() < 0.7) {
      if (nr === row + 1 && nc === col) {
        horizontal[row][col] = true;
      } else if (nc === col + 1 && nr === row) {
        vertical[row][col] = true;
      }

      if (has2x2BlockNearEdge(row, col, nr, nc, horizontal, vertical, rows, cols, cellSet)) {
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
 * Genera i bordi del labirinto dalla griglia
 */
export function generateMazeBorders(grid: Grid, random: RandomFn = Math.random): Borders {
  const rows = grid.length;
  const cols = grid[0].length;

  const horizontal: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const vertical: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  // Bordi esterni
  for (let col = 0; col < cols; col++) {
    horizontal[rows - 1][col] = true;
  }
  for (let row = 0; row < rows; row++) {
    vertical[row][cols - 1] = true;
  }

  // FASE 1: Divide per colore (nero vs bianco)
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

  // FASE 2: Aggiunge muri interni per percorsi serpentini
  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  function findMacroArea(startRow: number, startCol: number): [number, number][] {
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
          addSerpentineWalls(macroArea, horizontal, vertical, rows, cols, random);
        }
      }
    }
  }

  return { horizontal, vertical };
}

/**
 * Trova tutte le aree delimitate dai bordi
 */
export function findAreas(grid: Grid, borders: Borders): Area[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const areas: Area[] = [];

  function floodFill(startRow: number, startCol: number): Area {
    const area: Area = {
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
        { nr: row - 1, nc: col, hasBorder: row > 0 && borders.horizontal[row - 1][col] },
        { nr: row + 1, nc: col, hasBorder: borders.horizontal[row][col] },
        { nr: row, nc: col - 1, hasBorder: col > 0 && borders.vertical[row][col - 1] },
        { nr: row, nc: col + 1, hasBorder: borders.vertical[row][col] },
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
 * Genera il labirinto completo da un QR matrix
 */
export function generateMaze(qrMatrix: Grid, seed?: string): MazeResult {
  const random = seed !== undefined ? mulberry32(hashString(seed)) : Math.random;
  const grid = createHighResGrid(qrMatrix);
  const borders = generateMazeBorders(grid, random);
  const areas = findAreas(grid, borders);

  return { grid, borders, areas };
}