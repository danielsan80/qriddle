import photoFront from '../../assets/photos/front.webp';
import photoCenter from '../../assets/photos/center.webp';
import photoMap from '../../assets/photos/map.webp';
import photoSolve from '../../assets/photos/solve_puzzle.webp';
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
          <button
            type="button"
            className={styles.cta}
            onClick={() => setStep('inner.map')}
          >
            Create your puzzle
          </button>
        </div>
        <img
          src={photoSolve}
          alt="A treasure map puzzle being solved with a marker, a QR code emerging"
          className={styles.heroPhoto}
        />
      </header>
      <section className={styles.howItWorks}>
        <h2 className={styles.heading}>How it works</h2>
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
      </section>
    </div>
  );
}
