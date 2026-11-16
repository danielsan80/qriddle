import { createRandom, generateSeed, getQRMatrix } from '../lib/util';
import { config } from '../lib/config';
import type { FacedTextBox } from '../lib/domain/card';
import { type Coord, Image } from '../lib/domain/image';
import {
  cellsOfModules,
  choosePrefilledModules,
  Puzzle,
} from '../lib/domain/puzzle';

export type Work = {
  qrText: string;
  seed: string;
  prefillPercentage: number;
  textBoxes: FacedTextBox[];
};

export type WorkPuzzle = {
  qr: Image;
  prefilledModules: Coord[];
  puzzle: Puzzle;
};

export function workFrom(state: Partial<Work>): Work {
  return {
    qrText: state.qrText ?? config.defaultQrText,
    seed: state.seed ?? generateSeed(),
    prefillPercentage: state.prefillPercentage ?? 0,
    textBoxes: state.textBoxes ?? [],
  };
}

export function workPuzzleOf(
  work: Pick<Work, 'qrText' | 'seed' | 'prefillPercentage'>,
): WorkPuzzle {
  const qr = new Image(getQRMatrix(work.qrText).matrix);
  const prefilledModules = choosePrefilledModules(
    qr,
    work.prefillPercentage,
    createRandom(`${work.seed}:prefill`),
  );
  const puzzle = Puzzle.create(
    qr.x2(),
    createRandom(work.seed),
    cellsOfModules(prefilledModules),
  );
  return { qr, prefilledModules, puzzle };
}
