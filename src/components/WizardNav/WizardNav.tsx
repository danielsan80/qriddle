import { WIZARD_STEPS, type WizardStep } from './steps';
import styles from './WizardNav.module.css';

export type { WizardStep };

interface WizardNavProps {
  step: WizardStep;
  onStep: (step: WizardStep) => void;
}

export function WizardNav({ step, onStep }: WizardNavProps) {
  const index = WIZARD_STEPS.findIndex((s) => s.step === step);
  const total = WIZARD_STEPS.length;

  return (
    <ol className={styles.steps}>
      {WIZARD_STEPS.map((s, i) => (
        <li
          key={s.step}
          className={`${styles.step} ${i > index ? styles.future : ''}`}
          aria-current={i === index ? 'step' : undefined}
        >
          <button
            type="button"
            className={styles.label}
            onClick={() => onStep(s.step)}
          >
            {i <= index ? '●' : '○'} {s.label}
          </button>
          {i === index && i < total - 1 && ' '}
          {i === index && i < total - 1 && (
            <button
              type="button"
              aria-label="next"
              className={styles.next}
              onClick={() => onStep(WIZARD_STEPS[index + 1].step)}
            >
              →
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}
