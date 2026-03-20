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
  seed: string;
  onSeedChange: (seed: string) => void;
  onSeedRegenerate: () => void;
}

export function Workspace({
  qrCanvasRef,
  puzzleCanvasRef,
  showCanvas,
  seed,
  onSeedChange,
  onSeedRegenerate,
}: WorkspaceProps) {
  const seedActions = (
    <div className={styles.seedActions}>
      <input
        type="text"
        className={styles.seedInput}
        aria-label="Seed"
        value={seed}
        onChange={(event) => onSeedChange(event.target.value)}
      />
      <button
        type="button"
        className={styles.seedButton}
        title="Rigenera seed"
        onClick={onSeedRegenerate}
      >
        ↻
      </button>
    </div>
  );

  return (
    <div className={styles.workspace}>
      <Panel title="QR Code">
        <CanvasStage show={showCanvas}>
          <QrcodeCanvas ref={qrCanvasRef} />
        </CanvasStage>
      </Panel>

      <Panel title="Anteprima PDF" headerActions={seedActions}>
        <CanvasStage show={showCanvas}>
          <PreviewCanvas ref={puzzleCanvasRef} />
        </CanvasStage>
      </Panel>
    </div>
  );
}
