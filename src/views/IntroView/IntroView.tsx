import photoFront from '../../assets/photos/front.webp';
import photoCenter from '../../assets/photos/center.webp';
import photoMap from '../../assets/photos/map.webp';
import photoSolve from '../../assets/photos/solve_puzzle.webp';
import { useRef } from 'react';
import { useWizard } from '../../context/useWizard';
import styles from './IntroView.module.css';

const STEPS = [
  {
    src: photoFront,
    alt: 'Greeting card closed — ship and route on the cover',
    caption: 'A greeting card with a secret inside.',
  },
  {
    src: photoCenter,
    alt: 'Greeting card open — birthday message and cryptic instructions',
    caption: '"Follow the map. Dig at the X. Claim your treasure."',
  },
  {
    src: photoMap,
    alt: 'Card fully open — puzzle map unsolved',
    caption: 'Unfold it completely to reveal the puzzle.',
  },
  {
    src: photoSolve,
    alt: 'Card flat on table — puzzle being solved with a marker',
    caption: 'Solve it to uncover the hidden message.',
  },
];

export function IntroView() {
  const { setStep } = useWizard();
  const howItWorksRef = useRef<HTMLElement>(null);

  const createButton = (
    <button
      type="button"
      className={styles.cta}
      onClick={() => setStep('inner.map')}
    >
      Create your puzzle
    </button>
  );

  return (
    <div className={styles.layout}>
      <header className={styles.hero}>
        <div className={styles.presentation}>
          <hgroup>
            <h1 className={styles.name}>QRiddle</h1>
            <p className={styles.payoff}>
              Put a treasure into your greeting card
            </p>
            <p className={styles.explanation}>
              Write a secret message. Print it as a puzzle. They solve it to
              read it.
            </p>
          </hgroup>
          <div className={styles.actions}>
            {createButton}
            <button
              type="button"
              className={styles.howItWorksLink}
              onClick={() =>
                howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              How it works
              <span className={styles.arrow} aria-hidden="true">
                ↓
              </span>
            </button>
          </div>
        </div>
        <img
          src={photoSolve}
          alt="A treasure map puzzle being solved with a marker, a QR code emerging"
          className={styles.heroPhoto}
        />
      </header>
      <section
        ref={howItWorksRef}
        className={styles.howItWorks}
        aria-labelledby="how-it-works"
      >
        <h2 id="how-it-works" className={styles.heading}>
          How it works
        </h2>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.src} className={styles.step}>
              <img
                src={step.src}
                alt={step.alt}
                className={styles.photo}
                loading="lazy"
              />
              <p className={styles.caption}>{step.caption}</p>
            </li>
          ))}
        </ol>
        <div className={styles.closingAction}>{createButton}</div>
      </section>
    </div>
  );
}
