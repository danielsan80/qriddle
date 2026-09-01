import { useState } from 'react';
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
  const matrix = {
    a: SCALE,
    d: SCALE,
    // Screen pixels back to viewBox units, for the click that creates a box.
    inverse: () => ({ a: 1 / SCALE, d: 1 / SCALE }) as DOMMatrix,
  } as DOMMatrix;
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

// The views own the boxes and feed them back in as a prop, so a stateful parent
// is what the editor actually runs against.
function Harness({ initial }: { initial: TextBox[] }) {
  const [boxes, setBoxes] = useState(initial);
  return (
    <>
      <SvgTextEditor
        viewBox="0 0 100 100"
        textBoxes={boxes}
        onTextBoxesChange={setBoxes}
      />
      <output data-testid="boxes">{JSON.stringify(boxes)}</output>
    </>
  );
}

function renderHarness(initial: TextBox[] = []) {
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(
    'box-1' as ReturnType<typeof crypto.randomUUID>,
  );
  const { container } = render(<Harness initial={initial} />);
  return {
    svg: container.querySelector('svg')!,
    boxes: () =>
      JSON.parse(screen.getByTestId('boxes').textContent!) as TextBox[],
  };
}

// A press and release with no travel: the click path of the drag handler.
function openEditorOn(element: Element) {
  fireEvent.mouseDown(element, { clientX: 100, clientY: 100 });
  fireEvent.mouseUp(window);
}

describe('SvgTextEditor box lifecycle', () => {
  beforeEach(stubSvgGeometry);

  it('creates an empty box where the click lands and opens its editor', () => {
    const { svg, boxes } = renderHarness();

    fireEvent.click(svg, { clientX: 60, clientY: 40 });

    expect(boxes()).toEqual([
      { id: 'box-1', x: 60 / SCALE, y: 40 / SCALE, text: '', fontSize: 8 },
    ]);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('creates nothing when the click lands on an existing box', () => {
    const { boxes } = renderHarness([box]);

    fireEvent.click(screen.getByText('ciao'));

    expect(boxes()).toEqual([box]);
  });

  it('discards a box that is still empty when its editor closes', () => {
    const { svg, boxes } = renderHarness();
    fireEvent.click(svg, { clientX: 60, clientY: 40 });

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(boxes()).toEqual([]);
  });

  // Escape closes the editor exactly like Enter: the text typed so far is kept,
  // not rolled back. Both keys are pinned so a future Escape-cancels change is
  // a deliberate one.
  it.each(['Enter', 'Escape'])(
    'closes the editor on %s, keeping the text that was typed',
    (key) => {
      const { svg, boxes } = renderHarness();
      fireEvent.click(svg, { clientX: 60, clientY: 40 });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'auguri' },
      });
      fireEvent.keyDown(screen.getByRole('textbox'), { key });

      expect(boxes()).toEqual([
        {
          id: 'box-1',
          x: 60 / SCALE,
          y: 40 / SCALE,
          text: 'auguri',
          fontSize: 8,
        },
      ]);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    },
  );

  it('removes the box from the delete button', () => {
    const { boxes } = renderHarness([box]);
    openEditorOn(screen.getByText('ciao'));

    fireEvent.click(screen.getByRole('button', { name: '×' }));

    expect(boxes()).toEqual([]);
  });

  it('grows the font one step at a time and stops at 24', () => {
    const { boxes } = renderHarness([{ ...box, fontSize: 23 }]);
    openEditorOn(screen.getByText('ciao'));
    const grow = screen.getByRole('button', { name: '+' });

    fireEvent.click(grow);
    expect(boxes()).toEqual([{ ...box, fontSize: 24 }]);

    fireEvent.click(grow);
    expect(boxes()).toEqual([{ ...box, fontSize: 24 }]);
  });

  it('shrinks the font one step at a time and stops at 3', () => {
    const { boxes } = renderHarness([{ ...box, fontSize: 4 }]);
    openEditorOn(screen.getByText('ciao'));
    const shrink = screen.getByRole('button', { name: '−' });

    fireEvent.click(shrink);
    expect(boxes()).toEqual([{ ...box, fontSize: 3 }]);

    fireEvent.click(shrink);
    expect(boxes()).toEqual([{ ...box, fontSize: 3 }]);
  });
});
