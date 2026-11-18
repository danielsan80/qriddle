import { type Drawing } from './shape';

export class CanvasPainter {
  private readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  paint(drawing: Drawing): void {
    this.canvas.width = drawing.width;
    this.canvas.height = drawing.height;
    const context = this.canvas.getContext('2d');
    if (!context) return;

    for (const shape of drawing.shapes) {
      switch (shape.kind) {
        case 'rect':
          context.fillStyle = shape.color;
          context.fillRect(
            shape.topLeft.x,
            shape.topLeft.y,
            shape.width,
            shape.height,
          );
          break;
        case 'line':
          context.strokeStyle = shape.color;
          context.lineWidth = shape.width;
          context.beginPath();
          context.moveTo(shape.from.x, shape.from.y);
          context.lineTo(shape.to.x, shape.to.y);
          context.stroke();
          break;
        case 'circle':
          context.fillStyle = shape.color;
          context.beginPath();
          context.arc(
            shape.center.x,
            shape.center.y,
            shape.radius,
            0,
            Math.PI * 2,
          );
          context.fill();
          break;
      }
    }
  }
}
