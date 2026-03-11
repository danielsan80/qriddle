import type { RefObject } from 'react';
import { Panel } from '../Panel';
import styles from './Workspace.module.css';

interface WorkspaceProps {
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
  puzzleCanvasRef: RefObject<HTMLCanvasElement | null>;
  showCanvas: boolean;
  onDownloadPdf: () => void;
  canDownload: boolean;
}

export function Workspace({
  qrCanvasRef,
  puzzleCanvasRef,
  showCanvas,
  onDownloadPdf,
  canDownload,
}: WorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <Panel title="QR Code" type="qrcode" showCanvas={showCanvas}>
        <canvas ref={qrCanvasRef}></canvas>
      </Panel>

      <Panel
        title="Anteprima PDF"
        type="preview"
        showCanvas={showCanvas}
        action={{
          icon: '↓',
          label: 'Scarica PDF',
          onClick: onDownloadPdf,
          disabled: !canDownload,
        }}
      >
        <canvas ref={puzzleCanvasRef}></canvas>
      </Panel>
    </div>
  );
}
