import { Image } from '../image';
import { Puzzle } from './puzzle';
import { type CreateRandomFn } from './random';

export class PuzzleFactory {
  private readonly createRandom: CreateRandomFn;

  constructor(createRandom: CreateRandomFn) {
    this.createRandom = createRandom;
  }

  create(qr: Image, seed: string): Puzzle {
    return Puzzle.create(qr, this.createRandom(seed));
  }
}
