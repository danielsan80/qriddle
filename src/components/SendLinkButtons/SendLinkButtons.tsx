import { useCopyLink } from '../../lib/browser/useCopyLink';
import styles from './SendLinkButtons.module.css';

export function SendLinkButtons() {
  const { copied, copy } = useCopyLink();

  async function handleShare() {
    await navigator.share({ url: window.location.href, title: 'QRiddle' });
  }

  return (
    <div className={styles.buttons}>
      {navigator.share != null && (
        <button className={styles.button} onClick={handleShare}>
          Share the link
        </button>
      )}
      <button className={styles.button} onClick={copy}>
        {copied ? 'Link copied!' : 'Copy the link'}
      </button>
    </div>
  );
}
