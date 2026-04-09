import { createContext, useEffect, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { Image } from '../lib/domain/image';
import { Puzzle as PuzzleClass } from '../lib/domain/puzzle';
import { type TrackStep, TRACK_STEPS } from '../components/navigation/TrackNav';
import { readState, mergeState } from '../lib/browser/urlState';
import { createRandom, getQRMatrix } from '../lib/util';

interface WizardContextValue {
  trackStep: TrackStep;
  setTrackStep: (step: TrackStep) => void;
  puzzle: Puzzle | null;
  setPuzzle: (puzzle: Puzzle | null) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const VALID_STEPS = new Set<string>(TRACK_STEPS.map((s) => s.code));

function getInitialStep(): TrackStep {
  const { step } = readState<{ step?: string }>({});
  return step && VALID_STEPS.has(step)
    ? (step as TrackStep)
    : TRACK_STEPS[0].code;
}

function buildPuzzle(qrText: string, seed: string): Puzzle {
  const { matrix } = getQRMatrix(qrText);
  const qrImage = new Image(matrix);
  return PuzzleClass.create(qrImage.x2(), createRandom(seed));
}

function getInitialPuzzle(): Puzzle | null {
  const { qrText, seed } = readState<{ qrText?: string; seed?: string }>({});
  if (!qrText || !seed) return null;
  return buildPuzzle(qrText, seed);
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [trackStep, setTrackStep] = useState<TrackStep>(getInitialStep);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(getInitialPuzzle);

  function handleSetTrackStep(step: TrackStep) {
    mergeState({ step }, 'push');
    setTrackStep(step);
  }

  useEffect(() => {
    function handlePopState() {
      const { step } = readState<{ step: string }>({ step: getInitialStep() });
      if (!VALID_STEPS.has(step)) {
        return;
      }
      setTrackStep(step as TrackStep);
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <WizardContext
      value={{
        trackStep,
        setTrackStep: handleSetTrackStep,
        puzzle,
        setPuzzle,
      }}
    >
      {children}
    </WizardContext>
  );
}

export { WizardContext };
