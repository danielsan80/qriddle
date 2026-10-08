import { useWizard } from '../context/useWizard';
import type { Face, TextBox } from '../lib/domain/card';

export function useOuterTextBoxes(
  face: Face,
): [TextBox[], (boxes: TextBox[]) => void] {
  const { work, updateWork } = useWizard();

  const faceBoxes = work.textBoxes.filter((textBox) => textBox.face === face);

  function setFaceBoxes(newFaceBoxes: TextBox[]) {
    updateWork((current) => {
      const incoming = newFaceBoxes.map((textBox) => ({ ...textBox, face }));
      const inPlace = current.textBoxes.flatMap((textBox) => {
        if (textBox.face !== face) return [textBox];
        const replacement = incoming.shift();
        return replacement ? [replacement] : [];
      });
      return { ...current, textBoxes: [...inPlace, ...incoming] };
    });
  }

  return [faceBoxes, setFaceBoxes];
}
