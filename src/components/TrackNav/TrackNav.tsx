import { TRACK_STEPS, type TrackStep } from './steps';
import styles from './TrackNav.module.css';

export type { TrackStep };

interface TrackNavProps {
  step: TrackStep;
  onStep: (step: TrackStep) => void;
}

function DotMarker({ past }: { past: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle
        cx="6"
        cy="6"
        r="4"
        fill={past ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function XMarker() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <line
        x1="2"
        y1="2"
        x2="10"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="10"
        y1="2"
        x2="2"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <line x1="9" y1="1" x2="9" y2="10" strokeWidth="1.5" />
      <path d="M9 1 L16 9 L9 9 Z" fill="currentColor" stroke="none" />
      <path d="M3 10 Q9 14 15 10" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TrackNav({ step, onStep }: TrackNavProps) {
  const index = TRACK_STEPS.findIndex((s) => s.step === step);
  const total = TRACK_STEPS.length;

  return (
    <ol className={styles.steps}>
      {TRACK_STEPS.map((s, i) => {
        const isLast = i === total - 1;
        const past = i <= index;

        return (
          <li
            key={s.step}
            className={styles.step}
            data-state={past ? 'past' : 'future'}
            aria-current={i === index ? 'step' : undefined}
          >
            <div className={styles.track}>
              {isLast ? <XMarker /> : <DotMarker past={past} />}
              {!isLast && (
                <div
                  className={styles.segment}
                  data-past={i < index ? 'true' : undefined}
                />
              )}
            </div>
            <div className={styles.content}>
              <button
                type="button"
                className={styles.label}
                onClick={() => onStep(s.step)}
              >
                {s.label}
              </button>
              {i === index && !isLast && (
                <button
                  type="button"
                  aria-label="next"
                  className={styles.next}
                  onClick={() => onStep(TRACK_STEPS[index + 1].step)}
                >
                  <ShipIcon />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
