import { useEffect, useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Workspace } from './components/Workspace';
import { Image } from './lib/image';
import { Puzzle } from './lib/puzzle';
import { render, renderImage } from './lib/render';
import { createRandom, generateSeed, getQRMatrix } from './lib/util';
import './App.css';

const DEBOUNCE_MS = 300;

function App() {
  const [qrText, setQrText] = useState('');
  const [seed, setSeed] = useState(generateSeed);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qrText || !qrCanvasRef.current || !puzzleCanvasRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      const { matrix } = getQRMatrix(qrText);
      const qrImage = new Image(matrix);

      renderImage(qrCanvasRef.current!, qrImage, { cellSize: 12 });

      const puzzleImage = qrImage.x2();
      const puzzle = Puzzle.create(puzzleImage, createRandom(seed));
      render(puzzleCanvasRef.current!, puzzle);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [qrText, seed]);

  const showCanvas = qrText.length > 0;

  return (
    <Layout>
      <Header />
      <main>
        <Controls
          qrText={qrText}
          onQrTextChange={setQrText}
          seed={seed}
          onSeedChange={setSeed}
          onSeedRegenerate={() => setSeed(generateSeed())}
        />
        <Workspace
          qrCanvasRef={qrCanvasRef}
          puzzleCanvasRef={puzzleCanvasRef}
          showCanvas={showCanvas}
        />
      </main>
    </Layout>
  );
}

export default App;
