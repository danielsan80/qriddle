import { useEffect, useState } from 'react';
import { readState, mergeState } from '../lib/browser/urlState';
import type { Face, TextBox } from '../components/SvgTextEditor';

interface OuterState {
  textBoxes?: TextBox[];
}

function getInitialTextBoxes(): TextBox[] {
  return readState<OuterState>({}).textBoxes ?? [];
}

export function useOuterTextBoxes(
  face: Face,
): [TextBox[], (boxes: TextBox[]) => void] {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>(getInitialTextBoxes);

  useEffect(() => {
    mergeState({ textBoxes });
  }, [textBoxes]);

  const faceBoxes = textBoxes.filter((tb) => tb.face === face);

  function setFaceBoxes(newFaceBoxes: TextBox[]) {
    setTextBoxes((prev) => [
      ...prev.filter((tb) => tb.face !== face),
      ...newFaceBoxes,
    ]);
  }

  return [faceBoxes, setFaceBoxes];
}
