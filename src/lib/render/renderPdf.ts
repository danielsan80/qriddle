import { jsPDF } from 'jspdf';
import { Puzzle } from '../puzzle';
import { render } from './renderPuzzle';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const HALF_HEIGHT_MM = A4_HEIGHT_MM / 2;
const MARGIN_MM = 15;

export function downloadPuzzlePdf(
  puzzle: Puzzle,
  filename = 'puzzle.pdf',
): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const canvas = document.createElement('canvas');
  render(canvas, puzzle, { cellSize: 12, dotRadius: 0.15 });

  const availableWidth = A4_WIDTH_MM - 2 * MARGIN_MM;
  const availableHeight = HALF_HEIGHT_MM - 2 * MARGIN_MM;

  const canvasAspect = canvas.width / canvas.height;
  const availableAspect = availableWidth / availableHeight;

  let imgWidth: number;
  let imgHeight: number;

  if (canvasAspect > availableAspect) {
    imgWidth = availableWidth;
    imgHeight = availableWidth / canvasAspect;
  } else {
    imgHeight = availableHeight;
    imgWidth = availableHeight * canvasAspect;
  }

  const x = (A4_WIDTH_MM - imgWidth) / 2;
  const y = (HALF_HEIGHT_MM - imgHeight) / 2;

  pdf.addImage(canvas, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(filename);
}
