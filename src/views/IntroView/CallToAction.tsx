import { useWizard } from '../../context/useWizard';
import { hasFinePointer } from '../../lib/browser/device';
import { SendLinkButtons } from '../../components/SendLinkButtons';
import styles from './CallToAction.module.css';

export function CallToAction() {
  const { setStep } = useWizard();

  if (!hasFinePointer()) {
    return (
      <div className={styles.sendLink}>
        <p>Create your puzzle on a computer.</p>
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
