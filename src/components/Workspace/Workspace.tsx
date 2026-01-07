import type { RefObject } from 'react';
import { Panel } from '../Panel';
import styles from './Workspace.module.css';

export interface QRStats {
  size: string;
  blackModules: string;
}

export interface PuzzleStats {
  totalAreas: string;
  blackAreas: string;
  avgAreaSize: string;
}

interface WorkspaceProps {
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
  puzzleCanvasRef: RefObject<HTMLCanvasElement | null>;
  qrStats?: QRStats;
  puzzleStats?: PuzzleStats;
}

export function Workspace({
  qrCanvasRef,
  puzzleCanvasRef,
  qrStats,
  puzzleStats,
}: WorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <Panel
        title="QR Code Originale (Griglia A)"
        stats={[
          { label: 'Dimensione', value: qrStats?.size ?? '-' },
          { label: 'Moduli Neri', value: qrStats?.blackModules ?? '-' },
        ]}
      >
        <canvas ref={qrCanvasRef}></canvas>
      </Panel>

      <Panel
        title="Puzzle Generato (Griglia B)"
        stats={[
          { label: 'Aree Totali', value: puzzleStats?.totalAreas ?? '-' },
          { label: 'Aree Nere', value: puzzleStats?.blackAreas ?? '-' },
          {
            label: 'Dimensione Media Area',
            value: puzzleStats?.avgAreaSize ?? '-',
          },
        ]}
      >
        <canvas ref={puzzleCanvasRef}></canvas>
      </Panel>
    </div>
  );
}
