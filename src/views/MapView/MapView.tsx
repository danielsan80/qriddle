import { useEffect, useRef } from 'react';
import { Panel } from '../../components/layout/Panel';
import { CanvasStage } from '../../components/stages/CanvasStage';
import { QrcodeCanvas } from '../../components/canvas/QrcodeCanvas';
import { PreviewCanvas } from '../../components/canvas/PreviewCanvas';
import { useWizard } from '../../context/useWizard';
import { Image } from '../../lib/domain/image';
import { Puzzle } from '../../lib/domain/puzzle';
import { renderInnerPdfPreview, renderImage } from '../../lib/render';
import { createRandom, generateSeed, getQRMatrix } from '../../lib/util';
import { ExampleLink } from './ExampleLink';
import { config } from '../../lib/config';
import styles from './MapView.module.css';

const DEBOUNCE_MS = 300;

export function MapView() {
  const { setPuzzle, work, updateWork } = useWizard();
  const { qrText, seed } = work;

  function setQrText(newQrText: string) {
    updateWork((current) => ({ ...current, qrText: newQrText }));
  }

  function setSeed(newSeed: string) {
    updateWork((current) => ({ ...current, seed: newSeed }));
  }

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
              onChange={(event) => setQrText(event.target.value)}
              onBlur={handleQrTextBlur}
              placeholder="link · secret code · virtual gift"
            />
            <p className={styles.examplesLabel}>Some examples:</p>
            <ul className={styles.examples}>
              <li>the link to a video showing where your gift is hidden</li>
              <li>the combination to open a safe</li>
              <li>the link to a virtual gift</li>
              <li>the key to open a treasure chest</li>
              <li>
                the <ExampleLink code="rose">coordinates</ExampleLink> of an
                &ldquo;island&rdquo;
              </li>
              <li>
                a funny <ExampleLink code="mario">phrase</ExampleLink>
              </li>
              <li>
                the <ExampleLink code="qriddle">path</ExampleLink> to your next
                quest
              </li>
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
          <Panel.ActionButton
            label="Another puzzle"
            onClick={() => setSeed(generateSeed())}
          >
            ↻
          </Panel.ActionButton>
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
