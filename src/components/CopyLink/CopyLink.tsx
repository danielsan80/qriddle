import { useCopyLink } from '../../lib/browser/useCopyLink';
import styles from './CopyLink.module.css';

export function CopyLink() {
  const { copied, copy } = useCopyLink();

  return (
    <button
      type="button"
      className={copied ? `${styles.button} ${styles.copied}` : styles.button}
      onClick={copy}
    >
      {copied ? 'Saved! Link copied' : 'Save'}
    </button>
  );
}
