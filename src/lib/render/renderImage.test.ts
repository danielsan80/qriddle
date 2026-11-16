import { describe, it, expect } from 'vitest';
import { config } from '../config';
import { Coord, Image } from '../domain/image';
import { createRecordingCanvas } from './recordingCanvas.testing';
import { renderImage } from './renderImage';

const { blackColor, whiteColor, prefilledColor } = config.qr;

function colorsOf(image: Image, prefilledModules: Coord[]): string[] {
  const { canvas, filledRects } = createRecordingCanvas();
  renderImage(canvas, image, prefilledModules);
  return filledRects.map((rect) => rect.color);
}

describe('renderImage', () => {
  const image = new Image([
    [1, 0],
    [1, 1],
  ]);

  it('draws the prefilled modules in their own color', () => {
    expect(colorsOf(image, [new Coord(1, 0)])).toEqual([
      blackColor,
      whiteColor,
      prefilledColor,
      blackColor,
    ]);
  });

  it('draws black and white modules without prefilled modules', () => {
    expect(colorsOf(image, [])).toEqual([
      blackColor,
      whiteColor,
      blackColor,
      blackColor,
    ]);
  });
});
