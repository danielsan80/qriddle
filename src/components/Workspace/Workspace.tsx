import type { RefObject } from 'react';
import { Panel } from '../Panel';
import styles from './Workspace.module.css';

interface WorkspaceProps {
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
}

export function Workspace({ qrCanvasRef }: WorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <Panel
        title="QR Code Originale (Griglia A)"
        stats={[
          { label: 'Dimensione', value: '-' },
          { label: 'Moduli Neri', value: '-' },
        ]}
      >
        <canvas ref={qrCanvasRef}></canvas>
      </Panel>

      <Panel
        title="Puzzle Generato (Griglia B)"
        stats={[
          { label: 'Aree Totali', value: '-' },
          { label: 'Aree Nere', value: '-' },
          { label: 'Dimensione Media Area', value: '-' },
        ]}
      >
        <canvas id="puzzleCanvas"></canvas>
      </Panel>
    </div>
  );
}
