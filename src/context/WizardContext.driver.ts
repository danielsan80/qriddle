import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import type { CardSpec } from '../lib/domain/card';
import type { Puzzle } from '../lib/domain/puzzle';
import type { Step } from './steps';
import { useWizard } from './useWizard';
import { WizardProvider } from './WizardContext';

function wrapper({ children }: { children: ReactNode }) {
  return createElement(WizardProvider, null, children);
}

export class WizardDriver {
  private readonly result: { current: ReturnType<typeof useWizard> };

  private constructor(result: { current: ReturnType<typeof useWizard> }) {
    this.result = result;
  }

  static render(): WizardDriver {
    return new WizardDriver(renderHook(() => useWizard(), { wrapper }).result);
  }

  get step(): Step {
    return this.result.current.step;
  }

  get cardSpec(): CardSpec {
    return this.result.current.cardSpec;
  }

  get puzzle(): Puzzle | null {
    return this.result.current.puzzle;
  }

  setStep(step: Step): void {
    act(() => this.result.current.setStep(step));
  }

  setCardSpec(cardSpec: CardSpec): void {
    act(() => this.result.current.updateCardSpec(() => cardSpec));
  }

  changeQrText(qrText: string): void {
    act(() =>
      this.result.current.updateCardSpec((current) => ({ ...current, qrText })),
    );
  }

  changeSeed(seed: string): void {
    act(() =>
      this.result.current.updateCardSpec((current) => ({ ...current, seed })),
    );
  }
}
