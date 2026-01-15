import QRCode from 'qrcode';
import type { Matrix } from '../image';

export interface QROptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRMatrixResult {
  matrix: Matrix;
  size: number;
  blackCount: number;
}

const defaultOptions: QROptions = {
  width: 256,
  margin: 0,
  errorCorrectionLevel: 'M',
};

export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QROptions = {},
): Promise<void> {
  const opts = { ...defaultOptions, ...options };

  await QRCode.toCanvas(canvas, text, {
    width: opts.width,
    margin: opts.margin,
    errorCorrectionLevel: opts.errorCorrectionLevel,
    color: {
      dark: '#1a1a1a',
      light: '#ffffff',
    },
  });
}

export function getQRMatrix(
  text: string,
  options: QROptions = {},
): QRMatrixResult {
  const opts = { ...defaultOptions, ...options };
  const qr = QRCode.create(text, {
    errorCorrectionLevel: opts.errorCorrectionLevel,
  });

  const size = qr.modules.size;
  const matrix: Matrix = [];
  let blackCount = 0;

  for (let row = 0; row < size; row++) {
    matrix[row] = [];
    for (let col = 0; col < size; col++) {
      const isBlack = qr.modules.data[row * size + col] === 1 ? 1 : 0;
      matrix[row][col] = isBlack;
      if (isBlack) blackCount++;
    }
  }

  return { matrix, size, blackCount };
}
