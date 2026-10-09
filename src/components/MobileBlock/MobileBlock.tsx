import { isMobileDevice } from '../../lib/browser/device';
import { SendLinkButtons } from '../SendLinkButtons';
import styles from './MobileBlock.module.css';

export function MobileBlock() {
  if (!isMobileDevice()) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Desktop only"
    >
      <div className={styles.card}>
        <h1 className={styles.title}>QRiddle</h1>
        <p className={styles.message}>
          This service works on desktop only.
          <br />
          Open it on your computer.
        </p>
        <SendLinkButtons />
      </div>
    </div>
  );
}
