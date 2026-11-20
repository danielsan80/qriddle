import { PuzzleFactory } from '../lib/domain/puzzle';
import { config } from '../lib/config';
import { createRandom } from '../lib/util';

export const puzzleFactory = new PuzzleFactory(
  createRandom,
  config.puzzleGeneration,
);
