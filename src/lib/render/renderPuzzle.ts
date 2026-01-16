import { Coord } from '../image';
import { Puzzle } from '../puzzle';

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
  dotColor: '#a0a0a0',
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

  // Dots
  ctx.fillStyle = opts.dotColor!;
  for (const dot of puzzle.dots) {
    const x = (dot.col + 0.5) * cellSize;
    const y = (dot.row + 0.5) * cellSize;
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}
