import { describe, it, expect } from 'vitest';
import { Image } from '../image';
import { createRandom } from '../../util';
import { Puzzle } from './puzzle';
import { ALL_WALLS, PuzzleText } from './puzzleText.testing';

describe('PuzzleText', () => {
  const qr = new Image([
    [1, 1],
    [1, 0],
  ]);
  const puzzleText = PuzzleText.create(
    Puzzle.create(qr, createRandom('seed'), 0),
  );

  it('draws all the walls without the cells', () => {
    expect(puzzleText.walls(ALL_WALLS)).toBe(
      puzzleText.full().replace(/[◾◻◉]/g, ' '),
    );
  });

  it('draws only the external walls', () => {
    const puzzleText = PuzzleText.create(
      Puzzle.create(new Image([[0, 1]]), createRandom('seed'), 0),
    );

    // prettier-ignore
    expect(puzzleText.walls(['external'])).toBe(
      [
        '╔═══════╗',
        '║       ║',
        '║       ║',
        '║       ║',
        '╚═══════╝',
      ].join('\n'),
    );
  });

  it('draws only the walls inside the areas', () => {
    const puzzleText = PuzzleText.create(
      Puzzle.create(new Image([[0, 1]]), createRandom('seed'), 0),
    );

    // prettier-ignore
    expect(puzzleText.walls(['insideArea'])).toBe(
      [
        '  ╷      ',
        '  │      ',
        '  ╵   ╷  ',
        '      │  ',
        '      ╵  ',
      ].join('\n'),
    );
  });
});
