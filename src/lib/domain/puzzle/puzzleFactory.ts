import { Image } from '../image';
import { Puzzle } from './puzzle';
import { type PuzzleConfig } from './puzzleConfig';
import { type CreateRandomFn } from './random';

export class PuzzleFactory {
  private readonly createRandom: CreateRandomFn;
  private readonly puzzleConfig: PuzzleConfig;

  constructor(createRandom: CreateRandomFn, puzzleConfig: PuzzleConfig) {
    this.createRandom = createRandom;
    this.puzzleConfig = puzzleConfig;
  }

  create(qr: Image, seed: string, prefillPercentage: number): Puzzle {
    return Puzzle.create(
      qr,
      this.createRandom(seed),
      prefillPercentage,
      this.puzzleConfig,
    );
  }
}
