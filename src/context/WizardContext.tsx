import { createContext, useEffect, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { type TrackStep, TRACK_STEPS } from '../components/navigation/TrackNav';
import { readState, mergeState } from '../lib/browser/urlState';

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

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [trackStep, setTrackStep] = useState<TrackStep>(getInitialStep);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    mergeState({ step: trackStep });
  }, [trackStep]);

  return (
    <WizardContext value={{ trackStep, setTrackStep, puzzle, setPuzzle }}>
      {children}
    </WizardContext>
  );
}

export { WizardContext };
