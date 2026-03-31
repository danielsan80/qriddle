import photoFront from '../../assets/photos/front.webp';
import photoCenter from '../../assets/photos/center.webp';
import photoMap from '../../assets/photos/map.webp';
import photoSolve from '../../assets/photos/solve_puzzle.webp';
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
  return (
    <div className={styles.layout}>
      <h1 className={styles.heading}>How it works</h1>
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
    </div>
  );
}
