import { describe, it, expect } from 'vitest';
import { config } from '../config';
import { Image } from '../domain/image';
import { ImageDrawer } from './imageDrawer';
import { type Rect } from './shape';

const { blackColor, whiteColor, cellSize } = config.qr;
const imageDrawer = new ImageDrawer(config.qr);

function module(color: string, x: number, y: number): Rect {
  return {
    kind: 'rect',
    color,
    topLeft: { x, y },
    width: cellSize,
    height: cellSize,
  };
}

describe('ImageDrawer', () => {
  const image = new Image([
    [1, 0],
    [1, 1],
  ]);

  it('draws each pixel as a module of its color, row by row', () => {
    expect(imageDrawer.draw(image)).toEqual({
      width: 2 * cellSize,
      height: 2 * cellSize,
      shapes: [
        module(blackColor, 0, 0),
        module(whiteColor, cellSize, 0),
        module(blackColor, 0, cellSize),
        module(blackColor, cellSize, cellSize),
      ],
    });
  });
});
