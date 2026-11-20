import { Coord, directions } from '../image';
import { type Edge, type EdgeStore } from './edge';

type EdgeFilter = (edge: Edge) => boolean;

export class EdgeStoreDriver {
  private readonly edgeStore: EdgeStore;

  constructor(edgeStore: EdgeStore) {
    this.edgeStore = edgeStore;
  }

  wallMap(): string[][] {
    return this.mapCells((edge) => edge.hasWall);
  }

  externalMap(): string[][] {
    return this.mapCells((edge) => edge.isExternal);
  }

  private mapCells(edgeFilter: EdgeFilter): string[][] {
    const { rows, cols } = this.edgeStore.imageSize;
    const cellMap: string[][] = [];
    for (let row = 0; row < rows; row++) {
      const cellRow: string[] = [];
      for (let col = 0; col < cols; col++) {
        cellRow.push(this.initialsOf(new Coord(row, col), edgeFilter));
      }
      cellMap.push(cellRow);
    }
    return cellMap;
  }

  private initialsOf(coord: Coord, edgeFilter: EdgeFilter): string {
    const initials = directions
      .filter((direction) => edgeFilter(this.edgeStore.get(coord, direction)))
      .map((direction) => direction[0].toUpperCase());
    return initials.join('') || '-';
  }
}
