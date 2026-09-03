import { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CardFaceEditor, type TextBox } from './CardFaceEditor';

afterEach(() => vi.restoreAllMocks());

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
  const { unmount } = render(
    <CardFaceEditor
      viewBox="0 0 100 100"
      textBoxes={[box]}
      onTextBoxesChange={onTextBoxesChange}
    />,
  );
  return { onTextBoxesChange, text: screen.getByText('ciao'), unmount };
}

describe('CardFaceEditor drag threshold', () => {
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
    expect(screen.getByRole('textbox')).toHaveValue('ciao');
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
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
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

  // Both properties are written on the body, which outlives the editor, so
  // unmounting mid-drag has to hand them back: no mouseup will ever arrive to
  // do it.
  it('restores the body styles when it unmounts during a drag', () => {
    const { text, unmount } = renderEditor();

    fireEvent.mouseDown(text, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 103, clientY: 102 });

    unmount();

    expect({
      cursor: document.body.style.cursor,
      userSelect: document.body.style.userSelect,
    }).toEqual({ cursor: '', userSelect: '' });
  });
});

// The views own the boxes and feed them back in as a prop, so a stateful parent
// is what the editor actually runs against.
function Harness({ initial }: { initial: TextBox[] }) {
  const [boxes, setBoxes] = useState(initial);
  return (
    <>
      <CardFaceEditor
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

describe('CardFaceEditor box lifecycle', () => {
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

describe('CardFaceEditor closing by blur', () => {
  beforeEach(stubSvgGeometry);

  it('closes the editor and swallows the click that caused the blur', () => {
    const { svg, boxes } = renderHarness([box]);
    openEditorOn(screen.getByText('ciao'));

    // One physical gesture, pressing outside the input, reaches the page as a
    // sequence: the browser moves the focus and fires blur, then fires click on
    // whatever was under the pointer. jsdom moves no focus on its own, so the
    // two halves are fired by hand, in that order. The test therefore proves
    // the editor handles the sequence, not that a browser produces it.
    fireEvent.blur(screen.getByRole('textbox'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    // Without the guard this second half would open a box under the pointer.
    fireEvent.click(svg, { clientX: 60, clientY: 40 });
    expect(boxes()).toEqual([box]);

    // The guard lasts one click only.
    fireEvent.click(svg, { clientX: 60, clientY: 40 });
    expect(boxes()).toEqual([
      box,
      { id: 'box-1', x: 60 / SCALE, y: 40 / SCALE, text: '', fontSize: 8 },
    ]);
  });

  it('closes the editor when another box is grabbed', () => {
    const second: TextBox = { ...box, id: 'b', text: 'auguri', x: 40 };
    renderHarness([box, second]);
    openEditorOn(screen.getByText('ciao'));

    fireEvent.mouseDown(screen.getByText('auguri'), {
      clientX: 100,
      clientY: 100,
    });

    // Only the overlay is gone; both boxes are still drawn in the svg.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('ciao')).toBeInTheDocument();
  });

  // Every toolbar button carries the same guard, so every one of them is
  // checked. jsdom moves no focus on mousedown, so the guard is asserted
  // directly: fireEvent returns false when the handler called preventDefault,
  // which is what stops a browser from blurring the input and closing the
  // overlay before the button's own click can run.
  it.each(['−', '+', '×'])(
    'keeps the input alive when the %s button is pressed',
    (name) => {
      renderHarness([box]);
      openEditorOn(screen.getByText('ciao'));

      const pressed = fireEvent.mouseDown(screen.getByRole('button', { name }));

      expect(pressed).toBe(false);
    },
  );
});

// Zoom runs between a floor of 100px, hard-coded in the editor, and a ceiling:
// the width of the <div> wrapping the svg, since the sheet is never drawn wider
// than what holds it. The two numbers below are arbitrary; what the tests need
// is that the starting width sits strictly between the floor and the ceiling,
// so the wheel has somewhere to go in both directions before it hits a limit.
const FLOOR_WIDTH = 100;
const CONTAINER_WIDTH = 500;
const INITIAL_WIDTH = 200;

describe('CardFaceEditor zoom', () => {
  beforeEach(() => {
    stubSvgGeometry();
    // jsdom lays nothing out, so both widths read 0 until they are stubbed.
    vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect').mockReturnValue(
      { width: CONTAINER_WIDTH, left: 0, top: 0 } as DOMRect,
    );
    vi.spyOn(SVGSVGElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: INITIAL_WIDTH,
      left: 0,
      top: 0,
    } as DOMRect);
  });

  it('grows the svg on a wheel up and shrinks it on a wheel down', () => {
    const { svg } = renderHarness([box]);

    fireEvent.wheel(svg, { deltaY: -1 });
    expect(parseFloat(svg.style.width)).toBeCloseTo(INITIAL_WIDTH * 1.1, 5);

    fireEvent.wheel(svg, { deltaY: 1 });
    expect(parseFloat(svg.style.width)).toBeCloseTo(INITIAL_WIDTH, 5);
  });

  it('never shrinks below the floor nor grows past the container', () => {
    const { svg } = renderHarness([box]);

    for (let step = 0; step < 20; step++) {
      fireEvent.wheel(svg, { deltaY: 1 });
    }
    expect(svg.style.width).toBe(`${FLOOR_WIDTH}px`);

    for (let step = 0; step < 40; step++) {
      fireEvent.wheel(svg, { deltaY: -1 });
    }
    expect(svg.style.width).toBe(`${CONTAINER_WIDTH}px`);
  });

  // A sideways wheel — a tilt wheel, a trackpad, shift+wheel — carries deltaY
  // zero. It is not a zoom in either direction, and it must stay a scroll:
  // fireEvent returns false when the handler called preventDefault.
  it('ignores a sideways wheel instead of zooming on it', () => {
    const { svg } = renderHarness([box]);

    const scrolled = fireEvent.wheel(svg, { deltaY: 0, deltaX: 10 });

    // Untouched: the editor never set a width, so the CSS one still applies.
    expect(svg.style.width).toBe('');
    expect(scrolled).toBe(true);
  });
});

describe('CardFaceEditor without a parent holding the boxes', () => {
  beforeEach(stubSvgGeometry);

  it('keeps the boxes in its own state', () => {
    const { container } = render(<CardFaceEditor viewBox="0 0 100 100" />);
    const svg = container.querySelector('svg')!;
    expect(screen.getByText('Click to add text')).toBeInTheDocument();

    fireEvent.click(svg, { clientX: 60, clientY: 40 });
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'auguri' },
    });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(screen.getByText('auguri')).toBeInTheDocument();
    expect(screen.queryByText('Click to add text')).not.toBeInTheDocument();
  });
});
