import { describe, it, expect } from 'vitest';
import { Image } from '../image';
import { createRandom } from '../../util';
import { Puzzle } from './puzzle';
import { PuzzleTester } from './puzzle.tester';
import { ALL_WALLS } from './puzzleText.testing';

describe('Puzzle', () => {
  it('doubles the QR into the image', () => {
    const qr = new Image([
      [1, 0],
      [1, 1],
    ]);

    expect(Puzzle.create(qr, createRandom('seed')).image).toEqual(qr.x2());
  });

  it('draws the walls and the dots from the random', () => {
    const qr = new Image([
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
    ]);

    const puzzle = Puzzle.create(qr, createRandom('fixed-seed'));

    expect(new PuzzleTester(puzzle).toText().full()).toBe(
      [
        '╔═══════════╗',
        '║◾ ◾ ◾ ◾ ◾ ◾║',
        '║ ┌─┬───╴ ╷ ║',
        '║◾│◾│◾ ◾ ◾│◾║',
        '║ ╵ │ ╶─┬─┼─╢',
        '║◾ ◾│◾ ◉│◻│◻║',
        '╟───┴─╴ │ ╵ ║',
        '║◾ ◾ ◾ ◾│◻ ◻║',
        '║ ╷ ┌─┬─┼───╢',
        '║◾│◾│◻│◻│◉ ◾║',
        '╟─┘ │ ╵ │ ╶─╢',
        '║◾ ◾│◻ ◻│◾ ◾║',
        '╚═══╧═══╧═══╝',
      ].join('\n'),
    );
  });

  it('produces same result with same seed', () => {
    const qr = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle1 = Puzzle.create(qr, createRandom('test-seed'));
    const puzzle2 = Puzzle.create(qr, createRandom('test-seed'));

    expect(new PuzzleTester(puzzle1).toText().full()).toEqual(
      new PuzzleTester(puzzle2).toText().full(),
    );
  });

  it('produces different results with different seeds', () => {
    const qr = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle1 = Puzzle.create(qr, createRandom('seed-a'));
    const puzzle2 = Puzzle.create(qr, createRandom('seed-b'));

    expect(new PuzzleTester(puzzle1).toText().full()).not.toEqual(
      new PuzzleTester(puzzle2).toText().full(),
    );
  });

  it('preserves external walls', () => {
    const qr = new Image([[1]]);

    const puzzle = Puzzle.create(qr, createRandom('seed'));

    // prettier-ignore
    expect(new PuzzleTester(puzzle).toText().walls(['external'])).toBe(
      [
        '╔═══╗',
        '║   ║',
        '║   ║',
        '║   ║',
        '╚═══╝',
      ].join('\n'),
    );
    // prettier-ignore
    expect(new PuzzleTester(puzzle).toText().walls(ALL_WALLS)).toBe(
      [
        '╔═╤═╗',
        '║ │ ║',
        '║ ╵ ║',
        '║   ║',
        '╚═══╝',
      ].join('\n'),
    );
  });

  it('preserves walls between different colors', () => {
    const qr = new Image([[0, 1]]);

    const puzzle = Puzzle.create(qr, createRandom('seed'));

    // prettier-ignore
    expect(new PuzzleTester(puzzle).toText().walls(['betweenAreas'])).toBe(
      [
        '    ╷    ',
        '    │    ',
        '    │    ',
        '    │    ',
        '    ╵    ',
      ].join('\n'),
    );
    // prettier-ignore
    expect(new PuzzleTester(puzzle).toText().walls(ALL_WALLS)).toBe(
      [
        '╔═╤═╤═══╗',
        '║ │ │   ║',
        '║ ╵ │ ╷ ║',
        '║   │ │ ║',
        '╚═══╧═╧═╝',
      ].join('\n'),
    );
  });

  it('connects all the cells of an area', () => {
    const qr = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle = Puzzle.create(qr, createRandom('seed'));

    const area = puzzle.areas.at(0)!;
    expect(
      new PuzzleTester(puzzle).reachableCellsFrom(area.pixels[0].coord),
    ).toEqual(area.cells());
  });

  describe('dots', () => {
    it('has one dot per black area', () => {
      const qr = new Image([[1, 0]]);

      const puzzle = Puzzle.create(qr, createRandom('seed'));
      const blackAreas = puzzle.areas.all().filter((a) => a.color === 'black');

      expect(puzzle.dots.length).toBe(blackAreas.length);
    });

    it('each dot belongs to a black area', () => {
      const qr = new Image([[1, 0]]);

      const puzzle = Puzzle.create(qr, createRandom('seed'));
      const blackAreas = puzzle.areas.all().filter((a) => a.color === 'black');

      puzzle.dots.forEach((dot, index) => {
        const area = blackAreas[index];
        const pixelCoords = area.pixels.map((p) => p.coord.toString());
        expect(pixelCoords).toContain(dot.toString());
      });
    });

    it('produces same dots with same seed', () => {
      const qr = new Image([
        [1, 1],
        [1, 1],
      ]);

      const puzzle1 = Puzzle.create(qr, createRandom('test-seed'));
      const puzzle2 = Puzzle.create(qr, createRandom('test-seed'));

      const dots1 = puzzle1.dots.map((d) => d.toString());
      const dots2 = puzzle2.dots.map((d) => d.toString());
      expect(dots1).toEqual(dots2);
    });

    it('produces different dots with different seeds', () => {
      const qr = new Image([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);

      const puzzle1 = Puzzle.create(qr, createRandom('seed-a'));
      const puzzle2 = Puzzle.create(qr, createRandom('seed-b'));

      const dots1 = puzzle1.dots.map((d) => d.toString());
      const dots2 = puzzle2.dots.map((d) => d.toString());
      expect(dots1).not.toEqual(dots2);
    });
  });
});
