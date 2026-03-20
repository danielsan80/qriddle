import { useEffect, useRef, useState } from 'react';
import { Panel } from '../../components/Panel';
import { CanvasStage } from '../../components/Workspace/CanvasStage';
import { QrcodeCanvas } from '../../components/Workspace/QrcodeCanvas';
import { PreviewCanvas } from '../../components/Workspace/PreviewCanvas';
import { useWizard } from '../../context/useWizard';
import { Image } from '../../lib/domain/image';
import { Puzzle } from '../../lib/domain/puzzle';
import { renderInnerPdfPreview, renderImage } from '../../lib/render';
import { createRandom, generateSeed, getQRMatrix } from '../../lib/util';
import { config } from '../../lib/config';
import { readState, mergeState } from '../../lib/browser/urlState';
import styles from './MapView.module.css';

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
  const { setPuzzle } = useWizard();

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

  const showCanvas = qrText.length > 0;

  return (
    <div className={styles.layout}>
      <div className={styles.topPanels}>
        <Panel>
          <Panel.Title>The Treasure</Panel.Title>
          <Panel.Body>
            <label htmlFor="qrText" className={styles.treasureLabel}>
              Enter the secret text you want to hide:
            </label>
            <input
              type="text"
              id="qrText"
              className={styles.treasureInput}
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              onBlur={handleQrTextBlur}
              placeholder="link · secret code · virtual gift"
            />
            <p className={styles.examplesLabel}>Some examples:</p>
            <ul className={styles.examples}>
              <li>
                the link to a video showing where your gift is hidden
              </li>
              <li>the combination to open a safe</li>
              <li>the link to a virtual gift</li>
              <li>the key to open a treasure chest</li>
            </ul>
          </Panel.Body>
        </Panel>

        <Panel>
          <Panel.Title>QR Code</Panel.Title>
          <Panel.Body>
            <p className={styles.description}>
              Whoever solves the puzzle finds this code.
            </p>
            <CanvasStage show={showCanvas}>
              <QrcodeCanvas ref={qrCanvasRef} />
            </CanvasStage>
          </Panel.Body>
        </Panel>
      </div>

      <Panel>
        <Panel.Title>Preview</Panel.Title>
        <Panel.Actions>
          <div className={styles.seedActions}>
            <input
              type="text"
              className={styles.seedInput}
              aria-label="Seed"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
            />
            <button
              type="button"
              className={styles.seedButton}
              title="Regenerate seed"
              onClick={() => setSeed(generateSeed())}
            >
              ↻
            </button>
          </div>
        </Panel.Actions>
        <Panel.Body>
          <CanvasStage show={showCanvas}>
            <PreviewCanvas ref={puzzleCanvasRef} />
          </CanvasStage>
        </Panel.Body>
      </Panel>
    </div>
  );
}
