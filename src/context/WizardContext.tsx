import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Puzzle } from '../lib/domain/puzzle';
import { Image } from '../lib/domain/image';
import { getQRMatrix } from '../lib/util';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { config } from '../lib/config';
import { puzzleFactory } from './puzzleFactory';
import { type Step, STEPS } from './steps';
import { readState, mergeState, type UrlState } from '../lib/browser/urlState';
import { analytics } from '../lib/browser/analytics';
import type { CardSpec } from '../lib/domain/card';
import { cardSpecFromUrlState } from './cardSpec';

interface WizardContextValue {
  step: Step;
  setStep: (step: Step) => void;
  puzzle: Puzzle | null;
  cardSpec: CardSpec;
  updateCardSpec: (update: (cardSpec: CardSpec) => CardSpec) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const VALID_STEPS = new Set<string>(STEPS);

function hasState(): boolean {
  return window.location.hash.length > 1;
}

function readStep(): Step {
  const { step } = readState<UrlState>({});
  return typeof step === 'string' && VALID_STEPS.has(step)
    ? (step as Step)
    : STEPS[0];
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>(readStep);
  const [cardSpec, setCardSpec] = useState<CardSpec>(() =>
    cardSpecFromUrlState(readState<UrlState>({})),
  );
  const qrText = useDebouncedValue(
    cardSpec.qrText,
    config.puzzleGenerationDelayMs,
  );
  const seed = useDebouncedValue(cardSpec.seed, config.puzzleGenerationDelayMs);
  const prefillPercentage = useDebouncedValue(
    cardSpec.prefillPercentage,
    config.puzzleGenerationDelayMs,
  );
  const qr = useMemo(
    () => (qrText ? new Image(getQRMatrix(qrText).matrix) : null),
    [qrText],
  );
  const puzzle = useMemo(
    () => (qr ? puzzleFactory.create(qr, seed, prefillPercentage) : null),
    [qr, seed, prefillPercentage],
  );

  const touched = useRef(hasState());

  useEffect(() => {
    if (touched.current) {
      mergeState({ step, ...cardSpec });
    }
  }, [step, cardSpec]);

  function handleSetStep(newStep: Step) {
    touched.current = true;
    if (newStep !== step) analytics.stepChanged(newStep);
    setStep(newStep);
  }

  function handleUpdateCardSpec(update: (cardSpec: CardSpec) => CardSpec) {
    touched.current = true;
    setCardSpec(update);
  }

  useEffect(() => {
    function handleHashChange() {
      setStep(readStep());
      setCardSpec(cardSpecFromUrlState(readState<UrlState>({})));
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
        cardSpec,
        updateCardSpec: handleUpdateCardSpec,
      }}
    >
      {children}
    </WizardContext>
  );
}

export { WizardContext };
