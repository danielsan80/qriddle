export type FilledRect = {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Operation = 'fillRect' | 'stroke';

export type RecordingCanvas = {
  canvas: HTMLCanvasElement;
  filledRects: FilledRect[];
  operations: Operation[];
};

/** A canvas that records what it draws: jsdom has no 2D context. */
export function createRecordingCanvas(): RecordingCanvas {
  const filledRects: FilledRect[] = [];
  const operations: Operation[] = [];
  const context = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    fillRect(x: number, y: number, width: number, height: number) {
      filledRects.push({ color: this.fillStyle, x, y, width, height });
      operations.push('fillRect');
    },
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {
      operations.push('stroke');
    },
    arc() {},
    fill() {},
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  return { canvas, filledRects, operations };
}
