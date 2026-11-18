import { Image, type Pixel } from '../domain/image';
import { type Drawing, type Rect } from './shape';

export interface ImageDrawOptions {
  cellSize: number;
  blackColor: string;
  whiteColor: string;
}

export class ImageDrawer {
  private readonly options: ImageDrawOptions;

  constructor(options: ImageDrawOptions) {
    this.options = options;
  }

  draw(image: Image): Drawing {
    const { cellSize } = this.options;
    return {
      width: image.size.cols * cellSize,
      height: image.size.rows * cellSize,
      shapes: image.map((pixel) => this.module(pixel)).flat(),
    };
  }

  private module(pixel: Pixel): Rect {
    const { cellSize, blackColor, whiteColor } = this.options;
    return {
      kind: 'rect',
      color: pixel.color === 'black' ? blackColor : whiteColor,
      topLeft: { x: pixel.coord.col * cellSize, y: pixel.coord.row * cellSize },
      width: cellSize,
      height: cellSize,
    };
  }
}
