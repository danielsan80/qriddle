import { Image } from '../domain/image';

export interface ImageRenderOptions {
  cellSize?: number;
  blackColor?: string;
  whiteColor?: string;
}

const defaultOptions: ImageRenderOptions = {
  cellSize: 6,
  blackColor: '#1a1a1a',
  whiteColor: '#ffffff',
};

export function renderImage(
  canvas: HTMLCanvasElement,
  image: Image,
  options: ImageRenderOptions = {},
): void {
  const opts = { ...defaultOptions, ...options };
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { rows, cols } = image.size;
  const cellSize = opts.cellSize!;

  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  image.forEach((pixel) => {
    const x = pixel.coord.col * cellSize;
    const y = pixel.coord.row * cellSize;
    ctx.fillStyle =
      pixel.color === 'black' ? opts.blackColor! : opts.whiteColor!;
    ctx.fillRect(x, y, cellSize, cellSize);
  });
}
