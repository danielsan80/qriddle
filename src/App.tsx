import { useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Workspace } from './components/Workspace';
import { Image } from './lib/image';
import { Puzzle } from './lib/puzzle';
import { render } from './lib/render';
import {
  createRandom,
  generateSeed,
  renderQRToCanvas,
  getQRMatrix,
} from './lib/util';
import './App.css';

function App() {
  const [qrText, setQrText] = useState('https://example.com');
  const [seed] = useState(generateSeed);
  const [generated, setGenerated] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!qrText || !qrCanvasRef.current || !puzzleCanvasRef.current) return;

    await renderQRToCanvas(qrCanvasRef.current, qrText);
    const { matrix } = getQRMatrix(qrText);

    const image = new Image(matrix).x2();
    const puzzle = Puzzle.create(image, createRandom(seed));
    render(puzzleCanvasRef.current, puzzle);
    setGenerated(true);
  };

  return (
    <Layout>
      <Header />
      <main>
        <Controls
          qrText={qrText}
          onQrTextChange={setQrText}
          seed={seed}
          onGenerate={handleGenerate}
        />
        <Workspace
          qrCanvasRef={qrCanvasRef}
          puzzleCanvasRef={puzzleCanvasRef}
          showCanvas={generated}
        />
      </main>
    </Layout>
  );
}

export default App;
