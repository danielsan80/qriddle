import { useEffect, useRef, useState } from 'react';
import { Panel } from '../../components/Panel';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './FrontView.module.css';

const FONT_NAME = 'Edwardian Script ITC';
const DRAG_THRESHOLD = 4;

interface TextBox {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

interface EditingState {
  id: string;
  overlayX: number;
  overlayY: number;
}

interface DragState {
  id: string;
  startMouseX: number;
  startMouseY: number;
  startBoxX: number;
  startBoxY: number;
  moved: boolean;
}

function svgToContainer(
  svgEl: SVGSVGElement,
  containerEl: HTMLElement,
  x: number,
  y: number,
): { x: number; y: number } {
  const pt = svgEl.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const screen = pt.matrixTransform(svgEl.getScreenCTM()!);
  const rect = containerEl.getBoundingClientRect();
  return { x: screen.x - rect.left, y: screen.y - rect.top };
}

export function FrontView() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  // Keep a ref to current textBoxes for use inside window event listeners
  const textBoxesRef = useRef(textBoxes);
  useEffect(() => {
    textBoxesRef.current = textBoxes;
  }, [textBoxes]);

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = event.clientX - drag.startMouseX;
      const dy = event.clientY - drag.startMouseY;

      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
        drag.moved = true;
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }

      if (!drag.moved) return;

      const ctm = svgRef.current!.getScreenCTM()!;
      setTextBoxes((prev) =>
        prev.map((tb) =>
          tb.id === drag.id
            ? {
                ...tb,
                x: drag.startBoxX + dx / ctm.a,
                y: drag.startBoxY + dy / ctm.d,
              }
            : tb,
        ),
      );
    }

    function onMouseUp() {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (!drag.moved) {
        // Treat as click: open editor
        const tb = textBoxesRef.current.find((t) => t.id === drag.id);
        if (tb) {
          const pos = svgToContainer(
            svgRef.current!,
            containerRef.current!,
            tb.x,
            tb.y,
          );
          setEditing({ id: tb.id, overlayX: pos.x, overlayY: pos.y });
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function stopEditing() {
    if (!editing) return;
    setTextBoxes((prev) =>
      prev.filter((tb) => tb.id !== editing.id || tb.text.trim() !== ''),
    );
    setEditing(null);
  }

  function handleSvgClick(event: React.MouseEvent<SVGSVGElement>) {
    if ((event.target as Element).tagName === 'text') return;

    const svgEl = svgRef.current!;
    const pt = svgEl.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgCoord = pt.matrixTransform(svgEl.getScreenCTM()!.inverse());

    const newBox: TextBox = {
      id: crypto.randomUUID(),
      x: svgCoord.x,
      y: svgCoord.y,
      text: '',
      fontSize: 8,
    };

    setTextBoxes((prev) => [...prev, newBox]);
    const rect = containerRef.current!.getBoundingClientRect();
    setEditing({
      id: newBox.id,
      overlayX: event.clientX - rect.left,
      overlayY: event.clientY - rect.top,
    });
  }

  function handleTextMouseDown(
    event: React.MouseEvent<SVGTextElement>,
    tb: TextBox,
  ) {
    event.stopPropagation();
    if (editing) stopEditing();
    dragRef.current = {
      id: tb.id,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startBoxX: tb.x,
      startBoxY: tb.y,
      moved: false,
    };
  }

  function handleTextChange(id: string, text: string) {
    setTextBoxes((prev) =>
      prev.map((tb) => (tb.id === id ? { ...tb, text } : tb)),
    );
  }

  function handleFontSize(id: string, delta: number) {
    setTextBoxes((prev) =>
      prev.map((tb) =>
        tb.id === id
          ? { ...tb, fontSize: Math.max(3, Math.min(24, tb.fontSize + delta)) }
          : tb,
      ),
    );
  }

  function handleDelete(id: string) {
    setTextBoxes((prev) => prev.filter((tb) => tb.id !== id));
    setEditing(null);
  }

  const editingBox = editing
    ? textBoxes.find((tb) => tb.id === editing.id)
    : null;

  return (
    <Panel title="Fronte">
      <div ref={containerRef} className={styles.previewContainer}>
        <svg
          ref={svgRef}
          viewBox="105 148.5 105 148.5"
          className={styles.preview}
          onClick={handleSvgClick}
        >
          <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
          {textBoxes.map((tb) => (
            <text
              key={tb.id}
              x={tb.x}
              y={tb.y}
              textAnchor="middle"
              fontSize={tb.fontSize}
              fontFamily={`'${FONT_NAME}'`}
              fill={editing?.id === tb.id ? 'rgba(51,51,51,0.3)' : '#333'}
              onMouseDown={(event) => handleTextMouseDown(event, tb)}
              className={styles.textNode}
            >
              {tb.text}
            </text>
          ))}
          {textBoxes.length === 0 && (
            <text
              x="157.5"
              y="222.75"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="3.5"
              fill="rgba(100,100,100,0.5)"
              pointerEvents="none"
            >
              Clicca per aggiungere testo
            </text>
          )}
        </svg>

        {editing && editingBox && (
          <div
            className={styles.editOverlay}
            style={{ left: editing.overlayX, top: editing.overlayY }}
          >
            <input
              autoFocus
              className={styles.editInput}
              value={editingBox.text}
              onChange={(event) =>
                handleTextChange(editing.id, event.target.value)
              }
              onBlur={stopEditing}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape')
                  stopEditing();
              }}
            />
            <div className={styles.sizeGroup}>
              <button
                type="button"
                className={styles.sizeBtn}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleFontSize(editing.id, -1)}
              >
                −
              </button>
              <button
                type="button"
                className={styles.sizeBtn}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleFontSize(editing.id, +1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className={styles.deleteBtn}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleDelete(editing.id)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}
