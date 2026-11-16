import { describe, it, expect } from 'vitest';
import { Image } from '../lib/domain/image';
import { cellsOfModules, choosePrefilledModules } from '../lib/domain/puzzle';
import { createRandom, getQRMatrix } from '../lib/util';
import { type Work, type WorkPuzzle, workFrom, workPuzzleOf } from './work';

const work: Work = {
  qrText: 'treasure',
  seed: 'abcdefghij',
  prefillPercentage: 30,
  textBoxes: [],
};

function prefilledCellsOf({ puzzle }: WorkPuzzle): string[] {
  const cells: string[] = [];
  puzzle.image.forEach((pixel) => {
    if (puzzle.isPrefilled(pixel.coord)) cells.push(pixel.coord.toString());
  });
  return cells.sort();
}

describe('workFrom', () => {
  it('starts with no prefill', () => {
    expect(
      workFrom({ qrText: 'treasure', seed: 'abcdefghij' }).prefillPercentage,
    ).toBe(0);
  });

  it('keeps the prefill of the work', () => {
    expect(workFrom(work)).toEqual(work);
  });
});

describe('workPuzzleOf', () => {
  it('builds the QR of the text', () => {
    expect(workPuzzleOf(work).qr).toEqual(
      new Image(getQRMatrix('treasure').matrix),
    );
  });

  it('chooses the prefilled modules with a random of their own', () => {
    const qr = new Image(getQRMatrix('treasure').matrix);

    expect(workPuzzleOf(work).prefilledModules).toEqual(
      choosePrefilledModules(qr, 30, createRandom('abcdefghij:prefill')),
    );
  });

  it('prefills the cells of the prefilled modules in the puzzle', () => {
    const workPuzzle = workPuzzleOf(work);

    expect(prefilledCellsOf(workPuzzle)).toEqual(
      cellsOfModules(workPuzzle.prefilledModules)
        .map((coord) => coord.toString())
        .sort(),
    );
  });

  it('prefills no cell at 0%', () => {
    expect(
      prefilledCellsOf(workPuzzleOf({ ...work, prefillPercentage: 0 })),
    ).toEqual([]);
  });
});
