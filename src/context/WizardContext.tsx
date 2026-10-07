import { createContext, useEffect, useRef, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { Image } from '../lib/domain/image';
import { Puzzle as PuzzleClass } from '../lib/domain/puzzle';
import { type Step, STEPS } from './steps';
import { readState, mergeState } from '../lib/browser/urlState';
import { createRandom, getQRMatrix } from '../lib/util';
import { type Work, workFrom } from './work';

interface WizardContextValue {
  step: Step;
  setStep: (step: Step) => void;
  puzzle: Puzzle | null;
  setPuzzle: (puzzle: Puzzle | null) => void;
  work: Work;
  updateWork: (update: (work: Work) => Work) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const VALID_STEPS = new Set<string>(STEPS);

function hasState(): boolean {
  return window.location.hash.length > 1;
}

function readStep(): Step {
  const { step } = readState<{ step?: string }>({});
  return step && VALID_STEPS.has(step) ? (step as Step) : STEPS[0];
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
  const [step, setStep] = useState<Step>(readStep);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(readPuzzle);
  const [work, setWork] = useState<Work>(() => workFrom(readState({})));

  const touched = useRef(hasState());

  useEffect(() => {
    if (touched.current) {
      mergeState({ step, ...work });
    }
  }, [step, work]);

  function handleSetStep(newStep: Step) {
    touched.current = true;
    setStep(newStep);
  }

  function handleUpdateWork(update: (work: Work) => Work) {
    touched.current = true;
    setWork(update);
  }

  useEffect(() => {
    function handleHashChange() {
      setStep(readStep());
      setPuzzle(readPuzzle());
      setWork(workFrom(readState({})));
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <WizardContext
      value={{
        step,
        setStep: handleSetStep,
        puzzle,
        setPuzzle,
        work,
        updateWork: handleUpdateWork,
      }}
    >
      {children}
    </WizardContext>
  );
}

export { WizardContext };
