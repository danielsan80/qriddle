import { describe, it, expect } from 'vitest';
import { Coord, CoordSet, Image } from '../image';
import { createRandom } from '../../util';
import { config } from '../../config';
import { Puzzle } from './puzzle';
import { PuzzleDriver } from './puzzle.driver';
import { ALL_WALLS } from './puzzleText.testing';

describe('Puzzle', () => {
  it('doubles the QR into the image', () => {
    const qr = new Image([
      [1, 0],
      [1, 1],
    ]);

    expect(
      Puzzle.create(qr, createRandom('seed'), 0, config.puzzleGeneration).image,
    ).toEqual(qr.x2());
  });

  it('keeps the QR it comes from', () => {
    const qr = new Image([
      [1, 0],
      [1, 1],
    ]);

    expect(
      Puzzle.create(qr, createRandom('seed'), 0, config.puzzleGeneration).qr,
    ).toBe(qr);
  });

  it('draws the walls and the dots from the random', () => {
    const qr = new Image([
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
    ]);

    const puzzle = Puzzle.create(
      qr,
      createRandom('fixed-seed'),
      0,
      config.puzzleGeneration,
    );

    expect(new PuzzleDriver(puzzle).toText().full()).toBe(
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

  it('goes straight whenever it can with a straight bias of 1', () => {
    const qr = new Image([[1, 1, 1]]);

    const puzzle = Puzzle.create(qr, createRandom('seed'), 0, {
      biasStraight: 1,
    });

    expect(new PuzzleDriver(puzzle).toText().full()).toBe(
      [
        '╔═══════════╗',
        '║◾ ◾ ◾ ◾ ◾ ◾║',
        '║ ╷ ┌─────╴ ║',
        '║◾│◉│◾ ◾ ◾ ◾║',
        '╚═╧═╧═══════╝',
      ].join('\n'),
    );
  });

  it('produces same result with same seed', () => {
    const qr = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle1 = Puzzle.create(
      qr,
      createRandom('test-seed'),
      0,
      config.puzzleGeneration,
    );
    const puzzle2 = Puzzle.create(
      qr,
      createRandom('test-seed'),
      0,
      config.puzzleGeneration,
    );

    expect(new PuzzleDriver(puzzle1).toText().full()).toEqual(
      new PuzzleDriver(puzzle2).toText().full(),
    );
  });

  it('produces different results with different seeds', () => {
    const qr = new Image([
      [1, 1],
      [1, 1],
    ]);

    const puzzle1 = Puzzle.create(
      qr,
      createRandom('seed-a'),
      0,
      config.puzzleGeneration,
    );
    const puzzle2 = Puzzle.create(
      qr,
      createRandom('seed-b'),
      0,
      config.puzzleGeneration,
    );

    expect(new PuzzleDriver(puzzle1).toText().full()).not.toEqual(
      new PuzzleDriver(puzzle2).toText().full(),
    );
  });

  it('preserves external walls', () => {
    const qr = new Image([[1]]);

    const puzzle = Puzzle.create(
      qr,
      createRandom('seed'),
      0,
      config.puzzleGeneration,
    );

    // prettier-ignore
    expect(new PuzzleDriver(puzzle).toText().walls(['external'])).toBe(
      [
        '╔═══╗',
        '║   ║',
        '║   ║',
        '║   ║',
        '╚═══╝',
      ].join('\n'),
    );
    // prettier-ignore
    expect(new PuzzleDriver(puzzle).toText().walls(ALL_WALLS)).toBe(
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

    const puzzle = Puzzle.create(
      qr,
      createRandom('seed'),
      0,
      config.puzzleGeneration,
    );

    // prettier-ignore
    expect(new PuzzleDriver(puzzle).toText().walls(['betweenAreas'])).toBe(
      [
        '    ╷    ',
        '    │    ',
        '    │    ',
        '    │    ',
        '    ╵    ',
      ].join('\n'),
    );
    // prettier-ignore
    expect(new PuzzleDriver(puzzle).toText().walls(ALL_WALLS)).toBe(
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

    const puzzle = Puzzle.create(
      qr,
      createRandom('seed'),
      0,
      config.puzzleGeneration,
    );

    const area = puzzle.areas.at(0)!;
    expect(
      new PuzzleDriver(puzzle).reachableCellsFrom(area.pixels[0].coord),
    ).toEqual(area.cells());
  });

  describe('with prefilled cells', () => {
    const qr = new Image([
      [1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [0, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 0, 1, 0, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0, 1],
    ]);

    it('prefills no module at 0%', () => {
      expect(
        Puzzle.create(qr, createRandom('seed'), 0, config.puzzleGeneration)
          .prefilledModules,
      ).toEqual(CoordSet.empty());
    });

    it('draws a prefilled module full, walled from the areas to solve', () => {
      const qr = new Image([
        [1, 1, 1],
        [1, 0, 1],
      ]);

      const puzzle = Puzzle.create(
        qr,
        createRandom('seed'),
        20,
        config.puzzleGeneration,
      );

      expect(puzzle.prefilledModules).toEqual(
        CoordSet.create([new Coord(0, 1)]),
      );
      // prettier-ignore
      expect(new PuzzleDriver(puzzle).toText().full()).toBe([
        '╔═══╤═══╤═══╗',
        '║◾ ◾│■ ■│◾ ◾║',
        '║ ╷ │   │ ╷ ║',
        '║◾│◾│■ ■│◾│◾║',
        '║ │ ├───┤ │ ║',
        '║◾│◾│◻ ◻│◾│◾║',
        '║ └─┼─╴ │ │ ║',
        '║◉ ◾│◻ ◻│◾│◉║',
        '╚═══╧═══╧═╧═╝',
      ].join('\n'));
    });

    it('tells whether a cell is prefilled', () => {
      const qr = new Image([
        [1, 1, 1],
        [1, 0, 1],
      ]);
      const puzzle = Puzzle.create(
        qr,
        createRandom('seed'),
        20,
        config.puzzleGeneration,
      );

      const prefilled: Coord[] = [];
      puzzle.image.forEach((pixel) => {
        if (puzzle.isPrefilledCell(pixel.coord)) prefilled.push(pixel.coord);
      });

      expect(CoordSet.create(prefilled)).toEqual(
        CoordSet.create([
          new Coord(0, 2),
          new Coord(0, 3),
          new Coord(1, 2),
          new Coord(1, 3),
        ]),
      );
    });

    for (const percentage of [20, 50, 80]) {
      it(`connects every area to solve at ${percentage}%`, () => {
        const puzzle = Puzzle.create(
          qr,
          createRandom('seed'),
          percentage,
          config.puzzleGeneration,
        );

        for (const area of puzzle.areas.toSolve()) {
          expect(
            new PuzzleDriver(puzzle).reachableCellsFrom(area.pixels[0].coord),
          ).toEqual(area.cells());
        }
      });

      it(`leaves no 2x2 block in the areas to solve at ${percentage}%`, () => {
        const puzzle = Puzzle.create(
          qr,
          createRandom('seed'),
          percentage,
          config.puzzleGeneration,
        );

        expect(new PuzzleDriver(puzzle).open2x2BlocksOutsidePrefill()).toEqual(
          CoordSet.empty(),
        );
      });

      it(`keeps at least 4 cells in every area to solve at ${percentage}%`, () => {
        const puzzle = Puzzle.create(
          qr,
          createRandom('seed'),
          percentage,
          config.puzzleGeneration,
        );

        const smallAreas = puzzle.areas
          .toSolve()
          .filter((area) => area.pixels.length < 4);
        expect(smallAreas).toEqual([]);
      });
    }

    it('puts one dot in each black area to solve', () => {
      const puzzle = Puzzle.create(
        qr,
        createRandom('seed'),
        50,
        config.puzzleGeneration,
      );

      const blackAreas = puzzle.areas
        .toSolve()
        .filter((area) => area.color === 'black');
      const dotAreas = puzzle.dots.map((dot) =>
        blackAreas.findIndex((area) => area.cells().has(dot)),
      );
      expect(dotAreas).toEqual(blackAreas.map((_area, index) => index));
    });
  });

  describe('dots', () => {
    it('has one dot per black area', () => {
      const qr = new Image([[1, 0]]);

      const puzzle = Puzzle.create(
        qr,
        createRandom('seed'),
        0,
        config.puzzleGeneration,
      );
      const blackAreas = puzzle.areas.all().filter((a) => a.color === 'black');

      expect(puzzle.dots.length).toBe(blackAreas.length);
    });

    it('each dot belongs to a black area', () => {
      const qr = new Image([[1, 0]]);

      const puzzle = Puzzle.create(
        qr,
        createRandom('seed'),
        0,
        config.puzzleGeneration,
      );
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

      const puzzle1 = Puzzle.create(
        qr,
        createRandom('test-seed'),
        0,
        config.puzzleGeneration,
      );
      const puzzle2 = Puzzle.create(
        qr,
        createRandom('test-seed'),
        0,
        config.puzzleGeneration,
      );

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

      const puzzle1 = Puzzle.create(
        qr,
        createRandom('seed-a'),
        0,
        config.puzzleGeneration,
      );
      const puzzle2 = Puzzle.create(
        qr,
        createRandom('seed-b'),
        0,
        config.puzzleGeneration,
      );

      const dots1 = puzzle1.dots.map((d) => d.toString());
      const dots2 = puzzle2.dots.map((d) => d.toString());
      expect(dots1).not.toEqual(dots2);
    });
  });
});
