import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { useOuterTextBoxes } from './useOuterTextBoxes';
import type { FacedTextBox } from '../lib/domain/card';
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
  return renderHook(
    () => ({ front: useOuterTextBoxes('front'), wizard: useWizard() }),
    { wrapper },
  ).result;
}

describe('useOuterTextBoxes', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('returns only boxes matching the given face', () => {
    const result = renderFront([frontBox, centerBox]);

    expect(result.current.front[0]).toEqual([frontBox]);
  });

  it('stamps its own face on the boxes it is handed', () => {
    const result = renderFront([]);

    act(() =>
      result.current.front[1]([
        { id: '1', x: 10, y: 20, text: 'hi', fontSize: 8 },
      ]),
    );

    expect(result.current.wizard.work.textBoxes).toEqual([frontBox]);
  });

  it('preserves boxes from other faces when updating', () => {
    const result = renderFront([centerBox]);

    act(() => result.current.front[1]([frontBox]));

    expect(result.current.wizard.work.textBoxes).toEqual([centerBox, frontBox]);
  });
});
