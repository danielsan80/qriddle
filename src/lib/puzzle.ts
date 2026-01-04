import type { Grid, Borders, Area } from './maze';

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

export function renderPuzzle(
  canvas: HTMLCanvasElement,
  grid: Grid,
  borders: Borders,
  areas: Area[],
  options: PuzzleRenderOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rows = grid.length;
  const cols = grid[0].length;
  const cellSize = opts.cellSize!;

  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  // Sfondo
  ctx.fillStyle = opts.backgroundColor!;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bordi
  ctx.strokeStyle = opts.borderColor!;
  ctx.lineWidth = 2;

  // Bordi orizzontali
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (borders.horizontal[row][col]) {
        ctx.beginPath();
        ctx.moveTo(col * cellSize, (row + 1) * cellSize);
        ctx.lineTo((col + 1) * cellSize, (row + 1) * cellSize);
        ctx.stroke();
      }
    }
  }

  // Bordi verticali
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (borders.vertical[row][col]) {
        ctx.beginPath();
        ctx.moveTo((col + 1) * cellSize, row * cellSize);
        ctx.lineTo((col + 1) * cellSize, (row + 1) * cellSize);
        ctx.stroke();
      }
    }
  }

  // Dot nelle aree nere - posizionato nella cella più lontana dal centro
  ctx.fillStyle = opts.dotColor!;
  for (const area of areas) {
    if (area.isBlack && area.cells.length > 0) {
      // Centro geometrico dell'area
      const sumRow = area.cells.reduce((sum, [r]) => sum + r, 0);
      const sumCol = area.cells.reduce((sum, [, c]) => sum + c, 0);
      const centerRow = sumRow / area.cells.length;
      const centerCol = sumCol / area.cells.length;

      // Trova la cella più lontana dal centro
      let furthestCell = area.cells[0];
      let maxDist = 0;
      for (const [r, c] of area.cells) {
        const dist = Math.pow(r - centerRow, 2) + Math.pow(c - centerCol, 2);
        if (dist > maxDist) {
          maxDist = dist;
          furthestCell = [r, c];
        }
      }

      const [row, col] = furthestCell;
      const x = (col + 0.5) * cellSize;
      const y = (row + 0.5) * cellSize;

      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}