import { useEffect, useRef, useState } from 'react';
import { Controls } from '../../components/Controls';
import { Workspace } from '../../components/Workspace';
import { useWizard } from '../../context/useWizard';
import { Image } from '../../lib/domain/image';
import { Puzzle } from '../../lib/domain/puzzle';
import {
  renderInnerPdfPreview,
  renderImage,
  downloadPuzzlePdf,
} from '../../lib/render';
import { createRandom, generateSeed, getQRMatrix } from '../../lib/util';
import { config } from '../../lib/config';
import { readState, mergeState } from '../../lib/browser/urlState';

const DEBOUNCE_MS = 300;

interface MapState {
  qrText: string;
  seed: string;
}

function getInitialState(): MapState {
  const state = readState<Partial<MapState>>({});
  return {
    qrText: state.qrText ?? config.defaultQrText,
    seed: state.seed ?? generateSeed(),
  };
}

export function MapView() {
  const { setPuzzle, puzzle } = useWizard();

  const [initial] = useState(getInitialState);
  const [qrText, setQrText] = useState(initial.qrText);
  const [seed, setSeed] = useState(initial.seed);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    mergeState({ qrText, seed });
  }, [qrText, seed]);

  useEffect(() => {
    if (!qrText || !qrCanvasRef.current || !puzzleCanvasRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      void (async () => {
        const { matrix } = getQRMatrix(qrText);
        const qrImage = new Image(matrix);

        renderImage(qrCanvasRef.current!, qrImage, config.preview);

        const puzzleImage = qrImage.x2();
        const newPuzzle = Puzzle.create(puzzleImage, createRandom(seed));
        await renderInnerPdfPreview(puzzleCanvasRef.current!, newPuzzle);
        setPuzzle(newPuzzle);
      })();
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [qrText, seed, setPuzzle]);

  const handleQrTextBlur = () => {
    if (!qrText) setQrText(config.defaultQrText);
  };

  const handleDownloadPdf = () => {
    if (puzzle) {
      void downloadPuzzlePdf(puzzle);
    }
  };

  const showCanvas = qrText.length > 0;

  return (
    <>
      <Controls
        qrText={qrText}
        onQrTextChange={setQrText}
        onQrTextBlur={handleQrTextBlur}
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
    </>
  );
}
