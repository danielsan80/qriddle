import type { RefObject } from 'react';
import { Panel } from '../Panel';
import { CanvasStage } from './CanvasStage';
import { QrcodeCanvas } from './QrcodeCanvas';
import { PreviewCanvas } from './PreviewCanvas';
import styles from './Workspace.module.css';

interface WorkspaceProps {
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
  puzzleCanvasRef: RefObject<HTMLCanvasElement | null>;
  showCanvas: boolean;
}

export function Workspace({
  qrCanvasRef,
  puzzleCanvasRef,
  showCanvas,
}: WorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <Panel title="QR Code">
        <CanvasStage show={showCanvas}>
          <QrcodeCanvas ref={qrCanvasRef} />
        </CanvasStage>
      </Panel>

      <Panel title="Anteprima PDF">
        <CanvasStage show={showCanvas}>
          <PreviewCanvas ref={puzzleCanvasRef} />
        </CanvasStage>
      </Panel>
    </div>
  );
}
