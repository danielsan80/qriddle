import { useEffect, useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Workspace } from './components/Workspace';
import { Image } from './lib/image';
import { Puzzle } from './lib/puzzle';
import { renderPdfPreview, renderImage, downloadPuzzlePdf } from './lib/render';
import { createRandom, generateSeed, getQRMatrix } from './lib/util';
import './App.css';

const DEBOUNCE_MS = 300;

function getInitialState() {
  const params = new URLSearchParams(window.location.search);
  return {
    qrText: params.get('text') ?? '',
    seed: params.get('seed') ?? generateSeed(),
  };
}

function updateURL(qrText: string, seed: string) {
  const params = new URLSearchParams();
  if (qrText) params.set('text', qrText);
  if (seed) params.set('seed', seed);
  const query = params.toString();
  const url = query ? `?${query}` : window.location.pathname;
  window.history.replaceState({}, '', url);
}

function App() {
  const [initial] = useState(getInitialState);
  const [qrText, setQrText] = useState(initial.qrText);
  const [seed, setSeed] = useState(initial.seed);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    updateURL(qrText, seed);
  }, [qrText, seed]);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qrText || !qrCanvasRef.current || !puzzleCanvasRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      void (async () => {
        const { matrix } = getQRMatrix(qrText);
        const qrImage = new Image(matrix);

        renderImage(qrCanvasRef.current!, qrImage, { cellSize: 12 });

        const puzzleImage = qrImage.x2();
        const newPuzzle = Puzzle.create(puzzleImage, createRandom(seed));
        await renderPdfPreview(puzzleCanvasRef.current!, newPuzzle);
        setPuzzle(newPuzzle);
      })();
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [qrText, seed]);

  const handleDownloadPdf = () => {
    if (puzzle) {
      void downloadPuzzlePdf(puzzle);
    }
  };

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
          onDownloadPdf={handleDownloadPdf}
          canDownload={puzzle !== null && qrText.length > 0}
        />
      </main>
    </Layout>
  );
}

export default App;
