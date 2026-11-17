import { PuzzleFactory } from '../lib/domain/puzzle';
import { createRandom } from '../lib/util';

export const puzzleFactory = new PuzzleFactory(createRandom);
