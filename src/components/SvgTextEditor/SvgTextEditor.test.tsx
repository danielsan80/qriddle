import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SvgTextEditor, type TextBox } from './SvgTextEditor';

// jsdom implements no SVG geometry, so the two calls the editor makes on the
// <svg> element are stubbed with a 2x scale: one SVG unit is two screen pixels.
// Not 1: the editor divides the pointer delta by the scale, and a scale of 1
// would let that division be deleted without failing anything.
const SCALE = 2;

function stubSvgGeometry() {
  // a and d are the horizontal and vertical scale of the affine matrix; the
  // editor reads no other field.
  const matrix = { a: SCALE, d: SCALE } as DOMMatrix;
  SVGSVGElement.prototype.getScreenCTM = () => matrix;
  SVGSVGElement.prototype.createSVGPoint = function createSVGPoint() {
    return {
      x: 0,
      y: 0,
      // Native in a browser, absent in jsdom. x and y are all svgToContainer
      // reads, so the rest of DOMPoint is left out.
      matrixTransform(target: DOMMatrix) {
        return { x: this.x * target.a, y: this.y * target.d };
      },
    } as DOMPoint;
  };
}

const box: TextBox = { id: 'a', x: 10, y: 20, text: 'ciao', fontSize: 8 };

function renderEditor() {
  const onTextBoxesChange = vi.fn();
  render(
    <SvgTextEditor
      viewBox="0 0 100 100"
      textBoxes={[box]}
      onTextBoxesChange={onTextBoxesChange}
    />,
  );
  return { onTextBoxesChange, text: screen.getByText('ciao') };
}

describe('SvgTextEditor drag threshold', () => {
  beforeEach(stubSvgGeometry);

  it('opens the editor without moving the box when the pointer stays within the threshold', () => {
    const { onTextBoxesChange, text } = renderEditor();

    // Screen pixels, unrelated to the box's viewBox coordinates: the editor
    // only ever reads the difference between them, so the origin is arbitrary.
    fireEvent.mouseDown(text, { clientX: 100, clientY: 100 });
    // |dx| + |dy| === 4, DRAG_THRESHOLD itself: the test is `>`, so still a click
    fireEvent.mouseMove(window, { clientX: 102, clientY: 102 });
    fireEvent.mouseUp(window);

    expect(onTextBoxesChange.mock.calls).toEqual([]);
    expect(screen.getByDisplayValue('ciao')).toBeInTheDocument();
  });

  it('moves the box and opens no editor once the pointer passes the threshold', () => {
    const { onTextBoxesChange, text } = renderEditor();

    fireEvent.mouseDown(text, { clientX: 100, clientY: 100 });
    // |dx| + |dy| === 5: one past DRAG_THRESHOLD, the first value that drags
    fireEvent.mouseMove(window, { clientX: 103, clientY: 102 });
    fireEvent.mouseUp(window);

    expect(onTextBoxesChange.mock.calls).toEqual([
      [[{ ...box, x: 10 + 3 / SCALE, y: 20 + 2 / SCALE }]],
    ]);
    expect(screen.queryByDisplayValue('ciao')).not.toBeInTheDocument();
  });

  it('leaves the body cursor untouched on a click and restores it after a drag', () => {
    const { text } = renderEditor();

    fireEvent.mouseDown(text, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 102, clientY: 102 });
    expect(document.body.style.cursor).toBe('');

    fireEvent.mouseMove(window, { clientX: 103, clientY: 102 });
    expect(document.body.style.cursor).toBe('grabbing');

    fireEvent.mouseUp(window);
    expect(document.body.style.cursor).toBe('');
  });
});
