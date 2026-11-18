import { Coord, CoordSet, directions, Visited } from '../image';
import { type Puzzle } from './puzzle';
import { PuzzleText } from './puzzleText.testing';

export class PuzzleDriver {
  private readonly puzzle: Puzzle;

  constructor(puzzle: Puzzle) {
    this.puzzle = puzzle;
  }

  reachableCellsFrom(start: Coord): CoordSet {
    const visited = Visited.create(this.puzzle.image.size);
    visited.mark(start);
    const reached = [start];
    const queue = [start];
    while (queue.length > 0) {
      const coord = queue.shift()!;
      for (const direction of directions) {
        const neighbor = coord.goTo(direction);
        if (this.puzzle.hasWall(coord, direction)) continue;
        if (visited.has(neighbor)) continue;
        visited.mark(neighbor);
        reached.push(neighbor);
        queue.push(neighbor);
      }
    }
    return CoordSet.create(reached);
  }

  toText(): PuzzleText {
    return PuzzleText.create(this.puzzle);
  }
}
