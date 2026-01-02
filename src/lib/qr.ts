import QRCode from 'qrcode';

export interface QROptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const defaultOptions: QROptions = {
  width: 256,
  margin: 0,
  errorCorrectionLevel: 'M',
};

export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QROptions = {}
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