import { useWizard } from '../../context/useWizard';
import { isMobileDevice } from '../../lib/browser/device';
import { SendLinkButtons } from '../../components/SendLinkButtons';
import styles from './CallToAction.module.css';

export function CallToAction() {
  const { setStep } = useWizard();

  if (isMobileDevice()) {
    return (
      <div className={styles.sendLink}>
        <p>Puzzles are made on a computer. Send yourself the link:</p>
        <SendLinkButtons />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.cta}
      onClick={() => setStep('inner.map')}
    >
      Create your puzzle
    </button>
  );
}
