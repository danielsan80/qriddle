import { CoordSet, Image, type Pixel } from '../domain/image';
import { type Drawing, type Rect } from './shape';

export interface ImageDrawOptions {
  cellSize: number;
  blackColor: string;
  whiteColor: string;
  prefilledColor: string;
}

export class ImageDrawer {
  private readonly options: ImageDrawOptions;

  constructor(options: ImageDrawOptions) {
    this.options = options;
  }

  draw(image: Image, prefilledModules: CoordSet): Drawing {
    const { cellSize } = this.options;
    return {
      width: image.size.cols * cellSize,
      height: image.size.rows * cellSize,
      shapes: image.map((pixel) => this.module(pixel, prefilledModules)).flat(),
    };
  }

  private module(pixel: Pixel, prefilledModules: CoordSet): Rect {
    const { cellSize } = this.options;
    return {
      kind: 'rect',
      color: this.colorOf(pixel, prefilledModules),
      topLeft: { x: pixel.coord.col * cellSize, y: pixel.coord.row * cellSize },
      width: cellSize,
      height: cellSize,
    };
  }

  private colorOf(pixel: Pixel, prefilledModules: CoordSet): string {
    const { blackColor, whiteColor, prefilledColor } = this.options;
    if (prefilledModules.has(pixel.coord)) return prefilledColor;
    return pixel.color === 'black' ? blackColor : whiteColor;
  }
}
