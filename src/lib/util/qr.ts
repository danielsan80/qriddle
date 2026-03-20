import QRCode from 'qrcode';
import type { Matrix } from '../domain/image';

export interface QROptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRMatrixResult {
  matrix: Matrix;
  size: number;
  blackCount: number;
}

const defaultOptions: QROptions = {
  errorCorrectionLevel: 'M',
};

export async function getQRDataUrl(
  text: string,
  dark = '#000000',
  light = '#ffffff',
): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark, light },
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
