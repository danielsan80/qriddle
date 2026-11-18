import { describe, it, expect } from 'vitest';
import { Image } from '../image';
import { createRandom } from '../../util';
import { Puzzle } from './puzzle';
import { PuzzleFactory } from './puzzleFactory';

describe('PuzzleFactory', () => {
  const qr = new Image([
    [1, 0],
    [1, 1],
  ]);
  const puzzleFactory = new PuzzleFactory(createRandom);

  it('creates the puzzle with the random of the seed', () => {
    expect(puzzleFactory.create(qr, 'seed', 50)).toEqual(
      Puzzle.create(qr, createRandom('seed'), 50),
    );
  });
});
