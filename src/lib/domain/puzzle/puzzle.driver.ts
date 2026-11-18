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

  open2x2BlocksOutsidePrefill(): CoordSet {
    const { rows, cols } = this.puzzle.image.size;
    const blocks: Coord[] = [];
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const topLeft = new Coord(row, col);
        const bottomRight = new Coord(row + 1, col + 1);
        if (this.puzzle.prefilledCells.has(topLeft)) continue;
        const open =
          !this.puzzle.hasWall(topLeft, 'east') &&
          !this.puzzle.hasWall(topLeft, 'south') &&
          !this.puzzle.hasWall(bottomRight, 'north') &&
          !this.puzzle.hasWall(bottomRight, 'west');
        if (open) blocks.push(topLeft);
      }
    }
    return CoordSet.create(blocks);
  }

  toText(): PuzzleText {
    return PuzzleText.create(this.puzzle);
  }
}
