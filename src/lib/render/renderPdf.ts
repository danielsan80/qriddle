import { jsPDF } from 'jspdf';
import { Puzzle } from '../puzzle';
import { render } from './renderPuzzle';
import innerSvgUrl from '../../assets/inner/inner.svg?url';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const HALF_HEIGHT_MM = A4_HEIGHT_MM / 2;
const MARGIN_MM = 15;
// A4 @300dpi
const A4_PX_W = 2480;
const A4_PX_H = 3508;

function loadSvgAsPng(
  url: string,
  width: number,
  height: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function downloadPuzzlePdf(
  puzzle: Puzzle,
  filename = 'puzzle.pdf',
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background
  const bgPng = await loadSvgAsPng(innerSvgUrl, A4_PX_W, A4_PX_H);
  pdf.addImage(bgPng, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

  // Puzzle
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
