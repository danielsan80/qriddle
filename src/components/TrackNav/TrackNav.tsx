import { TRACK_STEPS, type TrackStep } from './steps';
import styles from './TrackNav.module.css';

export type { TrackStep };

interface TrackNavProps {
  step: TrackStep;
  onStep: (step: TrackStep) => void;
}

// 8-pointed star in 100x100 space, center (50,50)
// cardinal tips r=42, diagonal tips r=27, inner valleys r=15
const COMPASS_POINTS = [
  [50, 8], // N
  [56, 36], // inner
  [69, 31], // NE
  [64, 44], // inner
  [92, 50], // E
  [64, 56], // inner
  [69, 69], // SE
  [56, 64], // inner
  [50, 92], // S
  [44, 64], // inner
  [31, 69], // SW
  [36, 56], // inner
  [8, 50], // W
  [36, 44], // inner
  [31, 31], // NW
  [44, 36], // inner
]
  .map((p) => p.join(','))
  .join(' ');

function CompassMarker({ past }: { past: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true">
      <polygon
        points={COMPASS_POINTS}
        fill={past ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        transform="rotate(15, 50, 50)"
      />
    </svg>
  );
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
              {isLast ? (
                <XMarker />
              ) : i === 0 ? (
                <CompassMarker past={past} />
              ) : (
                <DotMarker past={past} />
              )}
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
