export interface TextBox {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export type Face = 'front' | 'center' | 'back';

export interface FacedTextBox extends TextBox {
  face: Face;
}
