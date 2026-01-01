import { Panel } from '../Panel';
import './Workspace.css';

export function Workspace() {
  return (
    <div className="workspace">
      <Panel
        title="QR Code Originale (Griglia A)"
        stats={[
          { label: 'Dimensione', value: '-' },
          { label: 'Moduli Neri', value: '-' },
        ]}
      >
        <canvas id="qrCanvas"></canvas>
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