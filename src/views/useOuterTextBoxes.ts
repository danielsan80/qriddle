import { useEffect, useState } from 'react';
import { readState, mergeState } from '../lib/browser/urlState';
import type { TextBox } from '../components/CardFaceEditor';

export type Face = 'front' | 'center' | 'back';

export interface FacedTextBox extends TextBox {
  face: Face;
}

interface OuterState {
  textBoxes?: FacedTextBox[];
}

function getInitialTextBoxes(): FacedTextBox[] {
  return readState<OuterState>({}).textBoxes ?? [];
}

export function useOuterTextBoxes(
  face: Face,
): [TextBox[], (boxes: TextBox[]) => void] {
  const [textBoxes, setTextBoxes] =
    useState<FacedTextBox[]>(getInitialTextBoxes);

  useEffect(() => {
    mergeState({ textBoxes }, 'replace');
  }, [textBoxes]);

  const faceBoxes = textBoxes.filter((tb) => tb.face === face);

  function setFaceBoxes(newFaceBoxes: TextBox[]) {
    setTextBoxes((prev) => [
      ...prev.filter((tb) => tb.face !== face),
      ...newFaceBoxes.map((tb) => ({ ...tb, face })),
    ]);
  }

  return [faceBoxes, setFaceBoxes];
}
