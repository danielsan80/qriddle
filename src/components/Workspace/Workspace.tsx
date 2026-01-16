import type { RefObject } from 'react';
import { Panel } from '../Panel';
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
      <Panel title="QR Code" showCanvas={showCanvas}>
        <canvas ref={qrCanvasRef}></canvas>
      </Panel>

      <Panel title="Puzzle" showCanvas={showCanvas}>
        <canvas ref={puzzleCanvasRef}></canvas>
      </Panel>
    </div>
  );
}
