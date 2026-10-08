import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { useOuterTextBoxes } from './useOuterTextBoxes';
import type { FacedTextBox, TextBox } from '../lib/domain/card';
import { WizardProvider } from '../context/WizardContext';
import { useWizard } from '../context/useWizard';
import { encode } from '../lib/browser/urlState';

const frontBox: FacedTextBox = {
  id: '1',
  x: 10,
  y: 20,
  text: 'hi',
  fontSize: 8,
  face: 'front',
};
const centerBox: FacedTextBox = {
  id: '2',
  x: 30,
  y: 40,
  text: 'yo',
  fontSize: 8,
  face: 'center',
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <WizardProvider>{children}</WizardProvider>;
}

function renderFront(textBoxes: FacedTextBox[]) {
  window.location.hash = '#' + encode({ textBoxes });
  const { result } = renderHook(
    () => {
      const [boxes, setBoxes] = useOuterTextBoxes('front');
      return { boxes, setBoxes, cardBoxes: useWizard().work.textBoxes };
    },
    { wrapper },
  );
  return {
    boxes: () => result.current.boxes,
    setBoxes: (boxes: TextBox[]) => act(() => result.current.setBoxes(boxes)),
    cardBoxes: () => result.current.cardBoxes,
  };
}

describe('useOuterTextBoxes', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('returns only boxes matching the given face', () => {
    const front = renderFront([frontBox, centerBox]);

    expect(front.boxes()).toEqual([frontBox]);
  });

  it('stamps its own face on the boxes it is handed', () => {
    const front = renderFront([]);

    front.setBoxes([{ id: '1', x: 10, y: 20, text: 'hi', fontSize: 8 }]);

    expect(front.cardBoxes()).toEqual([frontBox]);
  });

  it('preserves boxes from other faces when updating', () => {
    const front = renderFront([centerBox]);

    front.setBoxes([frontBox]);

    expect(front.cardBoxes()).toEqual([centerBox, frontBox]);
  });

  it('keeps the boxes of every face in place when one face changes', () => {
    const front = renderFront([frontBox, centerBox]);
    const editedFrontBox = { ...frontBox, text: 'hello' };

    front.setBoxes([editedFrontBox]);

    expect(front.cardBoxes()).toEqual([editedFrontBox, centerBox]);
  });

  it('adds a new box of the face at the end', () => {
    const front = renderFront([frontBox, centerBox]);
    const newFrontBox = { ...frontBox, id: '3', text: 'new' };

    front.setBoxes([frontBox, newFrontBox]);

    expect(front.cardBoxes()).toEqual([frontBox, centerBox, newFrontBox]);
  });

  it('drops the boxes a face no longer has', () => {
    const front = renderFront([frontBox, centerBox]);

    front.setBoxes([]);

    expect(front.cardBoxes()).toEqual([centerBox]);
  });
});
