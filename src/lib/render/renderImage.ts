import { config } from '../config';
import { Coord, CoordSet, Image, type Pixel } from '../domain/image';

export interface ImageRenderOptions {
  cellSize: number;
  blackColor: string;
  whiteColor: string;
  prefilledColor: string;
}

const defaultOptions: ImageRenderOptions = config.qr;

export function renderImage(
  canvas: HTMLCanvasElement,
  image: Image,
  prefilledModules: Coord[],
  options: Partial<ImageRenderOptions> = {},
): void {
  const opts = { ...defaultOptions, ...options };
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { rows, cols } = image.size;
  const cellSize = opts.cellSize;

  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  const prefilled = CoordSet.of(prefilledModules);

  function colorOf(pixel: Pixel): string {
    if (prefilled.has(pixel.coord)) return opts.prefilledColor;
    return pixel.color === 'black' ? opts.blackColor : opts.whiteColor;
  }

  image.forEach((pixel) => {
    const x = pixel.coord.col * cellSize;
    const y = pixel.coord.row * cellSize;
    ctx.fillStyle = colorOf(pixel);
    ctx.fillRect(x, y, cellSize, cellSize);
  });
}
