import { createContext, useEffect, useRef, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { type Step, STEPS } from './steps';
import { readState, mergeState } from '../lib/browser/urlState';
import { analytics } from '../lib/browser/analytics';
import { type Work, workFrom, workPuzzleOf } from './work';

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

function readPuzzle(): Puzzle | null {
  const state = readState<Partial<Work>>({});
  if (!state.qrText || !state.seed) return null;
  return workPuzzleOf(workFrom(state)).puzzle;
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
    if (newStep !== step) analytics.stepChanged(newStep);
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
