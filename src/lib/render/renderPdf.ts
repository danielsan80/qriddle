import { jsPDF } from 'jspdf';
import { config } from '../config';
import { Puzzle } from '../domain/puzzle';
import { renderPuzzle } from './renderPuzzle';
import innerSvgUrl from '../../assets/inner/inner.svg?url';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PUZZLE_WIDTH_MM = 100;
// A4 @300dpi
const A4_PX_W = 2480;
const A4_PX_H = 3508;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function composePdf(
  puzzle: Puzzle,
  widthPx: number,
  heightPx: number,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d')!;

  const bg = await loadImage(innerSvgUrl);
  ctx.drawImage(bg, 0, 0, widthPx, heightPx);

  const puzzleCanvas = document.createElement('canvas');
  renderPuzzle(puzzleCanvas, puzzle, config.pdf);

  const puzzleW = widthPx * (PUZZLE_WIDTH_MM / A4_WIDTH_MM);
  const puzzleH = puzzleW * (puzzleCanvas.height / puzzleCanvas.width);
  ctx.drawImage(
    puzzleCanvas,
    (widthPx - puzzleW) / 2,
    (heightPx - puzzleH) / 2,
    puzzleW,
    puzzleH,
  );

  return canvas;
}

export async function renderPdfPreview(
  canvas: HTMLCanvasElement,
  puzzle: Puzzle,
): Promise<void> {
  // ~75dpi (A4@300dpi / 4)
  const scale = 0.25;
  const composed = await composePdf(
    puzzle,
    Math.round(A4_PX_W * scale),
    Math.round(A4_PX_H * scale),
  );
  canvas.width = composed.width;
  canvas.height = composed.height;
  canvas.getContext('2d')!.drawImage(composed, 0, 0);
}

export async function downloadPuzzlePdf(
  puzzle: Puzzle,
  filename = 'puzzle.pdf',
): Promise<void> {
  const composed = await composePdf(puzzle, A4_PX_W, A4_PX_H);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  pdf.addImage(composed, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  pdf.save(filename);
}
