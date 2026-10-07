import { useEffect, useRef } from 'react';
import { Panel } from '../../components/layout/Panel';
import { useWizard } from '../../context/useWizard';
import {
  downloadPuzzlePdf,
  renderInnerPdfPreview,
  renderOuterPdfPreview,
} from '../../lib/render';
import { PreviewStage } from '../../components/stages/PreviewStage';
import { config } from '../../lib/config';
import { cardFontDescriptor, loadFont } from '../../lib/util';
import styles from './DownloadView.module.css';

export function DownloadView() {
  const { puzzle, work } = useWizard();
  const { textBoxes } = work;
  const innerCanvasRef = useRef<HTMLCanvasElement>(null);
  const outerCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (puzzle && innerCanvasRef.current) {
      const canvas = innerCanvasRef.current;
      void loadFont(cardFontDescriptor).then(() =>
        renderInnerPdfPreview(canvas, puzzle),
      );
    }
  }, [puzzle]);

  useEffect(() => {
    const canvas = outerCanvasRef.current;
    if (canvas) {
      void loadFont(cardFontDescriptor).then(() =>
        renderOuterPdfPreview(canvas, textBoxes),
      );
    }
  }, [textBoxes]);

  function handleDownload() {
    if (puzzle) {
      window.umami?.track('download');
      void downloadPuzzlePdf(puzzle, textBoxes);
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
      <button
        type="button"
        className={styles.download}
        onClick={handleDownload}
        disabled={puzzle === null}
      >
        Download the PDF
      </button>
      <Panel>
        <Panel.Title>Preview</Panel.Title>
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
