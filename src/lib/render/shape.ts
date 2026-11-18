export type Point = { x: number; y: number };

export type Rect = {
  kind: 'rect';
  color: string;
  topLeft: Point;
  width: number;
  height: number;
};

export type Line = {
  kind: 'line';
  color: string;
  width: number;
  from: Point;
  to: Point;
};

export type Circle = {
  kind: 'circle';
  color: string;
  center: Point;
  radius: number;
};

export type Shape = Rect | Line | Circle;

export type Drawing = {
  width: number;
  height: number;
  shapes: Shape[];
};
