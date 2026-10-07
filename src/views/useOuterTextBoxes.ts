import { useWizard } from '../context/useWizard';
import type { TextBox } from '../components/CardFaceEditor';

export type Face = 'front' | 'center' | 'back';

export interface FacedTextBox extends TextBox {
  face: Face;
}

export function useOuterTextBoxes(
  face: Face,
): [TextBox[], (boxes: TextBox[]) => void] {
  const { work, updateWork } = useWizard();

  const faceBoxes = work.textBoxes.filter((tb) => tb.face === face);

  function setFaceBoxes(newFaceBoxes: TextBox[]) {
    updateWork((current) => ({
      ...current,
      textBoxes: [
        ...current.textBoxes.filter((tb) => tb.face !== face),
        ...newFaceBoxes.map((tb) => ({ ...tb, face })),
      ],
    }));
  }

  return [faceBoxes, setFaceBoxes];
}
