import { createContext, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { type TrackStep, TRACK_STEPS } from '../components/TrackNav';

interface WizardContextValue {
  trackStep: TrackStep;
  setTrackStep: (step: TrackStep) => void;
  puzzle: Puzzle | null;
  setPuzzle: (puzzle: Puzzle | null) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [trackStep, setTrackStep] = useState<TrackStep>(TRACK_STEPS[0].step);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  return (
    <WizardContext value={{ trackStep, setTrackStep, puzzle, setPuzzle }}>
      {children}
    </WizardContext>
  );
}

export { WizardContext };
