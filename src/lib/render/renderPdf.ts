import { jsPDF } from 'jspdf';
import { config } from '../config';
import { Puzzle } from '../domain/puzzle';
import { renderPuzzle } from './renderPuzzle';
import { getQRDataUrl } from '../util';
import type { TextBox } from '../../components/SvgTextEditor';
import innerSvgUrl from '../../assets/inner/inner.svg?url';
import outerSvgUrl from '../../assets/outer/outer.svg?url';

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

async function composeInnerPdf(
  widthPx: number,
  heightPx: number,
  puzzle: Puzzle,
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

export async function renderInnerPdfPreview(
  canvas: HTMLCanvasElement,
  puzzle: Puzzle,
): Promise<void> {
  // ~75dpi (A4@300dpi / 4)
  const scale = 0.25;
  const composed = await composeInnerPdf(
    Math.round(A4_PX_W * scale),
    Math.round(A4_PX_H * scale),
    puzzle,
  );
  canvas.width = composed.width;
  canvas.height = composed.height;
  canvas.getContext('2d')!.drawImage(composed, 0, 0);
}

const FONT_NAME = 'Edwardian Script ITC';
// outer.svg coordinate space is 210 x 297 units (A4 mm)
const SVG_WIDTH = 210;
// center view shows the top half of outer.svg (0..148.5) rotated 180° around (105, 74.25)
const CENTER_VIEW_HEIGHT = 148.5;

// CenterView stores coords in its own rotated viewBox space.
// Map back to outer.svg space: (x, y) → (210 - x, 148.5 - y), text rotated 180°.
function drawTextBox(
  ctx: CanvasRenderingContext2D,
  tb: TextBox,
  scale: number,
): void {
  if (!tb.text.trim()) return;
  ctx.font = `${tb.fontSize * scale}px '${FONT_NAME}', serif`;

  if (tb.face === 'center') {
    const ox = (SVG_WIDTH - tb.x) * scale;
    const oy = (CENTER_VIEW_HEIGHT - tb.y) * scale;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(Math.PI);
    ctx.fillText(tb.text, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(tb.text, tb.x * scale, tb.y * scale);
  }
}

function drawTextBoxes(
  ctx: CanvasRenderingContext2D,
  textBoxes: TextBox[],
  widthPx: number,
): void {
  const scale = widthPx / SVG_WIDTH;
  ctx.textAlign = 'center';
  ctx.fillStyle = config.pdf.textColor;
  for (const tb of textBoxes) {
    drawTextBox(ctx, tb, scale);
  }
}

async function drawCredits(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
): Promise<void> {
  const scaleX = widthPx / SVG_WIDTH;
  const scaleY = heightPx / 297;
  const { sizeMm, centerX, bottomY, textY } = config.creditsQr;
  const qrDataUrl = await getQRDataUrl(
    config.siteUrl,
    config.pdf.textColor,
    '#ffffff00',
  );
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(
    qrImg,
    (centerX - sizeMm / 2) * scaleX,
    (bottomY - sizeMm) * scaleY,
    sizeMm * scaleX,
    sizeMm * scaleX,
  );
  ctx.textAlign = 'center';
  ctx.fillStyle = config.pdf.textColor;
  ctx.font = `${2.5 * scaleX}px serif`;
  ctx.fillText(config.siteUrl, centerX * scaleX, textY * scaleY);
}

async function composeOuterPdf(
  widthPx: number,
  heightPx: number,
  textBoxes: TextBox[],
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d')!;
  const bg = await loadImage(outerSvgUrl);
  ctx.drawImage(bg, 0, 0, widthPx, heightPx);
  drawTextBoxes(ctx, textBoxes, widthPx);
  await drawCredits(ctx, widthPx, heightPx);
  return canvas;
}

export async function renderOuterPdfPreview(
  canvas: HTMLCanvasElement,
  textBoxes: TextBox[],
): Promise<void> {
  const scale = 0.25;
  const composed = await composeOuterPdf(
    Math.round(A4_PX_W * scale),
    Math.round(A4_PX_H * scale),
    textBoxes,
  );
  canvas.width = composed.width;
  canvas.height = composed.height;
  canvas.getContext('2d')!.drawImage(composed, 0, 0);
}

export async function downloadPuzzlePdf(
  puzzle: Puzzle,
  textBoxes: TextBox[],
  filename = 'puzzle.pdf',
): Promise<void> {
  const [inner, outer] = await Promise.all([
    composeInnerPdf(A4_PX_W, A4_PX_H, puzzle),
    composeOuterPdf(A4_PX_W, A4_PX_H, textBoxes),
  ]);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  pdf.addImage(outer, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  pdf.addPage();
  pdf.addImage(inner, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  pdf.save(filename);
}
