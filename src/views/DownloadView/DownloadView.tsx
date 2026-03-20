import { useEffect, useRef } from 'react';
import { Panel } from '../../components/Panel';
import { useWizard } from '../../context/useWizard';
import {
  downloadPuzzlePdf,
  renderInnerPdfPreview,
  renderOuterPdfPreview,
} from '../../lib/render';
import { PreviewStage } from '../../components/PreviewStage';
import { readState } from '../../lib/browser/urlState';
import type { TextBox } from '../../components/SvgTextEditor';
import styles from './DownloadView.module.css';

function getTextBoxes(): TextBox[] {
  return readState<{ textBoxes?: TextBox[] }>({}).textBoxes ?? [];
}

export function DownloadView() {
  const { puzzle } = useWizard();
  const innerCanvasRef = useRef<HTMLCanvasElement>(null);
  const outerCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (puzzle && innerCanvasRef.current) {
      void renderInnerPdfPreview(innerCanvasRef.current, puzzle);
    }
  }, [puzzle]);

  useEffect(() => {
    if (outerCanvasRef.current) {
      void renderOuterPdfPreview(outerCanvasRef.current, getTextBoxes());
    }
  }, []);

  function handleDownload() {
    if (puzzle) void downloadPuzzlePdf(puzzle, getTextBoxes());
  }

  return (
    <>
      <p className={styles.message}>
        La tua <s>mappa del tesoro</s> biglietto d&apos;auguri è pronto!
        <br />
        Scarica il pdf, stampalo, piegalo in 4 e consegnalo al festeggiato.
        <br />
        (meglio usare un pennarello nero per risolverlo)
        <br />
        <br />
        Se ti va puoi{' '}
        <a
          href="https://ko-fi.com/danielsan80"
          target="_blank"
          rel="noopener noreferrer"
        >
          offrirmi un caffè
        </a>{' '}
        <span className={styles.coffeeIcon}>☕</span>
      </p>
      <Panel>
        <Panel.Title>Anteprima PDF</Panel.Title>
        <Panel.Actions>
          <Panel.ActionButton
            onClick={handleDownload}
            disabled={puzzle === null}
            title="Scarica PDF"
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
