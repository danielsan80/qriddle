import type { RefObject } from 'react';
import { Panel } from '../Panel';
import styles from './Workspace.module.css';

interface WorkspaceProps {
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
  puzzleCanvasRef: RefObject<HTMLCanvasElement | null>;
}

export function Workspace({ qrCanvasRef, puzzleCanvasRef }: WorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <Panel title="QR Code">
        <canvas ref={qrCanvasRef}></canvas>
      </Panel>

      <Panel title="Puzzle">
        <canvas ref={puzzleCanvasRef}></canvas>
      </Panel>
    </div>
  );
}
