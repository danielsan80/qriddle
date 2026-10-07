import { createContext, useEffect, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { Image } from '../lib/domain/image';
import { Puzzle as PuzzleClass } from '../lib/domain/puzzle';
import { type TrackStep, TRACK_STEPS } from '../components/navigation/TrackNav';
import { readState, mergeState } from '../lib/browser/urlState';
import { createRandom, getQRMatrix } from '../lib/util';
import { type Work, workFrom } from './work';

interface WizardContextValue {
  trackStep: TrackStep;
  setTrackStep: (step: TrackStep) => void;
  puzzle: Puzzle | null;
  setPuzzle: (puzzle: Puzzle | null) => void;
  work: Work;
  updateWork: (update: (work: Work) => Work) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const VALID_STEPS = new Set<string>(TRACK_STEPS.map((s) => s.code));

function readStep(): TrackStep {
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

function readPuzzle(): Puzzle | null {
  const { qrText, seed } = readState<{ qrText?: string; seed?: string }>({});
  if (!qrText || !seed) return null;
  return buildPuzzle(qrText, seed);
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [trackStep, setTrackStep] = useState<TrackStep>(readStep);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(readPuzzle);
  const [work, setWork] = useState<Work>(() => workFrom(readState({})));

  useEffect(() => {
    mergeState(work);
  }, [work]);

  function handleSetTrackStep(step: TrackStep) {
    mergeState({ step });
    setTrackStep(step);
  }

  useEffect(() => {
    // @rev replaceState never fires hashchange: this only runs for a hash changed from outside, such as a link pasted in the address bar.
    function handleHashChange() {
      setTrackStep(readStep());
      setPuzzle(readPuzzle());
      setWork(workFrom(readState({})));
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <WizardContext
      value={{
        trackStep,
        setTrackStep: handleSetTrackStep,
        puzzle,
        setPuzzle,
        work,
        updateWork: setWork,
      }}
    >
      {children}
    </WizardContext>
  );
}

export { WizardContext };
