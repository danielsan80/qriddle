import { useEffect, useRef } from 'react';
import { Panel } from '../../components/layout/Panel';
import { useWizard } from '../../context/useWizard';
import {
  downloadPuzzlePdf,
  renderInnerPdfPreview,
  renderOuterPdfPreview,
} from '../../lib/render';
import { PreviewStage } from '../../components/stages/PreviewStage';
import { readState } from '../../lib/browser/urlState';
import type { TextBox } from '../../components/SvgTextEditor';
import { config } from '../../lib/config';
import { loadFont } from '../../lib/util';
import styles from './DownloadView.module.css';

const EDWARDIAN_DESCRIPTOR = `1px 'Edwardian Script ITC'`;

function getTextBoxes(): TextBox[] {
  return readState<{ textBoxes?: TextBox[] }>({}).textBoxes ?? [];
}

export function DownloadView() {
  const { puzzle } = useWizard();
  const innerCanvasRef = useRef<HTMLCanvasElement>(null);
  const outerCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (puzzle && innerCanvasRef.current) {
      const canvas = innerCanvasRef.current;
      void loadFont(EDWARDIAN_DESCRIPTOR).then(() =>
        renderInnerPdfPreview(canvas, puzzle),
      );
    }
  }, [puzzle]);

  useEffect(() => {
    const canvas = outerCanvasRef.current;
    if (canvas) {
      void loadFont(EDWARDIAN_DESCRIPTOR).then(() =>
        renderOuterPdfPreview(canvas, getTextBoxes()),
      );
    }
  }, []);

  function handleDownload() {
    if (puzzle) {
      window.umami?.track('download');
      void downloadPuzzlePdf(puzzle, getTextBoxes());
    }
  }

  return (
    <>
      <p className={styles.message}>
        Your <s>treasure map</s> greeting card is ready!
        <br />
        Download the PDF, print it, fold it in 4 and hand it to the birthday
        star.
        <br />
        (a black marker works best to solve it)
        <br />
        <br />
        If you enjoyed it, you can{' '}
        <a href={config.kofi.url} target="_blank" rel="noopener noreferrer">
          buy me a coffee
        </a>{' '}
        <span className={styles.coffeeIcon}>☕</span>
      </p>
      <Panel>
        <Panel.Title>Preview</Panel.Title>
        <Panel.Actions>
          <Panel.ActionButton
            onClick={handleDownload}
            disabled={puzzle === null}
            title="Download PDF"
          >
            ↓
          </Panel.ActionButton>
        </Panel.Actions>
        <Panel.Body>
          <PreviewStage>
            <div className={styles.previews}>
              <canvas ref={innerCanvasRef} className={styles.page} />
              <canvas ref={outerCanvasRef} className={styles.page} />
            </div>
          </PreviewStage>
        </Panel.Body>
      </Panel>
    </>
  );
}
