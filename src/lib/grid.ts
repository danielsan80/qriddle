export type Grid = number[][];

/**
 * Generates a high resolution grid (2x) from the source matrix
 */
export function createHighResGrid(matrix: Grid): Grid {
  const size = matrix.length;
  const highResSize = size * 2;
  const grid: Grid = [];

  for (let row = 0; row < highResSize; row++) {
    grid[row] = [];
    for (let col = 0; col < highResSize; col++) {
      const origRow = Math.floor(row / 2);
      const origCol = Math.floor(col / 2);
      grid[row][col] = matrix[origRow][origCol];
    }
  }

  return grid;
}