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
    <Panel
      title="Anteprima PDF"
      action={{
        icon: '↓',
        label: 'Scarica PDF',
        onClick: handleDownload,
        disabled: puzzle === null,
      }}
    >
      <PreviewStage>
        <div className={styles.previews}>
          <canvas ref={innerCanvasRef} className={styles.page} />
          <canvas ref={outerCanvasRef} className={styles.page} />
        </div>
      </PreviewStage>
    </Panel>
  );
}
