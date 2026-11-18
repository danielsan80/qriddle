import { describe, it, expect, vi } from 'vitest';
import { CanvasPainter } from './canvasPainter';
import { type Shape } from './shape';

type FakeContext = ReturnType<typeof createContext>;

function createContext() {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
}

function createCanvas(context: FakeContext): HTMLCanvasElement {
  return {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
}

function paint(shape: Shape) {
  const context = createContext();
  new CanvasPainter(createCanvas(context)).paint({
    width: 10,
    height: 10,
    shapes: [shape],
  });
  return context;
}

describe('CanvasPainter', () => {
  it('sizes the canvas to the drawing', () => {
    const canvas = createCanvas(createContext());

    new CanvasPainter(canvas).paint({
      width: 30,
      height: 20,
      shapes: [],
    });

    expect({ width: canvas.width, height: canvas.height }).toEqual({
      width: 30,
      height: 20,
    });
  });

  it('fills a rect with its color', () => {
    const context = paint({
      kind: 'rect',
      color: 'red',
      topLeft: { x: 1, y: 2 },
      width: 3,
      height: 4,
    });

    expect(context.fillStyle).toBe('red');
    expect(context.fillRect).toHaveBeenCalledExactlyOnceWith(1, 2, 3, 4);
  });

  it('strokes a line with its color and width', () => {
    const context = paint({
      kind: 'line',
      color: 'blue',
      width: 2,
      from: { x: 0, y: 1 },
      to: { x: 5, y: 1 },
    });

    expect(context.strokeStyle).toBe('blue');
    expect(context.lineWidth).toBe(2);
    expect(context.moveTo).toHaveBeenCalledExactlyOnceWith(0, 1);
    expect(context.lineTo).toHaveBeenCalledExactlyOnceWith(5, 1);
    expect(context.stroke).toHaveBeenCalledOnce();
  });

  it('fills a circle', () => {
    const context = paint({
      kind: 'circle',
      color: 'green',
      center: { x: 3, y: 4 },
      radius: 2,
    });

    expect(context.fillStyle).toBe('green');
    expect(context.arc).toHaveBeenCalledExactlyOnceWith(
      3,
      4,
      2,
      0,
      Math.PI * 2,
    );
    expect(context.fill).toHaveBeenCalledOnce();
  });
});
