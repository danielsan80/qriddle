import { useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import {
  Workspace,
  type QRStats,
  type PuzzleStats,
} from './components/Workspace';
import { renderQRToCanvas, getQRMatrix } from './lib/qr';
import { Maze } from './lib/maze';
import { Puzzle } from './lib/puzzle';
import { render } from './lib/renderPuzzle';
import { Image } from './lib/image';
import './App.css';

function App() {
  const [qrText, setQrText] = useState('https://example.com');
  const [qrStats, setQrStats] = useState<QRStats>();
  const [puzzleStats, setPuzzleStats] = useState<PuzzleStats>();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!qrText || !qrCanvasRef.current || !puzzleCanvasRef.current) return;

    // Render QR e ottieni matrice
    await renderQRToCanvas(qrCanvasRef.current, qrText);
    const { matrix, size, blackCount } = getQRMatrix(qrText);

    setQrStats({
      size: `${size} × ${size}`,
      blackModules: String(blackCount),
    });

    // Genera e renderizza puzzle
    const image = new Image(matrix).x2();
    const maze = new Maze(image);
    const puzzle = Puzzle.create(maze, 'seed');
    render(puzzleCanvasRef.current, puzzle);

    const areas = puzzle.maze.areas;
    const blackAreas = areas.filter((a) => a.color === 'black').length;
    const totalCells = areas.reduce((sum, a) => sum + a.pixels.length, 0);
    const minSize = Math.min(...areas.map((a) => a.pixels.length));
    const maxSize = Math.max(...areas.map((a) => a.pixels.length));

    setPuzzleStats({
      totalAreas: String(areas.length),
      blackAreas: String(blackAreas),
      avgAreaSize: `${(totalCells / areas.length).toFixed(1)} (min: ${minSize}, max: ${maxSize})`,
    });
  };

  return (
    <Layout>
      <Header />
      <main>
        <Controls
          qrText={qrText}
          onQrTextChange={setQrText}
          onGenerate={handleGenerate}
        />
        <Workspace
          qrCanvasRef={qrCanvasRef}
          puzzleCanvasRef={puzzleCanvasRef}
          qrStats={qrStats}
          puzzleStats={puzzleStats}
        />
      </main>
    </Layout>
  );
}

export default App;
