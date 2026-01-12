import { Puzzle } from './puzzle';
import { Coord } from './coord';

export interface PuzzleRenderOptions {
  cellSize?: number;
  backgroundColor?: string;
  borderColor?: string;
  dotColor?: string;
}

const defaultOptions: PuzzleRenderOptions = {
  cellSize: 6,
  backgroundColor: '#f8f5ed',
  borderColor: '#c0c0c0',
  dotColor: '#1a1a1a',
};

export function render(
  canvas: HTMLCanvasElement,
  puzzle: Puzzle,
  options: PuzzleRenderOptions = {},
): void {
  const opts = { ...defaultOptions, ...options };
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { rows, cols } = puzzle.image.size;
  const cellSize = opts.cellSize!;

  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  // Background
  ctx.fillStyle = opts.backgroundColor!;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Walls
  ctx.strokeStyle = opts.borderColor!;
  ctx.lineWidth = 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coord = new Coord(row, col);
      const x = col * cellSize;
      const y = row * cellSize;

      if (puzzle.hasWall(coord, 'north')) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }

      if (puzzle.hasWall(coord, 'west')) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }

      // Only draw south/east for last row/col to complete the border
      if (row === rows - 1 && puzzle.hasWall(coord, 'south')) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }

      if (col === cols - 1 && puzzle.hasWall(coord, 'east')) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
    }
  }

  // Dot in black areas - positioned in the cell furthest from center
  ctx.fillStyle = opts.dotColor!;
  for (const area of puzzle.areas.all()) {
    if (area.color === 'black' && area.pixels.length > 0) {
      const coords = area.pixels.map((p) => p.coord);

      // Geometric center of the area
      const sumRow = coords.reduce((sum, c) => sum + c.row, 0);
      const sumCol = coords.reduce((sum, c) => sum + c.col, 0);
      const centerRow = sumRow / coords.length;
      const centerCol = sumCol / coords.length;

      // Find the cell furthest from center
      let furthest = coords[0];
      let maxDist = 0;
      for (const c of coords) {
        const dist =
          Math.pow(c.row - centerRow, 2) + Math.pow(c.col - centerCol, 2);
        if (dist > maxDist) {
          maxDist = dist;
          furthest = c;
        }
      }

      const x = (furthest.col + 0.5) * cellSize;
      const y = (furthest.row + 0.5) * cellSize;

      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
