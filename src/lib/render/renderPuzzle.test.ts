import { describe, it, expect } from 'vitest';
import { config } from '../config';
import { Coord, Image } from '../domain/image';
import { cellsOfModules, Puzzle } from '../domain/puzzle';
import { createRandom } from '../util';
import {
  createRecordingCanvas,
  type FilledRect,
  type RecordingCanvas,
} from './recordingCanvas.testing';
import { renderPuzzle } from './renderPuzzle';

const { cellSize, prefilledColor } = config.puzzle;
const image = new Image([
  [1, 1, 1, 1],
  [1, 1, 1, 1],
]);
const firstModule = cellsOfModules([new Coord(0, 0)]);

function render(prefilledCells: Coord[]): RecordingCanvas {
  const recording = createRecordingCanvas();
  renderPuzzle(
    recording.canvas,
    Puzzle.create(image, createRandom('seed'), prefilledCells),
  );
  return recording;
}

function prefilledRects(prefilledCells: Coord[]): FilledRect[] {
  return render(prefilledCells).filledRects.filter(
    (rect) => rect.color === prefilledColor,
  );
}

describe('renderPuzzle', () => {
  it('fills the prefilled cells', () => {
    const cell = { color: prefilledColor, width: cellSize, height: cellSize };
    expect(prefilledRects(firstModule)).toEqual([
      { ...cell, x: 0, y: 0 },
      { ...cell, x: cellSize, y: 0 },
      { ...cell, x: 0, y: cellSize },
      { ...cell, x: cellSize, y: cellSize },
    ]);
  });

  it('fills the prefilled cells before drawing the walls', () => {
    const { operations } = render(firstModule);

    expect(operations.lastIndexOf('fillRect')).toBeLessThan(
      operations.indexOf('stroke'),
    );
  });

  it('fills no cell without prefilled cells', () => {
    expect(prefilledRects([])).toEqual([]);
  });
});
